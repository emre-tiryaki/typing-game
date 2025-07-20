//veritabanı bağlantısı için fonksiyon. bağlantı başarısız olursa server durur.
const connectDB = async (URI) => {
  try {
    await mongoose.connect(URI);
    console.log('MongoDB bağlantısı başarılı!');
  } catch (err) {
    console.error('MongoDB bağlantı hatası:', err.message);
    process.exit(1); 
  }
};

export default connectDB;