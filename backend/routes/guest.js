import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const guest = express.Router();

//misafir kullanıcı girişi için
guest.post("/", (req, res) => {
  const id = crypto.randomBytes(16).toString("hex");
  const name = `Guest-${id}`;

  try {
    // yeni token oluştur
    const jwtToken = jwt.sign({ id: id, name: name }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // frontend'de cookie olarak jwt saklansın
    res.cookie("token", jwtToken, {
      httpOnly: true, // JS tarafından okunmaz sadece http isteklerinde
      secure: process.env.NODE_ENV === "production", // deploy zamanı https zorunlu olsun diye
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // farklı sitelere veri falan
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
    });

    // bitiş
    return res.json({
      success: true,
      msg: `${name} logged in as guest`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

export default guest;
