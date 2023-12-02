import { MongooseService } from '@shared/infra/db';
import { Schema } from 'mongoose';

import { ThemeConfigDTO, ThemeConfigSchema } from './';

export enum ModelNames {
  'themes',
}

type ModelNamesKeys = keyof typeof ModelNames;

type ModelsMapDTO = {
  themes: ThemeConfigDTO;
};

export class MongooseServiceConcrete extends MongooseService<
  ModelNamesKeys,
  ModelsMapDTO
> {
  public static modelsWithNameAndSchema: Record<ModelNamesKeys, Schema> = {
    themes: ThemeConfigSchema,
  };

  public static getInstance(): MongooseServiceConcrete {
    const connection = super.getInstance();

    connection.setModels(MongooseServiceConcrete.modelsWithNameAndSchema);

    return connection;
  }
}

export { MongooseServiceConcrete as MongooseThemeConfig };
