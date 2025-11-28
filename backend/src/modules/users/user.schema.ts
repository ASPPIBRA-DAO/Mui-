import { z } from 'zod';

const userCore = {
  email: z.string().email(),
  name: z.string(),
};

const createUser = z.object({
  ...userCore,
  password: z.string().min(6),
});

const createUserResponse = z.object({
  id: z.string(),
  ...userCore,
});

const login = z.object({
  email: z.string().email(),
  password: z.string(),
});

const loginResponse = z.object({
  token: z.string(),
});

export const userSchemas = {
  createUser,
  createUserResponse,
  login,
  loginResponse,
};
