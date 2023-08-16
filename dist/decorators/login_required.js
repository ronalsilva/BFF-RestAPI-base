"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const middlewares_1 = require("../utils/config/middlewares");
function login_required() {
    return function (target, key) {
        utils_1.registerMiddleware(target, key, middlewares_1.AuthFunc);
    };
}
exports.login_required = login_required;
//# sourceMappingURL=login_required.js.map