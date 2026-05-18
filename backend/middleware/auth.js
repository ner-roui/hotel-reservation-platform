const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

/**
 * AUTH MIDDLEWARE (COOKIE JWT)
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Récupérer token depuis cookies
    console.log('piwww', req.cookies)
    const token = req.cookies.token;
    console.log(token, "tokennn")

    if (!token) {
      return res.status(401).json({
        message: "Non autorisé - cookie manquant",
      });
    }

    // 2. Vérifier token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Récupérer user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Utilisateur introuvable",
      });
    }

    // 4. Injecter user dans request
    req.user = {
      userId: user._id,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token invalide ou expiré",
    });
  }
};

module.exports = authMiddleware;