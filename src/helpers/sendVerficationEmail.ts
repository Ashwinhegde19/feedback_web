import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/verificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {

    try {
        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: 'feedback web | Verify your email address',
            react: VerificationEmail({username, otp: verifyCode}),
          });

        return {
            success: true,
            message: 'Verification Email sent'
        };

    } catch (EmailError) {
        console.error("Error sending Verification Email: ", EmailError);
        return {
            success: false,
            message: 'Error sending Verification Email'

        }
    }
}

