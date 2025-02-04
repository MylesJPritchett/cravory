import NextAuth from "next-auth";
import { authAdapter } from "@/db";
import GitHub from "next-auth/providers/github";

const authOptions = {
  adapter: authAdapter,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
