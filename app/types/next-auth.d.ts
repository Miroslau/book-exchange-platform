declare module "next-auth" {
  interface User {
    username: string | null;
    email: string;
    image: string;
    id: string;
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
