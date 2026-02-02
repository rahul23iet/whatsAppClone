import mongoose, { Document, Schema} from "mongoose";

export interface IUsers extends Document {
    name: string;
    email: string;
}

const schema : Schema<IUsers > = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    }
})

export const User = mongoose.model<IUsers>("User", schema);