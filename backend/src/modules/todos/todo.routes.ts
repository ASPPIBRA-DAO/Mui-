import { FastifyInstance } from 'fastify';
import { todoSchemas } from './todo.schema';
import { TodoController } from './todo.controller';

export async function todoRoutes(server: FastifyInstance) {
  const todoController = new TodoController();

  server.post(
    '/',
    {
      schema: {
        body: todoSchemas.createTodo,
        response: {
          201: todoSchemas.createTodoResponse,
        },
      },
      preHandler: [server.authenticate],
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
      preHandler: [server.authenticate],
    },
    todoController.getTodos
  );
}
