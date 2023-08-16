'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const lodash_1 = require("lodash");
const patterns = {
    alphanum: '^[a-zA-Z0-9]*$',
    alphanumLower: '^[a-z0-9]*$',
    alphanumUpper: '^[A-Z0-9]*$',
};
const isJoi = function (joiObj) {
    return !!((joiObj && joiObj.isJoi));
};
const hasJoiMeta = function (joiObj) {
    return !!((isJoi(joiObj) && Array.isArray(joiObj._meta)));
};
const getJoiMetaProperty = function (joiObj, propertyName) {
    // get headers added using meta function
    if (isJoi(joiObj) && hasJoiMeta(joiObj)) {
        const meta = joiObj._meta;
        let i = meta.length;
        while (i--) {
            if (meta[i][propertyName]) {
                return meta[i][propertyName];
            }
        }
    }
    return undefined;
};
function parse(schema, existingComponents = null) {
    // inspect(schema);
    if (!schema)
        throw new Error('No schema was passed.');
    if (typeof schema === 'object' && !schema.isJoi) {
        schema = joi.object().keys(schema);
    }
    if (!schema.isJoi)
        throw new TypeError('Passed schema does not appear to be a joi schema.');
    var override = meta(schema, 'swagger');
    if (override && meta(schema, 'swaggerOverride')) {
        return { swagger: override, components: {} };
    }
    var metaDefName = meta(schema, 'className');
    var metaDefType = meta(schema, 'classTarget') || 'schemas';
    // if the schema has a definition class name, and that
    // definition is already defined, just use that definition
    if (metaDefName && lodash_1.get(existingComponents, [metaDefType, metaDefName])) {
        return { swagger: refDef(metaDefType, metaDefName) };
    }
    if (lodash_1.get(schema, '_flags.presence') === 'forbidden') {
        return {};
    }
    var swagger;
    var components = {};
    if (parseAsType[schema._type]) {
        swagger = parseAsType[schema._type](schema, existingComponents, components);
    }
    else {
        throw new TypeError(`${schema._type} is not a recognized Joi type.`);
    }
    if (!swagger)
        return { swagger, components };
    if (schema._valids && schema._valids.has(null)) {
        swagger.nullable = true;
    }
    if (schema._description) {
        swagger.description = schema._description;
    }
    if (schema._examples.length) {
        if (schema._examples.length === 1) {
            swagger.example = schema._examples[0];
        }
        else {
            swagger.examples = schema._examples;
        }
    }
    var label = lodash_1.get(schema, '_flags.label');
    if (label) {
        swagger.title = label;
    }
    var defaultValue = lodash_1.get(schema, '_flags.default');
    if (defaultValue && typeof defaultValue !== 'function') {
        swagger.default = defaultValue;
    }
    if (metaDefName) {
        lodash_1.set(components, [metaDefType, metaDefName], swagger);
        return { swagger: refDef(metaDefType, metaDefName), components };
    }
    if (override) {
        Object.assign(swagger, override);
    }
    return { swagger, components };
}
exports.default = parse;
;
var parseAsType = {
    number: (schema) => {
        var swagger = {};
        if (lodash_1.find(schema._tests, { name: 'integer' })) {
            swagger.type = 'integer';
        }
        else {
            swagger.type = 'number';
            if (lodash_1.find(schema._tests, { name: 'precision' })) {
                swagger.format = 'double';
            }
            else {
                swagger.format = 'float';
            }
        }
        if (lodash_1.find(schema._tests, { name: 'positive' })) {
            swagger.minimum = 1;
        }
        if (lodash_1.find(schema._tests, { name: 'negative' })) {
            swagger.maximum = -1;
        }
        const min = lodash_1.get(lodash_1.find(schema._tests, { name: 'min' }), 'arg');
        if (min) {
            swagger.minimum = min;
        }
        var max = lodash_1.get(lodash_1.find(schema._tests, { name: 'max' }), 'arg');
        if (max) {
            swagger.maximum = max;
        }
        var valids = schema._valids.values().filter((s) => typeof s === 'number');
        if (lodash_1.get(schema, '_flags.allowOnly') && valids.length) {
            swagger.enum = valids;
        }
        return swagger;
    },
    string: (schema) => {
        var swagger = { type: 'string' };
        var strict = lodash_1.get(schema, '_settings.convert') === false;
        if (lodash_1.find(schema._tests, { name: 'alphanum' })) {
            if (strict && lodash_1.find(schema._tests, { name: 'lowercase' })) {
                swagger.pattern = patterns.alphanumLower;
            }
            else if (strict && lodash_1.find(schema._tests, { name: 'uppercase' })) {
                swagger.pattern = patterns.alphanumUpper;
            }
            else {
                swagger.pattern = patterns.alphanum;
            }
        }
        if (lodash_1.find(schema._tests, { name: 'token' })) {
            if (lodash_1.find(schema._tests, { name: 'lowercase' })) {
                swagger.pattern = patterns.alphanumLower;
            }
            else if (lodash_1.find(schema._tests, { name: 'uppercase' })) {
                swagger.pattern = patterns.alphanumUpper;
            }
            else {
                swagger.pattern = patterns.alphanum;
            }
        }
        if (lodash_1.find(schema._tests, { name: 'email' })) {
            swagger.format = 'email';
            if (swagger.pattern)
                delete swagger.pattern;
        }
        if (lodash_1.find(schema._tests, { name: 'isoDate' })) {
            swagger.format = 'date-time';
            if (swagger.pattern)
                delete swagger.pattern;
        }
        var pattern = lodash_1.get(lodash_1.find(schema._tests, { name: 'regex' }), 'arg.pattern');
        if (pattern) {
            swagger.pattern = pattern.toString().slice(1, -1);
        }
        for (let i = 0; i < schema._tests.length; i++) {
            const test = schema._tests[i];
            if (test.name === 'min') {
                swagger.minLength = test.arg;
            }
            if (test.name === 'max') {
                swagger.maxLength = test.arg;
            }
            if (test.name === 'length') {
                swagger.minLength = test.arg;
                swagger.maxLength = test.arg;
            }
        }
        var valids = schema._valids.values().filter((s) => typeof s === 'string');
        if (lodash_1.get(schema, '_flags.allowOnly') && valids.length) {
            swagger.enum = valids;
        }
        return swagger;
    },
    binary: (schema) => {
        var swagger = { type: 'string', format: 'binary' };
        if (lodash_1.get(schema, '_flags.encoding') === 'base64') {
            swagger.format = 'byte';
        }
        for (let i = 0; i < schema._tests.length; i++) {
            const test = schema._tests[i];
            if (test.name === 'min') {
                swagger.minLength = test.arg;
            }
            if (test.name === 'max') {
                swagger.maxLength = test.arg;
            }
            if (test.name === 'length') {
                swagger.minLength = test.arg;
                swagger.maxLength = test.arg;
            }
        }
        return swagger;
    },
    date: ( /* schema */) => ({ type: 'string', format: 'date-time' }),
    boolean: ( /* schema */) => ({ type: 'boolean' }),
    alternatives: (schema, existingComponents, newComponentsByRef) => {
        var index = meta(schema, 'swaggerIndex') || 0;
        var matches = lodash_1.get(schema, ['_inner', 'matches']);
        var firstItem = lodash_1.get(matches, [0]);
        var itemsSchema;
        if (firstItem.ref) {
            if (schema._baseType && !firstItem.otherwise) {
                itemsSchema = index ? firstItem.then : schema._baseType;
            }
            else {
                itemsSchema = index ? firstItem.otherwise : firstItem.then;
            }
        }
        else if (index) {
            itemsSchema = lodash_1.get(matches, [index, 'schema']);
        }
        else {
            itemsSchema = firstItem.schema;
        }
        var items = parse(itemsSchema, lodash_1.merge({}, existingComponents || {}, newComponentsByRef || {}));
        if (lodash_1.get(itemsSchema, '_flags.presence') === 'required') {
            items.swagger.__required = true;
        }
        lodash_1.merge(newComponentsByRef, items.components || {});
        return items.swagger;
    },
    array: (schema, existingComponents, newComponentsByRef) => {
        var index = meta(schema, 'swaggerIndex') || 0;
        var itemsSchema = lodash_1.get(schema, ['_inner', 'items', index]);
        if (!itemsSchema)
            throw Error('Array schema does not define an items schema at index ' + index);
        var items = parse(itemsSchema, lodash_1.merge({}, existingComponents || {}, newComponentsByRef || {}));
        lodash_1.merge(newComponentsByRef, items.components || {});
        var swagger = { type: 'array' };
        for (let i = 0; i < schema._tests.length; i++) {
            const test = schema._tests[i];
            if (test.name === 'min') {
                swagger.minItems = test.arg;
            }
            if (test.name === 'max') {
                swagger.maxItems = test.arg;
            }
            if (test.name === 'length') {
                swagger.minItems = test.arg;
                swagger.maxItems = test.arg;
            }
        }
        if (lodash_1.find(schema._tests, { name: 'unique' })) {
            swagger.uniqueItems = true;
        }
        swagger.items = items.swagger;
        return swagger;
    },
    object: (schema, existingComponents, newComponentsByRef) => {
        var requireds = [];
        var properties = {};
        var combinedComponents = lodash_1.merge({}, existingComponents || {}, newComponentsByRef || {});
        var children = lodash_1.get(schema, '_inner.children') || [];
        children.forEach((child) => {
            var key = child.key;
            var prop = parse(child.schema, combinedComponents);
            if (!prop.swagger) { // swagger is falsy if joi.forbidden()
                return;
            }
            lodash_1.merge(newComponentsByRef, prop.components || {});
            lodash_1.merge(combinedComponents, prop.components || {});
            properties[key] = prop.swagger;
            if (lodash_1.get(child, 'schema._flags.presence') === 'required' || prop.swagger.__required) {
                requireds.push(key);
                delete prop.swagger.__required;
            }
        });
        var swagger = { type: 'object' };
        if (requireds.length) {
            swagger.required = requireds;
        }
        swagger.properties = properties;
        if (lodash_1.get(schema, '_flags.allowUnknown') === false) {
            swagger.additionalProperties = false;
        }
        return swagger;
    },
    any: (schema) => {
        var swagger = {};
        // convert property to file upload, if indicated by meta property
        if (getJoiMetaProperty(schema, 'swaggerType') === 'file') {
            swagger.type = 'file';
            swagger.in = 'formData';
        }
        if (schema._description) {
            swagger.description = schema._description;
        }
        return swagger;
    },
};
function meta(schema, key) {
    var flattened = Object.assign.apply(null, [{}].concat(schema._meta));
    return lodash_1.get(flattened, key);
}
function refDef(type, name) {
    return { $ref: '#/components/' + type + '/' + name };
}
//# sourceMappingURL=JoiToSwagger.js.map