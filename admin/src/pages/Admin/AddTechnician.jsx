import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AddTechnician = () => {
  const [techImg, setTechImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Radiology");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!techImg) {
        return toast.error("Image Not Selected");
      }

      const formData = new FormData();
      formData.append("image", techImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("department", department);
      formData.append("skills", JSON.stringify(skills.split(",")));
      formData.append("experience", experience);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-technician",
        formData,
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setTechImg(false);
        setName("");
        setEmail("");
        setPassword("");
        setDepartment("Radiology");
        setSkills("");
        setExperience("1 Year");
        setAddress1("");
        setAddress2("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Technician</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="tech-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={techImg ? URL.createObjectURL(techImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setTechImg(e.target.files[0])}
            type="file"
            id="tech-img"
            hidden
          />
          <p>
            Upload technician <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Technician Name"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border rounded px-2 py-2"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Years</option>
                <option value="3 Year">3 Years</option>
                <option value="5 Year">5 Years</option>
                <option value="8 Year">8 Years</option>
              </select>
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Department</p>
              <select
                onChange={(e) => setDepartment(e.target.value)}
                value={department}
                className="border rounded px-2 py-2"
              >
                <option value="Radiology">Radiology</option>
                <option value="Pathology">Pathology</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Blood Bank">Blood Bank</option>
                <option value="Operation Theatre">Operation Theatre</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Skills (comma separated)</p>
              <input
                onChange={(e) => setSkills(e.target.value)}
                value={skills}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Example: X-Ray, MRI, CT-Scan"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Address 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Address 2"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Technician
        </button>
      </div>
    </form>
  );
};

export default AddTechnician;
