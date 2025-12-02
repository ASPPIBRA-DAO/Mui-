
import api from './api';

// Supondo uma interface Todo, que idealmente viria de um pacote compartilhado
interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface CreateTodoPayload {
  title: string;
  description: string;
}

/**
 * Busca todas as tarefas.
 */
export const getTodos = async (): Promise<Todo[]> => {
  const response = await api.get('/todos');
  return response.data;
};

/**
 * Cria uma nova tarefa.
 * @param todoData - Os dados da nova tarefa.
 */
export const createTodo = async (todoData: CreateTodoPayload): Promise<Todo> => {
  const response = await api.post('/todos', todoData);
  return response.data;
};

const todoService = {
  getTodos,
  createTodo,
};

export default todoService;
