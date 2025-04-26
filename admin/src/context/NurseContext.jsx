// NurseContextProvider.js
import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const NurseContext = createContext();

const NurseContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [nToken, setNToken] = useState(localStorage.getItem("nToken") || "");
  const [profileData, setProfileData] = useState(false);

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/nurse/profile", {
        headers: { nToken },
      });
      setProfileData(data.nurse);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    nToken,
    setNToken,
    backendUrl,
    profileData,
    getProfileData,
  };

  return (
    <NurseContext.Provider value={value}>
      {props.children}
    </NurseContext.Provider>
  );
};

export default NurseContextProvider;
