// server.js
const dotenv = require('dotenv');

// Load environment variables before loading any application modules
dotenv.config();

const app = require('./src/app');

function startServer() {
  try {
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || '0.0.0.0';

    app.listen(PORT, HOST, () => {
      console.log(`Server listening on ${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
