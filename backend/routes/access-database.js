import express from "express";

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
    if (user.isGuest) {
      //misafir kullanıcı yanıtı
      return res.status(200).json({
        success: true,
        msg: "Guest user data",
        data: {
          name: user.name,
          isGuest: true,
          levelCompleted: user.levelsCompleted || {},
          topWPM: user.topWPM || 0,
          completionStats: user.completionStats || { percentage: 0 },
        },
      });
    } else {
      //Normal kullanıcı yanıtı
      return res.status(200).json({
        success: true,
        msg: "Normal user data",
        data: {
          name: user.name,
          isGuest: false,
          levelCompleted: user.levelsCompleted || {},
          topWPM: user.topWPM || 0,
          completionStats: user.completionStats || { percentage: 0 },
          isAccountVerified: user.isAccountVerified,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

//şimdilik email'e göre arama silindi

export default accessDatabase;
