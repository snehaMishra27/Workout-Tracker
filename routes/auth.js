// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const User=require("../models/User")
// // const { loginUser, registerUser } = require("../controllers/authController");

// // // POST /auth/register
// // router.post("/register", registerUser);

// // // POST /auth/login
// // router.post("/login", loginUser);

// // router.post("/workout", addWorkout);

// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   try {
//     const user = new User({ name, email, password: hashedPassword });
//     await user.save();
//     res.redirect("/login.html?registered=true");
//   } catch (err) {
//     console.error(err);
//     res.redirect("/register.html?error=exists");
//   }
// });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) return res.redirect("/login.html?error=notfound");

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) return res.redirect("/login.html?error=wrongpass");

//   // Create session
//   req.session.userId = user._id;
//   res.redirect("/index.html");
// });
// // Logout
// router.get("/logout", (req, res) => {
//   req.session.destroy(() => {
//     res.redirect("/login.html");
//   });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// 🔐 Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("📩 Received register data:", name, email, password);

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect("/register.html?error=exists");
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.redirect("/login.html?registered=true");
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    res.redirect("/register.html?error=server");
  }
});

// 🔑 Login Route
router.post("/login", async (req, res) => {
   console.log("💡 POST /auth/login hit");


  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("🔐 Login attempt:", email, password);

    if (!user) return res.redirect("/login.html?error=notfound");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.redirect("/login.html?error=wrongpass");

    if (!req.session) {
      console.error("❌ Session is undefined at login!");
      return res.redirect("/login.html?error=session");
    }

    // ✅ Set session for logged-in user
    //req.session.userId = user._id;
    req.session.user = {
      id: user._id,
      email: user.email
    };
    console.log("✅ Session set on login:", req.session.user);
    // res.redirect("/index.html");
    res.redirect("/");

  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.redirect("/login.html?error=server");
  }
});



module.exports = router;
