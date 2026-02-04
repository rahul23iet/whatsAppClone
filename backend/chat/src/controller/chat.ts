import TryCatch from '../config/TryCatch.js'
import { ChatModel } from '../model/chat.js';
import { type AuthenticatedRequest } from '../middleware/isAuth.js';
import { Messages } from '../model/messages.js';
import axios from 'axios';

export const createNewChat = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user?._id;
    const {otherUserId} = req.body;
    if(!user){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if(!otherUserId){
        return res.status(400).json({ message: 'otherUserId is required' });
    } 
    const existingChat = await ChatModel.findOne({
        users: { $all: [user, otherUserId], $size: 2 }
    });
    if(existingChat){
        return res.status(200).json({ message: "Chat already exists", chatId: existingChat._id });
    }
    const newChat = new ChatModel({
        users: [user, otherUserId],
    });
    await newChat.save();
     
  res.status(201).json({ message: "New chat created successfully", chatId: newChat._id });
}); 


export const getAllChats = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    if(!userId){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const chats = await ChatModel.find({
        users: userId
    }).sort({ updatedAt: -1 });
     
    const chatWithUserData = await Promise.all(chats.map(async (chat) => {
        const otherUserId= chat.users.find(id => id.toString() !== userId.toString());

         const messages = await Messages.countDocuments({
        chatId: chat._id,
        sender : { $ne: userId },
        seen: false
    });
        try{
            const {data} = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/${otherUserId}`);
            return { 
                 ...chat.toObject(),
                 latestMessage: chat.latestMessage,
                 unseenCount: messages,
                 user: data
             };

        }
        catch(err){
            console.error("Error fetching messages:", err);
             return {
                 user: { _id: otherUserId, name: "Unknown", email: "Unknown" }, 
                 ...chat.toObject(),
                 latestMessage: chat.latestMessage,
                 unseenCount: messages,
             };
        }
    }));
  res.status(200).json({ chats:  chatWithUserData });
});

