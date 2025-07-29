import express from "express";
import userModel from "../models/user.js";

const accessDatabase = express.Router();

//kullanıcı verisini çekmek için
accessDatabase.get("/user", async (req, res) => {
  //body'den email'i alalım
  const { email } = req.body;

  //email yoksa hata döndür
  if (!email) return res.json({ success: false, msg: "email required" });

  try {
    // veritabanında kullanıcıyı arayalım
    const user = await userModel.findOne({ email });

    //yoksa hata
    if (!user)
      return res.json({ success: false, msg: "user couldn't have been found" });

    return res.json({
      success: true,
      msg: `${user.name} found`,
      data: { name: user.name, email: user.email },
    });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
});

export default accessDatabase;
