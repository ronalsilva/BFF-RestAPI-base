"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definition_1 = require("./definition");
const joi = require("joi");
const JoiToSwagger_1 = require("../utils/config/JoiToSwagger");
function toSwagger(iSchema) {
    if (iSchema['isJoi']) {
        return JoiToSwagger_1.default(iSchema).swagger;
    }
    if (iSchema['$ref']) {
        return iSchemaToSwagger(iSchema);
    }
    let rules = {};
    Object.assign(rules, iSchema);
    for (let key in rules) {
        if (!rules[key]['isJoi']) {
            rules[key] = toJoi(rules[key]);
        }
    }
    return JoiToSwagger_1.default(joi.object().keys(rules)).swagger;
}
exports.toSwagger = toSwagger;
function iSchemaToSwagger(iSchema) {
    let items = undefined;
    let $ref = iSchema['$ref'];
    let description = undefined;
    if (iSchema['items']) {
        items = toSwagger(iSchema['items']);
        $ref = items['$ref'];
    }
    if ($ref && $ref[definition_1.TAG_DEFINITION_NAME]) {
        description = $ref[definition_1.TAG_DEFINITION_DESCRIPTION];
        $ref = '#/definitions/' + $ref[definition_1.TAG_DEFINITION_NAME];
    }
    return { items, type: iSchema['type'] || 'object', $ref, description };
}
exports.iSchemaToSwagger = iSchemaToSwagger;
function toSchema(Definition) {
    return JoiToSwagger_1.default(classToJoi(Definition)).swagger;
}
exports.toSchema = toSchema;
function classToJoi(def) {
    let rules = {};
    rules = Object.assign(rules, new def());
    for (let key in rules) {
        if (!rules[key]['isJoi']) {
            rules[key] = toJoi(rules[key]);
        }
    }
    return joi.object().keys(rules);
}
exports.classToJoi = classToJoi;
function iSchemaToJoi(iSchema) {
    let type = iSchema['type'] || 'object';
    let schema = null;
    let Ref = iSchema['$ref'] || (iSchema['items'] && iSchema['items'].$ref);
    let rules = {};
    if (Ref) {
        let ref = new Ref();
        rules = Object.assign({}, ref);
    }
    for (let key in rules) {
        if (!rules[key]['isJoi']) {
            rules[key] = toJoi(rules[key]);
        }
    }
    if (joi[type]) {
        schema = joi[type]();
    }
    if (Ref && Ref[definition_1.TAG_DEFINITION_DESCRIPTION]) {
        schema = schema.description(iSchema['desc'] || Ref[definition_1.TAG_DEFINITION_DESCRIPTION]);
    }
    switch (type) {
        case 'object':
            return schema.keys(rules);
        case 'array':
            return schema.items(rules);
    }
}
exports.iSchemaToJoi = iSchemaToJoi;
function toJoi(iSchema) {
    if (iSchema['isJoi']) {
        return iSchema;
    }
    if (iSchema['$ref']) {
        return iSchemaToJoi(iSchema);
    }
    if (Object.prototype.toString.call(iSchema) === '[object Function]') {
        return classToJoi(iSchema);
    }
}
exports.toJoi = toJoi;
//# sourceMappingURL=ischema.js.map