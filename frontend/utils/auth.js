// giriş/çıkış ve oturum kontrolü 
export async function checkLogin() {
    try {
        // Oturum kontrolü yap
        const response = await axios.get(`http://localhost:4000/auth/check`, {
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
                    await axios.post(`http://localhost:4000/auth/logout`, {}, {
                        withCredentials: true
                    }).then(() => {
                        window.location.href = "welcome.html";
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
