import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { config } from '../src/config/config';
import todoRoutes from '../src/routes/Todo';
import authRoutes from '../src/routes/auth';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

let token: string;

beforeAll(async () => {
  await mongoose.connect(config.mongo.url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);

  const loginRes = await request(app)
    .post('/auth/login')
    .send({
      email: 'user@gmail.com',
      password: 'shebz@123',
    });
  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Authentication Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'shebz',
        email: 'user@gmail.com',
        password: 'shebz@123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should log in an existing user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'user@gmail.com',
        password: 'shebz@123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('Todo Endpoints', () => {
  it('should create a new todo', async () => {
    const res = await request(app)
      .post('/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Todo',
        description: 'This is a test todo',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should fetch all todos', async () => {
    const res = await request(app)
      .get('/todos')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should fetch all ', async () => {
    const res = await request(app)
      .get('/')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(404); 
  });
});

app.listen(config.server.port, () => {
  console.log(`Test server is running on port ${config.server.port}`);
});
