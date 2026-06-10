const validateAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied. Admin rights required." });
    }
    next();
};

module.exports = validateAdmin;
