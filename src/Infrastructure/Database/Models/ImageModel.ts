import { Schema, model } from "mongoose";

const imageSchema = new Schema(
    {
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120
        },
        publicId: {
            type: String,
            required: true,
            unique: true
        },
        secureUrl: {
            type: String,
            required: true
        },
        format: {
            type: String,
            required: true
        },
        bytes: {
            type: Number,
            required: true,
            min: 1
        },
        width: {
            type: Number,
            required: true,
            min: 1
        },
        height: {
            type: Number,
            required: true,
            min: 1
        },
        order: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

imageSchema.index({ ownerId: 1, order: -1 });

export const ImageModel = model("Image", imageSchema);
