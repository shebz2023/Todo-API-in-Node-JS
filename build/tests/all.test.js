"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../src/config/config");
const Todo_1 = __importDefault(require("../src/routes/Todo"));
const auth_1 = __importDefault(require("../src/routes/auth"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
app.use('/todos', Todo_1.default);
let token;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(config_1.config.mongo.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const loginRes = yield (0, supertest_1.default)(app)
        .post('/auth/login')
        .send({
        email: 'user@gmail.com',
        password: 'shebz@123',
    });
    token = loginRes.body.token;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
describe('Authentication Endpoints', () => {
    it('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/auth/register')
            .send({
            username: 'shebz',
            email: 'user@gmail.com',
            password: 'shebz@123',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    }));
    it('should log in an existing user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/auth/login')
            .send({
            email: 'user@gmail.com',
            password: 'shebz@123',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    }));
});
describe('Todo Endpoints', () => {
    it('should create a new todo', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send({
            title: 'Test Todo',
            description: 'This is a test todo',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
    }));
    it('should fetch all todos', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/todos')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    }));
    it('should fetch all ', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(404);
    }));
});
app.listen(config_1.config.server.port, () => {
    console.log(`Test server is running on port ${config_1.config.server.port}`);
});
