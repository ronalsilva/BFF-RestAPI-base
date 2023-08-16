"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../../decorators");
const joi = require("joi");
//services
const getUser_1 = require("../../services/user/getUser");
const postUser_1 = require("../../services/user/postUser");
const login_1 = require("../../services/user/login");
//request
const createUserResquest_1 = require("./request/createUserResquest");
const loginRequest_1 = require("./request/loginRequest");
//response
const createUserResponse_1 = require("./response/createUserResponse");
const loginResponse_1 = require("./response/loginResponse");
let UserController = class UserController {
    async queryUsers(ctx) {
        const { userid } = ctx.$getParams();
        const result = await getUser_1.default().user(userid);
        return userid;
    }
    async postUser(ctx) {
        const { body } = ctx.request;
        const result = await postUser_1.default().create(body);
        return result;
    }
    async login(ctx) {
        const { email, password } = ctx.$getParams();
        const result = await login_1.default().get(email, password);
        ctx.cookies.set('token', result.token);
        return result;
    }
};
__decorate([
    decorators_1.get('/search'),
    decorators_1.tag('User'),
    decorators_1.summary('Search user'),
    decorators_1.parameter('userid', joi.string().description('teste').default('')),
    decorators_1.login_required(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "queryUsers", null);
__decorate([
    decorators_1.post('/create'),
    decorators_1.tag('User'),
    decorators_1.summary('Create user with correct info'),
    decorators_1.parameter('body', createUserResquest_1.default, decorators_1.ENUM_PARAM_IN.body),
    decorators_1.response(200, createUserResponse_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "postUser", null);
__decorate([
    decorators_1.post('/login'),
    decorators_1.tag('User'),
    decorators_1.summary('Login user'),
    decorators_1.parameter('body', loginRequest_1.default, decorators_1.ENUM_PARAM_IN.body),
    decorators_1.response(200, loginResponse_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
UserController = __decorate([
    decorators_1.controller('/user')
], UserController);
exports.default = UserController;
//# sourceMappingURL=controller.js.map