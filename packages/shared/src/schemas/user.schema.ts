import { z } from 'zod';

export const createUserInput = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(6),
});

export type CreateUserInput = z.infer<typeof createUserInput>;

export const loginInput = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginInput>;

const userCore = {
  email: z.string().email(),
  name: z.string(),
};

const createUserResponse = z.object({
  id: z.string(),
  ...userCore,
});

const loginResponse = z.object({
  token: z.string(),
});

export const userSchemas = {
  createUserResponse,
  loginResponse,
};