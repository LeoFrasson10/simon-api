import { MongooseService } from '@shared/infra/db';
import { Schema } from 'mongoose';

import { BaaSRequestDTO, BaaSRequestSchema } from './';

export enum ModelNames {
  'baas-request',
}

type ModelNamesKeys = keyof typeof ModelNames;

type ModelsMapDTO = {
  'baas-request': BaaSRequestDTO;
};

export class MongooseServiceConcrete extends MongooseService<
  ModelNamesKeys,
  ModelsMapDTO
> {
  public static modelsWithNameAndSchema: Record<ModelNamesKeys, Schema> = {
    'baas-request': BaaSRequestSchema,
  };

  public static getInstance(): MongooseServiceConcrete {
    const connection = super.getInstance();

    connection.setModels(MongooseServiceConcrete.modelsWithNameAndSchema);

    return connection;
  }
}

export { MongooseServiceConcrete as MongooseBaaSRequest };
