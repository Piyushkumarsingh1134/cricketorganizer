"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Organizercontroller_1 = require("../controllers/Organizercontroller");
const Organizermiddleware_1 = __importDefault(require("../middleware/Organizermiddleware"));
const organizerRouter = express_1.default.Router();
organizerRouter.get("/", (req, res) => {
    res.send("Organizer API is working!");
});
organizerRouter.post('/Register', Organizercontroller_1.registerOrganizer);
organizerRouter.post('/login', Organizercontroller_1.loginOrganizer);
organizerRouter.post('/tournament', Organizermiddleware_1.default, Organizercontroller_1.scheduleTournament);
exports.default = organizerRouter;
