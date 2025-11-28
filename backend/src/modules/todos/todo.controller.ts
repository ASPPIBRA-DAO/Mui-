import { FastifyReply, FastifyRequest } from 'fastify';
import { TodoService } from './todo.service';
import { CreateTodoInput } from './todo.schema';

export class TodoController {
  constructor(private readonly todoService = new TodoService()) {}

  public async createTodo(
    request: FastifyRequest<{ Body: CreateTodoInput }>,
    reply: FastifyReply
  ) {
    const todo = await this.todoService.createTodo(request.body, request.user.id);

    return reply.code(201).send(todo);
  }

  public async getTodos(request: FastifyRequest, reply: FastifyReply) {
    const todos = await this.todoService.getTodos(request.user.id);

    return reply.code(200).send(todos);
  }
}
