import express from "express";
import levelsModel from "../models/levels.js";
import userModel from "../models/user.js";

const accessDatabase = express.Router();
//istek atan kişinin verisini çekmek için
accessDatabase.get("/me", async (req, res) => {
  //req.user tanımlı değilse hata
  const user = req.user;
  if (!user)
    return res.status(401).json({ success: false, msg: "token error" });

  try {
    //Normal kullanıcı yanıtı
    return res.status(200).json({
      success: true,
      msg: `${user.role === "guest" ? "Guest" : "Normal"} user data`,
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

//tüm levelleri çekmek için bir endpoint
accessDatabase.get("/all-levels", async (req, res) => {
  try {
    //tüm level verilerini çek
    const allLevels = await levelsModel.find();

    if (!allLevels)
      return res.status(200).json({
        success: false,
        msg: "there are no data to send in database",
        data: [],
      });

    return res
      .status(200)
      .json({ success: true, msg: "data found!!!", data: allLevels });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

//spesifik level verisi almak için
accessDatabase.get("/level", async (req, res) => {
  //parametre olarak gelen id'yi alalım ve veritabanında aratalım
  const { levelId } = req.query;

  try {
    const level = await levelsModel.findById(levelId);

    //o id'ye sahip bir level yoksa hata mesajı ve boş bir veri döndürelim
    if (!level)
      return res
        .status(404)
        .json({ success: false, msg: "level data not found!!!", data: {} });

    //varsa level verisini döndürelim
    return res
      .status(200)
      .json({ success: true, msg: "level data found!!!", data: level });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

//level tamamlama ve progress kaydetme endpoint'i
accessDatabase.post("/complete-level", async (req, res) => {
  const user = req.user;
  if (!user)
    return res.status(401).json({ success: false, msg: "token error" });

  const { levelId, wpm, timeSpent, mistakes } = req.body;

  try {
    //kullanıcıyı bul ve güncelle
    const foundUser = await userModel.findById(user._id);
    
    if (!foundUser)
      return res.status(404).json({ success: false, msg: "User not found" });

    //level completion verisini kaydet
    foundUser.levelsCompleted.set(levelId, {
      completedAt: new Date(),
      wpm: wpm,
      timeSpent: timeSpent,
      mistakes: mistakes || 0
    });

    //kullanıcıyı kaydet (pre-save hooks otomatik olarak WPM ve completion stats'ları güncelleyecek)
    await foundUser.save();

    return res.status(200).json({ 
      success: true, 
      msg: "Level completion saved successfully!",
      data: {
        topWPM: foundUser.topWPM,
        completionPercentage: foundUser.completionStats.percentage
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

export default accessDatabase;
