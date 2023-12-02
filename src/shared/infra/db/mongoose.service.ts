import { Connection, Model, STATES } from 'mongoose';
import { MongooseServiceAbstract } from './mongoose-abstract.service';

type ModelGeneric<T = any> = Model<T, unknown, unknown, unknown, any>;

export class MongooseService<
  ModelNamesKeys extends keyof Record<string, number>,
  ModelsMapDTO extends Record<string, any>,
> extends MongooseServiceAbstract {
  public static getInstance(): MongooseService<any, any> {
    if (!MongooseService.instance) {
      MongooseService.instance = new MongooseService();

      const isConnected = [
        MongooseService.instance.getDefaultConnection().readyState,
      ].includes(STATES.connected);

      if (!isConnected) MongooseService.instance.onModuleInit();
    }

    return MongooseService.instance;
  }

  override getModel<ModelName extends ModelNamesKeys>(
    modelName: ModelName,
  ): ModelGeneric<ModelsMapDTO[ModelName]> {
    return super.getModel(modelName as string);
  }
}

export { Connection, Model };
