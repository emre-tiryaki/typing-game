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
