import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SequelizeAdapter } from '@next-auth/sequelize-adapter';
import db from '../../../models';
const {sequelize} = db;

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = await User.findOne({ where: { username: credentials.username } });
                if (user && user.password === credentials.password) {
                    return user;
                }
                return null;
            }
        }),
    ],
    adapter: SequelizeAdapter(sequelize),
    session: {
        jwt: true,
    },
    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id;
            session.user.username = user.username;
            return session;
        }
    }
});
