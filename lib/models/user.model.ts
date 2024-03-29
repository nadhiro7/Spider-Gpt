import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type: String, require: true, unique: true },
    username: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    image: String,
    bio: String,
    gender: String,
    birthday: String,
    email: String,
    session: String,
    active_at: { type: Date }
})

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;