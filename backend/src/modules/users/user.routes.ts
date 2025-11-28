import { FastifyInstance } from 'fastify';
import { userSchemas } from './user.schema';
import { UserController } from './user.controller';

export async function userRoutes(server: FastifyInstance) {
  const userController = new UserController();

  server.post(
    '/register',
    {
      schema: {
        body: userSchemas.createUser,
        response: {
          201: userSchemas.createUserResponse,
        },
      },
    },
    userController.createUser
  );

  server.post(
    '/login',
    {
      schema: {
        body: userSchemas.login,
        response: {
          200: userSchemas.loginResponse,
        },
      },
    },
    userController.login
  );
}
