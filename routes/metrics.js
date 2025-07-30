const express = require("express");
const router = express.Router();
const { addMetrics } = require("../controllers/metricsController");
//const { isAuthenticated } = require("../middleware/auth");

router.post("/add-metrics",addMetrics);

module.exports = router;

