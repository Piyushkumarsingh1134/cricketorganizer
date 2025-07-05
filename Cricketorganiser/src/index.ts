import express from 'express';
import { PrismaClient } from "@prisma/client";
import { Organizer } from '@prisma/client';
import organizerRouter from './routes/OrganizerRoute';
import cors from "cors";
import teamRoute from './routes/TeamRoute';

import tournamentRoute from './routes/Tournament';
import matchrouter from './routes/Matchroute';
const prisma = new PrismaClient();
const app = express(); 

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});
app.use(cors());
app.use("/api/v1/organizer", organizerRouter);


app.use("/api/v1/team",teamRoute);


app.use("/api/v1/tournament", tournamentRoute);

app.use("/api/v1/match", matchrouter);


app.listen(3000, () => {
  console.log("Server running on port 3000");
});


