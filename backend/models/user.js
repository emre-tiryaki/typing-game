import mongoose from "mongoose";
import levelsModel from "./levels";

//  user bilgilerinin veritabanında tutulma şeması
const userSchema = new mongoose.Schema({
  name: {
    // kullanıcı adı
    type: String,
    required: true,
  },
  email: {
    //kullanıcının e-posta adresi
    type: String,
    required: true,
    unique: true,
  },
  password: {
    //kullanıcının şifresi(hashlenmiş)
    type: String,
    required: true,
  },
  accountCreatedAt: {
    // hesabın oluşturulma tarihi
    type: Date,
    default: Date.now(),
    immutable: false,
  },
  levelsCompleted: {
    //bitirilen leveller'in listesi
    type: Map,
    of: {
      completedAt: { type: Date, default: Date.now() }, // ne zaman bitirildi
      wpm: { type: Number, required: true }, //wpm değeri
      timeSpent: { type: Number, required: true }, //ne kadar sürede bitirildi
      mistakes: { type: Number, default: 0 }, //hata miktarı
    },
    default: new Map(), //varsayılan olarak boş
  },
  // Misafir Kullanıcı Özellikleri
  guest: {
    guestId: { type: String }, //misafir id'si
    expiresAt: { type: Date },//ne zaman geçersiz olacak
    createdBy: {
      ip: { type: String }, //oluşturan kişinin ip'si
    },
  },
  completionStats: {
    //kullanıcının
    percentage: { type: Number, default: 0 }, // bitirilme yüzdesi
    // sonradan daha fazla eklenebilir diye böyle yazıldı
  },
  topWPM: {
    //kullanıcının yaptığı en yüksek WPM (Word Per Minute) değeri
    type: Number,
    default: 0,
  },
  lastLogin: {
    //kullanıcının son giriş yapma tarihi
    type: Date,
    default: Date.now(),
  },
  verifyOtp: {
    // email'i doğrulama kodu (OTP: One Time Password)
    type: String,
    default: "",
  },
  verifyOtpExpiresAt: {
    // email doğrulama kodunun geçerlilik süresi
    type: Number,
    default: 0,
  },
  isAccountVerified: {
    //hesap doğrulanmış mı
    type: Boolean,
    default: false,
  },
  resetOtp: {
    //şifre sıfırlama kodu
    type: String,
    default: "",
  },
  resetOtpExpiresAt: {
    // şifre sıfırlama kodunun geçerlilik süresi
    type: Number,
    default: 0,
  },
});

//kaydetme öncesinde en yüksek WPM'i günceller
userSchema.pre("save", function (next) {
  if (this.levelsCompleted && this.levelsCompleted.size > 0) {
    const wpmValues = Math.max([...this.levelsCompleted.values()]).map(
      (level) => level.wpm
    );
    this.topWPM = Math.max(...wpmValues);
  }
  next();
});

//kaydetme öncesinde bitirme yüzdesini günceller
userSchema.pre("save", async function (next) {
  const levelCount = await levelsModel.countDocuments(); //tüm levellerin sayısı
  const completedLevelCount = this.levelsCompleted.size; //bitirilen level sayısı

  //yeni yüzde
  const newPercentage =
    levelCount > 0 && completedLevelCount
      ? Math.round((completedLevelCount / levelCount) * 100)
      : 0;

  // yeni yüzde eski yüzdeden farklıysa yüzdeyi değiştir.
  if (newPercentage !== this.completionStats.percentage)
    this.completionStats.percentage = newPercentage;

  next();
});

//model zaten tanımlandıysa tekrar tanımlama tanımlanmadıysa tanımla
const userModel = mongoose.model.user || mongoose.model("User", userSchema);

export default userModel;
