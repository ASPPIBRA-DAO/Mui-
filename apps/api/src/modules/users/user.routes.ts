
import { Hono } from 'hono';
import { getUsers, getUser, createUser, updateUser, deleteUser } from './user.controller';

const users = new Hono();

users.get('/', getUsers);
users.get('/:id', getUser);
users.post('/', createUser);
users.put('/:id', updateUser);
users.delete('/:id', deleteUser);

export default users;
