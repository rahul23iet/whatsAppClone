import mongoose, { Document, Schema} from "mongoose";

export interface IUsers extends Document {
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
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
    },
},{ timestamps: true
})

export const User = mongoose.model<IUsers>("User", schema);