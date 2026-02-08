import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chat.js";
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
connectDB();
console.log("Connected to MongoDB====>>>");
app.use("/api/v1", chatRoutes );


app.listen(process.env.PORT || 3002, () => {
  console.log(`Chat service is running on port =>${process.env.PORT}`);
});