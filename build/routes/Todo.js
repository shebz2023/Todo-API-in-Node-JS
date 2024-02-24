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
const express_1 = __importDefault(require("express"));
const Todo_1 = __importDefault(require("../models/Todo"));
const logging_1 = __importDefault(require("../library/logging"));
const router = express_1.default.Router();
// Create Todo
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const todo = new Todo_1.default({ title, description });
        yield todo.save();
        res.status(201).json(todo);
    }
    catch (error) {
        logging_1.default.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}));
// Read All Todos
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield Todo_1.default.find();
        res.json(todos);
    }
    catch (error) {
        logging_1.default.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}));
// Read Todo by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield Todo_1.default.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(todo);
    }
    catch (error) {
        logging_1.default.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}));
// Update Todo
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, completed } = req.body;
        const todo = yield Todo_1.default.findByIdAndUpdate(req.params.id, { title, description, completed }, { new: true });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(todo);
    }
    catch (error) {
        logging_1.default.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}));
// Delete Todo
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield Todo_1.default.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully' });
    }
    catch (error) {
        logging_1.default.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}));
exports.default = router;
