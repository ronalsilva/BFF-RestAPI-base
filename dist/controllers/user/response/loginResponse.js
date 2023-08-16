"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
exports.default = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
//# sourceMappingURL=loginResponse.js.map