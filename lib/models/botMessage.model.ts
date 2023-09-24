import mongoose from "mongoose";

const botMessageSchema = new mongoose.Schema({
    Bot: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messageText: String,
    reply: { type: mongoose.Schema.Types.ObjectId, ref: 'BotMessage' },
    timestamp: { type: Date, default: Date.now }
});

const BotMessage = mongoose.models.BotMessage || mongoose.model('BotMessage', botMessageSchema);

export default BotMessage;
