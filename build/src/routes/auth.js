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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const User_1 = __importDefault(require("../models/User"));
const joi_1 = __importDefault(require("joi"));
const router = express_1.default.Router();
// Validation schema for user registration
const registerSchema = joi_1.default.object({
    username: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
});
// Validation schema for user login
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { username, email, password } = req.body;
        // Check if user already exists
        let user = yield User_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create new user
        user = new User_1.default({
            username,
            email,
            password: hashedPassword,
        });
        yield user.save();
        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
            },
        };
        jsonwebtoken_1.default.sign(payload, config_1.config.jwtSecret, { expiresIn: '1h' }, (err, token) => {
            if (err)
                throw err;
            if (token) {
                res.json({ token });
            }
            else {
                throw new Error('Token generation failed');
            }
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { email, password } = req.body;
        // Check if user exists
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Compare passwords
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
            },
        };
        jsonwebtoken_1.default.sign(payload, config_1.config.jwtSecret, { expiresIn: '1h' }, (err, token) => {
            if (err)
                throw err;
            if (token) {
                res.json({ token });
            }
            else {
                throw new Error('Token generation failed');
            }
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}));
exports.default = router;
