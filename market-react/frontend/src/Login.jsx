import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, logout, userInfo } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      // Use backend message if available
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-10 bg-gray-400 dark:bg-gray-800 rounded-2xl shadow">
      <h1 className="text-4xl dark:text-gray-100 text-center font-bold mb-8">
        Login
      </h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <label className="block text-xl dark:text-gray-100 font-medium mb-2">
          Email:
        </label>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 m-3 border rounded-2xl bg-gray-200 dark:text-white dark:bg-gray-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-xl dark:text-gray-100 font-medium mb-2">
          Password:
        </label>
        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 m-3 mb-8 border rounded-2xl bg-gray-200 dark:text-white dark:bg-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 cursor-pointer text-white py-2 rounded-2xl"
        >
          Login
        </button>

        {userInfo && (
          <button
            type="button"
            onClick={logout}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer"
          >
            Logout
          </button>
        )}
      </form>
    </div>
  );
}

