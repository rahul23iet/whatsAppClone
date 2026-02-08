import { createNewChat, getAllChats, getMessagesByChatId, sendMessage } from "../controller/chat.js";
import { isAuth } from "../middleware/isAuth.js";
import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { get } from "mongoose";


const router = Router();

router.post("/chat/new", isAuth, createNewChat);
router.get("/chat/all", isAuth, getAllChats);
router.post("/message", isAuth,upload.single('file'), sendMessage);
router.get("/message/:chatId", isAuth,getMessagesByChatId );

export default router;