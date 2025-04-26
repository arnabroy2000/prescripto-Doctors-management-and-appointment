import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const { token, backendUrl, userData, setUserData, loadUserProfileData } =
    useContext(AppContext);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const checkRisk = async () => {
    try {
      if (userData.riskLevel !== "Unknown") return;

      const { data } = await axios.post(
        backendUrl + "/api/user/get-risk-level",
        { userId: userData._id },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(`Risk Level: ${data.riskLevel}`);
        await loadUserProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Risk check failed");
    }
  };

  const getRiskBadgeClasses = (level) => {
    if (level === "High") return "bg-red-500 text-white animate-pulse";
    if (level === "Medium") return "bg-yellow-400 text-black animate-pulse";
    if (level === "Low") return "bg-green-500 text-white animate-pulse";
    return "bg-gray-400 text-white";
  };

  return userData ? (
    <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">
      {isEdit ? (
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer">
            <img
              className="w-36 rounded opacity-75"
              src={image ? URL.createObjectURL(image) : userData.image}
              alt=""
            />
            <img
              className="w-10 absolute bottom-12 right-12"
              src={image ? "" : assets.upload_icon}
              alt=""
            />
          </div>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
          />
        </label>
      ) : (
        <img className="w-36 rounded" src={userData.image} alt="" />
      )}

      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60"
          type="text"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
          value={userData.name}
        />
      ) : (
        <p className="font-medium text-3xl text-[#262626] mt-4">
          {userData.name}
        </p>
      )}

      <hr className="bg-[#ADADAD] h-[1px] border-none" />

      <div>
        <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{userData.email}</p>
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-50 max-w-52"
              type="text"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
              value={userData.phone}
            />
          ) : (
            <p className="text-blue-500">{userData.phone}</p>
          )}
          <p className="font-medium">Address:</p>
          {isEdit ? (
            <p>
              <input
                className="bg-gray-50"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                value={userData.address.line1}
              />
              <br />
              <input
                className="bg-gray-50"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                value={userData.address.line2}
              />
            </p>
          ) : (
            <p className="text-gray-500">
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-[#797979] underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-50"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData.gender}
            >
              <option value="Not Selected">Not Selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-500">{userData.gender}</p>
          )}
          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              className="max-w-28 bg-gray-50"
              type="date"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              value={userData.dob}
            />
          ) : (
            <p className="text-gray-500">{userData.dob}</p>
          )}
        </div>
      </div>

      <div>
        <p className="text-[#797979] underline mt-6">MEDICAL HISTORY</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
          <p className="font-medium">Chronic Conditions:</p>
          <p>
            {userData.medicalHistory?.chronicConditions?.join(", ") || "None"}
          </p>
          <p className="font-medium">Allergies:</p>
          <p>{userData.medicalHistory?.allergies?.join(", ") || "None"}</p>
          <p className="font-medium">Surgeries:</p>
          <p>{userData.medicalHistory?.surgeries?.join(", ") || "None"}</p>
          <p className="font-medium">Medications:</p>
          <p>{userData.medicalHistory?.medications?.join(", ") || "None"}</p>
          <p className="font-medium">Immunizations:</p>
          <p>{userData.medicalHistory?.immunizations?.join(", ") || "None"}</p>
        </div>
      </div>

      <div>
        <p className="text-[#797979] underline mt-6">INPATIENT DETAILS</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
          <p className="font-medium">Admitted:</p>
          <p>{userData.inpatient?.isAdmitted ? "Yes" : "No"}</p>
          <p className="font-medium">Room Number:</p>
          <p>{userData.inpatient?.roomNumber || "N/A"}</p>
          <p className="font-medium">Admission Date:</p>
          <p>
            {userData.inpatient?.admissionDate
              ? new Date(userData.inpatient.admissionDate).toLocaleDateString()
              : "N/A"}
          </p>
          <p className="font-medium">Discharge Date:</p>
          <p>
            {userData.inpatient?.dischargeDate
              ? new Date(userData.inpatient.dischargeDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <div>
        <p className="text-[#797979] underline mt-6">BILLING INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
          <p className="font-medium">Insurance Provider:</p>
          <p>{userData.billing?.insuranceProvider || "N/A"}</p>
          <p className="font-medium">Policy Number:</p>
          <p>{userData.billing?.policyNumber || "N/A"}</p>
          <p className="font-medium">Outstanding Balance:</p>
          <p>₹ {userData.billing?.outstandingBalance || 0}</p>
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Save information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Edit
          </button>
        )}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={checkRisk}
          className="border border-blue-600 px-6 py-2 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
        >
          Check Risk
        </button>
        <span
          className={`px-4 py-1 rounded-full font-semibold text-sm ${getRiskBadgeClasses(
            userData.riskLevel
          )}`}
        >
          Risk: {userData.riskLevel}
        </span>
      </div>
    </div>
  ) : null;
};

export default MyProfile;
