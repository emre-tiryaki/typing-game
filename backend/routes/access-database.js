import express from "express";
import userModel from "../models/user.js";

const accessDatabase = express.Router();

//kendi verini çekmek için
accessDatabase.get("/me", async (req, res) => {
  //req.user tanımlı değilse hata
  const user = req.user;
  if (!user)
    return res.status(400).json({ success: false, msg: "token error" });

  let data = {};

  if(user.isGuest){
    res.status(200) // değişir burdaki kod
    data = {
      name: user.name,
      levelsCompleted: new Map({}),
      starCount: 0,
      topWPM: 0,
    }
  }

  try {
    return res.json({
      success: true,
      msg: `${user.name} found`,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

//email'e göre istenen kullanıcının verisini çekmek için
accessDatabase.get("/user", async (req, res) => {
  //body'den email'i alalım
  const { email } = req.user;

  //email yoksa hata döndür
  if (!email)
    return res.status(400).json({ success: false, msg: "email required" });

  try {
    // veritabanında kullanıcıyı arayalım
    const user = await userModel.findOne({ email });

    //yoksa hata
    if (!user)
      return res
        .status(404)
        .json({ success: false, msg: "user couldn't have been found" });

    return res.status(200).json({
      success: true,
      msg: `${user.name} found`,
      data: {
        name: user.name,
        email: user.email,
        lastLogin: user.lastLogin,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

export default accessDatabase;
