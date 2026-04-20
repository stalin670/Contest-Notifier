const mongoose = require("mongoose");

const ContestSchema = new mongoose.Schema(
    {
        contestId: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true },
        platform: { type: String, required: true, index: true },
        solutionLink: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Contest", ContestSchema);
