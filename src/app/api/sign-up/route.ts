import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerficationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await Usermodel.findOne({
            username,
            isVerified: true
        })

            if (existingUserVerifiedByUsername) {
                return Response.json({
                    success: false,
                    message: "Username already exists"
                }, { status: 400 });
            }
    
            const existingUserByEmail = await Usermodel.findOne({ email });
            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    
            if (existingUserByEmail) {
                if (existingUserByEmail.isVerified) {
                    return Response.json({
                        success: false,
                        message: "Email already exists"
                    }, { status: 400 });
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const verifyCodeExpiry = new Date();
                    verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);
    
                    existingUserByEmail.verifyCode = verifyCode;
                    existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;
                    existingUserByEmail.password = hashedPassword;
    
                    await existingUserByEmail.save();
                }
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
    
                const newUser = new Usermodel({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessages: true,
                    messages: []
                });
    
                await newUser.save();
    
                const emailResponse = await sendVerificationEmail(email, username, verifyCode);
                console.log("Email Response: ", emailResponse);
    
                if (!emailResponse.success) {
                    return Response.json({
                        success: false,
                        message: "An error occurred while sending verification email"
                    }, { status: 500 });
                }
    
                return Response.json({
                    success: true,
                    message: "User registered successfully please verify your email address"
                }, { status: 201 });
            }
        } catch (error) {
            console.error("Error registering user: ", error);
            return Response.json(
                {
                    success: false,
                    message: "An error occurred while registering user"
                },
                {
                    status: 500
                }
            );
        }
    }
