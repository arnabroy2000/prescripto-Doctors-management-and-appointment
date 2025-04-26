import jwt from "jsonwebtoken";

// Nurse authentication middleware
const authNurse = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized. Nurse login required.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.nurseId = decoded.id; // inject nurseId for later use
    next();
  } catch (error) {
    console.log("authNurse error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export default authNurse;
