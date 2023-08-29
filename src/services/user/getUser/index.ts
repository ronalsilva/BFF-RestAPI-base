import { PRISMA } from "../../../utils/db.server";
import { getUserResponse } from "../../../interfaces/users/search";

class GetUser {
	async userGet(user_id: string): Promise<getUserResponse> {
		let response;
		try {
			response = await PRISMA.users.findFirst({
				where: { user_id },
			});
		} catch (error) {
			switch (error.code) {
                case 'P2002':
                    console.log(`registered field ${error.meta.target}: ${user_id}`)
					throw new Error(`registered field ${error.meta.target}: ${user_id}`);
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

		return response;
	}
};

export default new GetUser;
