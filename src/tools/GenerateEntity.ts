import * as fs from 'fs';
import * as path from 'path';
import { toSchema } from '../decorators';

class GenerateEntitys {

  private DefinesPath: string;

  constructor(filePath){
    this.DefinesPath = filePath;
  }

  /**
   * @param dict string
   * @return fileList array[string]
   */
  getFiles = dict => {
    let fileList = [];
    const findPathFunc = (basePath) => {
      const files = fs.readdirSync(basePath);
      files.forEach((file) => {
        const filePath = `${basePath}/${file}`;
        if (fs.statSync(filePath).isFile()) {
          if (file.endsWith('.ts')) {
            fileList.push(filePath);
          }
        } else {
          findPathFunc(filePath);
        }
      })
    };
    findPathFunc(dict);
    return fileList;
  }

  loadDefinition = (define) => {
    console.log(toSchema(define));
  }

  loadDefinitions = async () => {
    for (const file of this.getFiles(this.DefinesPath)) {
      const define = await import(file);
      if(!define || !define.default){
        return ;
      }
      this.loadDefinition(define.default);
    }
  }
}

new GenerateEntitys(
  path.resolve(__dirname, '../definitions')
).loadDefinitions();