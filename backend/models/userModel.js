const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name!"],
        trim: true,
        maxlength: [40, "Name can not exceed 40 characters"],
        minlength: [2, "Name should have more than 2 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [5, "Password must be at least 5 characters"],
        select: false,
    },
    about: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        required: [true, "Please tell us your gender!"],
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
            default: "avatars/default.jpg"
        },
        url: {
            type: String,
            required: true,
            default: "https://i.postimg.cc/mD9SJc41/149071.png",
        },
    },
    friends: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    ],
    role: {
        type: String,
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},
    { timestamps: true }
);

// Hashing the Password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding reset Password token to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);