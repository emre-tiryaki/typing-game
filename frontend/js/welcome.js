document.addEventListener("DOMContentLoaded", function () {
    const texts = [
        "Klavyede hızlan!",
        "On parmak yazmayı öğren",
        "Yavaş yazmaktan sıkılmadın mı?"
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
document.querySelector('.login-btn').onclick = function () {
    window.location.href = "login.html";
};

// Sayfa yuklenınce localStorageı kontrol etme yeri
function applyTheme(theme) {
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);
    const bg = document.querySelector('.background');
    if (bg) {
        bg.classList.remove('dark', 'light');
        bg.classList.add(theme);
    }
}

function getTheme() {
    return localStorage.getItem('theme') || 'light';
}

function setTheme(theme) {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
}

document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const background = document.querySelector(".background");

    // Tema geçişinde smooth animasyon için transition ekle
    body.style.transition = "background-color 0.5s, color 0.5s";
    if (background) background.style.transition = "background-image 0.7s, opacity 0.7s";

    // Sayfa açılışında tema ayarla
    const theme = localStorage.getItem("theme") || "light";
    applyTheme(theme);

    themeToggle.addEventListener("click", function () {
        const newTheme = body.classList.contains("dark") ? "light" : "dark";
        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    });

    function applyTheme(theme) {
        body.classList.remove("dark", "bg-gray-900", "text-white", "bg-white", "text-black");
        if (background) background.classList.remove("dark", "light");

        if (theme === "dark") {
            body.classList.add("dark", "bg-gray-900", "text-white");
            if (background) background.classList.add("dark");
        } else {
            body.classList.add("bg-white", "text-black");
            if (background) background.classList.add("light");
        }
    }
});
