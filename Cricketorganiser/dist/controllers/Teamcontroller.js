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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginTeam = exports.registerTeam = void 0;
const client_1 = require("@prisma/client");
const auth_1 = require("../utils/auth");
const prisma = new client_1.PrismaClient();
const registerTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, captainName, captainEmail, password } = req.body;
        if (!name || !captainName || !captainEmail || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const existingTeam = yield prisma.team.findUnique({
            where: { captainEmail },
        });
        if (existingTeam) {
            return res.status(400).json({ error: "Captain email is already registered with another team" });
        }
        const hashed = yield (0, auth_1.hashedPassword)(password);
        const newTeam = yield prisma.team.create({
            data: {
                name,
                captainName,
                captainEmail,
            },
        });
        const token = (0, auth_1.generateToken)({ id: newTeam.id, captainEmail: newTeam.captainEmail });
        return res.status(201).json({
            message: "Team registered successfully",
            team: newTeam,
            token,
        });
    }
    catch (error) {
        console.error("Team registration error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.registerTeam = registerTeam;
const loginTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { captainEmail } = req.body;
        if (!captainEmail) {
            return res.status(400).json({ error: "Email is required" });
        }
        const team = yield prisma.team.findUnique({
            where: { captainEmail },
        });
        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }
        const token = (0, auth_1.generateToken)({ id: team.id, captainEmail: team.captainEmail });
        return res.status(200).json({
            message: "Login successful",
            team: {
                id: team.id,
                name: team.name,
                captainName: team.captainName,
                captainEmail: team.captainEmail,
            },
            token,
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.loginTeam = loginTeam;
