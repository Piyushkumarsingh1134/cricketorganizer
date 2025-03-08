"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "your_secret_key";
const getOrganizerId = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(401).json({ error: "Unauthorized: No token provided" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
            res.status(401).json({ error: "Unauthorized: Invalid token" });
            return;
        }
        req.organizerId = decoded.id;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Unauthorized: Invalid token" });
        return;
    }
};
exports.default = getOrganizerId;
