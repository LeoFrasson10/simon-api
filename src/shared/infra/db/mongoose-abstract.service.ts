import { OnModuleInit } from '@nestjs/common';
import { mongo } from '@shared/config';
import { Mongoose, Connection, Model, Schema } from 'mongoose';

export abstract class MongooseServiceAbstract implements OnModuleInit {
  protected instanceMongoose: Mongoose;
  protected static instance: MongooseServiceAbstract;
  private uri = mongo.url;
  private dbName = mongo.dbName;

  protected constructor() {
    this.instanceMongoose = new Mongoose();
  }

  async onModuleInit() {
    await this.connect();
  }

  protected async connect() {
    await this.instanceMongoose.connect(this.uri, {
      dbName: this.dbName,
    });
  }

  getModel(modelName: string): Model<any, unknown, unknown, unknown, any> {
    return this.instanceMongoose.models[modelName];
  }

  getDefaultConnection(): Connection {
    return this.instanceMongoose.connection;
  }

  setModel(name: string, schema?: any) {
    this.instanceMongoose.model(name, schema);
  }

  setModels(modelsAndSchemas: Record<string, Schema>) {
    for (const [modelName, schema] of Object.entries(modelsAndSchemas)) {
      this.setModel(modelName, schema);
    }
  }
}

export { Connection, Model };
