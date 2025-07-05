


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Trophy, Users, Target, Clock, TrendingUp, RotateCcw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Match {
  id: string
  teamA: string
  teamB: string
  overs: number
  toss?: {
    winner: string
    decision: string
  }
  striker?: Player
  nonStriker?: Player
  bowler?: Bowler
  balls: Ball[]
  totalRuns: number
  totalWickets: number
  createdAt: string
}

interface Player {
  name: string
  runs: number
  balls: number
  fours: number
  sixes: number
}

interface Bowler {
  name: string
  overs: number
  balls: number
  runsGiven: number
  wickets: number
}

interface Ball {
  batsman: string
  bowler: string
  runs: number
  isWicket: boolean
  over: number
  ball: number
  timestamp: string
}

export default function CricketScorer() {
  const [activeTab, setActiveTab] = useState("create")
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null)
  const [matchId, setMatchId] = useState("")

  // Form states
  const [teamA, setTeamA] = useState("")
  const [teamB, setTeamB] = useState("")
  const [overs, setOvers] = useState(20)
  const [tossWinner, setTossWinner] = useState("")
  const [tossDecision, setTossDecision] = useState("")
  const [striker, setStriker] = useState("")
  const [nonStriker, setNonStriker] = useState("")
  const [bowler, setBowler] = useState("")
  const [newBowler, setNewBowler] = useState("")

  const createMatch = async () => {
    try {
      const response = await fetch("/api/create-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamA, teamB, overs }),
      })
      const data = await response.json()
      setMatchId(data.matchId)
      setActiveTab("toss")
      toast({ title: "Match Created!", description: `Match ID: ${data.matchId}` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to create match", variant: "destructive" })
    }
  }

  const setToss = async () => {
    try {
      await fetch(`/api/set-toss/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winner: tossWinner, decision: tossDecision }),
      })
      setActiveTab("players")
      toast({ title: "Toss Set!", description: `${tossWinner} won and chose to ${tossDecision}` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to set toss", variant: "destructive" })
    }
  }

  const setOpeningPlayers = async () => {
    try {
      const response = await fetch(`/api/opening-player/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ striker, nonStriker, bowler }),
      })
      const data = await response.json()
      setCurrentMatch(data.match)
      setActiveTab("scoring")
      toast({ title: "Players Set!", description: "Ready to start scoring" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to set players", variant: "destructive" })
    }
  }

  const updateScore = async (runs: number, isWicket = false) => {
    try {
      const response = await fetch(`/api/update-score/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runs, isWicket }),
      })
      const data = await response.json()

      if (data.requireNewBowler) {
        setCurrentMatch(data.match)
        toast({ title: "Over Complete!", description: "Please select a new bowler" })
      } else {
        setCurrentMatch(data.match)
        toast({
          title: "Score Updated!",
          description: `${runs} run${runs !== 1 ? "s" : ""} ${isWicket ? "+ Wicket" : ""}`,
        })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update score", variant: "destructive" })
    }
  }

  const setNewBowlerForOver = async () => {
    try {
      const response = await fetch(`/api/matches/${matchId}/bowler`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bowler: newBowler }),
      })
      const data = await response.json()
      setCurrentMatch(data.match)
      setNewBowler("")
      toast({ title: "New Bowler Set!", description: `${newBowler} is now bowling` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to set new bowler", variant: "destructive" })
    }
  }

  const getCurrentOver = () => {
    if (!currentMatch?.balls.length) return []
    const currentOverNumber = Math.floor(currentMatch.balls.length / 6)
    return currentMatch.balls.filter((ball) => ball.over === currentOverNumber)
  }

  const getStrikeRate = (player: Player) => {
    return player.balls > 0 ? ((player.runs / player.balls) * 100).toFixed(1) : "0.0"
  }

  const getEconomyRate = (bowler: Bowler) => {
    const totalOvers = bowler.overs + bowler.balls / 6
    return totalOvers > 0 ? (bowler.runsGiven / totalOvers).toFixed(1) : "0.0"
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cricket Scorer</h1>
          <p className="text-gray-600">Professional Cricket Match Management System</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Create Match
            </TabsTrigger>
            <TabsTrigger value="toss" disabled={!matchId}>
              <RotateCcw className="w-4 h-4" />
              Toss
            </TabsTrigger>
            <TabsTrigger value="players" disabled={!matchId}>
              <Users className="w-4 h-4" />
              Players
            </TabsTrigger>
            <TabsTrigger value="scoring" disabled={!currentMatch}>
              <Target className="w-4 h-4" />
              Live Scoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  Create New Match
                </CardTitle>
                <CardDescription>Set up teams and match format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="teamA">Team A</Label>
                    <Input
                      id="teamA"
                      placeholder="Enter team name"
                      value={teamA}
                      onChange={(e) => setTeamA(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teamB">Team B</Label>
                    <Input
                      id="teamB"
                      placeholder="Enter team name"
                      value={teamB}
                      onChange={(e) => setTeamB(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overs">Overs</Label>
                  <Select value={overs.toString()} onValueChange={(value) => setOvers(Number.parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Overs</SelectItem>
                      <SelectItem value="10">10 Overs</SelectItem>
                      <SelectItem value="20">20 Overs (T20)</SelectItem>
                      <SelectItem value="50">50 Overs (ODI)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={createMatch}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!teamA || !teamB}
                >
                  Create Match
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="toss">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                  Toss Details
                </CardTitle>
                <CardDescription>Who won the toss and what did they choose?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Toss Winner</Label>
                  <RadioGroup value={tossWinner} onValueChange={setTossWinner}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={teamA} id="teamA-toss" />
                      <Label htmlFor="teamA-toss">{teamA}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={teamB} id="teamB-toss" />
                      <Label htmlFor="teamB-toss">{teamB}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-4">
                  <Label>Decision</Label>
                  <RadioGroup value={tossDecision} onValueChange={setTossDecision}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bat" id="bat" />
                      <Label htmlFor="bat">Bat First</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bowl" id="bowl" />
                      <Label htmlFor="bowl">Bowl First</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button
                  onClick={setToss}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!tossWinner || !tossDecision}
                >
                  Set Toss
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="players">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Opening Players
                </CardTitle>
                <CardDescription>Select the opening batsmen and bowler</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="striker">Striker</Label>
                    <Input
                      id="striker"
                      placeholder="Striker name"
                      value={striker}
                      onChange={(e) => setStriker(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nonStriker">Non-Striker</Label>
                    <Input
                      id="nonStriker"
                      placeholder="Non-striker name"
                      value={nonStriker}
                      onChange={(e) => setNonStriker(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bowler">Opening Bowler</Label>
                    <Input
                      id="bowler"
                      placeholder="Bowler name"
                      value={bowler}
                      onChange={(e) => setBowler(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={setOpeningPlayers}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!striker || !nonStriker || !bowler}
                >
                  Start Match
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scoring">
            {currentMatch && (
              <div className="space-y-6">
                {/* Match Header */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl">
                          {teamA} vs {teamB}
                        </CardTitle>
                        <CardDescription>{overs} Overs Match</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {currentMatch.totalRuns}/{currentMatch.totalWickets}
                        </div>
                        <div className="text-sm text-gray-600">
                          {Math.floor(currentMatch.balls.length / 6)}.{currentMatch.balls.length % 6} overs
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Scoring Panel */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Current Players */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Current Players
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <div>
                              <div className="font-semibold">{currentMatch.striker?.name} *</div>
                              <div className="text-sm text-gray-600">Striker</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">{currentMatch.striker?.runs}</div>
                              <div className="text-sm text-gray-600">
                                ({currentMatch.striker?.balls}b, {currentMatch.striker?.fours}×4,{" "}
                                {currentMatch.striker?.sixes}×6)
                              </div>
                              <div className="text-xs text-gray-500">SR: {getStrikeRate(currentMatch.striker!)}</div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-semibold">{currentMatch.nonStriker?.name}</div>
                              <div className="text-sm text-gray-600">Non-Striker</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">{currentMatch.nonStriker?.runs}</div>
                              <div className="text-sm text-gray-600">
                                ({currentMatch.nonStriker?.balls}b, {currentMatch.nonStriker?.fours}×4,{" "}
                                {currentMatch.nonStriker?.sixes}×6)
                              </div>
                              <div className="text-xs text-gray-500">SR: {getStrikeRate(currentMatch.nonStriker!)}</div>
                            </div>
                          </div>

                          {currentMatch.bowler && (
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                              <div>
                                <div className="font-semibold">{currentMatch.bowler.name}</div>
                                <div className="text-sm text-gray-600">Bowler</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-lg">
                                  {currentMatch.bowler.overs}.{currentMatch.bowler.balls}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {currentMatch.bowler.runsGiven}/{currentMatch.bowler.wickets}
                                </div>
                                <div className="text-xs text-gray-500">Econ: {getEconomyRate(currentMatch.bowler)}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* New Bowler Selection */}
                    {!currentMatch.bowler && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-orange-600">Select New Bowler</CardTitle>
                          <CardDescription>Over completed. Please select the next bowler.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Input
                            placeholder="Enter bowler name"
                            value={newBowler}
                            onChange={(e) => setNewBowler(e.target.value)}
                          />
                          <Button
                            onClick={setNewBowlerForOver}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={!newBowler}
                          >
                            Set New Bowler
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {/* Scoring Buttons */}
                    {currentMatch.bowler && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Score This Ball</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-4 gap-3 mb-4">
                            <Button variant="outline" onClick={() => updateScore(0)} className="h-16 text-lg font-bold">
                              0
                            </Button>
                            <Button variant="outline" onClick={() => updateScore(1)} className="h-16 text-lg font-bold">
                              1
                            </Button>
                            <Button variant="outline" onClick={() => updateScore(2)} className="h-16 text-lg font-bold">
                              2
                            </Button>
                            <Button variant="outline" onClick={() => updateScore(3)} className="h-16 text-lg font-bold">
                              3
                            </Button>
                            <Button
                              onClick={() => updateScore(4)}
                              className="h-16 text-lg font-bold bg-green-600 hover:bg-green-700"
                            >
                              4
                            </Button>
                            <Button
                              onClick={() => updateScore(6)}
                              className="h-16 text-lg font-bold bg-purple-600 hover:bg-purple-700"
                            >
                              6
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => updateScore(0, true)}
                              className="h-16 text-lg font-bold text-red-600 border-red-600 hover:bg-red-50"
                            >
                              W
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => updateScore(1, true)}
                              className="h-16 text-sm font-bold text-red-600 border-red-600 hover:bg-red-50"
                            >
                              1+W
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Match Stats */}
                  <div className="space-y-6">
                    {/* Current Over */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Current Over
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {getCurrentOver().map((ball, index) => (
                            <Badge
                              key={index}
                              variant={
                                ball.isWicket
                                  ? "destructive"
                                  : ball.runs === 4
                                    ? "default"
                                    : ball.runs === 6
                                      ? "secondary"
                                      : "outline"
                              }
                              className={ball.runs === 4 ? "bg-green-600" : ball.runs === 6 ? "bg-purple-600" : ""}
                            >
                              {ball.isWicket ? "W" : ball.runs}
                            </Badge>
                          ))}
                          {Array.from({ length: 6 - getCurrentOver().length }).map((_, index) => (
                            <Badge key={`empty-${index}`} variant="outline" className="opacity-30">
                              -
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Match Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Match Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Overs:</span>
                          <span>
                            {Math.floor(currentMatch.balls.length / 6)}.{currentMatch.balls.length % 6} / {overs}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Run Rate:</span>
                          <span>
                            {currentMatch.balls.length > 0
                              ? ((currentMatch.totalRuns / currentMatch.balls.length) * 6).toFixed(2)
                              : "0.00"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Balls Remaining:</span>
                          <span>{overs * 6 - currentMatch.balls.length}</span>
                        </div>
                        <Separator />
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {currentMatch.totalRuns}/{currentMatch.totalWickets}
                          </div>
                          <div className="text-sm text-gray-600">
                            {Math.floor(currentMatch.balls.length / 6)}.{currentMatch.balls.length % 6} overs
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Balls */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Balls</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {currentMatch.balls
                            .slice(-10)
                            .reverse()
                            .map((ball, index) => (
                              <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                                <span>{ball.batsman}</span>
                                <Badge
                                  variant={
                                    ball.isWicket
                                      ? "destructive"
                                      : ball.runs === 4
                                        ? "default"
                                        : ball.runs === 6
                                          ? "secondary"
                                          : "outline"
                                  }
                                  className={ball.runs === 4 ? "bg-green-600" : ball.runs === 6 ? "bg-purple-600" : ""}
                                >
                                  {ball.isWicket ? "W" : ball.runs}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
