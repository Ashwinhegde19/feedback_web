import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function POST( request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || ! session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        },{ status: 401})
    }

    const userID = user._id
    const {acceptMessage} = await request.json()

    try {
        const updateUser = await UserModel.findOneAndUpdate(
            {_id: userID},
            {isAcceptingMessage: acceptMessage},
            {new: true}
        )

        if(!updateUser) {
            return Response.json({
                success: false,
                message: "User not found"
            },{ status: 401})
        }

        return Response.json({
            success: true,
            message: "Message acceptence status updated successfully",
            updateUser
        },{ status: 200})

    } catch (error) {
        console.error("failed to update user status to accept message")
        return Response.json({
            success: false,
            message: "Failed to update user status to accept message"
        },{ status: 500})
    }

}