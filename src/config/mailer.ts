import nodemailer from "nodemailer";

export const mailTransporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: "857717002@smtp-brevo.com",
        pass: "kgP3ITLbVH6YyAKR",
    },
});
