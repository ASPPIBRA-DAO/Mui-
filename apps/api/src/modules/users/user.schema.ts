
import { z } from 'zod';

// Schema do banco de dados (refletindo a tabela 'users')
export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  avatarUrl: z.string().nullable(),
  createdAt: z.string().nullable(),
});

// Parâmetros de rota (ex: /users/:id)
export const ParamsSchema = z.object({
  id: z.string(),
});

// Query params (ex: /users?limit=10)
export const QuerySchema = z.object({
  limit: z.string().transform(Number).optional(),
});

// Corpo da requisição para criação
export const CreateUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

// Corpo da requisição para atualização
export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});

// Schema para a resposta padrão de sucesso
export const SuccessResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(), // Pode ser um objeto ou um array
});

// Schema para a resposta de erro
export const ErrorResponseSchema = z.object({
  success: z.boolean(),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});
