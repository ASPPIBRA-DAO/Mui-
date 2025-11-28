import { z } from 'zod';

const todoCore = {
  title: z.string(),
  description: z.string(),
};

const createTodo = z.object({
  ...todoCore,
});

const createTodoResponse = z.object({
  id: z.string(),
  ...todoCore,
  completed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const getTodosResponse = z.array(createTodoResponse);

export type CreateTodoInput = z.infer<typeof createTodo>;

export const todoSchemas = {
  createTodo,
  createTodoResponse,
  getTodosResponse,
};
