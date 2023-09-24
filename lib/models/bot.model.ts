import mongoose from "mongoose";

const botSchema = new mongoose.Schema({
    botName: String,
    botAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creationDate: { type: Date, default: Date.now },
    botImage: String,
    type: String
});

const Bot = mongoose.models.Bot || mongoose.model('Bot', botSchema);

export default Bot;
