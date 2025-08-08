import mongoose from "mongoose";

// kullanıcı skorlarının kaydedileceği json şeması
const levelSchema = new mongoose.Schema({
  //level ismi
  name: {
    type: String,
    required: true,
    unique: true,
  },
  //level açıklaması
  description: {
    type: String,
    default: "There is no description for this level",
  },
  data: {
    // içerdiği kelimeler
    // ne kadar zor olduğu(opsiyonel eklenmeyebilirde)
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    //kaç kelime olduğu
  },
});

const Level = mongoose.model("Level", levelSchema);

export default Level;
