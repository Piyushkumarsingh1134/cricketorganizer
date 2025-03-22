import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();


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

  