const express = require('express');
const router = express.Router();

const auth = require('../Middleware/auth');
const multer = require('../Middleware/multer-config');

const sauceCtrl = require("../Controllers/route");

// route get des sauces
router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
// route post des sauces
router.post('/', auth, multer, sauceCtrl.createSauce);
// route put des sauces
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// route post des likes
//router.post('/:id/like', auth,sauceCtrl.updateLikeDislike);

module.exports = router;