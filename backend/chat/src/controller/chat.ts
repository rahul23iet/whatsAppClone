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
            console.log("User data for chat list:====>>", data);
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


export const sendMessage = TryCatch(async (req: AuthenticatedRequest, res) => {
    const sender = req.user?._id;
    const { chatId, text } = req.body; 
    const file = req.file;

    if(!sender){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if(!chatId){
        return res.status(400).json({ message: 'chatId is required' });
    }
    if(!text && !file){
        return res.status(400).json({ message: 'Either text or file is required' });
    }
    
    const chat = await ChatModel.findById(chatId);
    if(!chat){
        return res.status(404).json({ message: 'Chat not found' });
    }
    if(!chat.users.includes(sender)){
        return res.status(403).json({ message: 'You are not a participant of this chat' });
    }

    const otherUserId = chat.users.find(id => id.toString() !== sender.toString());

    if(!otherUserId){
        return res.status(400).json({ message: 'No other user found in chat' });
    }

    const messageData: any ={
        chatId,
        sender,
        seen: false,
        seenAt: undefined
    };
     if(file){
        messageData.image={
            url: file.path,
            public_id: file.filename
         };
         messageData.messageType = 'image';
         messageData.text = text || ''; 

     }
     else{
        messageData.text = text;
        messageData.messageType = 'text';
     }
         
    const newMessage = new Messages(messageData);
    const savedMessage = await newMessage.save();
    const latestMessageText = file? 'image': text;
    await ChatModel.findByIdAndUpdate(chatId, {
        latestMessage: {
            text: latestMessageText,
            sender
        },
        updatedAt: new Date()
    },{
        new: true
    }); 
  res.status(201).json({ message: savedMessage, sender: sender, chatId: chatId });

}); 

export const  getMessagesByChatId = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const { chatId } = req.params;
    if(!userId){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if(!chatId){
        return res.status(400).json({ message: 'chatId is required' });
    }
    const chat = await ChatModel.findById(chatId);
    if(!chat){
        return res.status(404).json({ message: 'Chat not found' });
    }
    if(!chat.users.includes(userId)){
        return res.status(403).json({ message: 'You are not a participant of this chat' });
    }
    
    const messageToseen = await Messages.updateMany({
        chatId: chatId,
        sender : { $ne: userId },
        seen: false
    }, {
        seen: true,
        seenAt: new Date()
    });
    
    const messages = await Messages.find({ chatId }).sort({ createdAt: 1 });
    const otherUserId = chat.users.find(id => id.toString() !== userId.toString());
    console.log("Other user ID:", otherUserId);
    console.log("====>>>>>  process.env.USER_SERVICE_URL:", process.env.USER_SERVICE_URL);
    try{
        const {data} = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/${otherUserId}`);
        
            console.log("User data for chat list:", data);
        if(!otherUserId){
            return res.status(400).json({ message: 'No other user found in chat' });
        } 

        //socket work

        res.json({ messages, user: data });
    }
    catch(err){
        console.error("Error fetching messages:", err);
        res.json({ messages, user: { _id: otherUserId, name: "Unknown", email: "Unknown" } }); 
       
    }
  res.status(200).json({ messages });

});