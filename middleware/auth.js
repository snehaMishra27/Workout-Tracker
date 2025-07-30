// middleware/auth.js

module.exports = function(req, res, next) {
  // Simple simulation: check if a user is logged in (mock logic)
  // Later you can replace this with JWT or session check
  // Replace with real check in future

  if (!req.session || !req.session.user) {
    const acceptHeader = req.headers.accept || "";
    if (acceptHeader.includes("application/json")) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      return res.redirect("/login.html");
    }
  }
  next();
};
