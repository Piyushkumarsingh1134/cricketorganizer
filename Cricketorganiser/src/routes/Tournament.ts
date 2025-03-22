import express from "express";
import { getAllTournaments } from "../controllers/Tournament";
const tournamentRoute = express.Router();

tournamentRoute.get("/", (req, res) => {
    res.send("team API is working!");
  })

tournamentRoute.get('/getAllTournaments',getAllTournaments);


export default tournamentRoute;
