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
exports.updateScore = exports.openingplayer = exports.setToss = exports.CreateMatch = void 0;
const uuid_1 = require("uuid");
const redisclient_1 = __importDefault(require("../utils/redisclient"));
const CreateMatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("inside create match");
        const { teamA, teamB, overs } = req.body;
        const matchId = (0, uuid_1.v4)();
        const match = {
            id: matchId,
            teamA,
            teamB,
            overs,
            toss: null,
            striker: null,
            nonStriker: null,
            bowler: null,
            balls: [],
            totalRuns: 0,
            totalWickets: 0,
            createdAt: new Date().toISOString(),
        };
        yield redisclient_1.default.set(`match:${matchId}`, JSON.stringify(match), {
            EX: 60 * 60 * 12, // 6 hours
        });
        res.status(201).json({ matchId });
    }
    catch (error) {
        console.error("Error in CreateMatch:", error);
        res.status(500).json({ error: "Failed to create match" });
    }
});
exports.CreateMatch = CreateMatch;
const setToss = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { matchId } = req.params;
    const { winner, decision } = req.body;
    const data = yield redisclient_1.default.get(`match:${matchId}`);
    if (!data)
        return res.status(404).json({ error: "Match not found" });
    const match = JSON.parse(data);
    match.toss = { winner, decision };
    yield redisclient_1.default.set(`match:${matchId}`, JSON.stringify(match));
    res.json({ message: "Toss updated", toss: match.toss });
});
exports.setToss = setToss;
const openingplayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { matchId } = req.params;
        const { striker, nonStriker, bowler } = req.body;
        const data = yield redisclient_1.default.get(`match:${matchId}`);
        if (!data)
            return res.status(404).json({ error: "Match not found" });
        const match = JSON.parse(data);
        match.striker = {
            name: striker,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
        };
        match.nonStriker = {
            name: nonStriker,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
        };
        match.bowler = {
            name: bowler,
            overs: 0,
            balls: 0,
            runsGiven: 0,
            wickets: 0,
        };
        yield redisclient_1.default.set(`match:${matchId}`, JSON.stringify(match));
        res.json({ message: "Opening players set", match });
    }
    catch (error) {
        console.error(error);
    }
});
exports.openingplayer = openingplayer;
// adjust path as per your project
const updateScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { matchId } = req.params;
        const { runs, isWicket = false } = req.body;
        console.log("⚡️ Entered updateScore for match:", matchId);
        const data = yield redisclient_1.default.get(`match:${matchId}`);
        if (!data) {
            console.warn("🚫 Match not found in Redis:", matchId);
            return res.status(404).json({ error: "Match not found" });
        }
        const match = JSON.parse(data);
        if (!match.striker || !match.bowler || !match.nonStriker) {
            console.warn("⚠️ Players not set properly in match:", matchId);
            return res.status(400).json({ error: "Players not set" });
        }
        // 🏏 Update striker
        match.striker.runs += runs;
        match.striker.balls += 1;
        if (runs === 4)
            match.striker.fours += 1;
        if (runs === 6)
            match.striker.sixes += 1;
        // 🏏 Update bowler
        match.bowler.balls += 1;
        match.bowler.runsGiven += runs;
        if (isWicket) {
            match.totalWickets += 1;
            match.bowler.wickets += 1;
        }
        match.totalRuns += runs;
        // 📜 Add ball history
        match.balls.push({
            batsman: match.striker.name,
            bowler: match.bowler.name,
            runs,
            isWicket,
            over: Math.floor(match.balls.length / 6),
            ball: (match.balls.length % 6) + 1,
            timestamp: new Date().toISOString(),
        });
        // 🔁 Swap strike on odd runs
        if (runs % 2 === 1) {
            [match.striker, match.nonStriker] = [match.nonStriker, match.striker];
        }
        // ⏱️ Handle end of over
        if (match.bowler.balls === 6) {
            match.bowler.overs += 1;
            match.bowler.balls = 0;
            [match.striker, match.nonStriker] = [match.nonStriker, match.striker];
            match.previousBowler = match.bowler.name;
            match.bowler = null;
            yield redisclient_1.default.set(`match:${matchId}`, JSON.stringify(match));
            return res.json({
                message: "Over completed. Please select a new bowler.",
                match,
                requireNewBowler: true
            });
        }
        yield redisclient_1.default.set(`match:${matchId}`, JSON.stringify(match));
        res.json({ message: "Score updated", match });
    }
    catch (error) {
        console.error("❌ Error in updateScore:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateScore = updateScore;
