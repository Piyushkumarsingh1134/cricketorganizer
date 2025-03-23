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
exports.getTeams = exports.gettournament = exports.scheduleTournament = exports.loginOrganizer = exports.registerOrganizer = void 0;
const client_1 = require("@prisma/client");
const auth_1 = require("../utils/auth");
const prisma = new client_1.PrismaClient();
const registerOrganizer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        console.log(name);
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const existingUser = yield prisma.organizer.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered" });
        }
        const hashed = yield (0, auth_1.hashedPassword)(password);
        const newOrganizer = yield prisma.organizer.create({
            data: {
                name,
                email,
                password: hashed,
            },
        });
        const generate = (0, auth_1.generateToken)(newOrganizer);
        res.status(201).json({ message: "Organizer registered successfully", organizer: newOrganizer, generate });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.registerOrganizer = registerOrganizer;
const loginOrganizer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const organizer = yield prisma.organizer.findUnique({
            where: { email },
        });
        if (!organizer) {
            return res.status(404).json({ error: "Organizer not found" });
        }
        const isMatch = yield (0, auth_1.verifyPassword)(password, organizer.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = (0, auth_1.generateToken)({ id: organizer.id, email: organizer.email });
        res.status(200).json({ message: "Login successful", token });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.loginOrganizer = loginOrganizer;
const scheduleTournament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, startDate, endDate, description, entryFee, banner } = req.body;
        const organizerId = req.organizerId;
        console.log("Organizer ID inside scheduleTournament:", organizerId);
        const tournament = yield prisma.tournament.create({
            data: {
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                description,
                entryFee: entryFee ? parseInt(entryFee, 10) : null,
                organizerId,
                banner: banner || null
            }
        });
        res.status(201).json(tournament);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to schedule tournament", error });
    }
});
exports.scheduleTournament = scheduleTournament;
const gettournament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizerId = req.organizerId;
        const tournament = yield prisma.tournament.findMany({
            where: { organizerId }
        });
        res.json(tournament);
    }
    catch (error) {
        console.error("Error fetching tournaments:", error);
        res.status(500).json({ error: "No tournament organise" });
    }
});
exports.gettournament = gettournament;
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizerId = req.organizerId;
        console.log("Inside the team", organizerId);
        const tournaments = yield prisma.tournament.findMany({
            where: { organizerId },
            select: {
                id: true,
                teams: {
                    select: {
                        id: true,
                        name: true,
                        captainName: true,
                        captainEmail: true,
                    },
                },
            },
        });
        if (tournaments.length === 0) {
            return res.status(404).json({
                message: "No tournaments found for this organizer",
                teams: [],
            });
        }
        // Collect all teams from the tournaments
        const teams = tournaments.flatMap((tournament) => tournament.teams);
        res.status(200).json({ teams });
    }
    catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({ error: "Failed to fetch teams" });
    }
});
exports.getTeams = getTeams;
