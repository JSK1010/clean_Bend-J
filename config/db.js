const dotenv = require("dotenv");

dotenv.config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        
    const a=process.env.MONGODB_URI.toString()
       await mongoose.connect("mongodb+srv://Jayasrikrishna:SRIjanaki1@cluster0.fz7ntml.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true});
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDB