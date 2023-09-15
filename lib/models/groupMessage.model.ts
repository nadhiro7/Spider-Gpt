import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messageText: String,
    reply: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupMessage' },
    timestamp: { type: Date, default: Date.now }
});

const GroupMessage = mongoose.models.GroupMessage || mongoose.model('GroupMessage', groupMessageSchema);

export default GroupMessage;
