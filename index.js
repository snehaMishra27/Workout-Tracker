// const express=require("express");
// const connectDB = require("./config/db");
// const path = require("path");
// const dashboardRoutes = require("./routes/dashboard");

// //require("./app");

// //Models files
// const User = require("./models/User");
// const Workout = require("./models/Workout");
// const Metrics = require("./models/Metrics");

// //routes files
// const workoutRoutes = require("./routes/workout");
// const metricsRoutes = require("./routes/metrics");
// const authRoutes = require("./routes/auth");

// // Express App Setup
// const app = express();
// const PORT = 3000;

// // Middleware

// app.use(express.urlencoded({ extended: true })); // handle form data
// app.use(express.json()); // handle JSON requests
// app.use(express.static(__dirname)); // serve HTML pages

// // Routes
// app.use("/workout", workoutRoutes);     // /workout/add
// app.use("/metrics", metricsRoutes);     //  /metrics/add-metrics
// app.use("/", authRoutes);               //  /register, /login (if available)
// app.use("/dashboard", dashboardRoutes);

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });



// connectDB().then(async () => {
//   // Ye line Compass me already inserted user dikhane ke liye hai
// //   const users = await User.find();
// //   console.log("📋 All users:", users);
// //   const workout = await Workout.create({
// //     type: "Strength",
// //     duration: 30,
// //     date: new Date()
// //   });

// //   console.log("✅ Workout inserted:", workout);

// try {
//     // --- INSERT USER ---
//     const existingUser = await User.findOne({ email: "sneha@example.com" });
//     //let user;
//     let newUser;

//     if (!existingUser) {
//         newUser = await User.create({
//         name: "Sneha",
//         email: "sneha@example.com",
//         password: "securepassword123" // 🔒 in real app, hash this
//       });
//       console.log("✅ User inserted:", newUser.email);
//     } else {
      
//       console.log("ℹ️ User already exists:", existingUser.email);
//     }


//     // ✅ INSERT SAMPLE WORKOUT
//     await Workout.create({
//       type: "Cardio",
//       duration: 45,
//       date: new Date()
//     });

//     // ✅ INSERT SAMPLE METRICS
//     await Metrics.create({
//       weight: 55,
//       heartRate:82,
//       sleep: 7.5,
//       date: new Date()
    
//     });
//     console.log("✅ Metrics inserted:");

//     // --- FETCH ALL DATA ---
//     const allUsers = await User.find();
//     const allWorkouts = await Workout.find();
//     const allMetrics = await Metrics.find();

//     console.log("📋 All Users:", allUsers);
//     console.log("📋 All Workouts:", allWorkouts);
//     console.log("📋 All Metrics:", allMetrics);
//   } catch (err) {
//     console.error("❌ Error:", err.message);
//   }
//     // app.use(express.static("public")); // ✅ serve HTML forms
//     // app.use(express.urlencoded({ extended: true })); // for form POST (not JSON)
//     //app.use("/workout", workoutRoutes);
//     // ✅ Start Server AFTER data is inserted
// //    app.listen(PORT, () => {
// //     console.log(`🚀 Server running at http://localhost:${PORT}`);
// //    });

//   const app = require("./app");
//   const PORT = process.env.PORT || 3000;

//   app.listen(PORT).on("listening", () => {
//     console.log(`🚀 Server running at http://localhost:${PORT}`);
//   })
//   .on("error", (err) => {
//     if (err.code === "EADDRINUSE") {
//       console.error(`❌ Port ${PORT} is already in use. Please close the previous server.`);
//     } else {
//       console.error("❌ Server Error:", err.message);
//     }
//   });

// });
