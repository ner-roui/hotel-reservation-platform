const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires",
      });
    }

    // check user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email déjà utilisé",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    //  STORE TOKEN IN COOKIE
    res.cookie("token", token, {
      httpOnly: true,        //  impossible à accéder via JS frontend
      secure: false,         // true en production (HTTPS)
      sameSite: "lax",       // protection CSRF basique
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};


login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe obligatoires",
      });
    }

    // 2. check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    // 3. check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    // 4. generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    // 5. cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true en production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Connexion réussie",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};


const createUser = async (req, res) => {
  try {

    const {
      prenom,
      nom,
      email,
      // password,
      role,
      status
    } = req.body;

    // validation
    if (!prenom || !nom || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis"
      });
    }

    // check email
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email déjà utilisé"
      });
    }

    // hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await UserModel.create({
      prenom,
      nom,
      email,
      password: hashedPassword,
      role: role || "Client",
      status: status || "Actif"
    });

    return res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      user
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });

  }
};


const getuserData = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log(userId)

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }

    //  ICI tu transformes le user
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    //  puis tu retournes la réponse SANS password
    return res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      user: userWithoutPassword
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};


const deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    // check if user exists
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable"
      });
    }

    // delete user
    await UserModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Utilisateur supprimé avec succès"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });

  }
};


const getUsers = async (req, res) => {
  try {

    const users = await UserModel
      .find()
      .select("-password")
      .populate("reservations");

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });

  }
};


logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Déconnexion réussie",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};


module.exports = {register, login , logout, getuserData, getUsers, createUser, deleteUser}