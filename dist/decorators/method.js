"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TAG_METHOD = Symbol('Method');
/**
 *  If it is a class method annotation,
 *  typescript is implemented by prototype,
 *  btw,
 *  class User extends BaseController {
 *      @get('/')
 *      index(){
 *
 *      }
 *  }
 *
 *  will cause the parent controller annotation pollution
 */
/**
 * Prevent inheritance pollution
 * @type {Map<any, any>}
 */
const METHODS = new Map();
/**
 * Method
 * @param method
 * @param path
 * @returns {(target:Object, key:string)=>undefined}
 */
function method(method, path) {
    return function (target, key) {
        if (!METHODS.has(target.constructor)) {
            METHODS.set(target.constructor, new Map());
        }
        if (!METHODS.get(target.constructor).has(path)) {
            METHODS.get(target.constructor).set(path, new Map());
        }
        METHODS.get(target.constructor).get(path).set(method, { key, handle: target[key] });
        target[exports.TAG_METHOD] = target.constructor[exports.TAG_METHOD] = METHODS.get(target.constructor);
    };
}
exports.method = method;
exports.get = (path) => method('get', path);
exports.put = (path) => method('put', path);
exports.del = (path) => method('delete', path);
exports.post = (path) => method('post', path);
//# sourceMappingURL=method.js.map