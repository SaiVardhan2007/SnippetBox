const Contact = require("../models/contactModel");

const getContacts = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const contacts = await Contact.find({ user_id: req.user.id });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ "error while fetching contacts": error.message });
    }
}
const editContact = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (contact.user_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to edit this contact" });
        }
        const contact = await Contact.findByIdAndUpdate(req.params.id, {
            name,
            email,
            phone
        }, { new: true });
        res.status(200).json({ "message": "contact updated", "contact": contact });
    } catch (error) {
        res.status(500).json({ "error while editing contact": error.message });
    }
}
const deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json({ "message": "contact deleted" });
    } catch (error) {
        console.log("error while deleting contact:", error);
        res.status(500).json({ "error while deleting contact": error.message });
    }
}
const getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        res.status(200).json({ "message": "got contact", "contact": contact });
    } catch (error) {
        console.log("error while fetching contact:", error);
        res.status(500).json({ "error while fetching contact": error.message });
    }
}
const addContact = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({ "message": "all fields are mandatory" });
        }
        const contact = await Contact.create({
            user_id: req.user.id,
            name,
            email,
            phone
        });
        res.status(201).json({ "message": "contact added", "contact": contact });
    } catch (error) {
        res.status(500).json({ "error while adding contact": error.message });
    }
}
module.exports = { getContacts, editContact, deleteContact, getContact, addContact };