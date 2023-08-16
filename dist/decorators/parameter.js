"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ischema_1 = require("./ischema");
const joi = require("joi");
const utils_1 = require("./utils");
exports.TAG_PARAMETER = Symbol('Parameter');
const PARAMETERS = new Map();
var ENUM_PARAM_IN;
(function (ENUM_PARAM_IN) {
    ENUM_PARAM_IN[ENUM_PARAM_IN["query"] = 0] = "query";
    ENUM_PARAM_IN[ENUM_PARAM_IN["body"] = 1] = "body";
    ENUM_PARAM_IN[ENUM_PARAM_IN["header"] = 2] = "header";
    ENUM_PARAM_IN[ENUM_PARAM_IN["path"] = 3] = "path";
})(ENUM_PARAM_IN = exports.ENUM_PARAM_IN || (exports.ENUM_PARAM_IN = {}));
function parameter(name, schema, paramIn) {
    return function (target, key) {
        if (!paramIn) {
            paramIn = ENUM_PARAM_IN.query;
        }
        if (!PARAMETERS.has(target.constructor)) {
            PARAMETERS.set(target.constructor, new Map());
        }
        if (!PARAMETERS.get(target.constructor).has(key)) {
            PARAMETERS.get(target.constructor).set(key, new Map());
        }
        utils_1.registerMethod(target, key, function fnParameter(router) {
            if (!router.parameters) {
                router.parameters = [];
            }
            schema = ischema_1.toSwagger(schema);
            let description = '';
            if (schema['description']) {
                description = schema['description'];
                delete schema['description'];
            }
            router.parameters.push(Object.assign({
                name,
                in: ENUM_PARAM_IN[paramIn],
                description: description
            }, { required: paramIn == ENUM_PARAM_IN.path }, ENUM_PARAM_IN.body === paramIn ? { schema } : schema));
        });
        utils_1.registerMiddleware(target, key, async function fnParameter(ctx, next) {
            let schemas = PARAMETERS.get(target.constructor).get(key);
            let tempSchema = { params: {}, body: {}, query: {} };
            for (let [name, schema] of schemas) {
                switch (schema.in) {
                    case ENUM_PARAM_IN.query:
                        tempSchema.query[name] = schema.schema;
                        break;
                    case ENUM_PARAM_IN.path:
                        tempSchema.params[name] = schema.schema;
                        break;
                    case ENUM_PARAM_IN.body:
                        tempSchema.body = schema.schema;
                }
            }
            const { error, value } = joi.validate({
                params: ctx.params,
                body: ctx.request.body,
                query: ctx.request.query
            }, tempSchema, {
                allowUnknown: true,
                abortEarly: true,
            });
            if (error) {
                return ctx.throw(400, JSON.stringify({ code: 400, message: error.message }));
            }
            // 参数验证完成, 再覆盖$getParams方法
            ctx.$getParams = () => {
                return Object.assign(value.params, value.body, value.query);
            };
            return await next();
        });
        PARAMETERS.get(target.constructor).get(key).set(name, { in: paramIn, schema: ischema_1.toJoi(schema) });
        target[exports.TAG_PARAMETER] = target.constructor[exports.TAG_PARAMETER] = PARAMETERS.get(target.constructor);
    };
}
exports.parameter = parameter;
//# sourceMappingURL=parameter.js.map