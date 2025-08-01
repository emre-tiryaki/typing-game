import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/database.js";
import words from "./routes/words.js";
import guest from "./routes/guest.js";
import auth from "./routes/auth.js";
import accountRecovery from "./routes/account-recovery.js";
import accessDatabase from "./routes/access-database.js";
import { verifyToken } from "./middleware/token-verification.js";

dotenv.config({ path: "../.env" });

//.env dosyasından gerekli değişkenleri çekelim
const PORT = process.env.PORT || 5000;
const CLIENT = process.env.CLIENT;
const URI = process.env.MONGO_URI;

// burada hata var düzelicek
connectDB(URI);

//API keylerimizi hazırlayalım
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

//kullanıcı girişi ve kaydı için
app.use("/auth", auth);
//misafir kullanıcılar için
app.use("/guest", guest);
//hesap kurtarma için
app.use("/account-recovery", accountRecovery);
//kelimeler için
app.use("/words", verifyToken, words);
//database verilerine erişmek için
app.use("/database", verifyToken, accessDatabase);

// API çalışıyor mu diye bakmak için bir health-checkup yapalım(olmasada olur)
app.get("/health-checkup", (req, res) =>
  res.status(200).send("API is working")
);

//serverı başlatalım.
app.listen(PORT, (err) =>
  console.log(
    err ? `Something went wrong ${err}` : `Server is listening on port ${PORT}`
  )
);
