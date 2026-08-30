const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const ATLAS_URI = 'mongodb+srv://dineshkumarsara07_db_user:Dinesh123@m0.wfhya0n.mongodb.net/it-leave-portal?retryWrites=true&w=majority&appName=M0';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || ATLAS_URI;
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
