import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import * as dotenv from "dotenv"; // <-- CRITICAL FIX: Add dotenv
import path from "path";          // <-- CRITICAL FIX: Add path

// Failsafe Load: This guarantees the .env is read, bypassing the server's loading issue.
// We use '..', '..' to navigate back to the project root from src/routes.
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') }); 

const router = express.Router();

// ... (Swagger documentation remains the same)

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // Check for JWT_SECRET just before using it
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET missing during token signing for login.");
        return res.status(500).send({ message: "Login failed due to server configuration." });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1d",
        }
      );

      // 🔑 CRITICAL FIX APPLIED TO LOGIN COOKIE SETTING:
      res.cookie("auth_token", token, {
        httpOnly: true,
        // MUST be false for development (non-HTTPS) on localhost
        secure: process.env.NODE_ENV === "production", 
        // Use 'lax' for development cross-port
        sameSite: 'lax', 
        // Force the domain to be localhost to prevent security blocking
        domain: 'localhost', 
        maxAge: 86400000,
        path: "/",
      });

      // Return user data in response body
      res.status(200).json({
        userId: user._id,
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// ... (Swagger documentation remains the same)

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

// ... (Swagger documentation remains the same)

router.post("/logout", (req: Request, res: Response) => {
  // 🔑 CRITICAL FIX APPLIED TO LOGOUT COOKIE SETTING:
  res.cookie("auth_token", "", { 
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    // MUST be false for development
    secure: process.env.NODE_ENV === "production", 
    // Set to lax for development
    sameSite: 'lax',
    // Force the domain to be localhost
    domain: 'localhost',
    path: "/",
  });
  res.send({ message: "Logout successful" });
});

export default router;
