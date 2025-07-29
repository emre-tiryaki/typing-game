import mongoose from "mongoose";

//veritabanı bağlantısı için fonksiyon. bağlantı başarısız olursa server durur.
const connectDB = async (URI) => {
  try {
    await mongoose.connect(URI, {
      authSource: "admin",
      retryWrites: true,
      tls: true,
      maxPoolSize: 100,
      connectTimeoutMS: 30000,
    });
    console.log("MongoDB bağlantısı başarılı!");
  } catch (err) {
    console.error("MongoDB bağlantı hatası:", err.message);
    process.exit(1);
  }
};

export default connectDB;
