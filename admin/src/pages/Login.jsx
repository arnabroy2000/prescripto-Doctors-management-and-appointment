import axios from "axios";
import React, { useContext, useState } from "react";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TechnicianContext } from "../context/TechnicianContext";
import { NurseContext } from "../context/NurseContext";

const Login = () => {
  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { setDToken } = useContext(DoctorContext);
  const { setAToken } = useContext(AdminContext);
  const { setTToken } = useContext(TechnicianContext);
  const { setNToken } = useContext(NurseContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const endpoint = `${backendUrl}/api/${role.toLowerCase()}/login`;
      const { data } = await axios.post(endpoint, { email, password });

      if (data.success) {
        toast.success(`${role} login successful`);

        switch (role) {
          case "Admin":
            setAToken(data.token);
            localStorage.setItem("aToken", data.token);
            navigate("/admin/dashboard");
            break;
          case "Doctor":
            setDToken(data.token);
            localStorage.setItem("dToken", data.token);
            navigate("/doctor/dashboard");
            break;
          case "Nurse":
            setNToken(data.token);
            localStorage.setItem("nToken", data.token);
            navigate("/nurse/dashboard");
            break;
          case "Technician":
            setTToken(data.token);
            localStorage.setItem("tToken", data.token);
            navigate("/technician/dashboard");
            break;
          default:
            break;
        }
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Something went wrong during login"
      );
    } finally {
      setLoading(false);
    }
  };

  const roles = ["Admin", "Doctor", "Nurse", "Technician"];

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{role}</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="w-full text-center mt-2">
          Switch Role:{" "}
          {roles
            .filter((r) => r !== role)
            .map((r, index) => (
              <span
                key={r}
                onClick={() => setRole(r)}
                className="text-primary underline cursor-pointer mx-1"
              >
                {r}
                {index < roles.length - 2 ? "," : ""}
              </span>
            ))}
        </p>
      </div>
    </form>
  );
};

export default Login;
