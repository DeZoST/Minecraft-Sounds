import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
const port = 3000;

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET"],
    })
);

const db = new sqlite3.Database("./data/sounds.db");

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/sounds", (req, res) => {
    const { page = 1, limit = 6, search = "" } = req.query;
    const offset = (page - 1) * limit;
    const searchQuery = search ? "WHERE name LIKE ? OR tags LIKE ?" : "";

    db.all(
        `SELECT * FROM sounds ${searchQuery} LIMIT ? OFFSET ?`,
        search
            ? [`%${search}%`, `%${search}%`, limit, offset]
            : [limit, offset],
        (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
        }
    );
});

app.use("/audio", express.static("sounds"));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});