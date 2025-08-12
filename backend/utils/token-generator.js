import jwt from "jsonwebtoken";

export const tokenGenerator = async (res, payload) => {
  // yeni kullanıcı için token oluşturalım
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  // frontend'de cookie olarak jwt saklansın
  res.cookie("token", token, {
    httpOnly: true, // JS tarafından okunmaz sadece http isteklerinde
    secure: process.env.NODE_ENV === "production", // deploy zamanı https zorunlu olsun diye
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // farklı sitelere veri falan
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
  });
};
