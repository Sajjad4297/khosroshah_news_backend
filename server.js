// server.js
const app = require('./src/app');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

// Setup Prisma

// Connect to database
async function startServer() {
  try {
    //await prisma.$connect();

    const PORT = 5000 ;
    app.listen(PORT, () => {
    });
  } catch (err) {
    process.exit(1);
  }
}

startServer();
