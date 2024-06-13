import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Auth0 from "next-auth/providers/auth0";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Auth0,]
});
