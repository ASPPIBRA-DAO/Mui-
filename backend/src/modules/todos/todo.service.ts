import { TodoModel } from './todo.model';
import { CreateTodoInput } from './todo.schema';

export class TodoService {
  public async createTodo(data: CreateTodoInput, userId: string) {
    const todo = await TodoModel.create({ ...data, userId });

    return {
      id: todo._id.toString(),
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    };
  }

  public async getTodos(userId: string) {
    const todos = await TodoModel.find({ userId });

    return todos.map((todo) => ({
      id: todo._id.toString(),
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    }));
  }
}
