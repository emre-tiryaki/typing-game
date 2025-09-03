import { ThemeManager } from "../utils/themeManager.js";
import { AnimationManager } from "../utils/animationManager.js";
import { fetchUserData, setProgress } from "../components/userPanel.js";
import { checkLogin } from "../utils/auth.js";
import { createLessonCard } from "../components/lessonCard.js";

// Uygulama başlatıcı
class TypingTutorApp {
  constructor() {
    this.themeManager = new ThemeManager();
    this.init();
  }
  init() {
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      AnimationManager.addFadeIn(mainContent);
    }
  }
}

// Sayfa yüklendiğinde çalışacak
document.addEventListener("DOMContentLoaded", async () => {
  window.typingApp = new TypingTutorApp();
  await checkLogin();// giriş kontrolcüsü
  await fetchUserData();/// kullanıcı verilerini al
  loadLessons(); // dersleri yükle
});

document.querySelector(".login-btn").onclick = function () {
  window.location.href = "login.html"; // Giriş sayfasına yönlendir
};

// Dersleri yükle
async function loadLessons() {
  try {
    const res = await axios.get("http://localhost:4000/database/all-levels");// Tüm dersleri al
    // Gelen verileri kontrol et(burwsı gptden)
    const lessons = Array.isArray(res.data) ? res.data : res.data.data || [];
    const container = document.getElementById("lessons-container");// Dersler konteynerini al
    container.innerHTML = "";// Önceki dersleri temizle
    lessons.forEach((lesson, idx) => {
      // Her bir ders için kart oluştur
      const isAvailable = lesson.isAvailable || idx < 2;
      // Kart oluşturma fonksiyonunu çağır
      const card = createLessonCard(lesson, idx, isAvailable, startLesson);
      // Kartı konteynere ekle
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Dersler yüklenemedi:", err);
  }
}

function startLesson(idx) {
  //eklenecekk
  alert(`Ders ${idx} başlatılacak!`);
}
