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
}

export const TodoModel = getModelForClass(Todo, {
  schemaOptions: {
    timestamps: true,
  },
});
