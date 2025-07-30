const Metrics = require("../models/Metrics");
//new Metrics(req.body)
const addMetrics = async (req, res) => {
  try {
    const { weight, heartRate,sleepHours,date} = req.body;
    
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).send("Unauthorized");
    }

    console.log("📥 Received Metrics:", req.body);
    const parsedSleepHours = parseFloat(sleepHours);
    console.log("🛌 Parsed Sleep Hours:", parsedSleepHours);
    const newMetric = new Metrics({
      userId: req.session.user.id, // ✅ Must include this
      weight:parseFloat(weight),
      heartRate:parseFloat(heartRate),
      sleepHours:parseFloat(sleepHours),
      date: new Date(date),
    });
    await newMetric.save();
    //res.status(200).send("✅ Metrics saved successfully");
    res.status(200).send(`<h2>✅ Metrics Saved!</h2><p><a href="/index.html">Go back</a></p>`);
  } catch (error) {
    console.error("❌ Failed to save metrics:", error.message);
    res.status(500).send("Server error while saving metrics");
  }
};

module.exports = { addMetrics };
