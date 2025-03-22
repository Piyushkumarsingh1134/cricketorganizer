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
exports.getAllTournaments = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllTournaments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Fetching tournaments...");
    console.log("Request Method:", req.method);
    console.log("Request Body:", req.body); // Should be empty for GET request
    try {
        const tournaments = yield prisma.tournament.findMany();
        return res.status(200).json(tournaments);
    }
    catch (error) {
        console.error("Error fetching tournaments:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllTournaments = getAllTournaments;
