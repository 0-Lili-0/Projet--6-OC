// package multer gere les fichier entrant
const multer = require("multer");
// creation objet pour le type d'image possible
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
// contient la logique pour dire à multer ou enregistrer les images
const storage = multer.diskStorage({
  // indique d'enregistrer dans le dossier Images
  destination: (req, file, callback) => {
    callback(null, 'Images');
  },
  // indique utiliser nom origine avec les espaces remplacer par underscore et le moment precis de l'enregistrement
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');