import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  const columns = [
    "Record Date",
    "Approver",
    "Reporter",
    "Phone Number",
    "Issue",
    "Location",
    "Shop",
    "Assigned",
    "Urgency",
    "Report",
    "Completion Date",
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("loggedInUser");
      const storedRecords = localStorage.getItem("records");

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setLoggedInUser(parsedUser?.username || "Guest");
        } catch (error) {
          console.error("Error parsing logged-in user:", error);
          navigate("/");
        }
      } else {
        navigate("/");
      }

      if (storedRecords) {
        try {
          setRecords(JSON.parse(storedRecords));
        } catch (error) {
          console.error("Error parsing records:", error);
        }
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      localStorage.setItem("records", JSON.stringify(records));
    }
  }, [records]);

  const handleNewRecordChange = (e, column) => {
    setNewRecord((prev) => ({ ...prev, [column]: e.target.value }));
  };

  const addNewRecord = () => {
    if (editIndex !== null) {
      const updatedRecords = [...records];
      updatedRecords[editIndex] = { ...newRecord, "Record No": editIndex + 1 };
      setRecords(updatedRecords);
      setEditIndex(null);
    } else {
      const newRecordWithId = { "Record No": records.length + 1, ...newRecord };
      setRecords([...records, newRecordWithId]);
    }
    setNewRecord({});
  };

  const editRecord = (index) => {
    setNewRecord({ ...records[index] });
    setEditIndex(index);
  };

  const deleteRecord = (index) => {
    const updatedRecords = records
      .filter((_, i) => i !== index)
      .map((record, i) => ({ ...record, "Record No": i + 1 }));
    setRecords(updatedRecords);
  };

  const logOut = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">FAULTY RECORD SYSTEM</h1>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">{loggedInUser}</span>
          <button
            onClick={logOut}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Log Off
          </button>
        </div>
      </div>

      <table className="w-full bg-white border rounded mt-4">
        <thead>
          <tr>
            <th className="border p-2 text-left">Record No</th>
            {columns.map((column, idx) => (
              <th key={idx} className="border p-2 text-left">
                {column}
              </th>
            ))}
            <th className="border p-2">Options</th>
          </tr>
          <tr>
            <td className="border p-2 text-center">#</td>
            {columns.map((column, idx) => (
              <td key={idx} className="border p-2">
                <input
                  type="text"
                  placeholder={`Enter ${column}`}
                  value={newRecord[column] || ""}
                  onChange={(e) => handleNewRecordChange(e, column)}
                  className="border p-1 w-full text-sm"
                />
              </td>
            ))}
            <td className="border p-2 text-center">
              <button
                onClick={addNewRecord}
                className={`px-4 py-2 rounded text-white ${
                  editIndex !== null ? "bg-yellow-500" : "bg-blue-500"
                }`}
              >
                {editIndex !== null ? "Update" : "Add"}
              </button>
            </td>
          </tr>
        </thead>

        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td className="border p-2 text-center">{record["Record No"]}</td>
              {columns.map((column, idx) => (
                <td key={idx} className="border p-2">
                  {record[column] || "-"}
                </td>
              ))}
              <td className="border p-2 text-center flex justify-between">
                <button
                  onClick={() => editRecord(index)}
                  className="bg-green-500 text-white px-3 py-1 mr-2 rounded w-[40px] h-[40px]"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteRecord(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded w-[40px] h-[40px]"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
