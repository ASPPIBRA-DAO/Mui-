import { z } from 'zod';

// 1. O VALIDADOR (usado no runtime pelo zValidator)
export const createTodoInput = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
});

// 2. O TIPO (usado pelo TypeScript)
export type CreateTodoInput = z.infer<typeof createTodoInput>;