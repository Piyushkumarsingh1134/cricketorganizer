import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";




export const getAllTournaments = async (req: Request, res: Response): Promise<any> => {
  console.log("Fetching open tournaments...");
  
  try {
    const openTournaments = await prisma.tournament.findMany({
      where: { status: "open" }, 
    });

    return res.status(200).json(openTournaments);
  } catch (error) {
    console.error("Error fetching open tournaments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};




export const joinTournament = async (req: Request, res: Response):Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const tournamentId = req.body.tournamentId as string; // Extract from body

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    if (!tournamentId) {
      return res.status(400).json({ error: "Tournament ID is required in request body" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY) as { captainEmail: string };
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const { captainEmail } = decoded;

    const existingTeam = await prisma.team.findUnique({
      where: { captainEmail },
    });

    if (!existingTeam) {
      return res.status(404).json({ error: "Team not found. Register first." });
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    if (tournament.status !== "open") {
      return res.status(400).json({ error: "Tournament is not open for joining" });
    }

    if (existingTeam.tournamentId) {
      return res.status(400).json({ error: "Team is already registered in a tournament" });
    }

    const updatedTeam = await prisma.team.update({
      where: { id: existingTeam.id },
      data: { tournamentId },
    });

    return res.status(200).json({
      message: "Team successfully joined the tournament",
      team: updatedTeam,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


  