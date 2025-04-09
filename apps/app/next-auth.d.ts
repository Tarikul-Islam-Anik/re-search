declare module 'next-auth' {
  interface Session {
    user: {
      role: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
  }
}

declare module 'next-auth/next' {
  interface NextAuthConfig {
    callbacks: {
      authorized?: ({
        auth,
        request: NextRequest,
      }) => boolean | Promise<boolean>;
    };
  }
}
