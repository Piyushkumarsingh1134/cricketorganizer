"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Trophy, Users, Target, Clock, TrendingUp, RotateCcw, X } from "lucide-react"

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

// Custom Components
const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: "default" | "outline"
  className?: string
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>{children}</div>
)

const CardHeader = ({ children }: { children: React.ReactNode }) => <div className="p-6 pb-4">{children}</div>

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
)

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-gray-600 mt-1">{children}</p>
)

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
)

const Input = ({
  id,
  placeholder,
  value,
  onChange,
  className = "",
  onKeyPress,
}: {
  id?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}) => (
  <input
    id={id}
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    onKeyPress={onKeyPress}
  />
)

const Label = ({
  htmlFor,
  children,
  className = "",
}: {
  htmlFor?: string
  children: React.ReactNode
  className?: string
}) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
    {children}
  </label>
)

const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode
  variant?: "default" | "outline" | "destructive" | "secondary"
  className?: string
}) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-gray-300 text-gray-700",
    destructive: "bg-red-100 text-red-800",
    secondary: "bg-purple-100 text-purple-800",
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

const Tabs = ({
  value,
  onValueChange,
  children,
  className = "",
}: {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}) => <div className={className}>{children}</div>

const TabsList = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>{children}</div>
)

const TabsTrigger = ({
  value,
  children,
  disabled = false,
  className = "",
  onClick,
}: {
  value: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
  onClick?: () => void
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-blue-600 ${className}`}
  >
    {children}
  </button>
)

const TabsContent = ({ value, children }: { value: string; children: React.ReactNode }) => <div>{children}</div>

const Separator = ({ className = "" }: { className?: string }) => <hr className={`border-gray-200 ${className}`} />

// Modal Component
const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function CricketScorer() {
  const [activeTab, setActiveTab] = useState("create")
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null)
  const [matchId, setMatchId] = useState("")

  // Modal states
  const [showNewBatsmanModal, setShowNewBatsmanModal] = useState(false)
  const [showNewBowlerModal, setShowNewBowlerModal] = useState(false)
  const [newBatsman, setNewBatsman] = useState("")
  const [newBowler, setNewBowler] = useState("")

  // Form states
  const [teamA, setTeamA] = useState("")
  const [teamB, setTeamB] = useState("")
  const [overs, setOvers] = useState(20)
  const [tossWinner, setTossWinner] = useState("")
  const [tossDecision, setTossDecision] = useState("")
  const [striker, setStriker] = useState("")
  const [nonStriker, setNonStriker] = useState("")
  const [bowler, setBowler] = useState("")

  // Scorecard data
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [allBowlers, setAllBowlers] = useState<Bowler[]>([])

  // Add this useEffect to debug modal state

  // Add this after your other useState declarations
  useEffect(() => {
    console.log("🔍 Modal states:", {
      showNewBatsmanModal,
      showNewBowlerModal,
      newBatsman,
      newBowler,
    })
  }, [showNewBatsmanModal, showNewBowlerModal, newBatsman, newBowler])

  const createMatch = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/match/CreateMatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamA, teamB, overs }),
      })
      const data = await response.json()
      setMatchId(data.matchId)
      setActiveTab("toss")
      alert(`Match Created! Match ID: ${data.matchId}`)
    } catch (error) {
      alert("Error: Failed to create match")
    }
  }

  const setToss = async () => {
    try {
      await fetch(`http://localhost:3000/api/v1/match/${matchId}/setToss`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winner: tossWinner, decision: tossDecision }),
      })
      setActiveTab("players")
      alert(`Toss Set! ${tossWinner} won and chose to ${tossDecision}`)
    } catch (error) {
      alert("Error: Failed to set toss")
    }
  }

  const setOpeningPlayers = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/match/${matchId}/openingplayer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ striker, nonStriker, bowler }),
      })
      const data = await response.json()
      setCurrentMatch(data.match)

      // Initialize scorecard data
      setAllPlayers([data.match.striker, data.match.nonStriker])
      setAllBowlers([data.match.bowler])

      setActiveTab("scoring")
      alert("Players Set! Ready to start scoring")
    } catch (error) {
      alert("Error: Failed to set players")
    }
  }

  const updateScore = async (runs: number, isWicket = false) => {
    console.log("🏏 updateScore called:", { runs, isWicket })

    try {
      const response = await fetch(`http://localhost:3000/api/v1/match/${matchId}/updateScore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runs,
          isWicket,
          action: "score",
        }),
      })
      const data = await response.json()
      console.log("📡 Backend response:", data)

      if (data.requireNewBowler) {
        console.log("🎳 Requiring new bowler")
        setCurrentMatch(data.match)
        setShowNewBowlerModal(true)
        alert("Over Complete! Please select a new bowler")
      } else if (data.requireNewBatsman) {
        console.log("🏏 Requiring new batsman - showing modal")
        setCurrentMatch(data.match)
        setShowNewBatsmanModal(true)
        alert("Wicket! Please select a new batsman")
      } else {
        console.log("✅ Regular score update")
        setCurrentMatch(data.match)
        updateScorecard(data.match)
        alert(`Score Updated! ${runs} run${runs !== 1 ? "s" : ""} ${isWicket ? "+ Wicket" : ""}`)
      }
    } catch (error) {
      console.error("❌ Error updating score:", error)
      alert("Error: Failed to update score")
    }
  }

  const setNewBowlerForOver = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/match/${matchId}/updateScore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "setBowler",
          newBowler,
        }),
      })
      const data = await response.json()

      if (data.bowlerSet) {
        setCurrentMatch(data.match)

        // Update bowlers list
        const existingBowler = allBowlers.find((b) => b.name === newBowler)
        if (!existingBowler) {
          setAllBowlers([...allBowlers, data.match.bowler])
        }

        setNewBowler("")
        setShowNewBowlerModal(false)
        alert(`New Bowler Set! ${newBowler} is now bowling`)
      }
    } catch (error) {
      alert("Error: Failed to set new bowler")
    }
  }

  const setNewBatsmanAfterWicket = async () => {
    if (!newBatsman.trim()) {
      alert("Please enter a batsman name")
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/api/v1/match/${matchId}/updateScore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "setBatsman",
          newBatsman: newBatsman.trim(),
        }),
      })
      const data = await response.json()

      if (data.batsmanSet) {
        setCurrentMatch(data.match)

        // Add new batsman to players list if not already present
        const existingPlayer = allPlayers.find((p) => p.name === newBatsman.trim())
        if (!existingPlayer) {
          const newPlayer: Player = {
            name: newBatsman.trim(),
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
          }
          setAllPlayers([...allPlayers, newPlayer])
        }

        setNewBatsman("")
        setShowNewBatsmanModal(false)
        alert(`New Batsman Set! ${newBatsman.trim()} is now batting`)
      } else {
        alert("Failed to set new batsman")
      }
    } catch (error) {
      console.error("Error setting new batsman:", error)
      alert("Error: Failed to set new batsman")
    }
  }

  const updateScorecard = (match: Match) => {
    // Update players in scorecard
    setAllPlayers((prev) =>
      prev.map((player) => {
        if (player.name === match.striker?.name) return match.striker
        if (player.name === match.nonStriker?.name) return match.nonStriker
        return player
      }),
    )

    // Update bowlers in scorecard
    if (match.bowler) {
      setAllBowlers((prev) => prev.map((bowler) => (bowler.name === match.bowler?.name ? match.bowler : bowler)))
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cricket Scorer</h1>
          <p className="text-gray-600">Professional Cricket Match Management System</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger
              value="create"
              className={`flex items-center gap-2 ${activeTab === "create" ? "bg-white text-blue-600" : ""}`}
              onClick={() => setActiveTab("create")}
            >
              <Trophy className="w-4 h-4" />
              Create Match
            </TabsTrigger>
            <TabsTrigger
              value="toss"
              disabled={!matchId}
              className={`flex items-center gap-2 ${activeTab === "toss" ? "bg-white text-blue-600" : ""}`}
              onClick={() => matchId && setActiveTab("toss")}
            >
              <RotateCcw className="w-4 h-4" />
              Toss
            </TabsTrigger>
            <TabsTrigger
              value="players"
              disabled={!matchId}
              className={`flex items-center gap-2 ${activeTab === "players" ? "bg-white text-blue-600" : ""}`}
              onClick={() => matchId && setActiveTab("players")}
            >
              <Users className="w-4 h-4" />
              Players
            </TabsTrigger>
            <TabsTrigger
              value="scoring"
              disabled={!currentMatch}
              className={`flex items-center gap-2 ${activeTab === "scoring" ? "bg-white text-blue-600" : ""}`}
              onClick={() => currentMatch && setActiveTab("scoring")}
            >
              <Target className="w-4 h-4" />
              Live Scoring
            </TabsTrigger>
            <TabsTrigger
              value="scorecard"
              disabled={!currentMatch}
              className={`flex items-center gap-2 ${activeTab === "scorecard" ? "bg-white text-blue-600" : ""}`}
              onClick={() => currentMatch && setActiveTab("scorecard")}
            >
              <TrendingUp className="w-4 h-4" />
              Scorecard
            </TabsTrigger>
          </TabsList>

          {activeTab === "create" && (
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
                    <select
                      value={overs.toString()}
                      onChange={(e) => setOvers(Number.parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="5">5 Overs</option>
                      <option value="10">10 Overs</option>
                      <option value="20">20 Overs (T20)</option>
                      <option value="50">50 Overs (ODI)</option>
                    </select>
                  </div>
                  <Button onClick={createMatch} className="w-full" disabled={!teamA || !teamB}>
                    Create Match
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {activeTab === "toss" && (
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
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="teamA-toss"
                          name="tossWinner"
                          value={teamA}
                          checked={tossWinner === teamA}
                          onChange={() => setTossWinner(teamA)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <Label htmlFor="teamA-toss">{teamA}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="teamB-toss"
                          name="tossWinner"
                          value={teamB}
                          checked={tossWinner === teamB}
                          onChange={() => setTossWinner(teamB)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <Label htmlFor="teamB-toss">{teamB}</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label>Decision</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="bat"
                          name="tossDecision"
                          value="bat"
                          checked={tossDecision === "bat"}
                          onChange={() => setTossDecision("bat")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <Label htmlFor="bat">Bat First</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="bowl"
                          name="tossDecision"
                          value="bowl"
                          checked={tossDecision === "bowl"}
                          onChange={() => setTossDecision("bowl")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <Label htmlFor="bowl">Bowl First</Label>
                      </div>
                    </div>
                  </div>
                  <Button onClick={setToss} className="w-full" disabled={!tossWinner || !tossDecision}>
                    Set Toss
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {activeTab === "players" && (
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
                  <Button onClick={setOpeningPlayers} className="w-full" disabled={!striker || !nonStriker || !bowler}>
                    Start Match
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {activeTab === "scoring" && currentMatch && (
            <TabsContent value="scoring">
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
                              className="h-16 text-lg font-bold bg-green-600 hover:bg-green-700 text-white"
                            >
                              4
                            </Button>
                            <Button
                              onClick={() => updateScore(6)}
                              className="h-16 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white"
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
                              className={
                                ball.runs === 4
                                  ? "bg-green-600 text-white"
                                  : ball.runs === 6
                                    ? "bg-purple-600 text-white"
                                    : ""
                              }
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
                  </div>
                </div>
              </div>
            </TabsContent>
          )}

          {activeTab === "scorecard" && currentMatch && (
            <TabsContent value="scorecard">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Scorecard</CardTitle>
                    <CardDescription>
                      {teamA} vs {teamB} - {overs} Overs Match
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Batting Scorecard */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Batting</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Batsman</th>
                              <th className="text-right py-2">R</th>
                              <th className="text-right py-2">B</th>
                              <th className="text-right py-2">4s</th>
                              <th className="text-right py-2">6s</th>
                              <th className="text-right py-2">SR</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allPlayers.map((player, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-2">
                                  {player.name}
                                  {(currentMatch.striker?.name === player.name ||
                                    currentMatch.nonStriker?.name === player.name) && (
                                    <span className="text-green-600 ml-1">*</span>
                                  )}
                                </td>
                                <td className="text-right py-2 font-semibold">{player.runs}</td>
                                <td className="text-right py-2">{player.balls}</td>
                                <td className="text-right py-2">{player.fours}</td>
                                <td className="text-right py-2">{player.sixes}</td>
                                <td className="text-right py-2">{getStrikeRate(player)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>
                            {currentMatch.totalRuns}/{currentMatch.totalWickets} (
                            {Math.floor(currentMatch.balls.length / 6)}.{currentMatch.balls.length % 6} overs)
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bowling Scorecard */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Bowling</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Bowler</th>
                              <th className="text-right py-2">O</th>
                              <th className="text-right py-2">R</th>
                              <th className="text-right py-2">W</th>
                              <th className="text-right py-2">Econ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allBowlers.map((bowler, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-2">
                                  {bowler.name}
                                  {currentMatch.bowler?.name === bowler.name && (
                                    <span className="text-blue-600 ml-1">*</span>
                                  )}
                                </td>
                                <td className="text-right py-2">
                                  {bowler.overs}.{bowler.balls}
                                </td>
                                <td className="text-right py-2">{bowler.runsGiven}</td>
                                <td className="text-right py-2 font-semibold">{bowler.wickets}</td>
                                <td className="text-right py-2">{getEconomyRate(bowler)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* New Batsman Modal */}
        <Modal isOpen={showNewBatsmanModal} onClose={() => setShowNewBatsmanModal(false)}>
          <CardTitle className="mb-4 text-red-600">🏏 Wicket Fallen!</CardTitle>
          <CardDescription>A wicket has fallen. Please select the new batsman to continue.</CardDescription>
          <div className="space-y-4">
            <Input
              placeholder="Enter new batsman name"
              value={newBatsman}
              onChange={(e) => setNewBatsman(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && newBatsman.trim()) {
                  setNewBatsmanAfterWicket()
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                onClick={setNewBatsmanAfterWicket}
                disabled={!newBatsman.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Set Batsman
              </Button>
              <Button variant="outline" onClick={() => setShowNewBatsmanModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Enter the name of the new batsman and click "Set Batsman"
            </p>
          </div>
        </Modal>

        {/* New Bowler Modal */}
        <Modal isOpen={showNewBowlerModal} onClose={() => setShowNewBowlerModal(false)}>
          <CardTitle className="mb-4">Select New Bowler</CardTitle>
          <CardDescription>Over completed. Please select the next bowler.</CardDescription>
          <div className="space-y-4">
            <Input
              placeholder="Enter new bowler name"
              value={newBowler}
              onChange={(e) => setNewBowler(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={setNewBowlerForOver} disabled={!newBowler} className="flex-1">
                Set Bowler
              </Button>
              <Button variant="outline" onClick={() => setShowNewBowlerModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

