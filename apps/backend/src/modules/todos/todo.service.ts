import { TodoModel } from './todo.model';
import { CreateTodoInput } from '@seu-app/shared'; // ✅ Corrigido

export class TodoService {
  public async createTodo(data: CreateTodoInput, userId: string) {
    // Cria a tarefa vinculada ao usuário
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