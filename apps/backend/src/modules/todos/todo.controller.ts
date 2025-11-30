import { TodoService } from './todo.service';
import { CreateTodoInput } from '@seu-app/shared';

export class TodoController {
  private todoService: TodoService;

  constructor() {
    this.todoService = new TodoService();
  }

  public async createTodo(data: CreateTodoInput, userId: string) {
    return this.todoService.createTodo(data, userId);
  }

  public async getTodos(userId: string) {
    return this.todoService.getTodos(userId);
  }
}
