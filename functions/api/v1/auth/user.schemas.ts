import { z } from 'zod';
import type { SafeParseReturnType } from 'zod'

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const registerSchema = z.object({
  username: z.string(),
  password: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
});

export const updateSchema = z.object({
  username: z.string(),
  password: z.string().optional(),
  name: z.string(),
  email: z.string().email().optional(),
});

export type LoginType = z.infer<typeof loginSchema>;
export type RegisterType = z.infer<typeof registerSchema>;

export const registerSafeParse = (body: unknown): SafeParseReturnType<RegisterType, typeof body> => {
  return registerSchema.safeParse(body);
}

export const updateSafeParse = (body: unknown): SafeParseReturnType<RegisterType, typeof body> => {
  return updateSchema.safeParse(body);
}

export const loginSafeParse = (body: unknown): SafeParseReturnType<LoginType, typeof body> => {
  return loginSchema.safeParse(body);
}