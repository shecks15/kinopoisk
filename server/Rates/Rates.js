const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rateSchema = new mongoose.Schema({
    rate: Number,
    text: String,
    filmId: {type: Schema.Types.ObjectId , ref: "film"},
    authorId: {type: Schema.Types.ObjectId , ref: "user"},
    timestamps: {type: Date, default: Date.now} 
})

module.exports = mongoose.model("rate", rateSchema)