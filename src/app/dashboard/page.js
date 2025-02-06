"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState(null);

  const columns = [
    "Kayıt Tarihi",
    "Kayıt Yapan",
    "Bildiren",
    "Bildiren Tel",
    "Arıza",
    "Yeri",
    "Shop",
    "Atanan",
    "Aciliyet",
    "İş Bitimi Açıklama",
    "Tamamlama Tarihi",
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("loggedInUser");
      if (!storedUser) {
        router.push("/");
      } else {
        try {
          const parsedUser = JSON.parse(storedUser);
          setLoggedInUser(parsedUser?.username || "Guest");
        } catch (error) {
          console.error("Error parsing logged-in user:", error);
          router.push("/");
        }
      }
    }
  }, [router]);

  const handleNewRecordChange = (e, column) => {
    setNewRecord({ ...newRecord, [column]: e.target.value });
  };

  const validateForm = () => {
    for (let column of columns) {
      if (!newRecord[column] || newRecord[column].trim() === "") {
        setError(` "${column}" kısmı boş kalamaz.`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const addNewRecord = () => {
    if (!validateForm()) return;

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
    setNewRecord(records[index]);
    setEditIndex(index);
  };

  const deleteRecord = (index) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const logOut = () => {
    localStorage.removeItem("loggedInUser");
    router.push("/");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ARIZA KAYIT SİSTEMİ</h1>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">{loggedInUser}</span>
          <button
            onClick={logOut}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <table className="w-full bg-white border rounded mt-4">
        <thead>
          <tr>
            <th className="border p-2 text-left">Kayıt No</th>
            {columns.map((column, idx) => (
              <th key={idx} className="border p-2 text-left">
                {column}
              </th>
            ))}
            <th className="border p-2">Seçenekler</th>
          </tr>

          <tr>
            <td className="border p-2 text-center">#</td>
            {columns.map((column, idx) => (
              <td key={idx} className="border p-2">
                <input
                  type={column.includes("Date") ? "date" : "text"}
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
                {editIndex !== null ? "Update" : "Ekle"}
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
              <td className="border p-2 text-center flex">
                <button
                  onClick={() => editRecord(index)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteRecord(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
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
