const express = require('express');
// methode router d'express
const router = express.Router();
// appel des fichiers middleware
const auth = require('../Middleware/auth');
const multer = require('../Middleware/multer-config');
// on importe fichier controllers
const sauceCtrl = require("../Controllers/sauce");

// route get pour voir une ou ttes les sauces
router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
// route post pour créer des sauces
router.post('/', auth, multer, sauceCtrl.createSauce);
// route put modifier des sauces
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// route delete pour supprimer une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// route post des likes
router.post('/:id/like', auth, sauceCtrl.updateLikeDislikeSauce);

module.exports = router;