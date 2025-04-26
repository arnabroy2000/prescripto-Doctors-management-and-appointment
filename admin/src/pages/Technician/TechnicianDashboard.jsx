import React, { useContext, useEffect } from "react";
import { TechnicianContext } from "../../context/TechnicianContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const TechnicianDashboard = () => {
  const { tToken, technicianProfile, getProfileData } =
    useContext(TechnicianContext);
  const { currency } = useContext(AppContext);

  useEffect(() => {
    if (tToken) {
      getProfileData();
    }
  }, [tToken]);

  return (
    technicianProfile && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {technicianProfile.experience}
              </p>
              <p className="text-gray-400">Experience</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {technicianProfile.department}
              </p>
              <p className="text-gray-400">Department</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.list_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {technicianProfile.available ? "Available" : "Not Available"}
              </p>
              <p className="text-gray-400">Status</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.profile_icon} alt="" />
            <p className="font-semibold">Technician Profile</p>
          </div>

          <div className="p-6 text-gray-700">
            <p>
              <b>Name:</b> {technicianProfile.name}
            </p>
            <p>
              <b>Email:</b> {technicianProfile.email}
            </p>
            <p>
              <b>Experience:</b> {technicianProfile.experience}
            </p>
            <p>
              <b>Department:</b> {technicianProfile.department}
            </p>
            <p>
              <b>Skills:</b>{" "}
              {technicianProfile.skills
                ? technicianProfile.skills.join(", ")
                : "No skills mentioned"}
            </p>
            <p>
              <b>About:</b>{" "}
              {technicianProfile.about || "No description available."}
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default TechnicianDashboard;
