const dotenv = require("dotenv");

dotenv.config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        
    console.log(process.env.MONGODB_URI.toString())
      mongoose.connect(process.env.MONGODB_URI.toString(), { useNewUrlParser: true});

        console.log(`Mongo DB connected ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDB