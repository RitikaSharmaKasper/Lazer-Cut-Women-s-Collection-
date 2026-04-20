import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Password reset via OTP
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpires: { type: Date },

    // Email verification via OTP
    emailVerificationOTP: { type: String },
    emailVerificationExpires: { type: Date },
    isVerified: { type: Boolean, default: false },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      lowercase: true,
    },

    profileImage: { type: String },
    dateOfBirth: { type: String },
    gender: { type: String, enum: ["male", "female"], required: false },
    alternateMobile: { type: String },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
