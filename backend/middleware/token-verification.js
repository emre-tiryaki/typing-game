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
    //token'ı ayrıştır, eğer token geçersizse hata çıkar
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //kullanıcı bilgileri burada
    req.user = await userModel.findById(decoded.id);
    next();
  } catch (error) {
    //token süresi geçmiş
    if (error.name === "TokenExpiredError")
      return res
        .status(403)
        .json({ success: false, msg: "Token expired" });
    else if (error.name === "JsonWebTokenError")
      return res.status(403).json({ success: false, msg: "invalid Token" });
    else
      return res
        .status(500)
        .json({ success: false, msg: "Token verification error." });
  }
};
