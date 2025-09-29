const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Placeholder routes for future API endpoints (users, games, bets)
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.listen(port, () => console.log(`Backend listening on port ${port}`));
