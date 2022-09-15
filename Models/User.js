const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// modèle creation user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// plugin qui s'assure une adresse mail unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);