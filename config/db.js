const dotenv = require("dotenv");

dotenv.config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        
    var a=process.env.MONGODB_URI.toString()
      mongoose.connect(a, { useNewUrlParser: true});

        //console.log(`Mongo DB connected ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDB