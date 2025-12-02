
import { useState } from 'react';

interface CreateTodoFormProps {
  onAddTodo: (title: string, description: string) => Promise<void>;
}

const CreateTodoForm = ({ onAddTodo }: CreateTodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title) {
      setError('Title is required');
      return;
    }
    
    try {
      await onAddTodo(title, description);
      setTitle('');
      setDescription('');
      setError('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <button type="submit">Create Todo</button>
    </form>
  );
};

export default CreateTodoForm;
