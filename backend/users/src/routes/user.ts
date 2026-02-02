import express from "express";
import { loginUser, verfiyUser } from "../controller/user.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/verify", verfiyUser);

export default router;