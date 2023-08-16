"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const koa = require("koa");
const koaBody = require("koa-body");
const decorators_1 = require("./decorators");
const db_server_1 = require("./utils/config/db.server");
const middlewares_1 = require("./utils/config/middlewares");
const config_1 = require("./utils/config/config");
const main = async () => {
    // prisma connection initialization
    await db_server_1.PRISMA;
    const app = new koa();
    app.use(koaBody(config_1.bodyParserConfig));
    // Each request prints the request record
    // Add $getParams method for ctx
    app.use(middlewares_1.logFunc);
    // route processing
    // Automatically scan routes
    // scan deinition
    const router = new decorators_1.KJSRouter(config_1.swaggerConfig);
    router.initApp(app);
    app.listen(config_1.AppConfig.port, () => {
        console.log(`app is listening on port: ${config_1.AppConfig.port}`);
    });
};
main();
//# sourceMappingURL=main.js.map