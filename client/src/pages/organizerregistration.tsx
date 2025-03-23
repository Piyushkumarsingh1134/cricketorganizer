import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

export default function OrganizerRegistration() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate(); 

    const handleRegister = async () => {
        setError("");
        setSuccess("");
        try {
            const response = await axios.post("http://localhost:3000/api/v1/organizer/Register", {
                name,
                email,
                password,
            });

            const token = response.data.generate; // Extract token
            localStorage.setItem("token", token); // Store token in local storage

            setSuccess("Registration successful! Redirecting...");
            setTimeout(() => navigate("/Organizerdashboard"), 1000); // Redirect after 1s

            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || err.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Organizer Registration</h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center">{success}</p>}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?
                        <Link to="/Organizerlogin" className="text-blue-500 hover:underline ml-1">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}




