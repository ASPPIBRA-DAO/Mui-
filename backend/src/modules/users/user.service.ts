import { User, hash } from './user.model';
import { CreateUserInput, LoginInput } from './user.schema';
import { sign } from '../../utils/jwt';

export class UserService {
  public async createUser(data: CreateUserInput) {
    const { name, email, password } = data;

    const passwordHash = await hash(password);

    const user = await User.create({
      name,
      email,
      password: passwordHash,
    });

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }

  public async login(data: LoginInput) {
    const { email, password } = data;

    const user = await User.findOne({ email });

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
