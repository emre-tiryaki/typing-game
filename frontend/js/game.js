// Theme Management (copied from levelpage.js)
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
  }
}

// Game Logic
class TypingGame {
  constructor() {
    this.currentLevel = null;
    this.currentText = "";
    this.currentIndex = 0;
    this.startTime = null;
    this.endTime = null;
    this.errors = 0;
    this.isGameActive = false;
    this.timerInterval = null;
    
    this.initializeElements();
    this.setupEventListeners();
    this.loadLevel();
  }

  initializeElements() {
    this.levelTitleEl = document.getElementById("levelTitle");
    this.levelDescriptionEl = document.getElementById("levelDescription");
    this.textDisplayEl = document.getElementById("textDisplay");
    this.typingInputEl = document.getElementById("typingInput");
    this.currentWPMEl = document.getElementById("currentWPM");
    this.accuracyEl = document.getElementById("accuracy");
    this.timeElapsedEl = document.getElementById("timeElapsed");
    this.resultsModalEl = document.getElementById("resultsModal");
    this.restartBtn = document.getElementById("restartBtn");
    this.backBtn = document.getElementById("backBtn");
    this.playAgainBtn = document.getElementById("playAgainBtn");
    this.nextLevelBtn = document.getElementById("nextLevelBtn");
    this.backToLevelsBtn = document.getElementById("backToLevelsBtn");
  }

  setupEventListeners() {
    this.typingInputEl.addEventListener("input", (e) => this.handleInput(e));
    this.typingInputEl.addEventListener("keydown", (e) => this.handleKeyDown(e));
    this.restartBtn.addEventListener("click", () => this.restartGame());
    this.backBtn.addEventListener("click", () => this.goBack());
    this.playAgainBtn.addEventListener("click", () => this.restartGame());
    this.nextLevelBtn.addEventListener("click", () => this.nextLevel());
    this.backToLevelsBtn.addEventListener("click", () => this.goBack());
  }

  async loadLevel() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const lessonNumber = urlParams.get("lesson");
      
      if (!lessonNumber) {
        this.showError("Ders numarası bulunamadı!");
        return;
      }

      // Try to fetch from backend first
      try {
        const response = await axios.get(`http://localhost:4000/database/all-levels`, {
          withCredentials: true,
        });
        
        if (response.data.success && response.data.data.length > 0) {
          // Find level by lesson number or use sample data
          const level = response.data.data.find(l => l.name.includes(`Ders ${lessonNumber}`) || l._id === lessonNumber) || this.getSampleLesson(lessonNumber);
          
          if (level) {
            this.currentLevel = {
              id: level._id || lessonNumber,
              name: level.name,
              description: level.description,
              text: level.data?.text || this.getSampleLesson(lessonNumber).text
            };
            this.displayLevel();
            this.resetGame();
            return;
          }
        }
      } catch (apiError) {
        console.log("API'den level alınamadı, örnek veri kullanılıyor:", apiError.message);
      }

      // Fallback to sample lessons
      const lesson = this.getSampleLesson(lessonNumber);
      
      if (!lesson) {
        this.showError("Ders bulunamadı!");
        return;
      }

      this.currentLevel = {
        id: lessonNumber,
        ...lesson
      };

