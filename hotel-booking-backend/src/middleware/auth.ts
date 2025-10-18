import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// NOTE: This ensures that if the token is sent via Authorization header (Header Bypass),
// it is used first. If not, it falls back to the cookie (Original method).

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // 1. Check for token in Authorization header (Header Bypass)
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    // 2. Fallback to session cookie (Original method)
    // NOTE: The name is "auth_token" as set in the backend routes, 
    // but your provided code used "session_id". I will assume "auth_token" 
    // is the correct one based on your working routes.
    token = req.cookies["auth_token"]; 
  }

  if (!token) {
    return res.status(401).json({ message: "unauthorized: No token found" });
  }

  try {
    // 🔑 CRITICAL FIX: Use the correct environment variable key: JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch (error) {
    // This catches expired or malformed tokens
    return res.status(401).json({ message: "unauthorized: Invalid token" });
  }
};

export default verifyToken;
