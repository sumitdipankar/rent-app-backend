import express from "express";
const authRouter = express.Router();
import { login, register } from "../../../controller/admin/auth/AuthController";

authRouter.post("/auth/register", register);
authRouter.post("/auth/login", login);

export default authRouter;
