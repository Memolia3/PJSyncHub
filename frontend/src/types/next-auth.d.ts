import "next-auth";

declare module "next-auth" {
  interface User {
    avatarUrl?: string;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      avatarUrl?: string;
    };
  }

  interface JWT {
    avatarUrl?: string;
  }
}
