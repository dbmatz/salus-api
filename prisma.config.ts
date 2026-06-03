import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/infra/database/prisma/schema.prisma",
  migrations: {
    path: "src/infra/database/prisma/migrations",
  },
  datasource: {
    // @ts-ignore
    url: process.env.DATABASE_URL ?? "",
  },
});