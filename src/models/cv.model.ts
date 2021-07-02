import {model, Schema} from "mongoose";

const cvSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        required: true
    },
    url: String,
    displayed : Boolean
}, {timestamps: true, versionKey: false});

export const CVModel = model("cvs", cvSchema);