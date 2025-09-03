// kullanıcı paneli verilerini alma
export async function fetchUserData() {
    // DOM elemanlarını seç
    const progressElement = document.querySelector(".progress-text");
    const bestWPMElement = document.querySelector(".best-wpm-text");
    const userNameElement = document.getElementById("userNameDisplay");

    try {
        // Kullanıcı verilerini al
        const response = await axios.get(`http://localhost:4000/database/me`, {
            withCredentials: true,
        });
        const userData = response.data;
        if (userData.data.role === "admin") {// Admin panel butonunu göster
            document.getElementById("adminPanelBtn").style.display = "block";
        }
        setProgress(userData.data.completionStats.percentage);// Kullanıcı ilerleme yüzdesini ayarla
        // Kullanıcı en iyi WPM değerini ayarla
        if (progressElement) {
            progressElement.textContent = `${userData.data.completionStats.percentage}%`;
        }// Kullanıcı ilerleme yüzdesini ayarla
        if (bestWPMElement) {
            bestWPMElement.textContent = `${userData.data.topWPM} WPM`;
        }// Kullanıcı en iyi WPM değerini ayarla
        if (userNameElement) {
            userNameElement.textContent = userData.data.name || "Misafir";
        }// Kullanıcı adını ayarla
    } catch (error) { // Hata durumunda
        const errMsg = error.response?.msg || error.message;
        if (progressElement) progressElement.textContent = "Hata! " + errMsg;
        if (bestWPMElement) bestWPMElement.textContent = "Hata! " + errMsg;
        if (userNameElement) userNameElement.textContent = "Hata! " + errMsg;
    }
}

export function setProgress(percent) {// Kullanıcı ilerleme yüzdesini ayarla
    percent = Math.max(0, Math.min(100, percent));
    document.getElementById('progressText').textContent = percent + '%';
    document.getElementById('progressFill').style.width = percent + '%';
}
