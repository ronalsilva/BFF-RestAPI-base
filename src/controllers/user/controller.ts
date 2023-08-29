import {
    get,
    tag,
    post,
    summary,
    parameter,
    response,
    controller,
    ENUM_PARAM_IN,
    login_required
  } from "../../decorators";
import * as joi from 'joi';
import { IContext } from '../../decorators/interface';

//services
import getUserService  from "../../services/user/getUser";
import postUserService  from "../../services/user/postUser";
import loginService  from "../../services/user/login";

//request
import createUserResquest from "./request/createUserResquest";
import loginRequest from "./request/loginRequest";

//response
import createUserResponse from "./response/createUserResponse";
import loginResponse from "./response/loginResponse";
  
@controller('/user')
    export default class UserController {

    @get('/search')
    @tag('User')
    @summary('Search user')
    @parameter('userid', joi.string().description('teste').default(''))
    // @login_required()
    async queryUsers(ctx: IContext) {
        const {
            userid
        } = ctx.$getParams();

        const result = await getUserService.userGet(userid);

        return result;
    }

    @post('/create')
    @tag('User')
    @summary('Create user with correct info')
    @parameter('body', createUserResquest, ENUM_PARAM_IN.body)
    @response(200, createUserResponse)
    async postUser(ctx: IContext) {
        const { body } = ctx.request;
        const result = await postUserService.create(body);
        return result;
    }

    @post('/login')
    @tag('User')
    @summary('Login user')
    @parameter('body', loginRequest, ENUM_PARAM_IN.body)
    @response(200, loginResponse)
    async login(ctx: IContext) {
        const { email, password } = ctx.$getParams();

        const result = await loginService.get(email, password)

        ctx.cookies.set('token', result.token);
        return result;
    }
}