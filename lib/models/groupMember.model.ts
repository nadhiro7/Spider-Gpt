import mongoose from "mongoose";

const groupMemberSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinDate: { type: Date, default: Date.now }
});

const GroupMember = mongoose.models.GroupMember || mongoose.model('GroupMember', groupMemberSchema);

export default GroupMember;
