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
    const navigate = useNavigate(); // Use navigate for navigation

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
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
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
        return <div className="flex items-center justify-center min-h-screen">Loading tournaments...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {tournaments.length > 0 ? (
                <div className="w-full max-w-3xl p-4 bg-white shadow-md rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Your Tournaments</h2>
                    <ul>
                        {tournaments.map((tournament) => (
                            <li key={tournament.id} className="p-4 border rounded-md mb-2">
                                <h3 className="text-xl font-semibold">{tournament.name}</h3>
                                <p className="text-gray-600">{tournament.description}</p>
                                <p className="text-sm text-gray-500">
                                    Status: <span className="font-bold">{tournament.status}</span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to schedule your first tournament?</h2>
                    <button
                        onClick={() => navigate("/schedule-tournament")}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg font-semibold"
                    >
                        Schedule Tournament
                    </button>
                </div>
            )}
        </div>
    );
}


