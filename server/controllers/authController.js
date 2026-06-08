const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "secret123";

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || username.length < 2) {
            return res.status(400).json({ error: "Некоректне ім'я" });
        }

        if (!email || !email.includes("@")) {
            return res.status(400).json({ error: "Некоректний email" });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ error: "Пароль мінімум 6 символів" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            [username, email, hashedPassword]
        );

        res.json({ message: "Реєстрація успішна" });

    } catch (err) {
        console.error("❌ REGISTER ERROR: ", err);

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Користувач вже існує" });
        }

        res.status(500).json({ error: "Помилка сервера" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [results] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (results.length === 0) {
            return res.status(400).json({ error: "Користувача не знайдено" });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ error: "Невірний пароль" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            SECRET,
            { expiresIn: "12h" }
        );

        res.json({ token });

    } catch (err) {
        console.error("❌ LOGIN ERROR: ", err);
        res.status(500).json({ error: "Помилка сервера" });
    }
}

module.exports = { register, login };