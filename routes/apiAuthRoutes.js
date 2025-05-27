const express = require("express");
const { signup, login, regenerateApiKey, getApiKey, deleteApiUser, changePassword } = require('../controllers/apiUserController');

const router = express.Router();

router.post('/signup', signup);
router.post("/login", login);
router.put("/regenerate-key", regenerateApiKey);
router.post("/get-key", getApiKey);
router.delete("/delete", deleteApiUser);
router.put("/change-password", changePassword);

module.exports = router;