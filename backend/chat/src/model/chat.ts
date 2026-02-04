import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document {
    users: string[];
    latestMessage: {
        text: string;
        sender: string;
        timestamp: Date;
    }
    createdAt: Date;
    updatedAt: Date;
}

const chatSchema: Schema<IChat> = new Schema({
    users: [{
        type: String,
        required: true
    }],
    latestMessage: {
        text: {
            type: String,
            required: false
        },
        sender: {
            type: String,
            required: false
        }
    }
},{ timestamps: true
})

export const ChatModel = mongoose.model<IChat>("Chat", chatSchema); 