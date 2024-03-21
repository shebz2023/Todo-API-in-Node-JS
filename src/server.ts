import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/logging';
import todoRoutes from './routes/Todo';
import authRoutes from './routes/auth'; 
import { authenticate } from './middleware/authenticate';
import cors from 'cors'  

const app = express();
// connect to mongo
mongoose
  .connect(config.mongo.url) 
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

//  CORS
app.use(cors())

// Health check route
app.get('/ping', (req, res) => res.status(200).json({ message: 'pong' }));

// Register routes
app.use('/auth', authRoutes);
app.use('/todos', authenticate, todoRoutes); 

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
