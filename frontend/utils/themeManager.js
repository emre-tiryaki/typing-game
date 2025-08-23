// Theme management logic(gpt komple)
export class ThemeManager {
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
