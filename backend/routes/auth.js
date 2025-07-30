import express from "express";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const auth = express.Router();

//kayıt olmak
auth.post("/register", async (req, res) => {
  // get the parameters
  const { name, email, password } = req.body;

  // check if the parameters are valid
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ success: false, msg: "insufficient parameters" });

  try {
    // search for the user
    const existingUser = await userModel.findOne({ email });

    //if there is someone with the same email abort
    if (existingUser)
      return res
        .status(409)
        .json({ success: false, msg: "User already registered" });

    //şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // kullanıcıyı veritabanına at
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    // yeni kullanıcı için token oluşturalım
    const token = jwt.sign(
      { id: user._id, name: name },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // frontend'de cookie olarak jwt saklansın
    res.cookie("token", token, {
      httpOnly: true, // JS tarafından okunmaz sadece http isteklerinde
      secure: process.env.NODE_ENV === "production", // deploy zamanı https zorunlu olsun diye
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // farklı sitelere veri falan
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // bitiş
    return res.status(201).json({
      success: true,
      msg: `${user.name} registered successfully`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

//giriş yapmak
auth.post("/login", async (req, res) => {
  // email ve şifreyi al
  const { email, password } = req.body;

  // geçerliler mi diye bak
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, msg: "email and password are required" });

  try {
    // veritabanından kişiyi çek
    const user = await userModel.findOne({ email });

    //kişi yoksa hata
    if (!user)
      return res.status(401).json({ success: false, msg: "email is wrong" });

    //şifreleri karşılaştır
    const arePasswordsSame = await bcrypt.compare(password, user.password);

    //şifreler uyuşmuyor ise hata
    if (!arePasswordsSame)
      return res.status(401).json({ success: false, msg: "Password is wrong" });

    user.lastLogin = Date.now();

    // yeni token oluştur
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // frontend'de cookie olarak jwt saklansın
    res.cookie("token", token, {
      httpOnly: true, // JS tarafından okunmaz sadece http isteklerinde
      secure: process.env.NODE_ENV === "production", // deploy zamanı https zorunlu olsun diye
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // farklı sitelere veri falan
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // bitiş
    return res.status(200).json({
      success: true,
      msg: `${user.name} logged in successfully`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

//çıkış
auth.post("/logout", (req, res) => {
  try {
    //cookieleri temizle
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({ success: true, msg: "logged out" });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

//google ile giriş yapmak
auth.post("/google-login", async (req, res) => {
  // gelen google token'ını al
  const { token } = req.body;

  try {
    // google tokenı mı kontrol et
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    //token içeriğini al
    const payload = ticket.getPayload();
    const { name, email } = payload;

    //kullanıcı var mı bak
    const user = await userModel.findOne({ email });

    //yoksa oluştur
    if (!user) {
      user = new userModel({
        name,
        email,
        password: "google-oauth-user",
        isAccountVerified: true,
      });
      await user.save();
      res.status(201);
    } else res.status(200);

    // yeni token oluştur
    const jwtToken = jwt.sign(
      { id: user._id, name: name },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // frontend'de cookie olarak jwt saklansın
    res.cookie("token", jwtToken, {
      httpOnly: true, // JS tarafından okunmaz sadece http isteklerinde
      secure: process.env.NODE_ENV === "production", // deploy zamanı https zorunlu olsun diye
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // farklı sitelere veri falan
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // bitiş
    return res.json({
      success: true,
      msg: `${user.name} logged in with google successfully`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

export default auth;
