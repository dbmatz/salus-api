import { defineConfig } from "prisma/config";
import { env } from "./src/env.ts";

export default defineConfig({
  schema: "src/infra/database/prisma/schema.prisma",
  migrations: {
    path: "src/infra/database/prisma/migrations",
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});