import { BACKEND_URL } from "../js/config.js";
let googleAuthClient;

window.onload = function () {
  if (window.google && window.google.accounts) {
    googleAuthClient = google.accounts.oauth2.initTokenClient({
      client_id: '210282093492-0ph62n0pg6hqpiullp5beksiqi3ikbh1.apps.googleusercontent.com',
      scope: 'profile email',
      callback: (response) => {
        handleCredentialResponse(response);
      },
    });
  } else {
    console.error("Google Sign-In API yüklenmedi!");
  }
};

window.promptGoogleSignIn = function () {
  if (googleAuthClient) {
    googleAuthClient.requestAccessToken();
  } else {
    console.error("Google Auth Client başlatılmadı!");
  }
};

function handleCredentialResponse(response) {
  const accessToken = response.access_token;
  console.log("Google Access Token: " + accessToken);

  axios
    .post(`${BACKEND_URL}/google-login`, {
      token: accessToken,
    })
    .then((response) => {
      console.log("Backend yanıtı:", response.data);
      window.location.href = "/dashboard"; // Örnek: Başarılı giriş sonrası yönlendirme
    })
    .catch((error) => {
      console.error("Hata:", error.response ? error.response.data : error.message);
      alert("Google ile giriş başarısız: " + (error.response ? error.response.data.message : error.message));
    });
}