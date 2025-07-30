const path = require("path"); // ADD THIS AT THE TOP
const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const Metrics = require("../models/Metrics");
const isAuthenticated = require("../middleware/auth");

// // Middleware to check if user is logged in
// router.use((req, res, next) => {
//   console.log("🔥 Session at dashboard route:", req.session);
//   if (!req.session.user) {
//     console.log("🚫 No session found:", req.session);
//     return res.status(401).json({ error: "Unauthorized: Please login first" });
//   }
//   next();
// });
router.get("/", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});
router.get("/summary", isAuthenticated, async (req, res) => {
  // if (!req.session || !req.session.user) {
    
  //   return res.status(401).json({ error: "Unauthorized: Please login first" });
  // }
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: "Unauthorized: Please login" });
    }

    const userId = req.session.user.id;
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    // Fetch all workouts in last 7 days
    const workouts = await Workout.find({ userId, date: { $gte: last7Days } });

    // Fetch metrics in last 7 days
    const metrics = await Metrics.find({ userId, date: { $gte: last7Days } });

    // Calculate Calories Burned
    let caloriesBurned = 0;
    workouts.forEach(w => {
      if (w.type === "Cardio") caloriesBurned += w.duration * 10;
      else if (w.type === "Strength") caloriesBurned += w.duration * 8;
      else if (w.type === "Yoga") caloriesBurned += w.duration * 5;
      else caloriesBurned += w.duration * 6;
    });

    // Sleep Hours (avg)
    let totalSleep = 0;
    metrics.forEach(m => {
      const sleep = parseFloat(m.sleepHours);  // convert to number
      if (!isNaN(sleep)) totalSleep += sleep; // skip bad values
    });

    const avgSleep = metrics.length > 0 ? (totalSleep / metrics.length) : 0;

    // Goal progress = let's say target is 300 minutes in 7 days
    const totalDuration = workouts.reduce((acc, curr) => acc + curr.duration, 0);
    const goalProgress = Math.min(100, ((totalDuration / 300) * 100).toFixed(0)); // Max 100%

    res.json({
      caloriesBurned,
      workoutCount: workouts.length,
      avgSleep,
      goalProgress
    });

  } catch (err) {
    console.error("❌ Dashboard Error:", err);
    res.status(500).json({ error: "Failed to load dashboard summary" });
  }
});

router.get("/chart-data",isAuthenticated, async (req, res) => {
  // if (!req.session || !req.session.user) {
  //   return res.status(401).json({ error: "Unauthorized: Please login first" });
  // }
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: "Unauthorized: Please login" });
    }

    const userId = req.session.user.id;
    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      last7Days.push(date.toISOString().split("T")[0]);
    }

    
    const startDate = new Date();
    startDate.setDate(today.getDate() - 6);

    const workouts = await Workout.find({userId,
      date: { $gte:startDate}
    });

    const dailyTotals = {};

    last7Days.forEach(date => (dailyTotals[date] = 0));

    workouts.forEach(workout => {
      const day = new Date(workout.date).toISOString().split("T")[0];
      if (dailyTotals[day] !== undefined) {
        dailyTotals[day] += workout.duration;
      }
    });

    const labels = Object.keys(dailyTotals);
    const data = Object.values(dailyTotals);

    res.json({ labels, data });
  } catch (err) {
    console.error("❌ Chart data error:", err);
    res.status(500).json({ error: "Failed to load chart data" });
  }
});

router.get("/metrics-trend",isAuthenticated, async (req, res) => {
  // if (!req.session || !req.session.user) {
  //   return res.status(401).json({ error: "Unauthorized: Please login first" });
  // }
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: "Unauthorized: Please login" });
    }
    console.log("🟢 Session User:", req.session.user); 

    const userId = req.session.user.id;
    const today = new Date();
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(today.getDate() - 28);

    const metrics = await Metrics.find({ userId , date: { $gte: fourWeeksAgo } }).sort({ date: 1 });

    // Group by week (start of each week)
    const weekData = {};

    metrics.forEach((entry) => {
      const weekStart = new Date(entry.date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Set to Sunday of that week
      const key = weekStart.toISOString().split("T")[0];

      if (!weekData[key]) {
        weekData[key] = { weightSum: 0, heartRateSum: 0, sleepHoursSum:0, count: 0 };
      }

      weekData[key].weightSum += parseFloat(entry.weight) || 0;
      weekData[key].heartRateSum += parseFloat(entry.heartRate)||0;
      weekData[key].sleepHoursSum+=parseFloat(entry.sleepHours) ||0;
      weekData[key].count++;
    });

    const labels = [];
    const weightData = [];
    const heartRateData = [];
    const sleepHoursData=[];

    Object.entries(weekData).forEach(([week, data]) => {
      labels.push(week);
      const avgWeight = data.count > 0 ? (data.weightSum / data.count).toFixed(1) : null;
      const avgHeartRate = data.count > 0 ? (data.heartRateSum / data.count).toFixed(1) : null;
      const avgSleepHours = data.count > 0 ? (data.sleepHoursSum / data.count).toFixed(1) : null;

      weightData.push(avgWeight);
      heartRateData.push(avgHeartRate);
      sleepHoursData.push(avgSleepHours);
    });

    res.json({ labels, weightData, heartRateData,sleepHoursData });
  } catch (err) {
    console.error("❌ Metrics Trend Error:", err);
    res.status(500).json({ error: "Failed to load metrics trend" });
  }
});


// 📁 routes/dashboard.js

router.get("/weekly-goals",isAuthenticated, async (req, res) => {
  // if (!req.session || !req.session.user) {
  //   return res.status(401).json({ error: "Unauthorized: Please login first" });
  // }
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: "Unauthorized: Please login" });
    }

    const userId = req.session.user.id;
    const today = new Date();
    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 6);

    // Get workouts in the last 7 days
    const workouts = await Workout.find({userId, date: { $gte: last7Days } });

    // Create a Set of unique workout dates
    const workoutDays = new Set();
    workouts.forEach(workout => {
      const day = new Date(workout.date).toDateString();
      workoutDays.add(day);
    });

    const totalWorkoutDays = workoutDays.size; // e.g., 4 days
    const workoutGoal = 5; // Assume goal is 5 workout days/week
    const workoutProgress = Math.min(100, Math.round((totalWorkoutDays / workoutGoal) * 100));

    const sleepGoalDays = 7; // e.g., sleep tracked daily
    const sleepEntries = await Metrics.find({userId, date: { $gte: last7Days } });
    const sleepDays = sleepEntries.length;
    const sleepProgress = Math.min(100, Math.round((sleepDays / sleepGoalDays) * 100));

    res.json({
      totalWorkoutDays,
      workoutProgress,
      sleepDays,
      sleepProgress
    });

  } catch (err) {
    console.error("❌ Weekly Goals Error:", err);
    res.status(500).json({ error: "Failed to load weekly goals" });
  }
});

 module.exports = router;

