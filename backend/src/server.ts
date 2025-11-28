import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { userRoutes } from './modules/users/user.routes';
import { todoRoutes } from './modules/todos/todo.routes';
import { verify } from './utils/jwt';

const server = fastify();

server.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        throw new Error('Missing token');
      }

      const decoded = verify(token) as { id: string; email: string };

      request.user = decoded;
    } catch (error) {
      reply.code(401).send(error);
    }
  }
);

async function main() {
  server.register(userRoutes, { prefix: 'api/users' });
  server.register(todoRoutes, { prefix: 'api/todos' });

  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server listening on port 3000');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
