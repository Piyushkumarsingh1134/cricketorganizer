import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Tournament {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    entryFee?: number;
    organizerId: string;
    banner?: string;
    status: "open" | "ongoing" | "completed";
}

export default function OrganizerDashboard() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

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

                if (isMounted) {
                    setTournaments(data.filter((t) => t.status === "open" || t.status === "ongoing"));
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    setError("Error fetching tournaments");
                    setLoading(false);
                }
                console.error("Error fetching tournaments:", error);
            }
        };

        fetchTournaments();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen text-lg font-semibold">Loading tournaments...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-500 font-semibold">{error}</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-blue-800 text-white p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-6">Organizer Panel</h2>
                <nav className="flex flex-col space-y-4">
                    <button onClick={() => navigate("/organize-match")} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-lg">
                        Organize Match
                    </button>
                    <button onClick={() => navigate("/TeamsList")} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-lg">
                        Teams List
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {tournaments.length > 0 ? (
                    <div className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-blue-600">Your Tournaments</h2>
                        <ul>
                            {tournaments.map((tournament) => (
                                <li key={tournament.id} className="p-4 border rounded-lg mb-4 bg-blue-50">
                                    <h3 className="text-xl font-semibold text-blue-800">{tournament.name}</h3>
                                    <p className="text-gray-700">{tournament.description}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Status: <span className="font-bold text-blue-700">{tournament.status}</span>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">Ready to schedule your first tournament?</h2>
                        <button
                            onClick={() => navigate("/ScheduleTournament")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-semibold transition duration-200"
                        >
                            Schedule Tournament
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}




