"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const decorators_1 = require("../decorators");
class GenerateEntitys {
    constructor(filePath) {
        /**
         * @param dict string
         * @return fileList array[string]
         */
        this.getFiles = dict => {
            let fileList = [];
            const findPathFunc = (basePath) => {
                const files = fs.readdirSync(basePath);
                files.forEach((file) => {
                    const filePath = `${basePath}/${file}`;
                    if (fs.statSync(filePath).isFile()) {
                        if (file.endsWith('.ts')) {
                            fileList.push(filePath);
                        }
                    }
                    else {
                        findPathFunc(filePath);
                    }
                });
            };
            findPathFunc(dict);
            return fileList;
        };
        this.loadDefinition = (define) => {
            console.log(decorators_1.toSchema(define));
        };
        this.loadDefinitions = async () => {
            for (const file of this.getFiles(this.DefinesPath)) {
                const define = await Promise.resolve().then(() => require(file));
                if (!define || !define.default) {
                    return;
                }
                this.loadDefinition(define.default);
            }
        };
        this.DefinesPath = filePath;
    }
}
new GenerateEntitys(path.resolve(__dirname, '../definitions')).loadDefinitions();
//# sourceMappingURL=GenerateEntity.js.map