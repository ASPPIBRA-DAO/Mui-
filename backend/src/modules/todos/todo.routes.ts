import { FastifyInstance } from 'fastify';
import { todoSchemas } from './todo.schema';
import { TodoController } from './todo.controller';
import { authenticate } from '../../middlewares/guard';

export async function todoRoutes(server: FastifyInstance) {
  const todoController = new TodoController();

  server.addHook('onRequest', authenticate);

  server.post(
    '/',
    {
      schema: {
        body: todoSchemas.createTodo,
        response: {
          201: todoSchemas.createTodoResponse,
        },
      },
    },
    todoController.createTodo
  );

  server.get(
    '/',
    {
      schema: {
        response: {
          200: todoSchemas.getTodosResponse,
        },
      },
    },
    todoController.getTodos
  );
}
