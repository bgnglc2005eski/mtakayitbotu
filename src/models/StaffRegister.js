const mongoose = require("mongoose");

module.exports = mongoose.model("striga_kayıtlar", new mongoose.Schema({
    guild: String,
    user: String,
    man: Number,
    woman: Number,
    total: Number
}));