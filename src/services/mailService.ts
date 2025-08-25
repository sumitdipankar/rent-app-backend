import { mailTransporter } from "../config/mailer";
import { SentMessageInfo } from "nodemailer";
import logger from "../logger";

interface MailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    template: string;
    context: { [key: string]: any };
}

export async function sendMail(options: MailOptions): Promise<SentMessageInfo> {
    try {
        const mailOptions = {
            from: '"sumit.dipanker@payomatix.com',
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };

        const info = await mailTransporter.sendMail(mailOptions);
        logger.info("Email sent: ", info.messageId);
        return info;
    } catch (error) {
        logger.error("Error sending mail:", error);
        throw error;
    }
}
