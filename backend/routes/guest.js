import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import { tokenGenerator } from "../utils/token-generator.js";

const guest = express.Router();

//misafir kullanıcı girişi için
guest.post("/", async (req, res) => {
  try {
    //(varsa) body'den misafir id'sini al.
    const { guestId } = req.body || {};

    //halihazırda aynı yerden gelen misafir kullanıcı var mı yok mu ona bak
    let existingGuest = null;

    if (guestId) {
      existingGuest = await userModel.findOne({
        "guest.guestId": guestId,
        "guest.expiresAt": { $gt: new Date() }, // henüz süresi dolmamış
      });
    }

    //halihazırda misafir varsa
    if (existingGuest) {
      const jwtToken = jwt.sign(
        { id: existingGuest._id, name: existingGuest.name, isGuest: true },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        msg: `Welcome back ${existingGuest.name}`,
        guestId: existingGuest.guest.guestId, // Frontend'e guestId'yi gönder
      });
    }

    //Yeni misafir kullanıcı oluştur
    const id = crypto.randomBytes(16).toString("hex");
    const name = `Guest-${id}`;

    const newUser = await userModel.create({
      name: name,
      email: `guest_${id}@temp.com`,
      password: await bcrypt.hash(id, 10),
      role: "guest",
      guest: {
        guestId: id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün sonra silinir
        createdBy: {
          ip: req.ip,
        },
      },
    });

    tokenGenerator(res, { id: newUser._id, name: newUser.name, isGuest: true });

    // bitiş
    return res.status(201).json({
      success: true,
      msg: `${name} logged in as guest`,
      guestId: id, //Frontend'e guestId gönder
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

export default guest;
