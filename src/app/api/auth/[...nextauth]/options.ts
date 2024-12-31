import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/util/dbConnect";
import User from "@/model/User";
import UserModel from "@/model/User";
import { signIn } from "next-auth/react";

export default {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error("No user found")
                    }

                    if (!user.isVerified) {
                        throw new Error("User not verified")
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password)
                    if (!isValid) {
                        throw new Error("Password incorrect")
                    }   
                    return user 
                } catch (error) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async jwt(token, user) {
            if (user) {
                token._id = user._id?.toString()
            }
            return token
        },
        async session(session, token) {
            return session
        }
    }
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
