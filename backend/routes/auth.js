import express from "express";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { tokenGenerator } from "../utils/token-generator.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const auth = express.Router();

// Kullanıcının giriş yapmış olup olmadığını kontrol et
auth.get("/check", async (req, res) => {
  // cookie'lerden token'ı al
  const token = req.cookies.token;

  //token yoksa hata var
  if (!token) {
    return res.status(401).json({
      success: false,
      loggedIn: false,
      message: "Authentication token is missing.",
    });
  }

  try {
    //token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //kullanıcıyı veritabanında ara
    const user = await userModel.findById(decoded.id).lean();

    //kullanıcı yoksa hata var
    if (!user) {
      return res.status(401).json({
        success: false,
        loggedIn: false,
        message: "Invalid authentication token.",
      });
    }

    //başarılı cevap
    return res.status(200).json({
      success: true,
      loggedIn: true,
      message: "User is authenticated.",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      loggedIn: false,
      message: "Authentication failed.",
      error: error.message,
    });
  }
});

//kayıt olmak
auth.post("/register", async (req, res) => {
  // parametreleri al
  const { name, email, password } = req.body;

  // parametreler geçerli mi kontrol et
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ success: false, msg: "insufficient parameters" });

  try {
    // kullanıcıyı ara
    const existingUser = await userModel.findOne({ email });

    //aynı email ile birisi varsa iptal et
    if (existingUser)
      return res
        .status(409)
        .json({ success: false, msg: "User already registered" });

    //şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // kullanıcıyı veritabanına at
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    tokenGenerator(res, { id: user._id, name: name, isGuest: false });

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
    await user.save(); //kullanıcının son girişini güncelleyip kayıt ediyoruz

    tokenGenerator(res, { id: user._id, name: name, isGuest: false });

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
    //çerezleri temizle
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
    // google token'ı mı kontrol et
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
      user.lastLogin = Date.now();
      await user.save();
    }

    tokenGenerator(res, { id: user._id, name: name, isGuest: false });

    // bitiş
    return res.status(200).json({
      success: true,
      msg: `${user.name} logged in with google successfully`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

export default auth;
