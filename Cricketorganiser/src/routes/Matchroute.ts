import express from "express";
import { CreateMatch, openingplayer, setToss, updateScore } from "../controllers/Matchcontroller";


const matchrouter=express.Router();


matchrouter.post("/CreateMatch",CreateMatch );
matchrouter.post("/:matchId/setToss",setToss);
matchrouter.post("/:matchId/openingplayer",openingplayer);

matchrouter.post("/:matchId/updateScore", updateScore);


export default matchrouter;