import * as Joi from "joi";

export default Joi.object().keys({
    email: Joi.string().required().description('User email'),
    password: Joi.string().required().description('User password'),
})