"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const OrganizerRoute_1 = __importDefault(require("./routes/OrganizerRoute"));
const cors_1 = __importDefault(require("cors"));
const TeamRoute_1 = __importDefault(require("./routes/TeamRoute"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/organizer", OrganizerRoute_1.default);
app.use("/api/v1/team", TeamRoute_1.default);
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
