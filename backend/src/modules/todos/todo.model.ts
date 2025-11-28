import { getModelForClass, prop } from '@typegoose/typegoose';

export class Todo {
  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ default: false })
  public completed!: boolean;

  @prop({ required: true })
  public userId!: string;

  @prop({ default: Date.now() })
  public createdAt!: Date;

  @prop({ default: Date.now() })
  public updatedAt!: Date;
}

export const TodoModel = getModelForClass(Todo, {
  schemaOptions: {
    timestamps: true,
  },
});
