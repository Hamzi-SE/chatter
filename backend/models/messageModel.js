const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            required: true
        },
        sender: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true,
            trim: true
        },
    },
    { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);