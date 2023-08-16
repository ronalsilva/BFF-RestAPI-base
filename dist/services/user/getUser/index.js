"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_server_1 = require("../../../utils/config/db.server");
// import CustomError from "../../../utils/customError";
const getUser = () => ({
    async user(user_id) {
        let response;
        response = await db_server_1.PRISMA.users.findFirst({
            where: { user_id },
        });
        // if(user == null) { throw Object.assign(new Error('tese teste'), { status: 404, message: "teste" }) };
        return response;
    },
});
exports.default = getUser;
//# sourceMappingURL=index.js.map