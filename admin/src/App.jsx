import React, { useContext } from "react";
import { DoctorContext } from "./context/DoctorContext";
import { AdminContext } from "./context/AdminContext";
import { NurseContext } from "./context/NurseContext";
import { TechnicianContext } from "./context/TechnicianContext";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import AddNurse from "./pages/Admin/AddNurse";
import NursesList from "./pages/Admin/NursesList";
import AddTechnician from "./pages/Admin/AddTechnician";
import TechniciansList from "./pages/Admin/TechniciansList";
import InventoryManagement from "./pages/Admin/InventoryManagement"; // ✅ NEW

// Doctor Pages
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

// Nurse Pages
import NurseDashboard from "./pages/Nurse/NurseDashboard";
import NurseInventory from "./pages/Nurse/NurseInventory"; // ✅ NEW

// Technician Pages
import TechnicianDashboard from "./pages/Technician/TechnicianDashboard";
import TechnicianAppointments from "./pages/Technician/TechnicianAppointments";

import Login from "./pages/Login";

const App = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);
  const { nToken } = useContext(NurseContext);
  const { tToken } = useContext(TechnicianContext);

  return dToken || aToken || nToken || tToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorsList />} />
          <Route path="/add-nurse" element={<AddNurse />} />
          <Route path="/nurse-list" element={<NursesList />} />
          <Route path="/add-technician" element={<AddTechnician />} />
          <Route path="/technician-list" element={<TechniciansList />} />
          <Route
            path="/inventory-management"
            element={<InventoryManagement />}
          />{" "}
          {/* ✅ Admin Inventory */}
          {/* Doctor Routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          {/* Nurse Routes */}
          <Route path="/nurse-dashboard" element={<NurseDashboard />} />
          <Route path="/nurse-inventory" element={<NurseInventory />} />{" "}
          {/* ✅ Nurse Inventory */}
          {/* Technician Routes */}
          <Route
            path="/technician-dashboard"
            element={<TechnicianDashboard />}
          />
          <Route
            path="/technician-appointments"
            element={<TechnicianAppointments />}
          />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  );
};

export default App;
