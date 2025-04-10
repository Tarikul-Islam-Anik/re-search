// @ts-nocheck

import { PrismaAdapter } from '@auth/prisma-adapter';
import { database } from '@repo/database';
import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // biome-ignore lint/suspicious/useAwait: <explanation>
    async jwt({ token, user }) {
      if (user) {
        // @ts-expect-error
        token.role = user.role;
      }
      return token;
    },
    // biome-ignore lint/suspicious/useAwait: <explanation>
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error
        session.user.role = token.role;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(database),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        const user = await database.user.findUnique({
          where: { email: email as string },
        });

        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isPasswordMatched = await compare(
          password as string,
          user.password
        );

        if (!isPasswordMatched) {
          throw new Error('Invalid credentials');
        }

        return user;
      },
    }),
  ],
});
