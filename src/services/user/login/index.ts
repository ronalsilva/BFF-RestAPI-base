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
        } catch (err) {
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
