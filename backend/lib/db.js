const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
    mongoose.connection.on("error", (err) => console.error("[mongo] error:", err.message));
    mongoose.connection.on("disconnected", () => console.warn("[mongo] disconnected"));

    await mongoose.connect(env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("[mongo] connected");
};

module.exports = connectDB;
