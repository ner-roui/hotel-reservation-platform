
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Non authentifié",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Accès refusé",
      });
    }

    next();
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = isAdmin