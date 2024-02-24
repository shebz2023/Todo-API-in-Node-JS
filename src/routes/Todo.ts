import express, { Request, Response } from 'express';
import Todo from '../models/Todo';
import Logging from '../library/logging'; 

const router = express.Router();

// Create aTodo
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const todo = new Todo({ title, description });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    Logging.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Read All Todos
router.get('/', async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    Logging.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Read Todo by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    Logging.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update Todo
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, description, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(req.params.id, { title, description, completed }, { new: true });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    Logging.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete Todo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    Logging.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
