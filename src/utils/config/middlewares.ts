import * as log4js from 'log4js';
import * as jwt from 'jsonwebtoken';
// import { getConnection } from "typeorm";
import { IContext } from '../../decorators/interface';
import { isDebug, log4jsConfig, AppConfig } from "./config";

log4js.configure(log4jsConfig);

const logger = log4js.getLogger('cheese');

export const logFunc = async (ctx, next) => {
  ctx.$getParams = () => {
    console.warn('warning: it is unsafe for this function, please add @parameter for the controller');
    return Object.assign(ctx.params, ctx.request.body, ctx.request.query);
  }
  await next();
}

export const RequestInject = (url, handler) => {
  return async (ctx: IContext, ...args) => {
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
    } catch (error) {
      logger.error(url, ctx.$getParams());
      logger.error(error.stack);
      ctx.status = 500;
      ctx.body = {
        code: error.statusCode || error.status || 500,
        message: isDebug ? error.message : 'error'
      }
    }
  }
}

export const AuthFunc = async (ctx: IContext, next) => {
  const token = (ctx.headers['Authorization'] || '').replace('Bearer ', '');
  try {
    // 1. token in headers
    // 2. token in cookies(for swagger)
    jwt.verify(token || ctx.cookies.get('token'), AppConfig.appKey);
    await next();
  } catch (error) {
    ctx.status = 403;
    ctx.body = {
      code: 403,
      message: 'The account is not logged in or the login status has expired'
    }
  }
}