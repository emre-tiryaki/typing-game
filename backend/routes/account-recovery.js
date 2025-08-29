import express from "express";
import userModel from "../models/user.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendMail } from "../utils/mailer.js";

const accountRecovery = express.Router();

accountRecovery.get("/forgot-password-code", async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({
      success: false,
      msg: "email is required.",
    });

  try {
    const user = await userModel.findOne({ email: email });

    if (!user)
      return res.status(404).json({
        success: false,
        msg: "User not found.",
      });

    const code = String(crypto.randomInt(0, 10000)).padStart(4, "0");

    user.resetOtp = code;
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendMail(email, {
      subject: "Your password reset code",
      text: `Hello ${user.name}.\nYour code for resetting your password is: ${user.resetOtp}\nHurry up you only got 10 minutes left to validate your code!!!!`,
    });
    return res
      .status(200)
      .json({ success: true, msg: "successfully sent resetOtp code" });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

//şifre unutmaya karşı
accountRecovery.post("/forgot-password", async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code)
    return res.status(400).json({
      success: false,
      msg: "Insufficient parameters.",
    });

  try {
    const user = await userModel.findOne({ email: email });

    if (!user)
      return res.status(404).json({
        success: false,
        msg: "User not found.",
      });

    if (user.resetOtpExpiresAt < Date.now())
      return res.status(400).json({
        success: false,
        msg: "time exceeded.",
      });

    if (user.resetOtp === code)
      return res.status(200).json({
        success: true,
        msg: "code is correct.",
      });
    else {
      return res.status(400).json({
        success: false,
        msg: "Verification code is incorrect.",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

//şifreyi sıfırlamak için
accountRecovery.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword)
    return res.status(400).json({
      success: false,
      msg: "Email and new password are required.",
    });

  try {
    const user = await userModel.findOne({ email: email });
    if (!user)
      return res.status(404).json({
        success: false,
        msg: "User not found.",
      });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    sendMail(email, {
      subject: "Your password has been changed",
      text: `Hello ${user.name},\nYour password has been successfully changed.`,
    });

    return res.status(200).json({
      success: true,
      msg: "Password has been reset successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
});

export default accountRecovery;
