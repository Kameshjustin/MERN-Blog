import express from "express";

const router = express.Router();

// Test route to make sure it's connected
router.post("/", (req, res) => {
    const { name, email, message } = req.body;
    console.log("Form received:", { name, email, message });
    res.status(201).json({ success: true, message: "Message sent successfully!" });
});

export default router;
