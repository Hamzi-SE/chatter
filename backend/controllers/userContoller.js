const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const { cloudinary } = require("../utils/cloudinary");
const cloudinaryy = require("cloudinary");


// Register a new user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, about, gender } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        about,
        gender
    });

    sendToken(user, 201, res);

});


// Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400));
    }

    // Finding user in database
    const user = await User.findOne({ email }).select("+password").populate("friends");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 200, res);
});


// Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});


// Get all users => /api/v1/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const resultsPerPage = 4;

    // get all users
    const apiFeature = new ApiFeatures(User.find(), req.query).pagination(resultsPerPage).search();
    const users = await apiFeature.query;
    let usersCount = await User.countDocuments({ role: "user" });

    if (req.query.keyword) {
        usersCount = await User.countDocuments({ role: "user", name: { $regex: req.query.keyword, $options: "i" } });
    }

    res.status(200).json({ success: true, users, usersCount, resultsPerPage });
});


// Get logged in user details => /api/v1/me
exports.getMyDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate("friends", "name email avatar");

    res.status(200).json({ success: true, user });
});


// Get single user details => /api/v1/user/:id
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate("friends", "name email avatar gender");

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({ success: true, user });
});


// Update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        about: req.body.about,
        gender: req.body.gender,
        email: req.body.email,
    };

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinaryy.v2.uploader.destroy(imageId);
        const myCloud = await cloudinaryy.v2.uploader.upload(req.body.avatar, {
            upload_preset: "chatterAvatars",
            width: 300,
            height: 300,
            crop: "scale",
        }, function (error, result) {
            error && console.log(error)
        });
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    let user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    }).populate("friends", "name email avatar");

    res.status(200).json({ success: true, user });
});


// Update user password => /api/v1/user/update/password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    if (!req.body.oldPassword || !req.body.newPassword || !req.body.confirmPassword) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    let user = await User.findById(req.user.id).select("+password");

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Checks previous user password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("New password and Confirm Password does not match", 400));
    }

    if (req.body.newPassword === req.body.oldPassword) {
        return next(new ErrorHandler("New password and Old password cannot be same", 400));
    }


    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
});


// Delete user => /api/v1/user/delete
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    // Removing cloudinary image
    if (user.avatar.public_id) {
        await cloudinaryy.v2.uploader.destroy(user.avatar.public_id);
    }

    if (!user) {
        return next(new ErrorHandler(`User does not exist with ID: ${req.params.id}`, 404));
    }

    await user.remove();

    res.status(200).json({ success: true, message: "User deleted successfully." });
});


// Forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    if (!req.body.email) {
        return next(new ErrorHandler("Please enter your email", 400));
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\nThis url will expire in 15 minutes.\n\nIf you have not requested this email, then ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Chatter Password Recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));

    }
});


// Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Password reset token is invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    // Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});


// Add Friend => /api/v1/user/addFriend/:id
exports.addFriend = catchAsyncErrors(async (req, res, next) => {
    const friend = await User.findById(req.body.userId);

    if (!friend) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (friend._id.toString() === req.user.id.toString()) {
        return next(new ErrorHandler("You cannot add yourself as a friend", 400));
    }

    if (req.user.friends.includes(req.body.userId)) {
        return next(new ErrorHandler("You are already friend with this user", 400));
    }

    await User.findByIdAndUpdate(req.user.id, {
        $push: { friends: req.body.userId },
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({ success: true, message: "Friend added successfully" });
});