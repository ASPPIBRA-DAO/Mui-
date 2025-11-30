import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { TodoController } from './todo.controller';
import { authenticate } from '../../middlewares/guard';
import { createTodoInput, CreateTodoInput } from '@seu-app/shared';

// Tipagem para o Contexto (usuário injetado pelo middleware)
type Variables = {
  user: {
    id: string;
    email: string;
  };
};

const todoRoutes = new Hono<{ Variables: Variables }>();
const todoController = new TodoController();

// Protege todas as rotas abaixo
// Certifique-se de que não há espaços extras dentro das aspas do '*'
todoRoutes.use('*', authenticate);

// POST: Criar Tarefa
todoRoutes.post(
  '/', 
  zValidator('json', createTodoInput),
  async (c) => {
    const user = c.get('user');
    const data: CreateTodoInput = c.req.valid('json');
    
    const todo = await todoController.createTodo(data, user.id);
    return c.json(todo, 201);
  }
);

// GET: Listar Tarefas
todoRoutes.get('/', async (c) => {
  const user = c.get('user');
  const todos = await todoController.getTodos(user.id);
  return c.json(todos);
});

export { todoRoutes };