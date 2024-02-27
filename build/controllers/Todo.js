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
exports.deleteTodo = exports.updateTodo = exports.getTodoById = exports.getAllTodos = exports.createTodo = void 0;
const Todo_1 = __importDefault(require("../models/Todo"));
const createTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const todo = new Todo_1.default({ title, description });
        yield todo.save();
        res.status(201).json(todo);
    }
    catch (error) {
        next(error);
    }
});
exports.createTodo = createTodo;
// Read All Todos
const getAllTodos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield Todo_1.default.find();
        res.json(todos);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllTodos = getAllTodos;
// Read Todo by ID
const getTodoById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield Todo_1.default.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(todo);
    }
    catch (error) {
        next(error);
    }
});
exports.getTodoById = getTodoById;
// Update Todo
const updateTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, completed } = req.body;
        const todo = yield Todo_1.default.findByIdAndUpdate(req.params.id, { title, description, completed }, { new: true });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(todo);
    }
    catch (error) {
        next(error);
    }
});
exports.updateTodo = updateTodo;
// Delete Todo
const deleteTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield Todo_1.default.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTodo = deleteTodo;
