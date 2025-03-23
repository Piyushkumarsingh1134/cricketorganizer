import { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

export const ScheduleTournament = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tournamentName: "",
    startDate: "",
    endDate: "",
    description: "",
    entryFee: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token"); // Retrieve JWT token from localStorage

      if (!token) {
        setMessage("Unauthorized: No token found!");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/v1/organizer/tournament",
        {
          name: formData.tournamentName,
          startDate: formData.startDate,
          endDate: formData.endDate,
          description: formData.description,
          entryFee: formData.entryFee,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Tournament scheduled successfully!");
      navigate('/Organizerdashboard')
      setFormData({ tournamentName: "", startDate: "", endDate: "", description: "", entryFee: "" });
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">🏆 Schedule Tournament</h1>

        {message && <p className="text-center text-lg text-red-500 mb-4">{message}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Tournament Name */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="tournamentName">
              Tournament Name
            </label>
            <input
              type="text"
              id="tournamentName"
              value={formData.tournamentName}
              onChange={handleChange}
              placeholder="Enter tournament name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-700"
              required
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="startDate">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-700"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="endDate">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-700"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter tournament description"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-700 h-24 resize-none"
              required
            ></textarea>
          </div>

          {/* Entry Fee */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor="entryFee">
              Entry Fee (₹)
            </label>
            <input
              type="number"
              id="entryFee"
              value={formData.entryFee}
              onChange={handleChange}
              placeholder="Enter entry fee"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-700"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? "Scheduling..." : "Schedule Tournament"}
          </button>
        </form>
      </div>
    </div>
  );
};


  