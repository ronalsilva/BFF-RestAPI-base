"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const File_1 = require("./File");
const BaseEntity_1 = require("./BaseEntity");
const md5 = require("md5");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
let User = class User extends BaseEntity_1.Base {
    constructor(user) {
        super();
        if (user && !lodash_1.isEmpty(user)) {
            this.name = user.name;
            this.password = md5(user.password);
        }
    }
};
__decorate([
    typeorm_1.Column({
        unique: true
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        nullable: false
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.OneToOne(type => File_1.File),
    typeorm_1.JoinColumn(),
    __metadata("design:type", File_1.File)
], User.prototype, "userIcon", void 0);
User = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [User])
], User);
exports.User = User;
//# sourceMappingURL=User.js.map