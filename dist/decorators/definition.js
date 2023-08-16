"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const ischema_1 = require("./ischema");
exports.TAG_DEFINITION_NAME = Symbol('DefinitionName');
exports.TAG_DEFINITION_DESCRIPTION = Symbol('DefinitionDescription');
function definition(name, description) {
    return function (Definition) {
        if (!name) {
            name = Definition.name;
        }
        utils_1.registerGlobal(Definition, function definition(swagger) {
            swagger.definitions[name] = ischema_1.toSchema(Definition);
        });
        Definition[exports.TAG_DEFINITION_NAME] = name;
        Definition[exports.TAG_DEFINITION_DESCRIPTION] = description || name;
    };
}
exports.definition = definition;
//# sourceMappingURL=definition.js.map