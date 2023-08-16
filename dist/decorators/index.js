"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const Router = require("koa-router");
const method_1 = require("./method");
const controller_1 = require("./controller");
const definition_1 = require("./definition");
const middlewares_1 = require("../utils/config/middlewares");
const utils_1 = require("./utils");
const koaSwagger = require("koa2-swagger-ui");
__export(require("./controller"));
__export(require("./definition"));
__export(require("./description"));
__export(require("./ischema"));
__export(require("./method"));
__export(require("./parameter"));
__export(require("./response"));
__export(require("./summary"));
__export(require("./tag"));
__export(require("./login_required"));
exports.DEFAULT_SWAGGER = {
    swagger: "2.0",
    info: {
        version: "1.0.0",
        title: "Koa-Joi-Swagger-TS server"
    },
    host: "localhost:3002",
    basePath: "/v1/api",
    schemes: ["http"],
    paths: {},
    definitions: {}
};
exports.DEFAULT_PATH = {
    tags: [],
    summary: "",
    description: "",
    operationId: undefined,
    consumes: ["application/json"],
    produces: ["application/json"],
    responses: { "200": { description: "Success" } },
    security: []
};
class KJSRouter {
    constructor(swagger = exports.DEFAULT_SWAGGER) {
        this.router = new Router();
        this.getFiles = (path) => {
            let fileList = [];
            const findPathFunc = (basePath) => {
                const files = fs.readdirSync(basePath);
                files.forEach((file) => {
                    const filePath = `${basePath}/${file}`;
                    if (fs.statSync(filePath).isFile()) {
                        if (file.endsWith('.ts')) {
                            fileList.push(filePath);
                        }
                    }
                    else {
                        findPathFunc(filePath);
                    }
                });
            };
            findPathFunc(path);
            return fileList;
        };
        this.loadControllers = async (path) => {
            for (const file of this.getFiles(path)) {
                const controller = await Promise.resolve().then(() => require(file));
                if (!controller || !controller.default) {
                    continue;
                }
                this.loadController(controller.default);
            }
        };
        this.loadDefinitions = async (path) => {
            for (const file of this.getFiles(path)) {
                const definition = await Promise.resolve().then(() => require(file));
                if (!definition || !definition.default) {
                    continue;
                }
                this.loadDefinition(definition.default);
            }
        };
        this.swagger = swagger;
    }
    loadController(Controller) {
        if (Controller[controller_1.TAG_CONTROLLER]) {
            const allMethods = Controller[method_1.TAG_METHOD] || new Map();
            const paths = [...allMethods.keys()];
            const middleMethods = Controller[utils_1.TAG_MIDDLE_METHOD] || new Map();
            const middleWares = Controller[utils_1.TAG_MIDDLE_WARE] || new Map();
            paths.forEach((path) => {
                const temp = {};
                const fullPath = (Controller[controller_1.TAG_CONTROLLER] + path).replace(this.swagger.basePath, "");
                const methods = allMethods.get(path);
                for (let [k, v] of methods) {
                    let router = _.cloneDeep(exports.DEFAULT_PATH);
                    const methods = middleMethods.get(v.key);
                    const wares = middleWares.has(v.key) ? [...middleWares.get(v.key)] : [];
                    if (methods) {
                        for (let i = 0, len = methods.length; i < len; i++) {
                            methods[i](router, this.swagger);
                        }
                    }
                    temp[k] = router;
                    if (this.router[k]) {
                        const accessUrl = (Controller[controller_1.TAG_CONTROLLER] + path).replace(/{(\w+)}/g, ":$1");
                        this.router[k](accessUrl, ...(wares.concat(middlewares_1.RequestInject(accessUrl, v.handle))));
                    }
                }
                this.swagger.paths[fullPath] = temp;
            });
        }
    }
    loadDefinition(Definition) {
        if (Definition[definition_1.TAG_DEFINITION_NAME]) {
            const globalMethods = Definition[utils_1.TAG_GLOBAL_METHOD] || [];
            globalMethods.forEach((deal) => {
                deal(this.swagger);
            });
        }
    }
    setSwaggerFile(fileName) {
        this.swaggerFileName = this.swagger.basePath + "/" + fileName;
        this.router.get(this.swaggerFileName, (ctx, next) => {
            ctx.body = JSON.stringify(this.swagger);
        });
    }
    loadSwaggerUI(url) {
        this.router.get(url, koaSwagger({
            routePrefix: false,
            swaggerOptions: {
                url: this.swaggerFileName,
            }
        }));
    }
    getRouter() {
        return this.router;
    }
    initApp(app) {
        this.setSwaggerFile('swagger.json');
        this.loadSwaggerUI('/docs');
        this.loadControllers(path.resolve(__dirname, '../controllers'));
        this.loadDefinitions(path.resolve(__dirname, '../definitions'));
        app.use(this.getRouter().routes());
        app.use(this.getRouter().allowedMethods());
    }
}
exports.KJSRouter = KJSRouter;
//# sourceMappingURL=index.js.map