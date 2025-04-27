import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyTests = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [tests, setTests] = useState([]);

  const getMyTests = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/list-test", {
        headers: { token },
      });
      if (data.success) {
        setTests(data.tests);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // ✅ Add this new function for formatting
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options); // e.g., 24 Apr 2025
  };

  useEffect(() => {
    if (token) {
      getMyTests();
    }
  }, [token]);

  return (
    <div className="m-5">
      <h1 className="text-2xl font-bold mb-4">My Tests</h1>

      {tests.length === 0 ? (
        <p className="text-gray-500">No tests booked yet.</p>
      ) : (
        <div className="grid gap-4">
          {tests.map((test, index) => (
            <div key={index} className="border p-4 rounded shadow">
              <p>
                <strong>Test Name:</strong> {test.testName}
              </p>
              <p>
                <strong>Test Date:</strong> {formatDate(test.testDate)}
              </p>
              <p>
                <strong>Status:</strong> {test.status}
              </p>
              {test.reportUrl && (
                <p className="text-green-500">
                  <a href={test.reportUrl} target="_blank" rel="noreferrer">
                    View Report
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTests;
