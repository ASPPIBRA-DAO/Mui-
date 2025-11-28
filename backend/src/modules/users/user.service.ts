import { UserModel } from './user.model';
import { z } from 'zod';
import { sign } from '../../utils/jwt';

const createUserInput = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginInput = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserInput>;
export type LoginInput = z.infer<typeof loginInput>;

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
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = sign({ id: user._id, email: user.email });

    return token;
  }
}
