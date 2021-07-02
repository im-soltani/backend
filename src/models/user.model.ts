import * as bcrypt from "bcrypt";
import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
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
      required: false,
      trim: true
    },
    last_Login: {
      type: Date,
      default: new Date()
    },
    is_blocked: {
      type: Boolean,
      required: false,
      default: false
    },
    isleader: {
      type: Boolean,
      required: false,
      default: true
    },
    name: {
      type: String,
      required: false,
      trim: true
    },
    prenom: {
      type: String,
      required: false,
      trim: true
    },
    is_holder: {
      type: Boolean,
      required: false,
      default: true
    },
    is_blocked_by_admin: {
      type: Boolean,
      required: false,
      default: false
    },
    is_verified: {
      type: Boolean,
      default: false
    },
    reset_password_code: {
      type: Schema.Types.String
    },
    reset_password_token: {
      type: Schema.Types.String
    },
    reset_password_expires: {
      type: Number
    }
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password") && this.isNew) {
    if (
      (this as any).ref === "entreprises" &&
      (this as any).password.includes("$2y$")
    ) {
      (this as any).password = (this as any).password.replace("$2y$", "$2a$");
      next();
    } else if (
      (this as any).ref === "candidats" &&
      (this as any).password.includes("$2y$")
    ) {
      (this as any).password = (this as any).password.replace("$2y$", "$2a$");
      next();
    } else
      try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync((this as any).password, salt);
        (this as any).password = hash;
        (this as any).updatedAt = new Date();
        next();
      } catch (e) {
        next(e);
      }
  } else {
    (this as any).updatedAt = new Date();
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
    } catch (e) {
      reject(e);
    }
  });
};

export const UserModel = model("users", userSchema);
