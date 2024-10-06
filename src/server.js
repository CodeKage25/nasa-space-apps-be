require('dotenv').config();
const http = require('http');

const app = require('./app');

const { mongoConnect } = require('./services/mongo');

const PORT_SERVER = process.env.PORT_SERVER || 8000;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
  
  
    server.listen(PORT_SERVER, () => {
      console.log(`Server listening on port ${PORT_SERVER}...`);
    });
  }
  
  startServer();