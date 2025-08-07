import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

//kullanıcı token'ını doğrulamak için
export const verifyToken = async (req, res, next) => {
  //token'ı cookie'lerden yada header'lardan al
  const authHeader = req.headers.authorization;
  const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);

  //token verilmemişse hata
  if (!token)
    return res.status(401).json({ success: false, msg: "Token is missing " });

  try {
    // Token'ı doğrula ve çöz
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Kullanıcıyı veritabanından bul
    const user = await userModel.findById(decoded.id).lean();

    if (!user)
      return res.status(404).json({ success: false, msg: "User not found" });
    
    req.user = user;
    next();
  } catch (error) {
    //token süresi geçmiş
    if (error.name === "TokenExpiredError")
      return res.status(403).json({ success: false, msg: "Token expired" });
    else if (error.name === "JsonWebTokenError")
      return res.status(403).json({ success: false, msg: "invalid Token" });
    else
      return res
        .status(500)
        .json({ success: false, msg: "Token verification error." });
  }
};

export const verifyAdmin = async (req, res, next) => {
  const user = req.user;

  if(!user)
    return res.status(403).json({ success: false, msg: "User authentication required to access this resource." });

  if(user.role === "admin")
    next();
  else
    return res.status(401).json({ success: false, msg: "Unauthorized: Admin access required." });
};