import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Accessing the Vite environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Correctly using the API_URL variable
      const response = await axios.post(`${API_URL}/api/users/signup`, {
        username,
        email,
        password,
      });

      setSuccess(response.data.message || "Signup successful! Redirecting...");
      
      // Clear fields
      setUsername("");
      setEmail("");
      setPassword("");

      // Redirect to Sign In after a short delay
      setTimeout(() => {
        navigate("/signin");
      }, 2000);

    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
        
        {error && <p className="text-red-500 mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center bg-green-50 p-2 rounded">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full text-white py-2 rounded-md transition duration-200 ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Signup"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-600 hover:underline">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
