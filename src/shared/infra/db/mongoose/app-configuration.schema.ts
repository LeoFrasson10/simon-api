import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

type ThemeConfigDBO = {
  origin: string;
  imageUrl: string;
  colorPrimary: string;
  colorSecondary: string;
  appTitle?: string;
  favicon?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

@Schema()
export class ThemeConfigSchemaClass implements ThemeConfigDBO {
  @Prop()
  origin: string;
  @Prop()
  imageUrl: string;
  @Prop()
  colorPrimary: string;
  @Prop()
  colorSecondary: string;

  @Prop()
  appTitle: string;

  @Prop()
  favicon: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now, select: false })
  updatedAt?: Date;
}

export const ThemeConfigSchema = SchemaFactory.createForClass(
  ThemeConfigSchemaClass,
);

export { ThemeConfigSchemaClass as ThemeConfigDTO };
