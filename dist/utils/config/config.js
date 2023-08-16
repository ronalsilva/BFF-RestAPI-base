"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.AppConfig = {
    appKey: 'long long key',
    port: 3002
};
exports.swaggerConfig = {
    swagger: "2.0",
    info: {
        version: "1.0.0",
        title: "Interface Documentation System"
    },
    // host: "localhost:3002",
    basePath: "",
    schemes: ["http"],
    paths: {},
    definitions: {}
};
// Environmental distinction
exports.isDebug = process.env.NODE_ENV === 'development';
// Log
exports.log4jsConfig = {
    appenders: {
        cheese: exports.isDebug ? {
            type: 'console'
        } : {
            type: 'dateFile',
            filename: 'logs/',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        }
    },
    categories: { default: { appenders: ['cheese'], level: exports.isDebug ? 'info' : 'error' } }
};
// bodyParser
exports.bodyParserConfig = {
    multipart: true,
    // encoding: 'gzip', // Enabling this will report an error
    formidable: {
        uploadDir: path.join(__dirname, '../upload/'),
        keepExtensions: true,
        maxFieldsSize: 2 * 1024 * 1024,
    }
};
//# sourceMappingURL=config.js.map