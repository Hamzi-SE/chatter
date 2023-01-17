const Message = require("../models/messageModel")
const Conversation = require("../models/conversationModel")
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new message
exports.createMessage = catchAsyncErrors(async (req, res, next) => {
    const { sender, text, conversationId } = req.body;

    const newMessage = new Message({
        conversationId,
        sender,
        text
    });

    try {
        const savedMessage = await newMessage.save();
        if (savedMessage) {
            const { conversationId } = req.body;
            const conversation = await Conversation.findById(conversationId);
            if (conversation) {
                conversation.lastMessage = savedMessage.createdAt;
                await conversation.save();
            }
        }
        res.status(201).json({
            success: true,
            message: savedMessage
        });
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});

// Get all messages of a conversation
exports.getConversationMessages = catchAsyncErrors(async (req, res, next) => {
    try {
        const messages = await Message.find({ conversationId: req.params.conversationId });
        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }

});