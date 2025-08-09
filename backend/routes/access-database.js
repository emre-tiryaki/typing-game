import express from "express";
import userModel from "../models/user.js";
import levelsModel from "../models/levels.js";

const accessDatabase = express.Router();
//kendi verini çekmek için
accessDatabase.get("/me", async (req, res) => {
  //req.user tanımlı değilse hata
  const user = req.user;
  if (!user)
    return res.status(401).json({ success: false, msg: "token error" });

  try {
    //Normal kullanıcı yanıtı
    return res.status(200).json({
      success: true,
      msg:  `${user.role === "guest" ? "Guest" : "Normal"} user data`,
      data: {
        name: user.name,
        role: user.role,
        levelCompleted: user.levelsCompleted || {},
        topWPM: user.topWPM || 0,
        completionStats: user.completionStats || { percentage: 0 },
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

//şimdilik email'e göre arama silindi

export default accessDatabase;
