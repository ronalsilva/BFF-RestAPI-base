import { hash } from "bcryptjs";
import { PRISMA } from "../../../utils/config/db.server";

const createUser = () => ({
    async create(body: any): Promise<any> {
        let response;
        const password = await hash(body.password, 10);

        const userData = {
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password,
            phone: body.phone,
        };

        try {
            response = await PRISMA.users.create({
                data: userData,
            });
        } catch (err) {
            console.log(err)
            switch (err.code) {
                case 'P2002':
                    throw new Error("User already created.");
                case 409:
                    throw new Error("This is an example exception.");
                case 500:
                    throw new Error("This is an example exception.");
                default:
                    throw new Error( `EXCEPTION: ${err.message}`);
            }
        }
        delete response.password
        return response;
    },
});

export default createUser;
