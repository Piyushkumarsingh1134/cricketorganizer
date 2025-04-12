import axios from "axios";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function OrganizerLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
    const navigate = useNavigate();
   

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/organizer/login`, { email, password });
            localStorage.setItem("token", response.data.token);
            navigate("/organizer")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login failed! Try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="w-96 border-2 border-gray-400 p-6 rounded-lg shadow-lg bg-white flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4 shadow-lg text-center">Organizer Login</h1>

                <div className="w-full flex flex-col items-start space-y-4">
                    <div className="flex flex-col w-full">
                        <label className="text-xl font-bold text-left">Enter your email</label>
                        <input 
                            type="text" 
                            placeholder="organizer@example.com" 
                            className="w-full py-2 px-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="flex flex-col w-full">
                        <label className="text-xl font-bold text-left">Enter your password</label>
                        <input 
                            type="password" 
                            placeholder="********" 
                            className="w-full py-2 px-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <button 
                        className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-200"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

