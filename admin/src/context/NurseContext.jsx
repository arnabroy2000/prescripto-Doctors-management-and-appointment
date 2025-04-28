import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const NurseContext = createContext();

const NurseContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [nToken, setNToken] = useState(localStorage.getItem("nToken") || "");
  const [profileData, setProfileData] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);

  // --------------------
  // GET Nurse Profile
  // --------------------
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/nurse/profile", {
        headers: { token: nToken }, // ✅ use 'token' header
      });
      if (data.success) {
        setProfileData(data.nurse);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // --------------------
  // INVENTORY APIs (Nurse Inventory Access)
  // --------------------

  const getAllInventoryItems = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/nurse/inventory/list", // ✅ Nurse route (not admin route)
        {
          headers: { token: nToken },
        }
      );
      if (data.success) {
        setInventoryItems(data.items);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const addInventoryItem = async (itemData) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/nurse/inventory/add",
        itemData,
        {
          headers: { token: nToken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAllInventoryItems();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateInventoryItem = async (id, updateData) => {
    try {
      const { data } = await axios.put(
        backendUrl + `/api/nurse/inventory/update/${id}`,
        updateData,
        {
          headers: { token: nToken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAllInventoryItems();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteInventoryItem = async (id) => {
    try {
      const { data } = await axios.delete(
        backendUrl + `/api/nurse/inventory/delete/${id}`,
        {
          headers: { token: nToken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAllInventoryItems();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // --------------------
  // Provider Values
  // --------------------
  const value = {
    nToken,
    setNToken,
    backendUrl,
    profileData,
    getProfileData,

    inventoryItems,
    getAllInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  };

  return (
    <NurseContext.Provider value={value}>
      {props.children}
    </NurseContext.Provider>
  );
};

export default NurseContextProvider;
