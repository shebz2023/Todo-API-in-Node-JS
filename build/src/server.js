"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const logging_1 = __importDefault(require("./library/logging"));
const Todo_1 = __importDefault(require("./routes/Todo"));
const auth_1 = __importDefault(require("./routes/auth"));
const authenticate_1 = require("./middleware/authenticate");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// connect to mongo
mongoose_1.default
    .connect(config_1.config.mongo.url)
    .then(() => {
    logging_1.default.info('Connected to MongoDB');
    StartServer();
})
    .catch((error) => {
    logging_1.default.error('Unable to connect ');
    logging_1.default.error(error);
});
// Middleware to log requests
app.use((req, res, next) => {
    logging_1.default.info(`Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging_1.default.info(`Outgoing -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
    });
    next();
});
// Parse incoming requests with JSON payloads
app.use(express_1.default.json());
//  CORS
app.use((0, cors_1.default)());
// Health check route
app.get('/ping', (req, res) => res.status(200).json({ message: 'pong' }));
// Register routes
app.use('/auth', auth_1.default);
app.use('/todos', authenticate_1.authenticate, Todo_1.default);
// Error handling middleware
app.use((req, res, next) => {
    const error = new Error('Not found');
    logging_1.default.error(error);
    res.status(404).json({ message: 'Endpoint not found' });
});
// Start the server
const StartServer = () => {
    http_1.default.createServer(app).listen(config_1.config.server.port, () => logging_1.default.info(`Server is running on port ${config_1.config.server.port}`));
};
