// src/env.ts
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    JWT_SECRET:   z.string().min(32),
    PORT:         z.coerce.number().default(3000),
    NODE_ENV:     z.enum(["development", "test", "production"]).default("development"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,  
});