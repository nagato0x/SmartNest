import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import * as dotenv from "dotenv"; // <-- CRITICAL FIX: Add dotenv
import path from "path";          // <-- CRITICAL FIX: Add path

// Failsafe Load: This guarantees the .env is read, bypassing the server's loading issue.
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') }); 

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    // This check is now robust because dotenv.config is at the top
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
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

    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      user = new User(req.body);
      await user.save();

      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET missing during token signing.");
        return res.status(500).send({ message: "Registration failed due to server configuration." });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1d",
        }
      );

      // 🛑 CRITICAL BYPASS: REMOVE COOKIE, SEND TOKEN IN RESPONSE BODY
      // The original res.cookie block has been removed/commented out.
      
      return res.status(200).send({ 
          message: "User registered OK",
          token: token // <-- Sending token for localStorage storage
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

export default router;
