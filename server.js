const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const startImage = require('./routes/image');
const { logMessage, config, APP_URL, PORT } = require('./config');

if (config.local) {
    app.use(cors());
}

app.use(express.json());

app.use((req, res, next) => {
    if (config.debug) {
        logMessage(`Incoming Request: ${req.method} ${req.url} - Headers: ${JSON.stringify(req.headers)} - Body: ${JSON.stringify(req.body)}`);
    } else {
        logMessage(`Incoming Request: ${req.method} ${req.url}`);
    }
    next();
});

app.use('/image', startImage);
app.use(express.static(path.join(__dirname, 'www')));

app.get('/', async (req, res) => {
    const indexPath = path.join(__dirname, 'www/index.html');
    try {
        await fs.access(indexPath);
        logMessage('Serving index.html');
        res.sendFile(indexPath);
    } catch (err) {
        logMessage('index.html not found so here is a 404 woohoo');
        res.status(404).sendFile(path.join(__dirname, 'www/404.html'));
    }
});

app.use((req, res) => {
    logMessage(`Received request for ${req.url} but route not found`);
    res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
    logMessage(`Error occurred: ${err.message}`);
    res.status(500).json({ error: err.message });
});

const server = http.createServer(app);

server.listen(PORT, () => {
    logMessage(`Server started at ${APP_URL}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        logMessage(`Port ${PORT} is already in use. Please use a different port.`);
        process.exit(1);
    } else {
        logMessage(`Server error: ${err.message}`);
        throw err;
    }
});