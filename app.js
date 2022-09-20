const express = require("express");
// import package requis
const mongoose = require("mongoose");
const path = require('path');
//const helmet = require("helmet")

// import route
const userRoutes = require("./Routes/user");
const sauceRoutes = require("./Routes/sauce");

// connection MongoDB
mongoose.connect('mongodb+srv://Lili:KaBFrxJIYhButxfe@cluster0.vwkgad0.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();

// gestion CORS : acceder à l'api depuis n'importe où / ajout des headers mentionnés / envoie des requete possible
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
   // res.setHeader('Cross-Origin-Ressource-Policy', 'same-site')
    next();
});

// methode pour parse corps Json
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// securiser les entête http
//app.use(helmet());

// charge les images depuis le dossiers et gere les ressources
app.use('/Images', express.static(path.join(__dirname, 'Images')));
// routes 
app.use("/api/sauces", sauceRoutes);
// route utilisateur
app.use("/api/auth", userRoutes);

module.exports = app;