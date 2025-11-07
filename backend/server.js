
import express from "express";
import pkg from "pg";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const wsModule = require("ws");
console.log("WS module exports:", Object.keys(wsModule));
const { WebSocketServer } = wsModule;

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

const activeUsers = new Map();

// Подключение к ПОСГРЕ С
const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT,
});

async function initDatabase() {
	try {
		const client = await pool.connect();
		client.release();
		console.log("Connected");
	} catch (err) {
		console.error("Database Error:", err.message);
		console.log("Server will start without database. Please check PostgreSQL connection.");
	}
}

initDatabase();


wss.on('connection', (ws, req) => {
	const url = new URL(req.url, `http://${req.headers.host}`);
	const userId = url.searchParams.get('userId');

	if (userId) {
		activeUsers.set(userId, ws);
		broadcastPlayerCount();
		console.log(` User ${userId} connected. Total online: ${activeUsers.size}`);
	}

	ws.on('close', () => {
		if (userId) {
			activeUsers.delete(userId);
			pool.query("DELETE FROM sessions WHERE user_id = $1", [userId]).catch(err => console.error(err));
			broadcastPlayerCount();
			console.log(` User ${userId} disconnected. Total online: ${activeUsers.size}`);
		}
	});

	ws.on('error', (err) => {
		console.error('WebSocket error:', err);
	});
});

function broadcastPlayerCount() {
	const count = activeUsers.size;
	const message = JSON.stringify({ type: 'playerCount', count });
	wss.clients.forEach((client) => {
		if (client.readyState === 1) {
			client.send(message);
		}
	});
}

function broadcastBalanceUpdate(userId, newBalance) {
	const message = JSON.stringify({ type: 'balanceUpdate', userId, balance: newBalance });
	wss.clients.forEach((client) => {
		if (client.readyState === 1) {
			client.send(message);
		}
	});
}


app.get("/health", (req, res) => {
	res.json({ status: "ok", timestamp: new Date().toISOString() });
});

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
	
	if (!username || !email || !password_hash) {
		return res.status(400).json({ message: "Username, email, and password are required" });
	}

	try {
		const result = await pool.query(
			"INSERT INTO users (username, email, password_hash, balance) VALUES ($1, $2, $3, $4) RETURNING *",
			[username, email, password_hash, 50]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error(err);
		if (err.code === '23505') {
			const constraint = err.constraint;
			if (constraint === 'users_username_key') {
				return res.status(400).json({ message: "Username already taken" });
			} else if (constraint === 'users_email_key') {
				return res.status(400).json({ message: "Email already registered" });
			}
		}
		res.status(500).json({ message: "Error creating user" });
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
		broadcastBalanceUpdate(id, balance);
		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send("Error updating balance");
	}
});

// Получить баланс пользователя
app.get("/api/users/:id/balance", async (req, res) => {
	const { id } = req.params;
	try {
		const result = await pool.query(
			"SELECT id, username, balance FROM users WHERE id = $1",
			[id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send("Error fetching balance");
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


// Получить количество онлайн игроков
app.get("/api/players/online", async (req, res) => {
	try {
		const count = activeUsers.size;
		res.json({ count });
	} catch (err) {
		console.error(err);
		res.status(500).send("Error fetching online players");
	}
});


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
	const { user_id, game_id, amount, result, payout, winning_number } = req.body;
	try {
		const q = `
      INSERT INTO bets (user_id, game_id, amount, result, payout, winning_number)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
		const r = await pool.query(q, [user_id, game_id, amount, result, payout, winning_number]);
		res.status(201).json(r.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send("Error creating bet");
	}
});

// Получить статистику пользователя
app.get("/api/users/:id/stats", async (req, res) => {
	const { id } = req.params;
	try {
		const bets = await pool.query(`
			SELECT 
				SUM(CASE WHEN result = 'win' THEN payout ELSE -amount END) AS profit,
				COUNT(*) AS total_bets,
				SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) AS wins,
				SUM(CASE WHEN result = 'lose' THEN 1 ELSE 0 END) AS losses
			FROM bets
			WHERE user_id = $1
		`, [id]);
		res.json(bets.rows[0] || { profit: 0, total_bets: 0, wins: 0, losses: 0 });
	} catch (err) {
		console.error(err);
		res.status(500).send("Error fetching stats");
	}
});


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


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`\n${'='.repeat(50)}`);
	console.log(`Server running on http://localhost:${PORT}`);
	console.log(`WebSocket available at ws://localhost:${PORT}`);
	console.log(`Health check: http://localhost:${PORT}/health`);
	console.log(`${'='.repeat(50)}\n`);
});
