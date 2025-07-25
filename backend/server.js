import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/database.js";
import words from "./routes/words.js";
import guest from "./routes/guest.js";
import auth from "./routes/auth.js";

dotenv.config({path: '../.env'});

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
app.use(cors({ origin: CLIENT, credentials: true }));

//for getting words
app.use('/words', words);
//for authorization
app.use('/auth', auth);
//for guests
app.use('/guest', guest);

// API çalışıyor mu diye bakmak için bir health-checkup yapalım(olmasada olur)
app.get('/health-checkup', (req, res) => res.status(200).send('API is working'));

//serverı başlatalım.
app.listen(PORT, err => console.log(err ? `Something went wrong ${err}` : `Server is listening on port ${PORT}`));