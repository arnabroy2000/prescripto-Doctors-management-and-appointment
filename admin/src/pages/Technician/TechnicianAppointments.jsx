import React, { useContext, useEffect, useState } from "react";
import { TechnicianContext } from "../../context/TechnicianContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const TechnicianAppointments = () => {
  const { tToken } = useContext(TechnicianContext);
  const { backendUrl } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [chronicConditions, setChronicConditions] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [medications, setMedications] = useState([]);
  const [remarks, setRemarks] = useState("");

  const placeholderImage =
    "https://res.cloudinary.com/dbgnvymjy/image/upload/v1745733562/lkmr9bz4aotrr1qg4cw7.png"; // ✅ your uploaded placeholder image

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/technician/list-tests",
        { headers: { token: tToken } }
      );

      if (data.success && Array.isArray(data.assignedTests)) {
        setAppointments(data.assignedTests.reverse());
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return `${date.getDate()}-${date.toLocaleString("default", {
      month: "short",
    })}-${date.getFullYear()}`;
  };

  const handleSubmitReport = async (testId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/technician/upload-report",
        {
          testId,
          chronicConditions,
          allergies,
          surgeries,
          medications,
          remarks,
        },
        { headers: { token: tToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setSelectedTest(null);
        resetForm();
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setChronicConditions([]);
    setAllergies([]);
    setSurgeries([]);
    setMedications([]);
    setRemarks("");
  };

  const handleListInput = (value, setter) => {
    setter(
      value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "")
    );
  };

  useEffect(() => {
    if (tToken) {
      getAppointments();
    }
  }, [tToken]);

  return (
    <div className="m-5">
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6">Assigned Tests</h1>

        {appointments.length > 0 ? (
          <div className="flex flex-col gap-6">
            {appointments.map((test, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 border border-gray-200 p-4 rounded-lg hover:shadow transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      className="w-16 h-16 rounded-full object-cover bg-gray-100"
                      src={test.patientImage || placeholderImage}
                      alt="Patient"
                      onError={(e) => (e.target.src = placeholderImage)}
                    />
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-gray-700">
                        {test.userName || "Patient"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Test Date: {formatDate(test.testDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Test Name: {test.testName || "Test"}
                      </p>
                    </div>
                  </div>

                  {test.status !== "Completed" && (
                    <button
                      className="bg-primary hover:bg-blue-700 text-white font-medium py-1 px-4 rounded text-sm"
                      onClick={() => setSelectedTest(test)}
                    >
                      Submit Report
                    </button>
                  )}
                </div>

                {selectedTest?._id === test._id && (
                  <div className="mt-3 flex flex-col gap-3">
                    <textarea
                      className="border p-2 rounded text-sm"
                      placeholder="Remarks (optional)"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    ></textarea>

                    <input
                      className="border p-2 rounded text-sm"
                      placeholder="Chronic Conditions (comma separated)"
                      onChange={(e) =>
                        handleListInput(e.target.value, setChronicConditions)
                      }
                    />
                    <input
                      className="border p-2 rounded text-sm"
                      placeholder="Allergies (comma separated)"
                      onChange={(e) =>
                        handleListInput(e.target.value, setAllergies)
                      }
                    />
                    <input
                      className="border p-2 rounded text-sm"
                      placeholder="Surgeries (comma separated)"
                      onChange={(e) =>
                        handleListInput(e.target.value, setSurgeries)
                      }
                    />
                    <input
                      className="border p-2 rounded text-sm"
                      placeholder="Medications (comma separated)"
                      onChange={(e) =>
                        handleListInput(e.target.value, setMedications)
                      }
                    />

                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                        onClick={() => handleSubmitReport(test._id)}
                      >
                        Submit
                      </button>
                      <button
                        className="border px-4 py-1 rounded text-sm"
                        onClick={() => {
                          setSelectedTest(null);
                          resetForm();
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-20">
            No tests assigned yet
          </p>
        )}
      </div>
    </div>
  );
};

export default TechnicianAppointments;
