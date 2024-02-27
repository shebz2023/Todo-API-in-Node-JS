import request from 'supertest';
import express from 'express';
import { config } from '../src/config/config';
import todoRoutes from '../src/routes/Todo';
import authRoutes from '../src/routes/auth';

const app = express();

// Middleware and routes setup
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

describe('Authentication Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should log in an existing user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('Todo Endpoints', () => {
  let token: string;

  beforeAll(async () => {
    // Login to obtain token for authenticated requests
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    token = loginRes.body.token;
  });

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

  // Add more test cases for other Todo endpoints (update, delete, etc.)
});

// Start the server for testing
app.listen(config.server.port, () => {
  console.log(`Test server is running on port ${config.server.port}`);
});

