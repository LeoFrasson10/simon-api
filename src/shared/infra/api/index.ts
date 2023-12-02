import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { server } from '@shared/config';
import { AppModule } from './app.module';
import { json } from 'express';

import {
  DocumentBuilder,
  SwaggerModule,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';

export async function bootstrapAPI() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(json({ limit: '20mb' }));

  AppModule.swaggerModules.forEach((swaggermodule) => {
    const documentBuilder = new DocumentBuilder();
    swaggermodule.hasBearerAuth && documentBuilder.addBearerAuth();
    const config = documentBuilder.build();

    const { title, description, version, modules, path, name } = swaggermodule;

    modules.forEach((module) => {
      const controllers = Reflect.getMetadata('controllers', module);
      controllers.forEach((controller) => {
        const methodNames = Object.getOwnPropertyNames(
          controller.prototype,
        ).filter((item) => item !== 'constructor');

        methodNames.forEach((method) => {
          const controllerPrototypeMethod = controller.prototype[method];

          Reflect.getMetadataKeys(controllerPrototypeMethod)
            .filter((item) => String(item).startsWith('swagger/'))
            .forEach((item) => {
              Reflect.deleteMetadata(item, controllerPrototypeMethod);
            });

          const customMetadata = Reflect.getMetadata(
            name,
            controllerPrototypeMethod,
          );

          if (customMetadata) {
            const decorators = [ApiExcludeEndpoint(false)];
            if (customMetadata.decorators)
              decorators.push(customMetadata.decorators);

            Reflect.decorate(
              decorators,
              controller.prototype,
              method,
              Object.getOwnPropertyDescriptor(controller.prototype, method),
            );
          } else {
            Reflect.decorate(
              [ApiExcludeEndpoint()],
              controller.prototype,
              method,
              Object.getOwnPropertyDescriptor(controller.prototype, method),
            );
          }
        });
      });
    });

    const document = SwaggerModule.createDocument(
      app,
      {
        ...config,
        info: { ...config.info, title, description, version },
      },
      { include: modules.length > 0 ? modules : [() => {}] },
    );
    if (server.env !== 'production') {
      SwaggerModule.setup(`docs/${path}`, app, document);
    }
  });

  await app.listen(server.port ?? '3000', '0.0.0.0');

  if (server.env !== 'production')
    console.log(`Application is running on: ${await app.getUrl()}`);
}
