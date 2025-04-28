import React, { useContext, useEffect } from "react";
import { NurseContext } from "../../context/NurseContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const NurseDashboard = () => {
  const { nToken, profileData, getProfileData } = useContext(NurseContext); // ✅ Fix here
  const { currency } = useContext(AppContext);

  useEffect(() => {
    if (nToken) {
      getProfileData();
    }
  }, [nToken]);

  return (
    profileData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {profileData.experience}
              </p>
              <p className="text-gray-400">Experience</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {profileData.speciality}
              </p>
              <p className="text-gray-400">Speciality</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.list_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {profileData.available ? "Available" : "Not Available"}
              </p>
              <p className="text-gray-400">Status</p>
            </div>
          </div>
        </div>

        <div className="bg-white mt-8">
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
            <img src={assets.profile_icon} alt="" />
            <p className="font-semibold">Nurse Profile</p>
          </div>

          <div className="p-6 text-gray-700">
            <p>
              <b>Name:</b> {profileData.name}
            </p>
            <p>
              <b>Email:</b> {profileData.email}
            </p>
            <p>
              <b>Experience:</b> {profileData.experience}
            </p>
            <p>
              <b>Speciality:</b> {profileData.speciality}
            </p>
            <p>
              <b>About:</b> {profileData.about || "No description available."}
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default NurseDashboard;
