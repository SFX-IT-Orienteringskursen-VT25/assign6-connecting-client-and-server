const express = require('express');
const cors = require('cors');
const numbersRouter = require('./routes/numbers');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration - Allow requests from client
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api', numbersRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
});

module.exports = app;