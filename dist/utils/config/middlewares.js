"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = require("log4js");
const jwt = require("jsonwebtoken");
const config_1 = require("./config");
log4js.configure(config_1.log4jsConfig);
const logger = log4js.getLogger('cheese');
exports.logFunc = async (ctx, next) => {
    ctx.$getParams = () => {
        console.warn('warning: it is unsafe for this function, please add @parameter for the controller');
        return Object.assign(ctx.params, ctx.request.body, ctx.request.query);
    };
    await next();
};
exports.RequestInject = (url, handler) => {
    return async (ctx, ...args) => {
        try {
            let result;
            result = await handler(Object.assign(ctx), ...args);
            // await getConnection().transaction(async manager => {
            // }); 
            if (result !== undefined) {
                ctx.body = result;
            }
            if (ctx.body === undefined) {
                ctx.throw(500, 'no return value');
            }
        }
        catch (error) {
            logger.error(url, ctx.$getParams());
            logger.error(error.stack);
            ctx.status = 500;
            ctx.body = {
                code: error.statusCode || error.status || 500,
                message: config_1.isDebug ? error.message : 'error'
            };
        }
    };
};
exports.AuthFunc = async (ctx, next) => {
    const token = (ctx.headers['Authorization'] || '').replace('Bearer ', '');
    try {
        // 1. token in headers
        // 2. token in cookies(for swagger)
        jwt.verify(token || ctx.cookies.get('token'), config_1.AppConfig.appKey);
        await next();
    }
    catch (error) {
        ctx.status = 403;
        ctx.body = {
            code: 403,
            message: 'The account is not logged in or the login status has expired'
        };
    }
};
//# sourceMappingURL=middlewares.js.map