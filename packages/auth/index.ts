import { PrismaAdapter } from '@auth/prisma-adapter';
import { database } from '@repo/database';
import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(database),
  providers: [],
});
