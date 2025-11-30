import { UserModel } from './user.model';
import { sign } from 'hono/jwt';
import { CreateUserInput, LoginInput } from '@seu-app/shared';

export class UserService {
  public async createUser(data: CreateUserInput) {
    const { name, email, password } = data;

    const user = await UserModel.create({
      name,
      email,
      password,
    });

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }

  public async login(data: LoginInput) {
    const { email, password } = data;

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Email ou senha inválidos');
    }

    const token = await sign(
      { 
        id: user._id.toString(), 
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 1 dia
      }, 
      'your-secret-key'
    );

    return token;
  }
}