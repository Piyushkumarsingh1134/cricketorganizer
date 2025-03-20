import express from "express";
import { loginTeam, registerTeam } from "../controllers/Teamcontroller";


const  teamRoute=express.Router();
teamRoute.get("/", (req, res) => {
    res.send("team API is working!");
  });

teamRoute.post('/register',registerTeam);
teamRoute.post('/login',loginTeam );

export default teamRoute;
