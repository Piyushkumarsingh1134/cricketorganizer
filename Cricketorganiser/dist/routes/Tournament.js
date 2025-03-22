"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Tournament_1 = require("../controllers/Tournament");
const tournamentRoute = express_1.default.Router();
tournamentRoute.get("/", (req, res) => {
    res.send("team API is working!");
});
tournamentRoute.get('/getAllTournaments', Tournament_1.getAllTournaments);
exports.default = tournamentRoute;
