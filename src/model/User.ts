import { Schema, Document } from "mongoose";


export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = Schema({

    content: {
        type: Number,
        required: true 
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }

})