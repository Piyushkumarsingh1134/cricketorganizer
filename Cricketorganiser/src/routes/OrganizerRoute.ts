import express from "express";
import { gettournament, loginOrganizer, registerOrganizer, scheduleTournament } from "../controllers/Organizercontroller";
import getOrganizerId from "../middleware/Organizermiddleware";

const organizerRouter = express.Router();

organizerRouter.get("/", (req, res) => {
  res.send("Organizer API is working!");
});

organizerRouter.post('/Register',registerOrganizer);
organizerRouter.post('/login',loginOrganizer);


organizerRouter.post('/tournament',getOrganizerId,scheduleTournament);


organizerRouter.get('/organisetournament',getOrganizerId,gettournament);

export default organizerRouter;
