"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TAG_CONTROLLER = Symbol('Controller');
/**
 * Controller
 * @param path
 * @returns {(Controller:Function)=>undefined}
 */
function controller(path) {
    return function (Controller) {
        if (!path) {
            path = Controller.name;
        }
        const parent = Object.getPrototypeOf(Controller);
        if (parent[exports.TAG_CONTROLLER]) {
            path = parent[exports.TAG_CONTROLLER] + path;
        }
        Controller[exports.TAG_CONTROLLER] = path;
    };
}
exports.controller = controller;
//# sourceMappingURL=controller.js.map