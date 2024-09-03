const path = require('path');
const fs = require('fs');

const config = {
    debug: true,
    local: true,
    logRequests: false
};

const PORT = process.env.PORT || 3000;
const APP_URL = config.local ? `http://localhost:${PORT}` : 'https://api.example.com';

const LOG_FILE_PATH = path.join(__dirname, 'debug.log');
const logMessage = (message) => {
    console.log(message);
    fs.appendFile(LOG_FILE_PATH, `${new Date().toISOString()} - ${message}\n`, (err) => {
        if (err) {
            console.error('Error writing to debug.log:', err);
        }
    });
};

module.exports = {
    config,
    APP_URL,
    PORT,
    logMessage
};
