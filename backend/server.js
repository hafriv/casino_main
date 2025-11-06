// server.js
import express from "express";
import pkg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к PostgreSQL
const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT,
});

// Проверяем соединение
pool.connect()
	.then(() => console.log("✅ Connected to PostgreSQL"))
	.catch(err => console.error("❌ DB Connection Error:", err));

// ----------- USERS -----------

// Получить всех пользователей
app.get("/api/users", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM users ORDER BY id");
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send("Error fetching users");
	}
});

// Добавить пользователя
app.post("/api/users", async (req, res) => {
	const { username, email, password_hash } = req.body;
	try {
		const result = await pool.query(
			"INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
			[username, email, password_hash]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send("Error creating user");
	}
});

// Обновить баланс пользователя
app.put("/api/users/:id/balance", async (req, res) => {
	const { id } = req.params;
	const { balance } = req.body;
	try {
		const result = await pool.query(
			"UPDATE users SET balance = $1 WHERE id = $2 RETURNING *",
			[balance, id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send("Error updating balance");
	}
});

// Удалить пользователя
app.delete("/api/users/:id", async (req, res) => {
	const { id } = req.params;
	try {
		await pool.query("DELETE FROM users WHERE id = $1", [id]);
		res.send("User deleted");
	} catch (err) {
		console.error(err);
		res.status(500).send("Error deleting user");
	}
});

// ----------- BETS -----------

// Получить все ставки
app.get("/api/bets", async (req, res) => {
	try {
		const result = await pool.query(`
      SELECT b.*, u.username, g.name AS game_name
      FROM bets b
      JOIN users u ON b.user_id = u.id
      JOIN games g ON b.game_id = g.id
      ORDER BY b.id DESC
    `);
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send("Error fetching bets");
	}
});

// Добавить ставку
app.post("/api/bets", async (req, res) => {
	const { user_id, game_id, amount, result, payout } = req.body;
	try {
		const q = `
      INSERT INTO bets (user_id, game_id, amount, result, payout)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
		const r = await pool.query(q, [user_id, game_id, amount, result, payout]);
		res.status(201).json(r.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send("Error creating bet");
	}
});

// ----------- TRANSACTIONS -----------

app.get("/api/transactions", async (req, res) => {
	try {
		const result = await pool.query(`
      SELECT t.*, u.username
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `);
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send("Error fetching transactions");
	}
});

app.post("/api/transactions", async (req, res) => {
	const { user_id, type, amount, status } = req.body;
	try {
		const result = await pool.query(
			`INSERT INTO transactions (user_id, type, amount, status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
			[user_id, type, amount, status]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send("Error creating transaction");
	}
});

// ----------- SERVER START -----------

const PORT = process.env.PORT || 5432;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

