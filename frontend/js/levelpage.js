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
  const progressElement = document.querySelector(".progress-text");
  const bestWPMElement = document.querySelector(".best-wpm-text");
  const userNameElement = document.getElementById("userNameDisplay");

  try {
    // Kullanıcı verilerini çek
    const response = await axios.get(`http://localhost:4000/database/me`, {
      withCredentials: true,
    });

    const userData = response.data;
    console.log("Kullanıcı Verileri:", userData);
    if (userData.data.role === "admin") {
      document.getElementById("adminPanelBtn").style.display = "block";
      document.getElementById("adminPanelBtn").onclick = () => {
        //window.location.href = "admin.html";
      };
    }

    // Progress bar güncelle
    setProgress(userData.data.completionStats.percentage);

    if (progressElement) {
      progressElement.textContent = `${userData.data.completionStats.percentage}%`;
    }
    if (bestWPMElement) {
      bestWPMElement.textContent = `${userData.data.topWPM} WPM`;
    }
    if (userNameElement) {
      userNameElement.textContent = userData.data.name || "Misafir";
    }

  } catch (error) {
    const errMsg = error.response.msg;
    console.error("Hata:", errMsg);// butası calısmıyor

    if (progressElement) progressElement.textContent = "Hata! " + errMsg;
    if (bestWPMElement) bestWPMElement.textContent = "Hata! " + errMsg;
    if (userNameElement) userNameElement.textContent = "Hata! " + errMsg;
  }
}

const checkLogin = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/auth/check`, {
      withCredentials: true
    });

    const loginBtn = document.getElementById("loginButton");
    const logoutBtn = document.getElementById("logoutButton");

    if (response.data.loggedIn) {
      console.log("Kullanıcı giriş yapmış");
      if (loginBtn) loginBtn.style.display = "none";
      if (logoutBtn) {
        logoutBtn.style.display = "block";
        logoutBtn.onclick = async function () {
          await axios.post(`http://localhost:4000/auth/logout`, {}, {
            withCredentials: true
          }).then(() => {
            console.log("Çıkış yapıldı");
            window.location.href = "login.html";
            checkLogin();
          }).catch(error => {
            console.error("Çıkış yaparken hata:", error);
          });
        };
      }
    } else {
      console.log("Kullanıcı giriş yapmamış");
      if (loginBtn) loginBtn.style.display = "block";
      if (logoutBtn) logoutBtn.style.display = "none";
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


//genel ilerleme barı
function setProgress(percent) {
  percent = Math.max(0, Math.min(100, percent)); // 0-100 arası sınırla
  document.getElementById('progressText').textContent = percent + '%';
  document.getElementById('progressFill').style.width = percent + '%';
}


