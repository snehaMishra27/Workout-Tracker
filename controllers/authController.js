const User = require("../models/User");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send("User already exists");

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.send("✅ User registered successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Server error during registration");
  }
};

// Login existing user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.status(401).send("❌ Invalid credentials");

    res.send("✅ Login successful");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Server error during login");
  }
};
