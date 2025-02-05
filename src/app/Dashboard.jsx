import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser")); // Parse JSON
    if (user) {
      setLoggedInUser(user.username); // Store only the username
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (loggedInUser === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">FAULTY RECORD SYSTEM</h1>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">{loggedInUser}</span>
          <button
            onClick={() => {
              localStorage.removeItem("loggedInUser");
              navigate("/");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}
