const Sauce = require("../Models/sauce");
const fs = require("fs");


// fonction creation sauce
exports.createSauce = (req, res, next) => {
    const objectSauce = JSON.parse(req.body.sauce)
    delete objectSauce._id
    delete objectSauce.userId
    let sauce = new Sauce({
        ...objectSauce,
        userId: req.body.userId,
        ImageUrl: `${req.protocol}://${req.get("host")}/Images/${req.file.filename}`
    })
    sauce.save()
        .then(() => { res.status(201).json({message: "Sauce crée !"})})
        .catch(error => { res.status(400).json({error})})
};

// fonction modification sauce
exports.modifySauce = (req, res, next) => {
    const objectSauce = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    } : { ...req.body };
};

// fonction supprimer sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (Sauce.userId != req.auth.userId) {
                res.status(401).json({message: "Non autorisé !"});
            } else {
                const filename = sauce.imageUrl.split("/Images/")[1];
                fs.unlink(`Images/${filename}`, () => {
                    sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};

// fonction voir une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

// fonction voir ttes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

// fonction like/dislike sauce
exports.updateLikeDislikeSauce = (req, res, next) =>{
 
}
