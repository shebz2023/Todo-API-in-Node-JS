import express, { Request, Response, NextFunction } from 'express';
import Todo from '../models/Todo';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        next(error); 
    }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description } = req.body;
        const todo = new Todo({
            title,
            description,
        });
        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        next(error); 
    }
});

export default router;
