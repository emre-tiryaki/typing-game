// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem("theme") || "light";
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
  }

  setupEventListeners() {
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme());
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(this.currentTheme);
    localStorage.setItem("theme", this.currentTheme);
  }

  applyTheme(theme) {
    const body = document.body;
    const background = document.querySelector(".page-background");
    const themeIcon = document.getElementById("themeIcon");

    // Remove existing theme classes
    body.classList.remove("light", "dark");
    if (background) {
      background.classList.remove("light", "dark");
    }

    // Apply new theme
    body.classList.add(theme);
    if (background) {
      background.classList.add(theme);
    }

    // Update theme icon
    if (themeIcon) {
      themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    }
  }
}

// Animation and Effects
class AnimationManager {
  static addFadeIn(element) {
    element.classList.add("fade-in");
    setTimeout(() => element.classList.remove("fade-in"), 500);
  }

  static addSlideUp(element) {
    element.classList.add("slide-up");
    setTimeout(() => element.classList.remove("slide-up"), 300);
  }

  static smoothScrollTo(element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}

class TypingTutorApp {
  constructor() {
    this.themeManager = new ThemeManager();

    this.init();
  }

  init() {

    // Add fade-in animation to main content
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      AnimationManager.addFadeIn(mainContent);
    }

  }

}
// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.typingApp = new TypingTutorApp();
});



document.querySelector(".login-btn").onclick = function () {
  window.location.href = "login.html";
};


// /me endpoint'inden kullanıcı verilerini çek
async function fetchUserData() {
  try {
    // Kullanıcı verizlerini çek
    const response = await axios.get(`http://localhost:4000/database/me`, {
      //cokokie ile 
      withCredentials: true,
    });

    // Kullanıcı verilerini isle
    const userData = response.data;
    console.log("Kullanıcı Verileri:", userData);
    // Verileri sayfada göster
    const progressElement = document.querySelector(".progress-text");
    const bestWPMElement = document.querySelector(".best-wpm-text");
    const userNameElement = document.getElementById("userNameDisplay");

    if (progressElement) {
      progressElement.textContent = `${userData.data.completionStats.percentage}%`;
    }
    if (bestWPMElement) {
      bestWPMElement.textContent = `${userData.data.topWPM} WPM`;
    }
    if (userNameElement) {
      userNameElement.textContent = userData.data.name || "mrb la";
    }
  } catch (error) {
    // Hata durumunu ele al
    const errMsg = error.response?.data?.message || "Kullanıcı verileri alınamadı.";
    console.error("Hata:", errMsg);
    // Eğer 401 Unauthorized hatası alırsak, kullanıcıyı login sayfasına yönlendir
    if (error.response?.status === 401) {
      showAlert("Oturumunuz geçersiz, lütfen tekrar giriş yapın.");
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "../html/login.html"; // Örnek yönlendirme
    } else {
      // Diğer hataları göster
      showAlert(errMsg);
    }
  }
}
const checkLogin = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/auth/check`, {
      withCredentials: true
    });

    if (response.data.loggedIn) {
      console.log("Kullanıcı giriş yapmış");
      document.getElementById("loginButton").style.display = "none"; // Giriş yap butonunu gizle
      document.getElementById("logoutButton").style.display = "block"; // Çıkış yap butonunu göster
    } else {
      console.log("Kullanıcı giriş yapmamış");
      document.getElementById("loginButton").style.display = "block"; // Giriş yap butonunu göster
      document.getElementById("logoutButton").style.display = "none"; // Çıkış yap butonunu gizle
    }
  } catch (err) {
    console.error("Check isteğinde hata:", err);
  }
};




// Sayfa yüklendiğinde giriş durumunu kontrol et
document.addEventListener("DOMContentLoaded", async () => {
  await checkLogin();
  await fetchUserData();

  // Giriş Yap butonu: login.html'ye yönlendir
  const loginButton = document.getElementById("loginButton");
  if (loginButton) {
    loginButton.onclick = () => {
      window.location.href = "login.html";
    };
  }

  // Çıkış Yap butonu: LocalStorage'ı temizle ve butonları güncelle
  /* const logoutButton = document.getElementById("logoutButton");
   if (logoutButton) {
     logoutButton.onclick = () => {
       localStorage.removeItem("isLoggedIn");
       localStorage.removeItem("token");
       checkLoginStatus();
     };
   }*/
});