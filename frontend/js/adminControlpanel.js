// Admin butonunu sadece admin rolü olanlara göster
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await axios.get("http://localhost:4000/database/me", {
            withCredentials: true
        });
        // Admin rolü kontrolü
        if (res.data.data.role === "admin") {
            document.getElementById("adminPanelBtn").style.display = "block";
            document.getElementById("adminPanelBtn").onclick = () => {

            };
        }
    } catch (e) {
        // Kullanıcı yoksa veya hata varsa buton zaten görünmez
    }
});

// Admin dropdown  islemleri
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await axios.get("http://localhost:4000/database/me", { withCredentials: true });
        await handleRequest(`${BACKEND_URL}/login`, { email: logEmail, password: logPassword },);
        if (res.data.data.role === "admin") {
            const adminBtn = document.getElementById("adminPanelBtn");
            const dropdown = document.getElementById("adminDropdown");
            adminBtn.style.display = "block";

            // Dropdown aç/kapat
            adminBtn.addEventListener("mouseenter", () => {
                dropdown.style.display = "block";
            });
            adminBtn.addEventListener("mouseleave", () => {
                setTimeout(() => {
                    // Dropdown dışında bir yere tıklanmışsa kapat
                    if (!dropdown.matches(':hover')) dropdown.style.display = "none";
                }, 200);
            });
            dropdown.addEventListener("mouseleave", () => {
                dropdown.style.display = "none";
            });
            dropdown.addEventListener("mouseenter", () => {
                dropdown.style.display = "block";
            });

            // Level ekle  aç
            document.getElementById("addLevelBtn").onclick = () => {
                document.getElementById("addLevelModal").style.display = "flex";
                document.getElementById("addLevelMsg").textContent = "";
            };
        }
    } catch (e) {

    }
});

// levek ekleme kapatma
document.getElementById("cancelAddLevel").onclick = function () {
    document.getElementById("addLevelModal").style.display = "none";
};

// Level ekleme formu gönderimi
document.getElementById("addLevelForm").onsubmit = async function (e) {
    e.preventDefault();
    // Formu gönderme işlemi
    const form = e.target; // Form referansı
    // Form verilerini alma
    const msg = document.getElementById("addLevelMsg");
    msg.textContent = "";
    try {
        // Level ekleme işlemi 
        const leveldata = {
            // Kullanıcıdan alınan veriler
            name: form.name.value,//level adı
            category: form.category.value,//level kategorisi
            description: form.description.value || undefined,//opsiyonel acıklama
            difficulty: form.difficulty.value || undefined,//opsiyonel zorluk
            time: form.time.value // süre
        };
        const res = await axios.post("http://localhost:4000/admin/add-level", leveldata, {
            withCredentials: true
        });
        // Level başarıyla eklendi mesajı
        msg.style.color = "#10b981";
        msg.textContent = "Level başarıyla eklendi!";
        // level yerını kapat
        setTimeout(() => {
            // levele eklme  kapat
            document.getElementById("addLevelModal").style.display = "none";
            // sıfırla formu
            form.reset();
            msg.style.color = "#e11d48";
            msg.textContent = "";
        }, 1200);
    } catch (err) {
        msg.style.color = "#e11d48";
        // Hata mesajını göster
        msg.textContent = "Hata: " + (err.res.data.msg || "Level eklenemedi.");
    }
};
const handleRequest = async (url, data,) => {
    const res = await axios.post(url, data);
};