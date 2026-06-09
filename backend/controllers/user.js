const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

register = async (req, res) => {
  try {
 
    const { name, prenom, email, password, role } = req.body;

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
      prenom,
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
      name,
      email,
      // password,
      role,
      status
    } = req.body;
    console.log(req.body)
    // validation
    if (!prenom || !name || !email ) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis"
      });
    }

    // check email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email déjà utilisé"
      });
    }

    // hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      prenom,
      name ,
      email,
      role: role || "Client",
      status: status || "Actif"
    });

    return res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      user
    });

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });

  }
};

const getuserData = async (req, res) => {
  try {
   
    const userId = req.user?.id || req.user?.userId || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

  
    return res.status(200).json({
      success: true,
      user,
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
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable"
      });
    }

    // delete user
    await User.findByIdAndDelete(id);

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

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('id update', id);
    const {
      prenom,
      name,
      email,
      role,
      statut,
 
    } = req.body;

    // 1. vérifier si user existe
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    // 2. vérifier email unique si modifié
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email déjà utilisé",
        });
      }
    }

    // 3. update champs
    user.name = name ?? user.name;
    user.prenom = prenom ?? user.prenom;
    user.email = email ?? user.email;
    user.role = role ?? user.role;
    user.statut = statut ?? user.statut;
  

    // 4. save
    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      user: updatedUser,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {

    const users = await User
      .find()
      .select("-password")
      .populate("reservations");

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });

  }
};

const getClients = async (req, res) => {
  try {

    const clients = await User
      .find({ role: "Client" })
      .select("-password")
      .populate("reservations");

    return res.status(200).json({
      success: true,
      count: clients.length,
      users: clients
    });

  } catch (error) {

    console.log(error.message);

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


module.exports = {register, login , logout, getuserData, getUsers, createUser, deleteUser, updateUser, getClients }