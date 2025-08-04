import mongoose from "mongoose";

// sadece isim email ve şifre(hashlenmiş) tutuyoruz
const userSchema = new mongoose.Schema({
  name: { // kullanıcı adı
    type: String,
    required: true,
  },
  email: {  //kullanıcının e-posta adresi
    type: String,
    required: true,
    unique: true,
  },
  password: { //kullanıcının şifresi(hashlenmiş)
    type: String,
    required: true,
  },
  accountCreatedAt: {// hesabın oluşturulma tarihi
    type: Date,
    default: Date.now(),
    immutable: false,
  },
  levelsCompleted: {  //bitirilen leveller'in listesi
    type: Map,
    of: {
      completedAt: { type: Date, default: Date.now() }, // ne zaman bitirildi
      wpm: { type: Number, required: true }, //wpm değeri
      timeSpent: { type: Number, required: true }, //ne kadar sürede bitirildi
      mistakes: { type: Number, default: 0 }, //hata miktarı
    },
    default: new Map(), //varsayılan olarak boş
  },
  topWPM: { //kullanıcının yaptığı en yüksek WPM (Word Per Minute) değeri
    type: Number,
    default: 0,
  },
  lastLogin: {  //kullanıcının son giriş yapma tarihi
    type: Date,
    default: Date.now(),
  },
  verifyOtp: {  // email'i doğrulama kodu (OTP: One Time Password)
    type: String,
    default: "",
  },
  verifyOtpExpiresAt: { // email doğrulama kodunun geçerlilik süresi
    type: Number,
    default: 0,
  },
  isAccountVerified: {  //hesap doğrulanmış mı
    type: Boolean,
    default: false,
  },
  resetOtp: { //şifre sıfırlama kodu
    type: String,
    default: "",
  },
  resetOtpExpiresAt: {  // şifre sıfırlama kodunun geçerlilik süresi
    type: Number,
    default: 0,
  },
});

//kaydetme öncesinde en yüksek WPM'i günceller
userSchema.pre("save", (next) => {
  if (this.levelsCompleted && this.levelsCompleted.size > 0) {
    const wpmValues = Math.max([...this.levelsCompleted.values()]).map(
      (level) => level.wpm
    );
    this.topWPM = Math.max(...wpmValues);
  }
  next();
});

//model zaten tanımlandıysa tekrar tanımlama tanımlanmadıysa tanımla
const userModel = mongoose.model.user || mongoose.model("User", userSchema);

export default userModel;
