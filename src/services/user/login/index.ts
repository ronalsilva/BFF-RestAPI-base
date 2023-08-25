import { PRISMA } from "../../../utils/config/db.server";
import * as jwt from "jsonwebtoken";
import { AppConfig } from '../../../utils/config/config';
import { compare } from "bcryptjs";

const login = () => ({
    async get(email: string, password: string): Promise<any> {
        let user;

        try {
            user = await PRISMA.users.findFirst({
                where: {
                    email
                },
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
        
        if (!(await compare(password, user.password))) {
          throw new Error('Username password does not match');
        }

        const token = jwt.sign({
          data: user.id
        }, AppConfig.appKey, { expiresIn: 60 * 60 });
        
        return { user, token };
    },
});

export default login;
