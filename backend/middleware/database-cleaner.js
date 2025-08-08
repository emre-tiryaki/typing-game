import cron from "node-cron";
import userModel from "../models/user.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

//log klasörüne erişmek için
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//veritabanındaki istemediğimiz verileri silecek fonksiyon
/**
 * silinecek kişiler:
 *  -geçerlilik süresi geçmiş misafir kullanıcılar.
 */
const databaseClean = async () => {
  try {
    const guestThresholdDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); //7 günü geçen misafir kullanıcılar

    //silinecek kullanıcıları bul
    const usersToDelete = await userModel.find({
      role: "guest",
      accountCreatedAt: { $lte: guestThresholdDate },
    });

    //kullanıcı bulunamadıysa bırak
    if (usersToDelete.length === 0) {
      console.log("There are no users to delete");
      return;
    }

    //ne yapıldığını loglamak için log yolu
    const logPath = path.join(__dirname, "..", "logs", "deleted_users.log");

    for (const user of usersToDelete) {
      //log şemasını hazırla
      const log = `[${new Date().toISOString()}] Deleted: ${user.name}-${
        user.email
      }-${user._id}\n`;

      //logu yazdır
      fs.appendFileSync(logPath, log);

      //silinecek elemanı sil
      await userModel.deleteOne({ _id: user._id });
    }

    //kaç kişi silindi bak
    console.log(`${usersToDelete.length} users deleted and logged`);
  } catch (error) {
    console.error("Database clean error: ", error);
  }
};

cron.schedule("0 12 * * *", () => {
  console.log("Database Cleanup has started to process");
  databaseClean();
});
