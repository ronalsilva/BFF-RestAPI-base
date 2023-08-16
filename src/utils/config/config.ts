import * as path from 'path';

export const AppConfig = {
  appKey: 'long long key',
  port: 3002
}

export const swaggerConfig = {
  swagger: "2.0",
  info: {
    version: "1.0.0",
    title: "Interface Documentation System"
  },
  basePath: "",
  schemes: ["http"],
  paths: {},
  definitions: {}
}

// Environmental distinction
export const isDebug = process.env.NODE_ENV === 'development';

// Log
export const log4jsConfig = {
  appenders: {
    cheese: isDebug ? {
      type: 'console'
    } : {
        type: 'dateFile',
        filename: 'logs/',
        pattern: 'yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
  },
  categories: { default: { appenders: ['cheese'], level: isDebug ? 'info' : 'error' } }
}

// bodyParser
export const bodyParserConfig = {
  multipart: true, // Support file upload
  // encoding: 'gzip', // Enabling this will report an error
  formidable: {
    uploadDir: path.join(__dirname, '../upload/'), // Set file upload directory
    keepExtensions: true,    // Keep the file suffix
    maxFieldsSize: 2 * 1024 * 1024, // file upload size
    // onFileBegin: (name, file) => {
    //   file.savedName = file.path.split('/').pop();
    // }
  }
}