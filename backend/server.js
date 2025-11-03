const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Lightweight CORS middleware so frontend dev server (or other origins)
// can call the backend if a proxy is not used. This avoids adding an external
// dependency and keeps the backend permissive for development.
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
		return res.sendStatus(200);
	}
	next();
});

// Placeholder routes for future API endpoints (users, games, bets)
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.listen(port, () => console.log(`Backend listening on port ${port}`));
