import mongoose from "mongoose";

// levellerin veritabanına kaydedilme şeması
const levelsSchema = new mongoose.Schema({
  // level id'si otomatik oluşturuluyor.
  name: {
    //level ismi
    type: String,
    required: true,
    unique: true,
  },
  category: {
    //kategori (ders mi, free-mode'mu)
    type: String,
    required: true,
    enum: ["lesson", "free-mode"], //sadece bu değerlerden birini alabilir
  },
  description: {
    //level açıklaması
    type: String,
    default: function () {
      return `${this.name} does not have a description`;
    },
  },
  data: {
    //level verisi
    type: Object,
    of: {
      text: {
        //level yazısı
        type: String,
        default: null,
      },
      difficulty: {
        //level zorluğu(görüntü olsun diye)
        type: String,
        default: "easy",
        enum: ["easy", "medium", "hard"], //sadece bu 3 değerden birini alır
      },
      wordCount: {
        //kelime sayısı(otomatik hesaplanıcak)
        type: Number,
        default: 0,
      },
      timeLimit: {
        //(varsa) süre sınırı
        type: Number,
        default: 0,
      },
    },
  },
});

//kelime sayısını hesaplamak için gerekli fonksiyon
levelsSchema.pre("save", function (next) {
  //veri varsa ve içerisinde text varsa
  if (this.data && this.data.text) {
    this.data.wordCount = this.data.text
      .trim() //baştaki ve sondaki boşlukları, tabları sil
      .split(/\s+/) //tüm kelimeleri ayır
      .filter((word) => word.length > 0).length; //uzunluğu 0'dan yüksek olanları seç ve array uzunluğunu al
  }
  next();
});

const levelsModel = mongoose.model("Level", levelsSchema);

export default levelsModel;
