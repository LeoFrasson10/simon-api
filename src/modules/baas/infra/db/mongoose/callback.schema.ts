import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

type BaaSCallbackDBO<T = object> = {
  origin: string;
  data: T;
  createdAt?: Date;
  updatedAt?: Date;
};

@Schema()
export class BaasCallbackSchemaClass<T = object> implements BaaSCallbackDBO<T> {

  @Prop()
  integrationId: string;

  @Prop()
  integrationName: string;

  @Prop()
  origin: string;

  @Prop({ type: Object })
  data: T;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now, select: false })
  updatedAt?: Date;
}

export const BaasCallbackSchema = SchemaFactory.createForClass(
  BaasCallbackSchemaClass,
);

export { BaasCallbackSchemaClass as BaaSCallbackDTO };
