const mongoose = require("mongoose");
const config = require("./config");

const startDatabase = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("📦 Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

const stopDatabase = async () => {
  await mongoose.disconnect();
  console.log("📦 Disconnected from MongoDB");
};

const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = { startDatabase, stopDatabase, isConnected };
