import e from 'express';
import mongoose from 'mongoose';

const connectDB = async ()=>{
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/usersdb';
    if(!mongoURI){
        throw new Error('MONGO_URI is not defined in environment variables');
    }
    try{
        await mongoose.connect(mongoURI, {
            dbName : 'usersdb'
        });
        console.log('Connected to MongoDB');
    }
    catch(err)
    {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}
export default connectDB;