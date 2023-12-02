import { MongooseService } from '@shared/infra/db';
import { Schema } from 'mongoose';

import { BaaSCallbackDTO, BaasCallbackSchema } from './';

export enum ModelNames {
  'baas-callbacks',
}

type ModelNamesKeys = keyof typeof ModelNames;

type ModelsMapDTO = {
  'baas-callbacks': BaaSCallbackDTO;
};

export class MongooseServiceConcrete extends MongooseService<
  ModelNamesKeys,
  ModelsMapDTO
> {
  public static modelsWithNameAndSchema: Record<ModelNamesKeys, Schema> = {
    'baas-callbacks': BaasCallbackSchema,
  };

  public static getInstance(): MongooseServiceConcrete {
    const connection = super.getInstance();

    connection.setModels(MongooseServiceConcrete.modelsWithNameAndSchema);

    return connection;
  }
}

export { MongooseServiceConcrete as MongooseBaaSCallbacks };
