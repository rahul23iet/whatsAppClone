import express from "express";
import { getAllUsers, getUserById, loginUser, myProfile, updateProfile, verfiyUser } from "../controller/user.js";
import { isAuth } from "../middleware/isAuth.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/verify", verfiyUser);
router.get("/me",isAuth,myProfile);
router.post("/update/user",isAuth,updateProfile);
router.get("/user/all",isAuth,getAllUsers);
router.get("/user/:id",getUserById);

export default router;