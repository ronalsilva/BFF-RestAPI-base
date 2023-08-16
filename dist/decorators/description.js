"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.TAG_DESCRIPTION = Symbol('Description');
const DESCRIPTIONS = new Map();
function description(description) {
    return function (target, key) {
        if (!DESCRIPTIONS.has(target.constructor)) {
            DESCRIPTIONS.set(target.constructor, new Map());
        }
        utils_1.registerMethod(target, key, function fnDescription(router) {
            router.description = description;
        });
        DESCRIPTIONS.get(target.constructor).set(key, description);
        target[exports.TAG_DESCRIPTION] = target.constructor[exports.TAG_DESCRIPTION] = DESCRIPTIONS.get(target.constructor);
    };
}
exports.description = description;
//# sourceMappingURL=description.js.map