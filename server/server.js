const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.static(path.join(__dirname, "../client")));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

const datasetRoutes = require("./routes/dataset.routes");
app.use("/api", datasetRoutes);

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
})