"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
const mailer_1 = require("../config/mailer");
const logger_1 = __importDefault(require("../logger"));
async function sendMail(options) {
    try {
        const mailOptions = {
            from: '"sumit.dipanker@payomatix.com',
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };
        const info = await mailer_1.mailTransporter.sendMail(mailOptions);
        logger_1.default.info("Email sent: ", info.messageId);
        return info;
    }
    catch (error) {
        logger_1.default.error("Error sending mail:", error);
        throw error;
    }
}
//# sourceMappingURL=mailService.js.map