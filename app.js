const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

// import route
const userRoutes = require("./Routes/user");
const sauceRoutes = require("./Routes/sauce");
const path = require('path');



// connection MongoDB
mongoose.connect('mongodb+srv://Lili:KaBFrxJIYhButxfe@cluster0.vwkgad0.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// gestion CORS : acceder à l'api depuis n'importe où / ajout des headers mentionnés / envoie des requete possible
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// body parser
app.use(bodyParser.json())

app.use('./Images', express.static(path.join(__dirname, 'Images')));
// routes 
app.use("/api/sauces", sauceRoutes)
// route utilisateur
app.use("/api/auth", userRoutes)

module.exports = app;