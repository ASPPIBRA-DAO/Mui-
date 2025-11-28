import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import { CreateUserInput, LoginInput } from './user.schema';

export class UserController {
  constructor(private readonly userService = new UserService()) {}

  public async createUser(
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
  ) {
    const user = await this.userService.createUser(request.body);

    return reply.code(201).send(user);
  }

  public async login(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
  ) {
    const token = await this.userService.login(request.body);

    return reply.code(200).send({ token });
  }
}
