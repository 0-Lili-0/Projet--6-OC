const mongoose = require("mongoose");


const sauceSchema = mongoose.Schema({
    userId : { type: String, require: true },
    name : { type: String, require: true },
    manufacturer : { type: String, require: true },
    description : { type: String, require: true },
    mainPepper : { type: String, require: true },
    imageUrl : { type: String, require: true },
    heat : { type: Number, require: true },
    likes : { type: Number, default: 0, require: true },
    dislike : { type: Number, default: 0, require: true },
    userLiked : { type: [String], require: true, default: [] },
    userDisliked : { type: [String], require: true, default: [] },
})

module.exports = mongoose.model("sauce", sauceSchema)