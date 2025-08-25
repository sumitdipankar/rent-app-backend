import express from "express";
const authRouter = express.Router();
import { login, register, requestOtp, verifyOtp, resetPassword } from "../../../controller/admin/auth/AuthController";

authRouter.post("/auth/register", register);
authRouter.post("/auth/login", login);
authRouter.post("/auth/request-otp", requestOtp);
authRouter.post("/auth/verify-otp", verifyOtp);
authRouter.post("/auth/reset-password", resetPassword);

export default authRouter;
