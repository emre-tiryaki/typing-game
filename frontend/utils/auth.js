// giriş/çıkış ve oturum kontrolü 
import { api } from '../js/config.js';

export async function checkLogin() {
    try {
        // Oturum kontrolü yap
        const response = await axios.get(api('/auth/check'), {
            withCredentials: true
        });
        // Oturum açma durumu kontrolü
        const loginBtn = document.getElementById("loginButton"); // Giriş butonu
        const logoutBtn = document.getElementById("logoutButton"); // Çıkış butonu
        if (response.data.loggedIn) {
            // Kullanıcı giriş yapmış
            if (loginBtn) loginBtn.style.display = "none";
            if (logoutBtn) {
                logoutBtn.style.display = "block";
                logoutBtn.onclick = async function () {
                    // Çıkış yap
                    await axios.post(api('/auth/logout'), {}, {
                        withCredentials: true
                    }).then(() => {
                        window.location.href = "welcome.html";// kullanıcı çıkış yaptıktan sonra welcome sayfasına yönlendir
                        checkLogin(); // Oturum kontrolü
                    }).catch(error => {
                        console.error("Çıkış yaparken hata:", error);
                    });
                };
            }
        } else {
            // Kullanıcı giriş yapmamış
            if (loginBtn) loginBtn.style.display = "block";
            if (logoutBtn) logoutBtn.style.display = "none";
        }
    } catch (err) {
        console.error("Check isteğinde hata:", err);
    }
}
