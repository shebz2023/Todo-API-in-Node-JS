import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/logging';
import todoRoutes from './routes/Todo'; 

const app = express();

// Connect to MongoDB
mongoose
  .connect(config.mongo.url, { useNewUrlParser: true, useUnifiedTopology: true } as any)
  .then(() => {
    Logging.info('Connected to MongoDB');
    StartServer();
  })
  .catch((error) => {
    Logging.error('Unable to connect ');
    Logging.error(error);
  });


// Middleware to log requests
app.use((req, res, next) => {
  Logging.info(`Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
  res.on('finish', () => {
    Logging.info(`Outgoing -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
  });
  next();
});

// Parse incoming requests with JSON payloads
app.use(express.json());

// Additional middleware for CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Health check route
app.get('/ping', (req, res) => res.status(200).json({ message: 'pong' }));

// Register Todo routes with the '/todos' prefix
app.use('/todos', todoRoutes);

// Error handling middleware
app.use((req, res, next) => {
  const error = new Error('Not found');
  Logging.error(error);
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start the server
const StartServer = () => {
  http.createServer(app).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`));
};
