import { getModelForClass, prop } from '@typegoose/typegoose';
import { hash as argonHash, verify } from 'argon2';

export class User {
  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public password!: string;

  public async comparePassword(password: string): Promise<boolean> {
    return verify(this.password, password);
  }
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
  },
});

export const hash = async (password: string): Promise<string> => {
  return argonHash(password);
};
