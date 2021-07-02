"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    ref: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profile_pic_url: {
        type: String
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    cardDetails: [{}],
    reset_password_code: {
        type: mongoose_1.Schema.Types.String
    },
    reset_password_token: {
        type: mongoose_1.Schema.Types.String
    },
    reset_password_expires: {
        type: Number
    }
}, { timestamps: true, versionKey: false });
userSchema.pre("save", function (next) {
    if (this.isModified("password") && this.isNew) {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(this.password, salt);
            this.password = hash;
            next();
        }
        catch (e) {
            next(e);
        }
    }
    else {
        next();
    }
});
userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
userSchema.statics.hashPassword = function (password) {
    return new Promise((resolve, reject) => {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            resolve(hash);
        }
        catch (e) {
            reject(e);
        }
    });
};
exports.UserModel = mongoose_1.model("users", userSchema);
//# sourceMappingURL=user.model.js.map