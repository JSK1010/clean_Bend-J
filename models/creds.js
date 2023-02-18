const mongoose = require("mongoose");

const signSchema = new mongoose.Schema({
    admin: Boolean,
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    Author_Name: String,
    Author_Type: String,
    Institution: String,
    Address: String,
    Mobile: String,
    IEEE_No: String,
    Coauthors: String,
    Affiliation: String,
    Paper_Title: String,
    Domain: String,
    pdfid:String,
    Decision: Boolean,
    Warning: String,
    Waiting: String,             /* R-rejected G-Accepted O-Waiting_for_change B->changes made */
    Revision: String,  /* USED TILL NOW */
});


module.exports = mongoose.model("Cred_vit", signSchema);

