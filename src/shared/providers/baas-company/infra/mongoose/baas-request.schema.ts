import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

type BaaSRequestDBO = {
  origin: string;
  token: string;
  duedate: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

@Schema()
export class BaaSRequestSchemaClass implements BaaSRequestDBO {
  @Prop()
  origin: string;
  @Prop()
  token: string;

  @Prop()
  duedate: Date;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now, select: false })
  updatedAt?: Date;
}

export const BaaSRequestSchema = SchemaFactory.createForClass(
  BaaSRequestSchemaClass,
);

export { BaaSRequestSchemaClass as BaaSRequestDTO };
