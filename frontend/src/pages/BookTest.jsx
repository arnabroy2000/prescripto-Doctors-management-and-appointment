import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BookTest = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [testName, setTestName] = useState("");
  const [testDate, setTestDate] = useState("");

  const handleBookTest = async (e) => {
    e.preventDefault();

    if (!testName || !testDate) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/book-test",
        { testName, testDate },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/my-tests"); // or redirect wherever you want
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleBookTest}
      className="flex flex-col gap-6 max-w-lg mx-auto mt-16 p-6 bg-white rounded shadow"
    >
      <h1 className="text-2xl font-bold text-center text-primary">
        Book a Test
      </h1>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-600">Test Name</label>
        <input
          type="text"
          placeholder="e.g. Blood Test, MRI Scan"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          className="border rounded px-4 py-2"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-600">Test Date</label>
        <input
          type="date"
          value={testDate}
          onChange={(e) => setTestDate(e.target.value)}
          className="border rounded px-4 py-2"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-primary text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Book Test
      </button>
    </form>
  );
};

export default BookTest;
