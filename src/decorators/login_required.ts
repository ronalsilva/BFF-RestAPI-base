import {  registerMiddleware } from './utils';
import { AuthFunc } from '../utils/config/middlewares';

export function login_required(): MethodDecorator {
  return function (target: any, key: string) {
    registerMiddleware(target, key, AuthFunc);
  }
}
