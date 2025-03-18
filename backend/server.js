const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});