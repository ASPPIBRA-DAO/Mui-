import { getModelForClass, prop, pre } from '@typegoose/typegoose';
import { hash, compare } from 'bcryptjs';
import { type Document } from 'mongoose';

@pre<User>('save', async function (this: Document & User) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
})
export class User {
  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public password!: string;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return compare(candidatePassword, this.password);
  }
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
  },
});