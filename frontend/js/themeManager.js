class ThemeManager {
    constructor(toggleBtnId = "themeToggle") {
        this.toggleBtnId = toggleBtnId;
        this.currentTheme = localStorage.getItem("theme") || "light";
    }

    init() {
        this.applyTheme(this.currentTheme);
        const btn = document.getElementById(this.toggleBtnId);

        if (btn) {
            btn.addEventListener("click", () => this.toggleTheme());
        } else {
            console.warn("⚠️ Tema butonu bulunamadı: " + this.toggleBtnId);
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
        this.applyTheme(this.currentTheme);
        localStorage.setItem("theme", this.currentTheme);
    }

    applyTheme(theme) {
        document.body.classList.remove("light", "dark");
        document.body.classList.add(theme);

        const bg = document.querySelector(".background");
        if (bg) {
            bg.classList.remove("light", "dark");
            bg.classList.add(theme);
        }
    }
}

// DOM tamamen yüklendikten sonra başlat
document.addEventListener("DOMContentLoaded", () => {
    new ThemeManager("themeToggle").init();
});
