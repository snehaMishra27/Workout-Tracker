const Workout = require("../models/Workout");

// Add workout
const addWorkout = async (req, res) => {
  try {
    const userId = req.session.user?.id; // ✅ Correct way

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user session" });
    }

    const { type, duration, date } = req.body;
    const workout = new Workout({userId, type, duration, date });
    await workout.save();

    //res.send("✅ Workout saved");
   // res.status(201).json({ message: "✅ Workout saved successfully" });
    res.status(200).send(`<h2>✅ Workout saved successfully!</h2><p><a href="/index.html">Go back</a></p>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Server error while saving workout");
  }
};

module.exports = { addWorkout };

