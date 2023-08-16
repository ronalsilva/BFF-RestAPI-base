"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const utils_1 = require("./utils");
const ischema_1 = require("./ischema");
exports.TAG_RESPONSE = Symbol('Response');
const RESPONSES = new Map();
exports.DEFAULT_RESPONSE = joi.string().default('');
function response(code, schema) {
    return function (target, key) {
        if (!schema) {
            schema = exports.DEFAULT_RESPONSE;
        }
        if (!RESPONSES.has(target.constructor)) {
            RESPONSES.set(target.constructor, new Map());
        }
        if (!RESPONSES.get(target.constructor).has(key)) {
            RESPONSES.get(target.constructor).set(key, new Map());
        }
        utils_1.registerMethod(target, key, function fnResponse(router) {
            if (!router.responses) {
                router.responses = {};
            }
            schema = ischema_1.toSwagger(schema);
            let description = '';
            if (schema['description']) {
                description = schema['description'];
                delete schema['description'];
            }
            router.responses[code] = Object.assign({ description: description }, { schema });
        });
        // 不需要返回响应的时候格式化数据
        // registerMiddleware(target, key, async function fnResponse(ctx, next) {
        //   await next();
        //   // if has been handle the error;
        //   if (RESPONSES.get(target.constructor).get(key).has(ctx.status)) {
        //     const aleadyHandled = ctx.body && ctx.body.code && ctx.body.code === 500 && ctx.body.message;
        //     if (aleadyHandled) {
        //       return;
        //     }
        //     let { error, value } = joi.validate(ctx.body, RESPONSES.get(target.constructor).get(key).get(ctx.status));
        //     if (error) {
        //       ctx.body = { code: 500, message: error.message };
        //       ctx.status = 500;
        //       return;
        //     }
        //     ctx.body = value;
        //   }
        // });
        RESPONSES.get(target.constructor).get(key).set(code, ischema_1.toJoi(schema));
        target[exports.TAG_RESPONSE] = target.constructor[exports.TAG_RESPONSE] = RESPONSES.get(target.constructor);
    };
}
exports.response = response;
//# sourceMappingURL=response.js.map