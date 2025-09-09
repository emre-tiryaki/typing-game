document.addEventListener("DOMContentLoaded", () => {
  // Login sayfasına yönlendirme
  document.querySelector(".login-btn").addEventListener("click", () => {
    window.location.href = "login.html";
  });

  // Yazı animasyonu
  const texts = [
    "Klavyede hızlan!",
    "On parmak yazmayı öğren",
    "dönerci olmak vardı şimdi",
    "Yavaş yazmaktan sıkılmadın mı?",
    "Hadi başlayalım!",
    "Yazma becerini geliştir!",
    "Hızlı ve doğru yaz!",
  ];
  const h1 = document.querySelector(".hero h1");
  let i = 0;
  let textIndex = 0;

  function typeWriter(text, cb) {
    if (i < text.length) {
      h1.textContent += text.charAt(i);
      i++;
      setTimeout(() => typeWriter(text, cb), 80);
    } else if (cb) {
      setTimeout(cb, 700);
    }
  }

  function deleteWriter(cb) {
    if (h1.textContent.length > 0) {
      h1.textContent = h1.textContent.slice(0, -1);
      setTimeout(() => deleteWriter(cb), 40);
    } else if (cb) {
      setTimeout(cb, 400);
    }
  }

  function startAnimation() {
    i = 0;
    typeWriter(texts[textIndex], () => {
      deleteWriter(() => {
        textIndex = (textIndex + 1) % texts.length;
        i = 0;
        typeWriter(texts[textIndex], () => {
          deleteWriter(() => {
            textIndex = (textIndex + 1) % texts.length;
            i = 0;
            typeWriter(texts[textIndex], () => {
              deleteWriter(() => {
                textIndex = (textIndex + 1) % texts.length;
                startAnimation();
              });
            });
          });
        });
      });
    });
  }

  h1.textContent = "";
  startAnimation();
});

//login sayfasına yonlendir
document.querySelector(".login-btn").onclick = function () {
  window.location.href = "login.html";
};

// Sayfa yuklenınce localStorageı kontrol etme yeri
function applyTheme(theme) {
  document.body.classList.remove("dark", "light");
  document.body.classList.add(theme);
  const bg = document.querySelector(".background");
  if (bg) {
    bg.classList.remove("dark", "light");
    bg.classList.add(theme);
  }
}

function getTheme() {
  return localStorage.getItem("theme") || "light";
}

function setTheme(theme) {
  localStorage.setItem("theme", theme);
  applyTheme(theme);
}

document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const background = document.querySelector(".background");

  // 🔹 Scroll ile block animasyonu
  const blocks = document.querySelectorAll(".block");
  function revealOnScroll() {
    blocks.forEach((block, index) => {
      const rect = block.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        setTimeout(() => block.classList.add("show"), index * 150);
      }
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
});
const startBtn = document.getElementById("startBtn");
if (startBtn) {
  startBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    // Buton tıklama süresince devre dışı bırak(gpt denaldım)
    startBtn.classList.add("disabled");
    try {
      await axios.post("http://localhost:4000/guest");
      // Başarılıysa yönlendirme veya başka bir işlem yapılabilir
      window.location.href = "levelpage.html";
    } catch (err) {
      alert("Sunucuya bağlanılamadı!");
    } finally {
      startBtn.classList.remove("disabled");
    }
  });
}
