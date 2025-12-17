const mongoose = require('mongoose');

const dotenv = require('dotenv').config();

const contactSchema = mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        required: [true, "Please add the name"]
    },
    email: {
        type: String,
        required: [true, "Please add the email"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Please add the phone number"],
        unique: true
    }
}, {
    timestamps: true
}
);

module.exports = mongoose.model("Contacts", contactSchema);