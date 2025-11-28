import { z } from 'zod';

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
