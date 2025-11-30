import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { UserController } from './user.controller';
import { createUserInput, loginInput, CreateUserInput, LoginInput } from '@seu-app/shared';

const userRoutes = new Hono();
const userController = new UserController();

userRoutes.post('/register', zValidator('json', createUserInput), async (c) => {
  const data: CreateUserInput = c.req.valid('json');
  const user = await userController.createUser(data);
  return c.json(user, 201);
});

userRoutes.post('/login', zValidator('json', loginInput), async (c) => {
  const data: LoginInput = c.req.valid('json');
  const res = await userController.login(data);
  return c.json(res);
});

export { userRoutes };