import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]); // ✅
  const [technicians, setTechnicians] = useState([]); // ✅
  const [dashData, setDashData] = useState(false);

  // Doctor APIs
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/all-doctors", {
        headers: { aToken },
      });
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeDoctorAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-doctor-availability",
        { docId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Nurse APIs
  const getAllNurses = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/all-nurses", {
        headers: { aToken },
      });
      if (data.success) {
        setNurses(data.nurses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeNurseAvailability = async (nurseId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-nurse-availability",
        { nurseId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllNurses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Technician APIs
  const getAllTechnicians = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/all-technicians",
        { headers: { aToken } }
      );
      if (data.success) {
        setTechnicians(data.technicians);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeTechnicianAvailability = async (technicianId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-technician-availability",
        { technicianId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllTechnicians();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Appointment APIs
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { aToken },
      });
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

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Dashboard Data
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    nurses,
    technicians,
    appointments,
    dashData,
    // Doctors
    getAllDoctors,
    changeDoctorAvailability,
    // Nurses
    getAllNurses,
    changeNurseAvailability,
    // Technicians
    getAllTechnicians,
    changeTechnicianAvailability,
    // Appointments
    getAllAppointments,
    cancelAppointment,
    // Dashboard
    getDashData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
