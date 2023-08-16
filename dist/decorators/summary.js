"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.TAG_SUMMARY = Symbol('Summary');
const SUMMARIES = new Map();
function summary(summary) {
    return function (target, key) {
        if (!SUMMARIES.has(target.constructor)) {
            SUMMARIES.set(target.constructor, new Map());
        }
        SUMMARIES.get(target.constructor).set(key, summary);
        utils_1.registerMethod(target, key, function fnSummary(router) {
            router.summary = summary;
        });
        target[exports.TAG_SUMMARY] = target.constructor[exports.TAG_SUMMARY] = SUMMARIES.get(target.constructor);
    };
}
exports.summary = summary;
//# sourceMappingURL=summary.js.map