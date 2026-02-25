import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../middlewares/errorHandler.js";
import validator from "validator";

// Signup Controller
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  if (!validator.isEmail(email)) {
    return next(errorHandler(400, "Invalid email format"));
  }

  if (password.length < 8) {
    return next(errorHandler(400, "Password must be at least 8 characters long"));
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(errorHandler(400, "Email or username already in use"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup Error:", error);
    return next(errorHandler(500, "Error saving the user"));
  }
};

// Signin Controller
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate Input (No logging of req.body here!)
    if (!email || !password) {
      return next(errorHandler(400, "Email and password are required"));
    }

    if (!validator.isEmail(email)) {
      return next(errorHandler(400, "Invalid email format"));
    }

    // 2. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // 3. Compare the provided password with the hashed password in DB
    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(400, "Incorrect password"));
    }

    // 4. Generate a JWT token
    const token = jwt.sign(
      { id: user._id, isBlogger: user.isBlogger },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Securely return user data (Excluding password)
    const { password: _, ...userDetails } = user._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      })
      .json({
        message: "Signin successful",
        user: userDetails,
      });
  } catch (error) {
    console.error("Signin Error:", error.message);
    return next(errorHandler(500, "Internal server error"));
  }
};
