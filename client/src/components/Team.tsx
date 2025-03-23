import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Team {
  id: string;
  name: string;
  captainName: string;
  captainEmail: string;
}

const TeamsList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Unauthorized! Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:3000/api/v1/organizer/teams/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTeams(response.data.teams || []);
      } catch (error) {
        toast.error("Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">Joined Teams</h2>

        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading teams...</p>
          </div>
        ) : teams.length > 0 ? (
          <ul className="space-y-4">
            {teams.map((team) => (
              <li key={team.id} className="p-4 border rounded-lg bg-gray-50 shadow-md">
                <h3 className="text-lg font-semibold text-blue-800">{team.name}</h3>
                <p className="text-gray-700"><strong>Captain:</strong> {team.captainName}</p>
                <p className="text-gray-600"><strong>Email:</strong> {team.captainEmail}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No teams have joined yet.</p>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/Organizerdashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-semibold transition duration-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamsList;
