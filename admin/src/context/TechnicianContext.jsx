// TechnicianContextProvider.js
import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const TechnicianContext = createContext();

const TechnicianContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [tToken, setTToken] = useState(localStorage.getItem("tToken") || "");
  const [profileData, setProfileData] = useState(false);

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/technician/profile", {
        headers: { tToken },
      });
      setProfileData(data.technician);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    tToken,
    setTToken,
    backendUrl,
    profileData,
    getProfileData,
  };

  return (
    <TechnicianContext.Provider value={value}>
      {props.children}
    </TechnicianContext.Provider>
  );
};

export default TechnicianContextProvider;
