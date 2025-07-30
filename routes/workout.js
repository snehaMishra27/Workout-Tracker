const express = require("express");
const router = express.Router();
//const Workout = require("../models/Workout");
const  {addWorkout}  = require("../controllers/workoutController");

//  Check session before adding workout
router.use((req, res, next) => {
  if (!req.session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});


router.post("/add",addWorkout);
module.exports = router;
