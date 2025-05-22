import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
    email: string;
    image: string;
    id: number;
  }
  interface Session {
    user: User & {
      username: string;
    };
    token: {
      username: string;
    };
  }
}
