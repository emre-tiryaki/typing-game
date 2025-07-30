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

//model zaten tanımlandıysa tekrar tanımlama tanımlanmadıysa tanımla
const userModel = mongoose.model.user || mongoose.model("User", userSchema);

export default userModel;
