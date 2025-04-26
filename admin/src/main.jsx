import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import AdminContextProvider from "./context/AdminContext.jsx";
import DoctorContextProvider from "./context/DoctorContext.jsx";
import AppContextProvider from "./context/AppContext.jsx";
import NurseContextProvider from "./context/NurseContext.jsx"; // ✅ Add this
import TechnicianContextProvider from "./context/TechnicianContext.jsx"; // ✅ Add this

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
        <NurseContextProvider>
          {" "}
          {/* ✅ wrap */}
          <TechnicianContextProvider>
            {" "}
            {/* ✅ wrap */}
            <AppContextProvider>
              <App />
            </AppContextProvider>
          </TechnicianContextProvider>
        </NurseContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);
