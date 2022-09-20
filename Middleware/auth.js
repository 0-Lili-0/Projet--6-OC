// package pour les tokens
const jwt = require('jsonwebtoken'); 
// package dotenv permet de charger des variable d'environnement à partir d'un fichier
require("dotenv").config();

 // middleware pour authentification
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
       const userId = decodedToken.userId;
       
        req.auth = { userId: userId };
	    next();
   } 
   catch(error) {res.status(401).json({ error })}
};