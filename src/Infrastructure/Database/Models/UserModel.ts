import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            select: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const UserModel = model("User", userSchema);