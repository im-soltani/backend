"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dayTypeSchema = new mongoose_1.Schema({
    open_at: {
        type: String,
        default: "19"
    },
    close_at: {
        type: String,
        default: "19"
    }
}, { versionKey: false, _id: false });
const holidaySchema = new mongoose_1.Schema({
    day: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    }
}, { versionKey: false, _id: false });
const weekTypeSchema = new mongoose_1.Schema({
    monday: {
        type: dayTypeSchema
    },
    tuesday: {
        type: dayTypeSchema
    },
    wednesday: {
        type: dayTypeSchema
    },
    thursday: {
        type: dayTypeSchema
    },
    friday: {
        type: dayTypeSchema
    },
    saturday: {
        type: dayTypeSchema
    },
    sunday: {
        type: dayTypeSchema
    }
}, { versionKey: false, _id: false });
const entrepriseSchema = new mongoose_1.Schema({
    num: {
        type: Number,
        required: true,
        unique: true
    },
    uid: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    tel: {
        type: String,
        required: true
    },
    is_pill_maker: {
        type: Boolean,
        default: false
    },
    website: {
        type: String,
        trim: true,
        lowercase: true
    },
    description: {
        type: String
    },
    location: {
        type: {
            type: String,
            enum: "Point",
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    address: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    country: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    city: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    zip_code: {
        type: String,
        required: true
    },
    work_schedule: {
        type: {
            is_always_on_work: {
                type: Boolean,
                default: false
            },
            planing: {
                type: weekTypeSchema
            }
        }
    },
    work_holidays: {
        type: [holidaySchema],
        default: []
    }
}, { timestamps: true, versionKey: false });
entrepriseSchema.index({ location: "2dsphere" });
exports.EntrepriseModel = mongoose_1.model("entreprises", entrepriseSchema);
//# sourceMappingURL=entreprise.model.js.map