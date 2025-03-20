import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { generateToken, hashedPassword } from "../utils/auth";

const prisma = new PrismaClient();


interface RegisterTeamRequest {
  name: string;
  captainName: string;
  captainEmail: string;
  password: string;
  tournamentId: string;
}

export const registerTeam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, captainName, captainEmail, password } = req.body as RegisterTeamRequest;

    if (!name || !captainName || !captainEmail || !password ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    
    const existingTeam = await prisma.team.findUnique({
      where: { captainEmail },
    });

    if (existingTeam) {
      return res.status(400).json({ error: "Captain email is already registered with another team" });
    }

 
    const hashed = await hashedPassword(password);

 
    const newTeam = await prisma.team.create({
      data: {
        name,
        captainName,
        captainEmail,
       

      },
    });

    
    const token = generateToken({ id: newTeam.id, captainEmail: newTeam.captainEmail });

    return res.status(201).json({
      message: "Team registered successfully",
      team: newTeam,
      token,
    });

  } catch (error) {
    console.error("Team registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};




export const loginTeam = async (req: Request, res: Response):Promise<any> => {
  try {
    const { captainEmail } = req.body as any;

    if (!captainEmail) {
      return res.status(400).json({ error: "Email is required" });
    }

    const team = await prisma.team.findUnique({
      where: { captainEmail },
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const token = generateToken({ id: team.id, captainEmail: team.captainEmail });

    return res.status(200).json({
      message: "Login successful",
      team: {
        id: team.id,
        name: team.name,
        captainName: team.captainName,
        captainEmail: team.captainEmail,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
