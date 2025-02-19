import mongoose from "mongoose"
import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User"; 

export async function GET( request: Request) {

    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || ! session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        },{ status: 401})
    }

    const userID = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await UserModel.aggregate([
            {$match: {_id: userID}},
            {$unwind: "$messages"},
            {$sort: {"messages.createdAt": -1}},
            {$group: {_id: "$_id", messages: {$push: "$messages"}}}
        ])

        if(!user || !user.length) {
            return Response.json({
                success: false,
                message: "User not found"
            },{ status: 401})
        }


        return Response.json({
            success: true,
            message: user[0].messages
            
        },{ status: 200})
    } catch (error) {
        console.error("failed to get user status to accept message")
        return Response.json({
            success: false,
            message: "Failed to get user status to accept message"
        },{ status: 500})
        
    }

    
}