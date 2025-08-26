"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRouter = express_1.default.Router();
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
adminRouter.use(authMiddleware_1.default);
exports.default = adminRouter;
//# sourceMappingURL=adminRoute.js.map