"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.TAG_TAG = Symbol('Tag');
const TAGS = new Map();
function tag(tag) {
    return function (target, key) {
        if (!TAGS.has(target.constructor)) {
            TAGS.set(target.constructor, new Map());
        }
        if (!TAGS.get(target.constructor).has(key)) {
            TAGS.get(target.constructor).set(key, new Set());
        }
        utils_1.registerMethod(target, key, function fnTag(router) {
            if (!router.tags) {
                router.tags = [];
            }
            router.tags.push(tag);
        });
        TAGS.get(target.constructor).get(key).add(tag);
        target[exports.TAG_TAG] = target.constructor[exports.TAG_TAG] = TAGS.get(target.constructor);
    };
}
exports.tag = tag;
//# sourceMappingURL=tag.js.map