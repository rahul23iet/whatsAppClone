import express from 'express';
import dotenv from 'dotenv';
import { startSentOtpConsumer } from './consumer.js';
dotenv.config();
const app = express();
app.use(express.json());
startSentOtpConsumer();
const PORT = process.env.PORT || 3001;



app.listen(PORT, () => {
  console.log(`Mail Service is listening on port ${PORT}`);
});