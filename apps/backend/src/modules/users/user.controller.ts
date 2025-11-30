import { UserService } from './user.service';
import { CreateUserInput, LoginInput } from '@seu-app/shared';

export class UserController {
  private userService = new UserService();

  public async createUser(data: CreateUserInput) {
    return this.userService.createUser(data);
  }

  public async login(data: LoginInput) {
    const token = await this.userService.login(data);
    return { token };
  }
}