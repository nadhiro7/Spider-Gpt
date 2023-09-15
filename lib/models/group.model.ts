import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    groupName: String,
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creationDate: { type: Date, default: Date.now },
    groupImage: String,

});

const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);

export default Group;
