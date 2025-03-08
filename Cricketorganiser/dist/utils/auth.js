"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashedPassword = hashedPassword;
exports.verifyPassword = verifyPassword;
exports.generateToken = generateToken;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = 'your_secret_key';
function hashedPassword(password) {
    return bcrypt_1.default.hash(password, 10);
}
function verifyPassword(password, hashedPassword) {
    return bcrypt_1.default.compare(password, hashedPassword);
}
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '1h' });
}
