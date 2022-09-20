const express = require("express");
// methode router d'express
const router = express.Router();
// appel des fichier controllers
const userCtrl = require("../Controllers/user");

// envoie des routes post
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;