
import { useState, useEffect } from 'react';
import todoService from '../services/todos';

// Supondo a mesma interface Todo
interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const data = await todoService.getTodos();
        setTodos(data);
      } catch (err) {
        setError('Failed to fetch todos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (title: string, description: string) => {
    try {
      const newTodo = await todoService.createTodo({ title, description });
      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (err) {
      setError('Failed to create todo');
      console.error(err);
      // Opcional: reverter a UI ou mostrar um erro mais específico
    }
  };

  return { todos, loading, error, addTodo };
};
