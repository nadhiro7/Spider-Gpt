import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contactUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedDate: { type: Date, default: Date.now }
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;
