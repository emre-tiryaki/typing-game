import mongoose from "mongoose";

// kullanıcı skorlarının kaydedileceği json şeması
const scoreSchema = new mongoose.Schema({
  //burası doldurulacak!!!
});

const Score = mongoose.model("Score", scoreSchema);

export default Score;
