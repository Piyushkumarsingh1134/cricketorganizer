"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Teamcontroller_1 = require("../controllers/Teamcontroller");
const teamRoute = express_1.default.Router();
teamRoute.get("/", (req, res) => {
    res.send("team API is working!");
});
teamRoute.post('/register', Teamcontroller_1.registerTeam);
teamRoute.post('/login', Teamcontroller_1.loginTeam);
exports.default = teamRoute;
