import express from "express";
import { getTeams, gettournament, loginOrganizer, registerOrganizer, scheduleTournament } from "../controllers/Organizercontroller";
import  { authMiddleware } from "../middleware/Organizermiddleware";

const organizerRouter = express.Router();

organizerRouter.get("/", (req, res) => {
  res.send("Organizer API is working!");
});

organizerRouter.post('/Register',registerOrganizer);
organizerRouter.post('/login',loginOrganizer);


organizerRouter.post('/tournament',authMiddleware,scheduleTournament);


organizerRouter.get('/organisetournament',authMiddleware,gettournament);



organizerRouter.get('/teams/details',authMiddleware , getTeams);


export default organizerRouter;
