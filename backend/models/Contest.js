const mongoose = require("mongoose");

const ContestSchema = new mongoose.Schema({
    contestId: { type: String, required: true, unique: true },
    name: String,
    platform: String,
    solutionLink: String,
});

const Contest = mongoose.model("Contest", ContestSchema);

module.exports = Contest;
