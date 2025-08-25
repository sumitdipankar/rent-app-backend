"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.mailTransporter = nodemailer_1.default.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: "857717002@smtp-brevo.com",
        pass: "kgP3ITLbVH6YyAKR",
    },
});
//# sourceMappingURL=mailer.js.map