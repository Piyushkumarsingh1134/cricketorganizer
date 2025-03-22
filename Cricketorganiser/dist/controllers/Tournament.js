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
exports.joinTournament = exports.getAllTournaments = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const getAllTournaments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Fetching open tournaments...");
    try {
        const openTournaments = yield prisma.tournament.findMany({
            where: { status: "open" },
        });
        return res.status(200).json(openTournaments);
    }
    catch (error) {
        console.error("Error fetching open tournaments:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllTournaments = getAllTournaments;
const joinTournament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const tournamentId = req.body.tournamentId; // Extract from body
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }
        if (!tournamentId) {
            return res.status(400).json({ error: "Tournament ID is required in request body" });
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        }
        catch (error) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }
        const { captainEmail } = decoded;
        const existingTeam = yield prisma.team.findUnique({
            where: { captainEmail },
        });
        if (!existingTeam) {
            return res.status(404).json({ error: "Team not found. Register first." });
        }
        const tournament = yield prisma.tournament.findUnique({
            where: { id: tournamentId },
        });
        if (!tournament) {
            return res.status(404).json({ error: "Tournament not found" });
        }
        if (tournament.status !== "open") {
            return res.status(400).json({ error: "Tournament is not open for joining" });
        }
        if (existingTeam.tournamentId) {
            return res.status(400).json({ error: "Team is already registered in a tournament" });
        }
        const updatedTeam = yield prisma.team.update({
            where: { id: existingTeam.id },
            data: { tournamentId },
        });
        return res.status(200).json({
            message: "Team successfully joined the tournament",
            team: updatedTeam,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.joinTournament = joinTournament;
