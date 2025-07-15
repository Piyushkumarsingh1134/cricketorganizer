"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Matchcontroller_1 = require("../controllers/Matchcontroller");
const matchrouter = express_1.default.Router();
matchrouter.post("/CreateMatch", Matchcontroller_1.CreateMatch);
matchrouter.post("/:matchId/setToss", Matchcontroller_1.setToss);
matchrouter.post("/:matchId/openingplayer", Matchcontroller_1.openingplayer);
matchrouter.post("/:matchId/updateScore", Matchcontroller_1.updateScore);
exports.default = matchrouter;
