import express from "express";
import userModel from "../models/user.js";

const accessDatabase = express.Router();
/**
 * TODO: kullanıcıya isim, levelsCompleted, topWPM, isAccountVerified
 * 
 */
//kendi verini çekmek için
accessDatabase.get("/me", async (req, res) => {
  //req.user tanımlı değilse hata
  const user = req.user;
  if (!user)
    return res.status(400).json({ success: false, msg: "token error" });

  try {
    if (user.isGuest) {
      return res.status(200).json({
        success: true,
        msg: `${user.name} found`,
        data: {
          name: user.name,
          email: null,
          lastLogin: user.lastLogin,
          isAccountVerified: user.isAccountVerified,
        },
      });
    }

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

//şimdilik email'e göre arama silindi

export default accessDatabase;
