const Conversation = require("../models/conversationModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new conversation
exports.createConversation = catchAsyncErrors(async (req, res, next) => {
    const { senderId, receiverId } = req.body;

    if (senderId === receiverId) {
        return next(new ErrorHandler("You cannot start a conversation with yourself", 400));
    }

    const presentConversation = await Conversation.findOne({
        members: { $eq: [senderId, receiverId] }
    });

    if (presentConversation) {
        res.status(200).json({
            message: "Conversation already exists",
            conversation: presentConversation,
        });
        return;
    }

    const newConversation = new Conversation({
        members: [senderId, receiverId]
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(201).json({
            success: true,
            message: "Conversation created successfully",
            conversation: savedConversation
        });
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});

// Get conversation of a user
exports.getUserConversation = catchAsyncErrors(async (req, res, next) => {

    try {
        const userConversations = await Conversation.find({
            members: { $in: [req.params.userId] }
        }).sort({ lastMessage: -1 });

        res.status(200).json({
            success: true,
            conversations: userConversations
        });
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});