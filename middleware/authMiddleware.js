function isAuthenticated(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

function isAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).send("Forbidden");
  }
  next();
}

function isCustomer(req, res, next) {
  if (!req.session.user || req.session.user.role !== "customer") {
    return res.status(403).send("Forbidden");
  }
  next();
}

module.exports = { isAuthenticated, isAdmin, isCustomer };
