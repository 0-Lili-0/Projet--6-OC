// import du model
const User = require("../Models/User");
// package necessaire pour mot de passe et token
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// fonction pour creation user
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // appel fonction hash de Bcrypt 
    // fonction asynchrone qui renvoie une promisse
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // creation et enregistrement de l'utilisateur
          .catch((error) => res.status(400).json({ error })); // message erreur en cas de problème
      })
      .catch((error) => res.status(500).json({ error }));
  };
// fonction pour login user
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // verification que le mail existe
        .then((user) => {
            if (!user) {
                return res.status(401).json({ message: "Utilisateur non trouvé !"});
            }
            bcrypt.compare(req.body.password, user.password) // methode compare pour verifier le mot de passe
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({ message: "Mot de passe incorrect !" });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( //chiffrage du token
                            { userId: user._id },
                            process.env.TOKEN_KEY,// chaine clé pour le chiffrement et déchiffrement du token
                            { expiresIn: '24h' } // temps validité session
                        )
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
 };