import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  PORT: z.coerce.number().int().positive(),

  FRONTEND_URL: z.string().url(),

  AUTH_SERVICE_URL: z.string().url(),

  TASK_SERVICE_URL: z.string().url(),

  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive(),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive(),

  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive(),

  AUTH_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive(),
});

export const env = envSchema.parse(process.env);