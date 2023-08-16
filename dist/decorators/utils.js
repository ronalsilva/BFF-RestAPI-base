"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TAG_MIDDLE_METHOD = Symbol("MiddleMethod");
exports.TAG_GLOBAL_METHOD = Symbol("GlobalMethod");
exports.TAG_MIDDLE_WARE = Symbol("MiddleWare");
const MIDDLE_METHODS = new Map();
const MIDDLE_WARES = new Map();
function registerMethod(target, key, deal) {
    if (!MIDDLE_METHODS.has(target.constructor)) {
        MIDDLE_METHODS.set(target.constructor, new Map());
    }
    if (!MIDDLE_METHODS.get(target.constructor).has(key)) {
        MIDDLE_METHODS.get(target.constructor).set(key, []);
    }
    MIDDLE_METHODS.get(target.constructor).get(key).push(deal);
    target[exports.TAG_MIDDLE_METHOD] = target.constructor[exports.TAG_MIDDLE_METHOD] = MIDDLE_METHODS.get(target.constructor);
}
exports.registerMethod = registerMethod;
function registerGlobal(target, deal) {
    if (!target[exports.TAG_GLOBAL_METHOD]) {
        target[exports.TAG_GLOBAL_METHOD] = [];
    }
    target[exports.TAG_GLOBAL_METHOD].push(deal);
}
exports.registerGlobal = registerGlobal;
function registerMiddleware(target, key, deal) {
    if (!MIDDLE_WARES.has(target.constructor)) {
        MIDDLE_WARES.set(target.constructor, new Map());
    }
    if (!MIDDLE_WARES.get(target.constructor).has(key)) {
        MIDDLE_WARES.get(target.constructor).set(key, new Set());
    }
    MIDDLE_WARES.get(target.constructor).get(key).add(deal);
    target[exports.TAG_MIDDLE_WARE] = target.constructor[exports.TAG_MIDDLE_WARE] = MIDDLE_WARES.get(target.constructor);
}
exports.registerMiddleware = registerMiddleware;
//# sourceMappingURL=utils.js.map