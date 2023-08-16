"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
exports.default = Joi.object().keys({
    email: Joi.string().required().description('User email'),
    password: Joi.string().required().description('User password'),
});
//# sourceMappingURL=loginRequest.js.map