import "reflect-metadata";
import koa from 'koa';
import koaBody from 'koa-body';
import { KJSRouter, } from './decorators';
import { PRISMA } from "./utils/db.server";
import { logFunc } from "./utils/middlewares";
import { swaggerConfig, bodyParserConfig, AppConfig } from './utils/config';

const main = async () => {

  // prisma connection initialization
  await PRISMA;

  const app = new koa();
  app.use(koaBody(bodyParserConfig));

  // Each request prints the request record
  // Add $getParams method for ctx
  app.use(logFunc);

  // route processing
  // Automatically scan routes
  // scan deinition
  const router = new KJSRouter(swaggerConfig);

  router.initApp(app);

  app.listen(AppConfig.port, () => {
    console.log(`app is listening on port: ${AppConfig.port}`);
  });
}

main();