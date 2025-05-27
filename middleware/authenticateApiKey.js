const ApiUser = require("../models/ApiUser");

const authenticateApiKey = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
    
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "API key is required" });
        }

        const apiKey = authHeader.split(" ")[1];

        const user = await ApiUser.findOne({ apiKey });
        if (!user) {
            return res.status(403).json({ error: "Invalid API key" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("API key authentication error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = authenticateApiKey;