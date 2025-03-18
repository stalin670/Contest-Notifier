const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contestRoutes = require("./routes/contest.route.js");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({ data: "Api is running successfully" });
});

app.use("/api/contests", contestRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});