import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { createClient } from 'redis';
import userRoutes from './routes/user.js';
import {connectRabbitMQ} from './config/rabbitmq.js';

dotenv.config();



connectDB();
connectRabbitMQ();
export const redisClient = createClient(
  { url: process.env.REDIS_URL || 'redis://localhost:6379' }
);


// upstash redis used for 250 MB plan free tier
redisClient.connect().then(()=>{
  console.log('Connected to Redis');
}).catch((err)=>{
  console.error('Redis connection error:', err);
});


const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;


app.use('/api/v1', userRoutes);

app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});