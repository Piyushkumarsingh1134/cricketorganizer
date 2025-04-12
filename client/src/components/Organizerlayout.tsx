import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface Tournament {
  id: string;
  name: string;
  description: string;
  status: string;
}

export default function OrganizerLayout() {
  const navigate = useNavigate();
  const [hasOpenOrOngoing, setHasOpenOrOngoing] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token missing");
          setLoading(false);
          return;
        }

        const { data } = await axios.get<Tournament[]>(
          "http://localhost:3000/api/v1/organizer/organisetournament",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const hasOpenOrOngoingTournaments = data.some(
          (t) => t.status.toLowerCase() === "open" || t.status.toLowerCase() === "ongoing"
        );

        setHasOpenOrOngoing(hasOpenOrOngoingTournaments);
      } catch (err) {
        console.error("Error fetching tournaments:", err);
        setError("Error checking tournaments");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Organizer Panel</h2>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => navigate("/organizer")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-lg"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/organizer/teams")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-lg"
          >
            Teams List
          </button>
          <button
            onClick={() => navigate("/organizer/schedule")}
            className={`px-4 py-2 rounded-lg text-lg ${
              hasOpenOrOngoing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={hasOpenOrOngoing || loading || !!error}
            title={
              hasOpenOrOngoing
                ? "Cannot schedule while tournaments are open or ongoing"
                : ""
            }
          >
            Schedule Tournament
          </button>
        </nav>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}