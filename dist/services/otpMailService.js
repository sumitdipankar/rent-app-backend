"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpMail = sendOtpMail;
const mailer_1 = require("../config/mailer");
async function sendOtpMail(to, otp) {
    const mailOptions = {
        from: '"sumit.dipanker@payomatix.com"',
        to,
        subject: "Password Reset OTP",
        html: `
      <h2>Reset Password Request</h2>
      <p>Your OTP is: <b>${otp}</b></p>
      <p>It will expire in 5 minutes.</p>
    `,
    };
    await mailer_1.mailTransporter.sendMail(mailOptions);
}
//# sourceMappingURL=otpMailService.js.map