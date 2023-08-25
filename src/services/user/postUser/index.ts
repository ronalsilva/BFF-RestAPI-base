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
        } catch (error) {
            switch (error.code) {
                case 'P2002':
                    console.log(`registered field ${error.meta.target}`)
					throw new Error(`registered field ${error.meta.target}`);
                case 'P1013':
                    console.log(`Invalid field ${error.meta.target}`)
					throw new Error(`Invalid field ${error.meta.target}`);
                case 'P1017':
                    console.log(`The server closed the connection.`)
					throw new Error(`The server closed the connection.`);
                default:
                    console.log(`The server closed the connection.`)
                    throw new Error(`The server closed the connection.`);
            }
        }
        delete response.password
        return response;
    },
});

export default createUser;
