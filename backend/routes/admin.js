import express from "express";
import levelsModel from "../models/levels.js";

const admin = express.Router();

//level eklemek için gerekli endpoint
admin.post("/add-level", async (req, res) => {
  // level bilgilerini(isim, açıklama, zorluk,veri) al
  const { name, category, description, data } = req.body;

  if (!name || !data)
    return res
      .status(400)
      .json({ success: false, msg: "name and data parameters are required" });

  try {
    const existingLevel = await levelsModel.findOne({ name: name.trim() });

    if (existingLevel)
      return res.status(409).json({
        success: false,
        msg: `Level with name '${name}' already exists`,
      });

    //level verisini hazırla
    const levelData = {
      name: name.trim(),
      data: data,
    };
    if (description) levelData.description = description;
    if (category) levelData.category = category;

    //leveli veritabanına kaydet
    await levelsModel.create(levelData);

    return res
      .status(201)
      .json({ success: true, msg: `${name}-level is created successfully` });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

export default admin;
