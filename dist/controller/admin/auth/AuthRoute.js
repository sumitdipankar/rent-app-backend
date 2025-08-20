"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRouter = express_1.default.Router();
const AuthController_1 = require("../../../controller/admin/auth/AuthController");
authRouter.post("/auth/register", AuthController_1.register);
authRouter.post("/auth/login", AuthController_1.login);
exports.default = authRouter;
//# sourceMappingURL=AuthRoute.js.map