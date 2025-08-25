import nodemailer from "nodemailer";
import { mailTransporter } from "../config/mailer";

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
    template?: string;
    context?: { [key: string]: any };
}

export async function sendOtpMail(to: string, otp: string) {
    const mailOptions: MailOptions = {
        from: '"sumit.dipanker@payomatix.com"',
        to,
        subject: "Password Reset OTP",
        html: `
      <h2>Reset Password Request</h2>
      <p>Your OTP is: <b>${otp}</b></p>
      <p>It will expire in 5 minutes.</p>
    `,
    };

    await mailTransporter.sendMail(mailOptions);
}
