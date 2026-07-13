require('dotenv').config();

// Defaults so the app still runs even without a .env file (handy for a fresh clone).
// A real .env will override these.
process.env.PORT = process.env.PORT || '5000';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pizzaapp';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'demo_secret_key_please_change';
process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@pizza.com';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedData = require('./utils/seed');

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pizza', require('./routes/pizza'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// simple health check
app.get('/', (req, res) => res.send('Pizza API is running'));

const PORT = process.env.PORT || 5000;

// connect to the database, seed starter data, then start the server
connectDB().then(async () => {
    await seedData();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
