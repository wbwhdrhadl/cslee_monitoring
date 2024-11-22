const mongoose = require('mongoose');

const connectDB = async () => {
  const DB_URI = 'mongodb://localhost:27017/cslee_crawlingDB';

  try {
    await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
