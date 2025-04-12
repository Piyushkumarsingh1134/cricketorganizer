import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Tournament from "./Tournamnet";


import axios from "axios";

export default function OrganizerDashboard() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Authentication token missing");
                    setLoading(false);
                    return;
                }

                const { data } = await axios.get<Tournament[]>("http://localhost:3000/api/v1/organizer/organisetournament", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Log the raw response data for debugging
                console.log("Raw Tournament Data:", data);

                // Filter tournaments that are open or ongoing
                const filteredTournaments = data.filter((t) =>
                    t.status.toLowerCase() === "open" || t.status.toLowerCase() === "ongoing"
                );

                // Log the filtered tournaments
                console.log("Filtered Tournaments:", filteredTournaments);

                setTournaments(filteredTournaments);
            } catch (error) {
                console.error("Error fetching tournaments:", error);
                setError("Error fetching tournaments");
            } finally {
                setLoading(false);
            }
        };

        fetchTournaments();
    }, []);

    if (loading) return <div className="text-center">Loading tournaments...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    // Check if there are any open or ongoing tournaments
    const hasOpenOrOngoingTournaments = tournaments.length > 0;

    return (
        <div>
            {/* Render tournaments if there are any, else show the "Schedule Tournament" button */}
            {hasOpenOrOngoingTournaments ? (
                <div className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">Your Tournaments</h2>
                    <ul>
                        {tournaments.map((t) => (
                            <li key={t.id} className="p-4 border rounded-lg mb-4 bg-blue-50">
                                <h3 className="text-xl font-semibold text-blue-800">{t.name}</h3>
                                <p className="text-gray-700">{t.description}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Status: <span className="font-bold text-blue-700">{t.status}</span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-center bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-blue-600 mb-4">Ready to schedule your first tournament?</h2>
                    <button
                        onClick={() => navigate("/organizer/schedule")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-semibold transition duration-200"
                        disabled={hasOpenOrOngoingTournaments} // Disable the button if there are open or ongoing tournaments
                    >
                        Schedule Tournament
                    </button>
                </div>
            )}
        </div>
    );
}
