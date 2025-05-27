const ApiUser = require("../models/ApiUser");
const crypto = require("crypto");

// Generate a random API key
const generateUniqueApiKey = async () => {
  let apiKey;
  let existingUser;
  do {
      apiKey = crypto.randomBytes(16).toString("hex");
      existingUser = await ApiUser.findOne({ apiKey });
  } while (existingUser);
  return apiKey;
};


// API User Signup
exports.signup = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        let user = await ApiUser.findOne({ email });

        if (user) {
        return res.status(400).json({ error: "Email already registered" });
        }

        const apiKey = await generateUniqueApiKey();

        // Check if this is the first user
        const userCount = await ApiUser.countDocuments();
        const role = userCount === 0 ? "superadmin" : "admin"; 

        user = new ApiUser({ email, password, apiKey, role });
        await user.save();

        res.status(201).json({ message: "API Key generated", apiKey });
    } catch (error) {
        console.error("Signup error:", error)
        res.status(500).json({ error: error.message });
    }
};

// Allow users to authenticate and retrieve their API key.
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await ApiUser.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({ message: "Login successful", apiKey: user.apiKey });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: error.message });
    }
};


// Change Password
exports.changePassword = async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ error: "Email, current password, and new password are required" });
    }

    try {
        const user = await ApiUser.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if current password is correct
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid current password" });
        }

        // Check if new password is the same as the old password
        const isReusedPassword  = await user.isSamePassword(newPassword);
        if (isReusedPassword ) {
            return res.status(400).json({ error: "New password cannot be the same as the old password." });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ error: error.message });
    }
};


// Allow users to regenerate their API key if needed.
exports.regenerateApiKey = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
  }

  try {
      const user = await ApiUser.findOne({ email });

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Check if password is correct
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate a new API key
      const newApiKey = await generateUniqueApiKey();
      user.apiKey = newApiKey;
    // Save without triggering password validation
    await user.save({ validateBeforeSave: false });

      res.json({ message: "New API Key generated", apiKey: newApiKey });
  } catch (error) {
      console.error("API key regeneration error:", error);
      res.status(500).json({ error: error.message });
  }
};

// Allow users to retrieve their API key if they forgot it.
exports.getApiKey = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
  }

  try {
      const user = await ApiUser.findOne({ email });

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Check if password is correct
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({ apiKey: user.apiKey });
  } catch (error) {
      console.error("Error retrieving API key:", error);
      res.status(500).json({ error: error.message });
  }
};

// Allow users to delete their API key/account.
exports.deleteApiUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
  }

  try {
      const user = await ApiUser.findOne({ email });

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Check if password is correct
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
      }

      await ApiUser.deleteOne({ email });

      res.json({ message: "API user deleted successfully" });
  } catch (error) {
      console.error("Delete API user error:", error);
      res.status(500).json({ error: error.message });
  }
};