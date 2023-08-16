"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_server_1 = require("../../../utils/config/db.server");
const jwt = require("jsonwebtoken");
const config_1 = require("../../../utils/config/config");
const bcryptjs_1 = require("bcryptjs");
const login = () => ({
    async get(email, password) {
        let user;
        try {
            user = await db_server_1.PRISMA.users.findFirst({
                where: {
                    email
                },
            });
        }
        catch (err) {
            switch (err.code) {
                case 'P2002':
                    throw new Error("User already created.");
                case 409:
                    throw new Error("This is an example exception.");
                case 500:
                    throw new Error("This is an example exception.");
                default:
                    throw new Error(`EXCEPTION: ${err.message}`);
            }
        }
        if (!(await bcryptjs_1.compare(password, user.password))) {
            throw new Error('Username password does not match');
        }
        const token = jwt.sign({
            data: user.id
        }, config_1.AppConfig.appKey, { expiresIn: 60 * 60 });
        return { user, token };
    },
});
exports.default = login;
//# sourceMappingURL=index.js.map