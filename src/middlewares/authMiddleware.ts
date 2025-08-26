import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

function authMiddleware(request: Request, response: Response, next: NextFunction) {
    // Get token from header → "Authorization: Bearer <token>"
    const authHeader = request.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return response.status(401).json({ message: "Unauthorized: Token missing" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, "my_secret_key"); // same secret used while signing
        request.user = decoded; // store user data for later use
        next();
    } catch (err) {
        return response.status(403).json({ message: "Forbidden: Invalid token" });
    }
}

module.exports = authMiddleware;
