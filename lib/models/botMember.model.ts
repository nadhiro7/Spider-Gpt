import mongoose from "mongoose";

const botMemberSchema = new mongoose.Schema({
    bot: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinDate: { type: Date, default: Date.now }
});

const BotMember = mongoose.models.BotMember || mongoose.model('BotMember', botMemberSchema);

export default BotMember;
