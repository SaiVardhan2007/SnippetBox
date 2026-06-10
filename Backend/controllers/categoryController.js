const Category = require('../models/categoryModel');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ "error while fetching categories": error.message });
    }
}

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ "message": "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ "error while fetching category": error.message });
    }
}

const addCategory = async (req, res) => {
    try {
        const { name, icon } = req.body;
        if (!name || !icon) {
            return res.status(400).json({ "message": "All fields are mandatory" });
        }
        const category = await Category.create({ name, icon });
        res.status(201).json({ "message": "Category added", "category": category });
    } catch (error) {
        res.status(500).json({ "error while adding category": error.message });
    }
}

const editCategory = async (req, res) => {
    try {
        const { name, icon } = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, { name, icon }, { new: true });
        if (!category) {
            return res.status(404).json({ "message": "Category not found" });
        }
        res.status(200).json({ "message": "Category updated", "category": category });
    } catch (error) {
        res.status(500).json({ "error while editing category": error.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ "message": "Category not found" });
        }
        res.status(200).json({ "message": "Category deleted" });
    } catch (error) {
        res.status(500).json({ "error while deleting category": error.message });
    }
}

module.exports = { getCategories, getCategoryById, addCategory, editCategory, deleteCategory };