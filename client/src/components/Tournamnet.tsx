import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  entryFee: number;
  status: string;
}

const Tournament = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/tournament/getAllTournaments");
        console.log("API Response:", res.data);

        if (Array.isArray(res.data)) {
          setTournaments(res.data);
        } else {
          throw new Error("Invalid data format received from server");
        }
      } catch (err: any) {
        console.error("Error fetching tournaments:", err);
        setError("Failed to fetch tournaments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleJoinTournament = async (tournamentId: string) => {
    const token = localStorage.getItem("token");
    const team = localStorage.getItem("team");

    if (!token || !team) {
      navigate("/RegisterTeam"); // Redirect only when trying to join
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/api/v1/team/join-tournament",
        { tournamentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Successfully joined the tournament!");
    } catch (err: any) {
      console.error("Error joining tournament:", err);
      alert("Error joining the tournament. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-10">
      <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">🏆 Open Tournaments</h2>

      {loading && <p className="text-center text-gray-600 text-lg">Loading tournaments...</p>}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-white shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105 border-l-4 border-blue-500"
            >
              <h3 className="text-2xl font-semibold text-blue-800">{tournament.name}</h3>
              <p className="text-gray-600 mt-2">{tournament.description}</p>
              
              <p className="text-gray-700 mt-3">
                📅 <span className="font-medium">{new Date(tournament.startDate).toLocaleDateString()}</span> -{" "}
                <span className="font-medium">{new Date(tournament.endDate).toLocaleDateString()}</span>
              </p>

              <p className="text-gray-800 mt-2 text-lg font-semibold">💰 Entry Fee: ₹{tournament.entryFee}</p>

              <div className="mt-3">
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded-lg ${
                    tournament.status === "Open"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tournament.status}
                </span>
              </div>

              <button
                onClick={() => handleJoinTournament(tournament.id)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Join Tournament
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500 text-lg">No open tournaments available</p>
        )}
      </div>
    </div>
  );
};

export default Tournament;



