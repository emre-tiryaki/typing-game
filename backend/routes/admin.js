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

  // Data format kontrolü
  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({
      success: false,
      msg: "data must be a non-empty array",
    });
  }

  name = name.trim();

  try {
    const existingLevel = await levelsModel.findOne({ name: name });

    if (existingLevel)
      return res.status(409).json({
        success: false,
        msg: `there is already a level with that name: ${name}`,
      });

    //verileri gir
    const levelData = {
      name: name,
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
