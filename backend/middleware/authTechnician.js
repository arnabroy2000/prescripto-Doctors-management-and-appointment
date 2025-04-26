import jwt from "jsonwebtoken";

// Technician authentication middleware
const authTechnician = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized. Technician login required.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.technicianId = decoded.id; // inject technicianId for later use
    next();
  } catch (error) {
    console.log("authTechnician error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export default authTechnician;
