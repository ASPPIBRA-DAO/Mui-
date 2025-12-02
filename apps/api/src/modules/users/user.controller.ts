
import { Context } from 'hono';
import { UserService } from './user.service';
import { createUserSchema, updateUserSchema } from './user.schema';

export const getUsers = async (c: Context) => {
  const userService = new UserService(c.env.DB);
  const users = await userService.getUsers();
  return c.json(users);
};

export const getUser = async (c: Context) => {
  const id = c.req.param('id');
  const userService = new UserService(c.env.DB);
  const user = await userService.getUser(id);
  return c.json(user);
};

export const createUser = async (c: Context) => {
  const body = await c.req.json();
  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.issues }, 400);
  }

  const userService = new UserService(c.env.DB);
  const newUser = await userService.createUser(parsed.data);
  return c.json(newUser, 201);
};

export const updateUser = async (c: Context) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const parsed = updateUserSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.issues }, 400);
  }

  const userService = new UserService(c.env.DB);
  const updatedUser = await userService.updateUser(id, parsed.data);
  return c.json(updatedUser);
};

export const deleteUser = async (c: Context) => {
  const id = c.req.param('id');
  const userService = new UserService(c.env.DB);
  await userService.deleteUser(id);
  return c.json({ message: 'User deleted' });
};
