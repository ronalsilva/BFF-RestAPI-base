"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
const db_server_1 = require("../../../utils/config/db.server");
const createUser = () => ({
    async create(body) {
        let response;
        const password = await bcryptjs_1.hash(body.password, 10);
        const userData = {
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password,
            phone: body.phone,
        };
        try {
            response = await db_server_1.PRISMA.users.create({
                data: userData,
            });
        }
        catch (err) {
            console.log(err);
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
        delete response.password;
        return response;
    },
});
exports.default = createUser;
//# sourceMappingURL=index.js.map