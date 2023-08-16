import { PRISMA } from "../src/utils/db.server";

// type Userteste = {
//     first_name: string;
//     second_name: string;
//     email: string;
//     password: string;
//     phone_number: string;
//     date_of_birth: string;
// };

// async function seed() {
//     await Promise.all(
//         getUsers().map((user) => {
//             return PRISMA.userteste.create({
//                 data: {
//                     first_name: user.first_name,
//                     second_name: user.second_name,
//                     email: user.email,
//                     password: user.password,
//                     phone_number: user.phone_number,
//                     date_of_birth: user.date_of_birth,
//                 },
//             });
//         })
//     );
//     const user = await PRISMA.userteste.findFirst({
//         where: {
//             first_name: "Gaby",
//         },
//     });
// }

// seed();

// function getUsers(): Array<Userteste> {
//     return [
//         {
//             first_name: "Gaby",
//             second_name: "Silva",
//             email: "gaby@gmail.com",
//             password: "abc123",
//             phone_number: "abc123",
//             date_of_birth: "abc123"
//         },
//         {
//             first_name: "Ronald",
//             second_name: "Junger",
//             email: "jose@gmail.com",
//             password: "abc123",
//             phone_number: "abc123",
//             date_of_birth: "abc123"
//         }
//     ];
// }
