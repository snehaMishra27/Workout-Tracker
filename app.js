const session = require("express-session"); 
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose"); 
//const dashboardRoutes = require("./routes/dashboard");

dotenv.config();

// Connect MongoDB
mongoose.connect("mongodb://localhost:27017/snehafit", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ Mongo Error:", err.message));

const app = express();




// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname))); // ✅ serve public folder

// Sessions
app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    maxAge: 1000 * 60 * 60
  }
}));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/workout", require("./routes/workout"));
app.use("/metrics", require("./routes/metrics"));
app.use("/dashboard", require("./routes/dashboard"));

// ✅ Serve Home Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Serve Other Pages like login.html, register.html
app.get("/:page(login|register|metrics|workout)", (req, res) => {
  const file = `${req.params.page}.html`;
  const filePath = path.join(__dirname, file); // ✅ public folder path

  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send("Page not found");
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send("❌ Route not found");
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

