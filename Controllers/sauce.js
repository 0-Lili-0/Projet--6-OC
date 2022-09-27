// appel modèle de la sauce
const Sauce = require("../Models/sauce");
const sauce = require("../Models/sauce");
// package fs gere les telechargment et modif images
const fs = require("fs");


// fonction creation sauce
exports.createSauce = (req, res, next) => {
    const objectSauce = JSON.parse(req.body.sauce);
    delete objectSauce._id;
    delete objectSauce.userId
    const sauce = new Sauce({
        ...objectSauce,
        
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [""],
        usersDisliked: [""]   
    });
    
    sauce.save()
        .then(() => { res.status(201).json({message: "Nouvelle sauce crée !"})})
        .catch((error) => { res.status(400).json({error})})
};

// fonction modification sauce
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // si utilisateur n'est pas le créateur de la sauce il ne peut pas la modifier
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: "Modification non autorisées!"});
            } 
            if (req.file) {   
            // sinon il peut la modifier 
                const filename = sauce.imageUrl.split("/images/")[1]; // suppression ancienne images
                fs.unlink(`images/${filename}`, () => {
                    const objectSauce = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                Sauce.updateOne({_id: req.params.id}, {...objectSauce, _id: req.params.id}) //on modifie la sauce
                    .then(() => { res.status(200).json({ message: "La sauce à bien été modifiée !"})})
                    .catch(error => res.status(400).json({ error }));
            })
            } else {
                const sauceObject = { ...req.body };
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'La sauce à bien été modifée !' }))
                    .catch(error => res.status(500).json(error));
            }
        })    
        .catch((error) => res.status(400).json({ error }));
};

// fonction supprimer sauce
exports.deleteSauce = (req, res, next) => {
    // on cherche la sauce par son id
    Sauce.findOne({ _id: req.params.id})
        .then((sauce) => {
            // on verifie que l'utilisateur et le createur sont les mêmes
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: "Non autorisé !"});
            } else {
                // on recupère le fichier image pour le supprimer 
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                        .catch((error) => res.status(400).json({ error }));
                    });
            };
        })
        .catch((error) => {res.status(500).json({ error })});
};

// fonction voir une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => res.status(200).json(sauce))
      .catch((error) => res.status(404).json({ error }));
};

// fonction voir ttes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find({})
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(400).json({ error }));
};


// fonction pour les like et dislike
exports.updateLikeDislikeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            // quand l'utilisateur essaye de like ou dislike verifie :
            if (req.body.like == 1 || req.body.like == -1) {
                //si l'user est dans le tableau usersLiked ou userDisliked
                if (sauce.usersLiked.includes(req.body.userId) || sauce.usersDisliked.includes(req.body.userId)) {
                    return res.status(400).json({ message: "Vous avez déjà liker/disliker cette sauce"});
                };
                // si l'utilisateur veut like la sauce
                if (req.body.like == 1) {
                    Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: req.auth.userId}})
                        .then(() => res.status(201).json({ message: "Vous aimez cette sauce !"}))
                        .catch((error) => res.status(400).json({ error }));
                };
                // si l'utilisateur veux dislike la sauce
                if( req.body.like == -1) {
                    Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: req.auth.userId}})
                        .then(() => res.status(201).json({ message: "Vous n'aimez pas cette sauce !"}))
                        .catch((error) => res.status(400).json({ error }));
                }        
            } else {
                // si l'utilisateur veut retirer son like
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.auth.userId}})
                        .then(() => res.status(200).json({ message: "Votre like est annulé :"}))
                        .catch((error) => res.status(400).json({ error }));
                };
                // si l'utilisateur veut supprimer son dislike
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.auth.userId}})
                        .then(() => res.status(200).json({ message: "Votre dislike est annulé :"}))
                        .catch((error) => res.status(400).json({ error }));
                };
            };
        })
        .catch((error) => res.status(500).json({ error }));
};
