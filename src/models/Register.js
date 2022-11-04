const mongoose = require("mongoose");

module.exports = mongoose.model("striga_isimler", new mongoose.Schema({
    guild: String,
    user: String, 
    names: Array
}));