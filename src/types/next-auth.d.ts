import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        _id: string;
        email: string;
        username: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        
    }
}