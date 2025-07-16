import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

//.env dosyasından gerekli değişkenleri çekelim
const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI;

//mongo db bağlantısını sağlayalım
await mongoose.connect(URI)
              .then(() => console.log("MongoDB connection established"))
              .catch(err => console.error(`MongoDB connection error. ${err}`));

//API keylerimizi hazırlayalım
const app = express();
app.use(express.json());

// API çalışıyor mu diye bakmak için bir health-checkup yapalım(olmasada olur)
app.get('/health-checkup', (req, res) => res.status(200).send('API is working'));

//serverı başlatalım.
app.listen(PORT, err => console.log(err ? `Something went wrong ${err}` : `Server is listening on port ${PORT}`));