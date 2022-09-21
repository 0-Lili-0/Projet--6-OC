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
        
        userId: req.body.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [""],
        usersDisliked: [""]   
    })
    sauce.save()
        .then(() => { res.status(201).json({message: "Nouvelle sauce crée !"})})
        .catch((error) => { res.status(400).json({error})})
};

// fonction modification sauce
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // si utilisateur n'est pas le créateur de la sauce il ne peut pas la modifier
            if (sauce.userId != req.userId) {
                res.status(403).json({ message: "Modification non autorisées!"});
                return;
            } else {
            // sinon il peut la modifier 
           const filename = sauce.imageUrl.split("/images/")[1]; //recup nom de fichier
                fs.unlink(`images/${filename}`); // suppresion image
            const objectSauce = req.file ? { // verifie la presence d'un champs file
                ...JSON.parse(req.body.sauce), //recup si oui et parse
                imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, // creation url image a nouveau
            } : { ...req.body }; // sinon recup objet dans la requete
            // on pousse les modif de la sauce
            Sauce.updateOne({_id: req.params.id}, {...objectSauce, _id: req.params.id}) //on modifie la sauce
                .then(() => { res.status(200).json({ message: "La sauce à bien été modifiée !"})})
                .catch(error => res.status(400).json({ error }));
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
                return
            } else {
                // on recupère le fichier image pour le supprimer 
                const filename = sauce.imageUrl.split("/Images/")[1];
                fs.unlink(`Images/${filename}`, () => {
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
    
    // si on like la sauce
    if (req.body.likes === 1) {
        Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}}, {$push: {usersLiked: req.body.userId}})
            .then(() => res.status(201).json({ message: "Vous aimez cette sauce !"}))
            .catch((error) => res.status(400).json({ error }));
    }
    // si on dislike la sauce
    if ( req.body.dislikes === -1) {
        Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}}, {$push: {usersDisliked: req.bady.userId}})
            .then(() => res.status(201).json({ message: "Vous n'aimez pas cette sauce !"}))
            .catch((error) => res.status(400).json({ error }));
    }
    // on vérifie si l'user a deja like ou disliker la sauce
    if (req.body.like === 0) {
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                //si l'user est dans le tableau usersLiked
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}}, {$pull: {usersLiked: req.body.userId}})
                        .then(() => res.status(200).json({ message: "Votre like est annulé :"}))
                        .catch((error) => res.status(400).json({ error }));
                }
                // si l'user est dans le tableau usersDisliked
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}}, {$pull: {usersDisliked: req.body.userId}})
                        .then(() => res.status(200).json({ message: "Votre dislike est annulé :"}))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
    }
};
