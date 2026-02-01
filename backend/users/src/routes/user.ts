import express from "express";

const router = express.Router();

// Sample route
router.get("/user", (req, res) => {
  res.send("User Service is running");
});

export default router;