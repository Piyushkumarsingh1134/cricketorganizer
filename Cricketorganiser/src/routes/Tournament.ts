import express from "express";
import { getAllTournaments, joinTournament } from "../controllers/Tournament";
const tournamentRoute = express.Router();

tournamentRoute.get("/", (req, res) => {
    res.send("team API is working!");
  })

tournamentRoute.get('/getAllTournaments',getAllTournaments);


tournamentRoute.post('/jointournament',joinTournament);


export default tournamentRoute;
