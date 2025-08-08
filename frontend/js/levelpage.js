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
    this.virtualKeyboard = new VirtualKeyboard();
    this.lessonManager = new LessonManager();
    this.analytics = new ProgressAnalytics();
    this.init();
  }

  init() {
    // Initialize app components
    this.setupGlobalEventListeners();
    this.loadUserPreferences();

    // Add fade-in animation to main content
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      AnimationManager.addFadeIn(mainContent);
    }

    console.log("TypingTutor App initialized successfully");
  }

  setupGlobalEventListeners() {
    // Global keyboard event handling
    document.addEventListener("keydown", (e) => {
      // Prevent default browser shortcuts that might interfere
      if (e.ctrlKey || e.metaKey) return;

      // Track keystrokes for analytics
      this.analytics.trackKeystroke();

      // Show key highlight on virtual keyboard
      if (this.virtualKeyboard.isVisible) {
        this.virtualKeyboard.highlightKey(e.key);
      }
    });

    // Responsive navigation handling
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  handleResize() {
    // Handle responsive behavior on window resize
    const width = window.innerWidth;
    const navLinks = document.querySelector(".nav-links");

    if (navLinks) {
      if (width < 768) {
        navLinks.style.display = "none";
      } else {
        navLinks.style.display = "flex";
      }
    }
  }

  loadUserPreferences() {
    // Load and apply user preferences
    const preferences = localStorage.getItem("userPreferences");
    if (preferences) {
      const prefs = JSON.parse(preferences);
      // Apply saved preferences (keyboard visibility, sound settings, etc.)
      console.log("User preferences loaded:", prefs);
    }
  }

  saveUserPreferences(preferences) {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
  }
}
// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.typingApp = new TypingTutorApp();
});

// Export classes for potential module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ThemeManager,
    AnimationManager,
    TypingTutorApp,
  };
}
document.querySelector(".login-btn").onclick = function () {
  window.location.href = "login.html";
};

// /me endpoint'inden kullanıcı verilerini çek
async function fetchUserData() {
  const token = localStorage.getItem("token"); //  token anahtarı cek
  if (!token) {
    console.error("Token bulunamadı, lütfen önce giriş yapın.");
    showAlert("Oturumunuz kapalı, lütfen giriş yapın.");
    return;
  }

  try {
    // Kullanıcı verilerini çek
    const response = await axios.get(`http://localhost:4000/database/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Kullanıcı verilerini isle
    const userData = response.data;
    console.log("Kullanıcı Verileri:", userData);
    // Verileri sayfada göster
    const progressElement = document.querySelector(".progress-text");
    const bestWPMElement = document.querySelector(".best-wpm-text");
    const userNameElement = document.getElementById("userNameDisplay");

    if (progressElement) {
      progressElement.textContent = `${userData.progress || 0}%`;
    }
    if (bestWPMElement) {
      bestWPMElement.textContent = `${userData.bestWPM || 0} WPM`;
    }
    if (userNameElement) {
      userNameElement.textContent = userData.name || "Kullanıcı";
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

// girişi kontrol et
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const loginButton = document.getElementById("loginButton");
  const logoutButton = document.getElementById("logoutButton");

  // Giriş yapıldıysa butonları güncelle
  if (loginButton && logoutButton) {
    if (isLoggedIn) {
      loginButton.style.display = "none"; // Giriş yaptıysa  gizle
      logoutButton.style.display = "block"; // Çıkış Yap butonunu göster
    } else {
      loginButton.style.display = "block"; // Misafir ise  göster
      logoutButton.style.display = "none"; // Çıkış Yap butonunu gizle
    }
  }
}

// Sayfa yüklendiğinde giriş durumunu kontrol et
document.addEventListener("DOMContentLoaded", async () => {
  checkLoginStatus();
  await fetchUserData();

  // Giriş Yap butonu: login.html'ye yönlendir
  const loginButton = document.getElementById("loginButton");
  if (loginButton) {
    loginButton.onclick = () => {
      window.location.href = "login.html";
    };
  }

  // Çıkış Yap butonu: LocalStorage'ı temizle ve butonları güncelle
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.onclick = () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      checkLoginStatus();
    };
  }
});