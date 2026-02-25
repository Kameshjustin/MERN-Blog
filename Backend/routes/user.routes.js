import express from "express";
import { signin, signup } from "../controllers/user.controller.js";

const router = express.Router();

// Route for user signup
router.post("/signup", signup);

// Route for user signin
router.post("/signin", signin);

export default router;
