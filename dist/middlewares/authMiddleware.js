"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(request, response, next) {
    const authHeader = request.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return response.status(401).json({ message: "Unauthorized: Token missing" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "my_secret_key");
        request.user = decoded;
        next();
    }
    catch (err) {
        return response.status(403).json({ message: "Forbidden: Invalid token" });
    }
}
module.exports = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map