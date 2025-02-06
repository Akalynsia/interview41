"use client"; // Ensures it runs on the client side

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Next.js native navigation

export default function Login() {
  const router = useRouter();

  const getStoredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem("users")) || [];
    } catch {
      return [];
    }
  };

  const [users, setUsers] = useState(getStoredUsers);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) =>
        u.username === loginData.username && u.password === loginData.password
    );
    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      router.push("/dashboard"); // Next.js navigation
    } else {
      setError("Invalid credentials");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (users.some((u) => u.username === signupData.username)) {
      setError("Username already exists");
      return;
    }
    setUsers([...users, signupData]);
    setIsSignupOpen(false);
    setSignupData({ username: "", password: "" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded mb-2"
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-2"
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          <button
            className="w-full bg-blue-500 text-white p-2 rounded"
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <button
            className="text-blue-500"
            onClick={() => setIsSignupOpen(true)}
          >
            Sign Up
          </button>
        </p>
      </div>

      {isSignupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 border rounded mb-2"
                onChange={(e) =>
                  setSignupData({ ...signupData, username: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border rounded mb-2"
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
              />
              <button
                className="w-full bg-green-500 text-white p-2 rounded"
                type="submit"
              >
                Sign Up
              </button>
            </form>
            <button
              className="mt-4 text-red-500 w-full"
              onClick={() => setIsSignupOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
