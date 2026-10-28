const express = require('express');
const { createClient } = require('redis');

const app = express();
app.use(express.json());

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.on('error', err => console.error('Redis Client Error', err));

app.post('/api/plates', async (req, res) => {
    const { plate } = req.body;
    if (!plate) return res.status(400).send('Plate is required');
    
    const entryTime = new Date().toISOString();
    const record = JSON.stringify({ plate, entryTime });
    
    await redisClient.lPush('parking_log', record);
    res.status(201).json({ message: 'Logged successfully', plate });
});

app.get('/api/plates', async (req, res) => {
    const logs = await redisClient.lRange('parking_log', 0, -1);
    const parsedLogs = logs.map(log => JSON.parse(log));
    res.json({ total: parsedLogs.length, cars: parsedLogs });
});

async function startServer() {
    await redisClient.connect();
    app.listen(3000, () => console.log('API Server running on port 3000'));
}
startServer();