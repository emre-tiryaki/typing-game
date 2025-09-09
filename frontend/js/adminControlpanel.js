
import { api } from './config.js';

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await axios.get(api('/database/me'), { withCredentials: true });
        if (res.data.data.role === "admin") {
            const adminBtn = document.getElementById("adminPanelBtn");
            const dropdown = document.getElementById("adminDropdown");
            adminBtn.style.display = "block";

            // Dropdown aç/kapat (tıkla veya mouseenter)
            function showDropdown() { dropdown.style.display = "block"; }
            function hideDropdown() { dropdown.style.display = "none"; }

            adminBtn.addEventListener("mouseenter", showDropdown);
            adminBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
            });
            dropdown.addEventListener("mouseenter", showDropdown);
            adminBtn.addEventListener("mouseleave", () => {
                setTimeout(() => {
                    if (!dropdown.matches(':hover')) hideDropdown();
                }, 200);
            });
            dropdown.addEventListener("mouseleave", hideDropdown);

            // Dışarı tıklanınca kapat(gpt)
            document.addEventListener("click", (e) => {
                if (!adminBtn.contains(e.target) && !dropdown.contains(e.target)) {
                    hideDropdown();
                }
            });

            // Level ekle modalı aç
            document.getElementById("addLevelBtn").onclick = (e) => {
                e.stopPropagation();
                document.getElementById("addLevelModal").style.display = "flex";
                document.getElementById("addLevelMsg").textContent = "";
                hideDropdown();
            };
        }
    } catch (e) {
        // Kullanıcı yoksa veya hata varsa buton zaten görünmez
    }

    // Level ekleme modalı kapatma
    const cancelBtn = document.getElementById("cancelAddLevel");
    if (cancelBtn) {
        cancelBtn.onclick = function () {
            document.getElementById("addLevelModal").style.display = "none";
        };
    }
});

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
            name: form.name.value, // level adı
            category: form.category.value, // level kategorisi
            description: form.description.value || undefined, // opsiyonel açıklama

            data: {// asıl level verisi (backend'in beklediği)
                difficulty: form.difficulty.value || undefined, // opsiyonel zorluk
                timeLimit: form.data.value, // süre sınırı
                text: form.text.value, // metin
            }
        };
        const res = await axios.post(api('/admin/add-level'), leveldata, {
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
        msg.textContent = "Hata: " + (err.res || "Level eklenemedi.");
    }
};
