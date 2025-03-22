import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const RegisterTeam = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    captainName: "",
    captainEmail: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/v1/team/register", formData);
      alert("Team Registered Successfully!");
      navigate("/Tournament"); // Redirect to tournament page
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-blue-50 p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Register Team</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Team Name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-md"/>
          
          <input type="text" name="captainName" placeholder="Captain Name" value={formData.captainName} onChange={handleChange} required className="w-full p-2 border rounded-md"/>
          
          <input type="email" name="captainEmail" placeholder="Captain Email" value={formData.captainEmail} onChange={handleChange} required className="w-full p-2 border rounded-md"/>
          
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded-md"/>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">Register</button>
        </form>


        
         <p className="text-center text-sm text-gray-600 mt-4">
          Already have account?{" "}
          <Link to="/LoginTeam" className="text-blue-600 hover:underline">
            login here
          </Link>
        </p>
      </div>

      
    </div>
  );
};

export default RegisterTeam;
