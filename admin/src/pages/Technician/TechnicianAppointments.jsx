import React, { useContext, useEffect, useState } from "react";
import { TechnicianContext } from "../../context/TechnicianContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const TechnicianAppointments = () => {
  const { tToken } = useContext(TechnicianContext);
  const { backendUrl, slotDateFormat, currency } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/technician/appointments",
        {
          headers: { tToken },
        }
      );
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (tToken) {
      getAppointments();
    }
  }, [tToken]);

  return (
    <div className="m-5">
      <div className="bg-white p-6 rounded">
        <h1 className="text-xl font-semibold mb-6">Technician Tasks</h1>

        {appointments.length > 0 ? (
          <div className="flex flex-col gap-4">
            {appointments.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border rounded hover:bg-gray-100"
              >
                <img
                  className="w-14 h-14 rounded-full"
                  src={item.patientImage || assets.profile_icon}
                  alt="Patient"
                />

                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {item.patientName || "Patient Name"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Task Date: {slotDateFormat(item.taskDate || item.createdAt)}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Task Type: {item.taskType || "General Test"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-primary font-semibold">
                    {currency} {item.amount || 0}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.status || "Pending"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-20">
            No tasks/appointments yet
          </p>
        )}
      </div>
    </div>
  );
};

export default TechnicianAppointments;
