import * as Joi from "joi";

export default Joi.object({
    user_id: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    dob: Joi.string().required(),
    photo: Joi.string(),
    gender: Joi.string().required(),
    created_at: Joi.string().required(),
    updated_at: Joi.string().required(),
    is_active: Joi.boolean().required()
})