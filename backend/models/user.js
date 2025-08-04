import mongoose from "mongoose";

// sadece isim email ve şifre(hashlenmiş) tutuyoruz
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  //kullanıcının bitirdiği levelleri bir Map veri tipinin içerisinde tutuyoruz
  levelsCompleted: {
    type: Map,
    of: {
      CompletedAt: { type: Date, default: Date.now() }, //ne zaman bitirildi
      score: { type: Number, default: 0 }, //hangi skor ile bitirildi
      timeSpent: { type: Number, default: 0 }, //level üzerine harcanan zaman
      WPM: { type: Number, default: 0 }, //kullanıcının yazma hızı WPM(Words Per Minute)
      stars: { type: Number, enum: [0, 1, 2, 3], default: 0 }, //kullanıcının levelden aldığı yıldız sayısı.
    },
    default: new Map(),
  },
  //kullanıcının sahip olduğu toplam yıldız sayısı
  starCount: {
    type: Number,
    default: 0,
  },
  //kullanıcının yaptığı en yüksek WPM değeri
  topWPM: {
    type: Number,
    default: 0.0,
  },
  accountCreatedAt: {
    type: Date,
    default: Date.now(),
    immutable: false,
  },
  lastLogin: {
    type: Date,
    default: Date.now(),
  },
  // email'i doğrulama kodu (OTP: One Time Password)
  verifyOtp: {
    type: String,
    default: "",
  },
  // email doğrulama kodunun geçerlilik süresi
  verifyOtpExpiresAt: {
    type: Number,
    default: 0,
  },
  //hesap doğrulanmış mı
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  //şifre sıfırlama kodu
  resetOtp: {
    type: String,
    default: "",
  },
  // şifre sıfırlama kodunun geçerlilik süresi
  resetOtpExpiresAt: {
    type: Number,
    default: 0,
  },
});

//toplam yıldız sayısını ve en yüksek WPM'i güncellemek için gerekli fonksiyon
userSchema.pre("save", function (next) {
  this.starCount = [...this.levelsCompleted.values()].reduce(
    (total, level) => total + (level.stars || 0),
    0
  ); //toplam yıldız sayısı
  this.topWPM = Math.max(
    this.topWPM || 0,
    ...[...this.levelsCompleted.values()].map((level) => level.WPM || 0)
  ); //en yüksek WPM
  next();
});

//model zaten tanımlandıysa tekrar tanımlama tanımlanmadıysa tanımla
const userModel = mongoose.model.user || mongoose.model("User", userSchema);

export default userModel;
