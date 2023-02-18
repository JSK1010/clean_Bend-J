const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({

    SES: { type: Number },
    NGWCT: { type: Number },
    AWN: { type: Number },
    SARF: { type: Number },
    SIP: { type: Number },
    ACISS: { type: Number },
    WIE: { type: Number }
});


module.exports = mongoose.model("Tracks", trackSchema);