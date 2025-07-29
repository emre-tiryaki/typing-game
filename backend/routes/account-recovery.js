import express from "express";

const accountRecovery = express.Router();

//şifre unutmaya karşı
accountRecovery.post("/forgot-password", (req, res) => {
  //doldurulacak
});

//şifreyi sıfırlamak için
accountRecovery.post("/reset-password", (req, res) => {
  //doldurulacak
});

export default accountRecovery;
