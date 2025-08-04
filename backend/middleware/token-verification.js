import jwt from "jsonwebtoken";

//kullanıcı token'ını doğrulamak için
export const verifyToken = (req, res, next) => {
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
    req.user = decoded;
    next();
  } catch (error) {
    //token süresi geçmiş
    if (err.name === "TokenExpiredError")
      return res
        .status(403)
        .json({ success: false, msg: "Token süresi dolmuş." });
    else if (err.name === "JsonWebTokenError")
      return res.status(403).json({ success: false, msg: "Token geçersiz." });
    else
      return res
        .status(500)
        .json({ success: false, msg: "Token doğrulama hatası." });
  }
};
