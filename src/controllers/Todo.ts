import { Request, Response, NextFunction } from 'express';
import Todo from '../models/Todo';

// Create Todo
export const createTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;
    const todo = new Todo({ title, description });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

// Read All Todos
export const getAllTodos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

// Read Todo by ID
export const getTodoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    next(error);
  }
};

// Update Todo
export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(req.params.id, { title, description, completed }, { new: true });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    next(error);
  }
};

// Delete Todo
export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    next(error);
  }
};