      this.displayLevel();
      this.resetGame();
      
    } catch (error) {
      console.error("Level yükleme hatası:", error);
      this.showError("Ders yüklenirken hata oluştu!");
    }
  }

  getSampleLesson(lessonNumber) {
    const sampleLessons = {
      1: {
        name: "Ana Tuşlar - ASDF JKL;",
        description: "Ana sıradaki tuşları öğrenin",
        text: "asd asd jkl jkl asdf asdf jklh jklh asdfjklh asdfjklh asdf jklh"
      },
      2: {
        name: "Kelime Kombinasyonları",
        description: "Basit kelimelerle pratik yapın",
        text: "ask ask sad sad lad lad has has hall hall fall fall shall shall"
      }
    };

    return sampleLessons[lessonNumber];
  }

  displayLevel() {
    this.levelTitleEl.textContent = this.currentLevel.name;
    this.levelDescriptionEl.textContent = this.currentLevel.description;
    this.currentText = this.currentLevel.text;
    this.renderText();
  }

  renderText() {
    const chars = this.currentText.split("");
    let html = "";
    
    for (let i = 0; i < chars.length; i++) {
      let className = "";
      const userInput = this.typingInputEl.value;
      
      if (i < userInput.length) {
        // Already typed
        className = userInput[i] === chars[i] ? "char-correct" : "char-incorrect";
      } else if (i === userInput.length) {
        // Current character
        className = "char-current";
      }
      
      html += `<span class="${className}">${chars[i] === " " ? "&nbsp;" : chars[i]}</span>`;
    }
    
    this.textDisplayEl.innerHTML = html;
  }

  handleInput(e) {
    if (!this.isGameActive) {
      this.startGame();
    }
    
    this.renderText();
    this.updateStats();
    
    // Check if game is completed
    if (this.typingInputEl.value.length === this.currentText.length) {
      this.endGame();
    }
  }

  handleKeyDown(e) {
    // Prevent backspace beyond current position
    if (e.key === "Backspace" && this.typingInputEl.value.length === 0) {
      e.preventDefault();
    }
  }

  startGame() {
    this.isGameActive = true;
    this.startTime = new Date();
    this.startTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.updateTimeDisplay();
      this.updateWPM();
    }, 1000);
  }

  updateTimeDisplay() {
    if (!this.startTime) return;
    
    const elapsed = new Date() - this.startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    this.timeElapsedEl.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  updateWPM() {
    if (!this.startTime) return;
    
    const elapsed = (new Date() - this.startTime) / 1000 / 60; // minutes
    const wordsTyped = this.typingInputEl.value.length / 5; // assuming 5 chars per word
    const wpm = elapsed > 0 ? Math.round(wordsTyped / elapsed) : 0;
    
    this.currentWPMEl.textContent = wpm;
  }

  updateStats() {
    const userInput = this.typingInputEl.value;
    let correct = 0;
    let errors = 0;
    
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === this.currentText[i]) {
        correct++;
      } else {
        errors++;
      }
    }
    
    this.errors = errors;
    const accuracy = userInput.length > 0 ? Math.round((correct / userInput.length) * 100) : 100;
    this.accuracyEl.textContent = `${accuracy}%`;
  }

  endGame() {
    this.isGameActive = false;
    this.endTime = new Date();
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.showResults();
    this.saveProgress();
  }

  showResults() {
    const totalTime = (this.endTime - this.startTime) / 1000; // seconds
    const minutes = Math.floor(totalTime / 60);
    const seconds = Math.floor(totalTime % 60);
    const wpm = Math.round((this.currentText.length / 5) / (totalTime / 60));
    const accuracy = Math.round(((this.currentText.length - this.errors) / this.currentText.length) * 100);
    
    document.getElementById("finalWPM").textContent = wpm;
    document.getElementById("finalAccuracy").textContent = `${accuracy}%`;
    document.getElementById("finalTime").textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    document.getElementById("finalErrors").textContent = this.errors;
    
    this.resultsModalEl.style.display = "flex";
  }

  async saveProgress() {
    try {
      const totalTime = (this.endTime - this.startTime) / 1000;
      const wpm = Math.round((this.currentText.length / 5) / (totalTime / 60));
      
      const progressData = {
        levelId: this.currentLevel.id,
        wpm: wpm,
        timeSpent: totalTime,
        mistakes: this.errors,
        accuracy: Math.round(((this.currentText.length - this.errors) / this.currentText.length) * 100)
      };
      
      console.log("Saving progress:", progressData);
      
      // API call to save progress
      const response = await axios.post("http://localhost:4000/database/complete-level", progressData, { 
        withCredentials: true 
      });
      
      if (response.data.success) {
        console.log("Progress başarıyla kaydedildi:", response.data);
      } else {
        console.error("Progress kaydedilemedi:", response.data.msg);
      }
      
    } catch (error) {
      console.error("Progress kaydetme hatası:", error.response?.data?.msg || error.message);
      // Don't show error to user, just log it
    }
  }

  restartGame() {
    this.resetGame();
    this.resultsModalEl.style.display = "none";
    this.typingInputEl.focus();
  }

  resetGame() {
    this.currentIndex = 0;
    this.startTime = null;
    this.endTime = null;
    this.errors = 0;
    this.isGameActive = false;
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.typingInputEl.value = "";
    this.currentWPMEl.textContent = "0";
    this.accuracyEl.textContent = "100%";
    this.timeElapsedEl.textContent = "0:00";
    
    this.renderText();
  }

  nextLevel() {
    const nextLevelNumber = parseInt(this.currentLevel.id) + 1;
    window.location.href = `game.html?lesson=${nextLevelNumber}`;
  }

  goBack() {
    window.location.href = "levelpage.html";
  }

  showError(message) {
    this.levelTitleEl.textContent = "Hata!";
    this.levelDescriptionEl.textContent = message;
    this.textDisplayEl.textContent = "Lütfen ana sayfaya dönün.";
    this.typingInputEl.disabled = true;
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager();
  new TypingGame();
});