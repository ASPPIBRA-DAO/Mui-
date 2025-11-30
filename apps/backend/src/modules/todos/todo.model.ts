import { getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Todo {
  @prop({ required: true })
  public title!: string;

  @prop({ required: false })
  public description?: string;

  @prop({ required: false, default: false })
  public completed?: boolean;

  @prop({ required: true })
  public userId!: string;

  public createdAt!: Date;

  public updatedAt!: Date;
}

export const TodoModel = getModelForClass(Todo);