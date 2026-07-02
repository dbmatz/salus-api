# SALUS

Sistema de registro diário de saúde emocional e acompanhamento de hábitos, construído como projeto de estudo e portfólio em TypeScript com Clean Architecture.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js + TypeScript (strict) |
| Framework HTTP | Fastify 5 |
| ORM | Prisma 6 |
| Banco de dados | PostgreSQL 16 |
| Validação | Zod |
| Autenticação | JWT via `jose` |
| Hash de senha | `argon2` |
| Testes | Vitest |
| Env | `@t3-oss/env-core` |

---

## Arquitetura

O projeto segue **Clean Architecture** com separação estrita em três camadas:

```
src/
├── domain/                  # Núcleo puro — sem dependências externas
│   ├── entities/            # User, Emotion, Medication, Parameter, DailyRecord
│   ├── value-objects/       # Email, Password, ParameterType
│   ├── errors/              # DomainError, ConflictError, NotFoundError, UnauthorizedError
│   ├── repositories/        # Interfaces de repositório (contratos)
│   └── services/            # IHashingService, IJwtService
│
├── application/             # Use Cases — orquestra o domínio
│   └── use-cases/
│       ├── auth/            # RegisterUser, Login
│       ├── emotion/         # Create, List, Delete, Restore
│       ├── medication/      # Create, List, Delete, Restore
│       ├── parameter/       # Create, List, Delete, Restore
│       └── daily-record/    # CreateDailyRecord, ListDailyRecordByMonth
│
├── infra/                   # Implementações concretas
│   ├── database/
│   │   ├── prisma/          # Schema e migrations
│   │   ├── repositories/    # PrismaUserRepository, PrismaEmotionRepository, ...
│   │   └── mappers/         # Conversão banco ↔ domínio
│   ├── http/
│   │   ├── controllers/     # Handlers HTTP (Fastify)
│   │   ├── middleware/      # Autenticação JWT
│   │   └── errors/          # Error handler global
│   └── services/            # ArgonHashingService, JoseJwtService
│
├── tests/
│   ├── unit/                # Testes de entidades, value objects e use cases
│   ├── mocks/               # InMemory repositories, fake services
│   └── integration/
│
├── container.ts             # Injeção de dependências (Poor Man's DI)
├── server.ts                # Bootstrap do Fastify
└── env.ts                   # Validação de variáveis de ambiente
```

---

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose

---

## Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repo>
cd _salus
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados
DATABASE_URL="postgresql://salus:salus@localhost:5433/salus"
POSTGRES_USER=salus
POSTGRES_PASSWORD=salus
POSTGRES_DB=salus

# JWT — mínimo 32 caracteres
JWT_SECRET="sua-chave-secreta-com-pelo-menos-32-caracteres"

# Servidor
PORT=3000
NODE_ENV=development
```

### 4. Suba o banco de dados

```bash
docker-compose up -d
```

### 5. Execute as migrations

```bash
npm run prisma:migrate
```

### 6. Inicie o servidor

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

---

## Rotas da API

Todas as rotas protegidas exigem o header:
```
Authorization: Bearer <token>
```

### Autenticação

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/auth/register` | — | Cadastra um novo usuário |
| `POST` | `/auth/login` | — | Autentica e retorna JWT |

**`POST /auth/register`**
```json
{ "name": "Ana", "email": "ana@email.com", "password": "minimo8chars" }
```

**`POST /auth/login`** → `{ "token": "<jwt>" }`
```json
{ "email": "ana@email.com", "password": "minimo8chars" }
```

---

### Emoções

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/emotions` | ✅ | Cria uma emoção |
| `GET` | `/emotions` | ✅ | Lista todas (incluindo deletadas) |
| `DELETE` | `/emotions/:emotionId` | ✅ | Soft delete |
| `PATCH` | `/emotions/:emotionId/restore` | ✅ | Restaura emoção deletada |

**`POST /emotions`**
```json
{ "name": "Ansiedade" }
```

---

### Remédios

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/medications` | ✅ | Cria um remédio |
| `GET` | `/medications` | ✅ | Lista todos (incluindo deletados) |
| `DELETE` | `/medications/:medicationId` | ✅ | Soft delete |
| `PATCH` | `/medications/:medicationId/restore` | ✅ | Restaura remédio deletado |

**`POST /medications`**
```json
{ "name": "Sertralina", "dosage": "50mg" }
```

---

### Parâmetros

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/parameters` | ✅ | Cria um parâmetro |
| `GET` | `/parameters` | ✅ | Lista todos (incluindo deletados) |
| `DELETE` | `/parameters/:parameterId` | ✅ | Soft delete |
| `PATCH` | `/parameters/:parameterId/restore` | ✅ | Restaura parâmetro deletado |

**`POST /parameters`**
```json
{ "name": "Qualidade do sono", "type": "SCALE_1_10" }
```

Tipos disponíveis: `BOOLEAN` · `SCALE_1_5` · `SCALE_1_10`

---

### Registro Diário

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/daily-records` | ✅ | Cria registro do dia |
| `GET` | `/daily-records?month=6&year=2025` | ✅ | Lista registros do mês |

**`POST /daily-records`**
```json
{
  "date": "2025-06-25",
  "emotionId": "uuid-da-emocao",
  "dayDescription": "Dia produtivo, mas cansativo.",
  "medicationLogs": [
    { "medicationId": "uuid-do-remedio", "status": "TAKEN" }
  ],
  "parameterEvaluations": [
    { "parameterId": "uuid-do-parametro", "valuationInt": 7 }
  ]
}
```

Status de medicamento: `TAKEN` · `NOT_TAKEN` · `SKIPPED`

---

## Modelo de Dados

```
User ─────┬──── Emotion ──────── DailyRecord ──┬──── MedicationLog ──── Medication
          ├──── Medication                      └──── ParameterEvaluation ── Parameter
          ├──── Parameter
          └──── DailyRecord
```

- **Emoção, Remédio e Parâmetro** usam **soft delete** (`deletedAt`)
- **DailyRecord** não usa soft delete — um por usuário por dia (unique: userId + date)
- **Parâmetro**: o `type` é imutável após criação (protege o histórico de avaliações)

---

## Scripts

```bash
npm run dev               # Servidor com hot reload
npm start                 # Servidor em produção

npm test                  # Testes em modo watch
npm run test:run          # Testes (CI)
npm run test:coverage     # Relatório de cobertura

npm run prisma:generate   # Gera o Prisma Client
npm run prisma:migrate    # Cria e aplica migrations (dev)
npm run prisma:migrate:prod  # Aplica migrations em produção
npm run prisma:studio     # Abre o Prisma Studio
```

---

## Regras de Negócio

| Código | Regra |
|--------|-------|
| RN01 | Um usuário só pode ter um DailyRecord por dia |
| RN02 | Toda operação valida ownership do recurso |
| RN03 | Parâmetros e medicamentos devem pertencer ao usuário |
| RN04 | Medicamentos e parâmetros usam soft delete |
| RN06 | Uma emoção só pode ser associada a um DailyRecord se pertencer ao mesmo usuário |
| RN07 | A data do DailyRecord não pode ser futura |
| RN08 | O valor de avaliação de um parâmetro deve ser compatível com seu tipo |
| RN09 | Medicamentos e parâmetros deletados não podem ser usados em novos DailyRecords |
| RN10 | DailyRecord pode ser editado após criação |
| RN12 | Atualização de listas filhas usa substituição completa |
