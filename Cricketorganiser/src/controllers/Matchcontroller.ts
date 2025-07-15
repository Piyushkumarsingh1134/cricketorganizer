import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redisclient';

export const CreateMatch = async (req: Request, res: Response) => {
    
  try {
    console.log("inside create match");
    const { teamA, teamB, overs } = req.body as any;


    

    const matchId = uuidv4();

    const match = {
      id: matchId,
      teamA,
      teamB,
      overs,
      toss: null,
      striker: null,
      nonStriker: null,
      bowler: null,
      balls: [],
      totalRuns: 0,
      totalWickets: 0,
      createdAt: new Date().toISOString(),
    };

    await redisClient.set(`match:${matchId}`, JSON.stringify(match), {
      EX: 60 * 60 * 12, // 6 hours
    });

    res.status(201).json({ matchId });
  } catch (error) {
    console.error("Error in CreateMatch:", error);
    res.status(500).json({ error: "Failed to create match" });
  }
};




export const setToss = async (req: Request, res: Response):Promise<any> => {
  const { matchId } = req.params;
  const { winner, decision } = req.body;

  const data = await redisClient.get(`match:${matchId}`);
  if (!data) return res.status(404).json({ error: "Match not found" });

  const  match= JSON.parse(data);
  match.toss = { winner, decision };

  await redisClient.set(`match:${matchId}`, JSON.stringify(match));
  res.json({ message: "Toss updated", toss: match.toss });
};

export const  openingplayer=async(req:Request,res:Response):Promise<any>=>{
    try {
        const { matchId } = req.params;
        const { striker, nonStriker, bowler } = req.body as any;
        const data = await redisClient.get(`match:${matchId}`);
         if (!data) return res.status(404).json({ error: "Match not found" });
          const match = JSON.parse(data);

  match.striker = {
    name: striker,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
  };
  match.nonStriker = {
    name: nonStriker,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
  };
  match.bowler = {
    name: bowler,
    overs: 0,
    balls: 0,
    runsGiven: 0,
    wickets: 0,
  };

  await redisClient.set(`match:${matchId}`, JSON.stringify(match));
  res.json({ message: "Opening players set", match });

    } catch (error) {
        console.error(error);
    }
}


export const updateScore = async (req: Request, res: Response): Promise<any> => {
  try {
    const { matchId } = req.params
    const {
      runs,
      isWicket = false,
      newBowler = null,
      newBatsman = null,
      action = "score", // "score", "setBowler", "setBatsman"
    } = req.body

    console.log("⚡️ Entered updateScore for match:", matchId, "Action:", action)

    const data = await redisClient.get(`match:${matchId}`)
    if (!data) {
      console.warn("🚫 Match not found in Redis:", matchId)
      return res.status(404).json({ error: "Match not found" })
    }

    const match = JSON.parse(data)

    // Handle setting new bowler after over completion
    if (action === "setBowler" && newBowler) {
      match.bowler = {
        name: newBowler,
        overs: 0,
        balls: 0,
        runsGiven: 0,
        wickets: 0,
      }

      await redisClient.set(`match:${matchId}`, JSON.stringify(match))
      return res.json({
        message: `New bowler ${newBowler} set successfully`,
        match,
        bowlerSet: true,
      })
    }

    // Handle setting new batsman after wicket
    if (action === "setBatsman" && newBatsman) {
      // Replace the striker (who got out) with new batsman
      match.striker = {
        name: newBatsman,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
      }

      await redisClient.set(`match:${matchId}`, JSON.stringify(match))
      return res.json({
        message: `New batsman ${newBatsman} set successfully`,
        match,
        batsmanSet: true,
      })
    }

    // Regular scoring logic
    if (action === "score") {
      if (!match.striker || !match.bowler || !match.nonStriker) {
        console.warn("⚠️ Players not set properly in match:", matchId)
        return res.status(400).json({ error: "Players not set" })
      }

      // 🏏 Update striker stats (always count the ball)
      match.striker.balls += 1

      // Add runs only if it's not a clean bowled wicket
      if (!isWicket || runs > 0) {
        match.striker.runs += runs
        if (runs === 4) match.striker.fours += 1
        if (runs === 6) match.striker.sixes += 1
      }

      // 🏏 Update bowler stats
      match.bowler.balls += 1
      match.bowler.runsGiven += runs

      // Handle wicket
      if (isWicket) {
        match.totalWickets += 1
        match.bowler.wickets += 1
        console.log("🎯 Wicket taken! Total wickets:", match.totalWickets)
      }

      match.totalRuns += runs

      // 📜 Add ball history
      match.balls.push({
        batsman: match.striker.name,
        bowler: match.bowler.name,
        runs,
        isWicket,
        over: Math.floor(match.balls.length / 6),
        ball: (match.balls.length % 6) + 1,
        timestamp: new Date().toISOString(),
      })

      // 🔁 Swap strike on odd runs (only if not a wicket)
      if (!isWicket && runs % 2 === 1) {
        ;[match.striker, match.nonStriker] = [match.nonStriker, match.striker]
      }

      // ⏱️ Handle end of over
      if (match.bowler.balls === 6) {
        match.bowler.overs += 1
        match.bowler.balls = 0
        ;[match.striker, match.nonStriker] = [match.nonStriker, match.striker]
        match.previousBowler = match.bowler.name
        match.bowler = null

        await redisClient.set(`match:${matchId}`, JSON.stringify(match))
        return res.json({
          message: "Over completed. Please select a new bowler.",
          match,
          requireNewBowler: true,
        })
      }

      // Save match state
      await redisClient.set(`match:${matchId}`, JSON.stringify(match))

      // Handle wicket - require new batsman
      if (isWicket) {
        console.log("🚨 Wicket! Requiring new batsman selection")
        return res.json({
          message: "Wicket! Please select a new batsman.",
          match,
          requireNewBatsman: true,
        })
      }

      // Regular score update
      return res.json({
        message: `Score updated: ${runs} run${runs !== 1 ? "s" : ""}`,
        match,
      })
    }

    return res.status(400).json({ error: "Invalid action" })
  } catch (error: any) {
    console.error("❌ Error in updateScore:", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}

