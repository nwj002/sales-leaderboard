require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDatabase = require("./database/database");

const app = express();

connectDatabase();

app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/leaderboard"));

app.get("/", (req, res) => {
    res.send("Sales Leaderboard API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
