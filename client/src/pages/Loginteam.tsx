import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginTeam = () => {
  const navigate = useNavigate();
  const [captainEmail, setCaptainEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/v1/team/login", { captainEmail });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("team", JSON.stringify(res.data.team));

      // Show toast and navigate immediately
      toast.success("Login Successful!", { autoClose: 1000 }); // 1 sec duration
      setTimeout(() => navigate("/Tournament"), 1000); // Navigate after toast
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
      toast.error("Login failed! Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-blue-50 p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Team Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="captainEmail"
            placeholder="Captain Email"
            value={captainEmail}
            onChange={(e) => setCaptainEmail(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/RegisterTeam" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginTeam;


