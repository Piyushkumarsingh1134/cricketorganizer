import express from 'express';
import { PrismaClient } from "@prisma/client";
import { Organizer } from '@prisma/client';
import organizerRouter from './routes/OrganizerRoute';
const prisma = new PrismaClient();
const app = express(); 

app.use(express.json()); 

app.use("/api/v1/organizer", organizerRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
