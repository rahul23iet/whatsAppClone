import { createNewChat, getAllChats } from "../controller/chat.js";
import { isAuth } from "../middleware/isAuth.js";
import { Router } from "express";


const router = Router();

router.post("/chat/new", isAuth, createNewChat);
router.get("/chat/all", isAuth, getAllChats);

export default router;