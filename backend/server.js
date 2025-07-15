import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

//.env dosyasından gerekli değişkenleri çekelim
const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI;

//mongo db bağlantısını sağlayalım
mongoose.connect(URI).then("MongoDB connection established")
                     .catch("MongoDB connection error");

//API keylerimizi hazırlayalım
const app = express();

// API çalışıyor mu diye bakmak için bir health-checkup yapalım(olmasada olur)
app.get('/health-checkup', (req, res) => {
    res.status(200).send('API is working');
});

//serverı başlatalım.
app.listen(PORT, err => console.log(err => err ? `Something went wrong ${err}` : `Server is listening on port ${PORT}`));