const Snippet = require('../models/snippetModel');

const getSnippets = async (req, res) => {
    try {
        const { category_id } = req.query;
        const filter = category_id ? { category_id } : {};
        const snippets = await Snippet.find(filter);
        res.status(200).json(snippets);
    } catch (error) {
        res.status(500).json({ "error while fetching snippets": error.message });
    }
}

const addSnippet = async (req, res) => {
    try {
        const { title, description, htmlCode, cssCode, tailwindCode, reactCode, jsCode, category_id } = req.body;
        if (!title || !category_id) {
            return res.status(400).json({ "message": "Title and category are mandatory" });
        }
        const snippet = await Snippet.create({
            category_id,
            title,
            description: description || "",
            htmlCode: htmlCode || "",
            cssCode: cssCode || "",
            tailwindCode: tailwindCode || "",
            reactCode: reactCode || "",
            jsCode: jsCode || ""
        });
        res.status(201).json({ "message": "Snippet added", "snippet": snippet });
    } catch (error) {
        res.status(500).json({ "error while adding snippet": error.message });
    }
}

const getSnippetById = async (req, res) => {
    try {
        const snippet = await Snippet.findById(req.params.id);
        if (!snippet) {
            return res.status(404).json({ "message": "Snippet not found" });
        }
        res.status(200).json(snippet);
    } catch (error) {
        res.status(500).json({ "error while fetching snippet": error.message });
    }
}

const editSnippet = async (req, res) => {
    try {
        const { title, description, htmlCode, cssCode, tailwindCode, reactCode, jsCode, category_id } = req.body;
        const snippet = await Snippet.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                htmlCode,
                cssCode,
                tailwindCode,
                reactCode,
                jsCode,
                category_id
            },
            { new: true }
        );
        if (!snippet) {
            return res.status(404).json({ "message": "Snippet not found" });
        }
        res.status(200).json(snippet);
    } catch (error) {
        res.status(500).json({ "error while editing snippet": error.message });
    }
}

const deleteSnippet = async (req, res) => {
    try {
        const snippet = await Snippet.findByIdAndDelete(req.params.id);
        if (!snippet) {
            return res.status(404).json({ "message": "Snippet not found" });
        }
        res.status(200).json({ "message": "Snippet deleted" });
    } catch (error) {
        res.status(500).json({ "error while deleting snippet": error.message });
    }
}

module.exports = { getSnippets, addSnippet, getSnippetById, editSnippet, deleteSnippet };