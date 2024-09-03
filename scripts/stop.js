const { exec } = require('child_process');

// exec('pkill -f "node.*"', (error, stdout, stderr) => {
exec('pkill -f server.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error stopping server: ${error.message}`);
        return;
    }

    if (stderr) {
        console.error(`Error output: ${stderr}`);
        return;
    }

    console.log(`Server stopped successfully: ${stdout}`);
});