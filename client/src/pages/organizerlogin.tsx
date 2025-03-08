import { useState } from "react";

export function Organizerlogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handlelogin = () => {
        console.log("Email:", email);
        console.log("Password:", password);
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
                            placeholder="piyush@gmail.com" 
                            className="w-full py-2 px-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="flex flex-col w-full">
                        <label className="text-xl font-bold text-left">Enter your password</label>
                        <input 
                            type="password" 
                            placeholder="********" 
                            className="w-full py-2 px-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <button 
                        className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-200"
                        onClick={handlelogin}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}
