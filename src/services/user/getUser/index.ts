import { PRISMA } from "../../../utils/config/db.server";
// import CustomError from "../../../utils/customError";

const getUser = () => ({
	async user(user_id: any): Promise<any> {
		let response;
		response = await PRISMA.users.findFirst({
			where: { user_id },
		});

		// if(user == null) { throw Object.assign(new Error('tese teste'), { status: 404, message: "teste" }) };

		return response;
	},
});

export default getUser;
