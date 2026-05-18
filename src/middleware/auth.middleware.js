import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    console.log("cookies:", req.cookies);
    console.log("token:", req.cookies?.token);

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.log("auth error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authMiddleware;