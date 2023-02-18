const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
    name:{type: String},
    count:{type: Number}
    
    });
    
    
    module.exports = mongoose.model("Tracks",trackSchema);