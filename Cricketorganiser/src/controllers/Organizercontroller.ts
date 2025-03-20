import { PrismaClient } from "@prisma/client";

import { Request, Response } from "express";
import { generateToken, hashedPassword, verifyPassword } from "../utils/auth";
import { promises } from "dns";

const prisma = new PrismaClient();

export const registerOrganizer = async (req: Request, res: Response):Promise<any> => {
    try {
        const { name, email, password } = req.body as any;
                console.log(name);
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await prisma.organizer.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered" });
        }

      
        const hashed= await hashedPassword(password);

        
        const newOrganizer = await prisma.organizer.create({
            data: {
                name,
                email,
                password: hashed,
            },
        });
       const generate=generateToken(newOrganizer);
        res.status(201).json({ message: "Organizer registered successfully", organizer: newOrganizer ,generate});
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const loginOrganizer = async (req: Request, res: Response):Promise<any> => {
    try {
        const { email, password } = req.body as any;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const organizer = await prisma.organizer.findUnique({
            where: { email },
        });

        if (!organizer) {
            return res.status(404).json({ error: "Organizer not found" });
        }

        const isMatch = await verifyPassword(password, organizer.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = generateToken({ id: organizer.id, email: organizer.email });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const scheduleTournament = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, startDate, endDate, description, entryFee, banner } = req.body as any;
        const organizerId = (req as any).organizerId;

        console.log(organizerId);

        const tournament = await prisma.tournament.create({
            data: {
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                description,
                entryFee,
                organizerId,
                banner:banner || null
            }
        });

        res.status(201).json(tournament);
    } catch (error) {
        res.status(500).json({ message: "Failed to schedule tournament", error });
    }
};


export const gettournament = async (req: Request, res: Response): Promise<any> => {
    try {
        const organizerId = (req as any).organizerId;

        const tournament = await prisma.tournament.findMany({
            where: { organizerId }
        });

        res.json(tournament);
    } catch (error) {
        console.error("Error fetching tournaments:", error);
        res.status(500).json({ error: "No tournament organise" });
    }
};


