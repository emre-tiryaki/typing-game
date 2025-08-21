// URL'den lesson parametresini al
const params = new URLSearchParams(window.location.search);
// Eğer lesson parametresi yoksa 1 varsayılan değerini kullan
const lessonId = params.get("lesson") || 1;

// Ders bilgisini backendden çek
async function fetchLesson(id) {
    try {
        // Backend API'sine istek gönder
        const res = await axios.get(`http://localhost:4000/database/lessons/${id}`, {
            withCredentials: true
        });
        return res.data; // Ders verisini döndür
    } catch (err) {
        return null;
    }
}

// Sayfayı render et
async function renderLesson() {
    // Ders bilgisini al
    const lesson = await axios.get(`http://localhost:4000/database/lessons/${lessonId}`, {
        withCredentials: true
    });
    // DOM elemanlarını seç
    const titleEl = document.getElementById("lesson-title");
    const textEl = document.getElementById("lesson-text");
    // Ders bilgilerini yerleştir
    if (lesson) {
        titleEl.textContent = lesson.name || `Ders ${lessonId}`;
        textEl.textContent = lesson.data || "";
    } else {
        // Ders bulunamadı
        titleEl.textContent = `Ders ${lessonId}`;
        textEl.textContent = "Bu ders henüz eklenmedi.";
    }

    // Progress bar mantığı(gpt)
    const input = document.getElementById("user-input");
    const progress = document.getElementById("progress");
    input.value = "";
    progress.style.width = "0%";
    input.oninput = () => {
        const target = lesson?.data || "";
        const typed = input.value;
        let correct = 0;
        for (let i = 0; i < typed.length; i++) {
            if (typed[i] === target[i]) correct++;
            else break;
        }
        const percent = target.length ? (correct / target.length) * 100 : 0;
        progress.style.width = percent + "%";
    };
}

// Sayfayı render et
renderLesson();

function goBack() {
    window.location.href = "levelpage.html";
}
