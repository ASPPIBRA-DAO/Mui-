import { getModelForClass, prop, pre } from '@typegoose/typegoose';
import { hash as argonHash, verify } from 'argon2';

@pre<User>('save', async function () {
  if (this.isModified('password')) {
    this.password = await argonHash(this.password);
  }
})
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
