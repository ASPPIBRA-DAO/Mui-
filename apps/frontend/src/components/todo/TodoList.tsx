
import { useTodos } from '../../hooks/useTodos';
import CreateTodoForm from './CreateTodoForm';

export function TodoList() {
  const { todos, loading, error, addTodo } = useTodos();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Create a new Todo</h2>
      <CreateTodoForm onAddTodo={addTodo} />

      <hr style={{ margin: '2rem 0' }} />

      <h2>Todo List</h2>
      {todos.length === 0 ? (
        <p>No todos yet!</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
              <p>{todo.completed ? 'Completed' : 'Not completed'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
