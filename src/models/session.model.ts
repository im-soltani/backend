import {model, Schema} from "mongoose";

const sessionSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, {timestamps: true, versionKey: false});

export const SessionModel = model("sessions", sessionSchema);