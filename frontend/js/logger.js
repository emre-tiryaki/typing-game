import { api } from '../js/config.js';

document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("registerBtn");
  const loginBtn = document.getElementById("enter-btn");

  //veriler al
  const getInputValues = (fields) => {
    return fields.reduce((acc, id) => {
      acc[id] = document.getElementById(id).value.trim();
      return acc;
    }, {});
  };

  //kayıt ve giriş işlemleri
  const validateRegister = ({ regName, regEmail, regPass1 }) => {
    if (!regName || !regEmail || !regPass1) {
      showAlert("Tüm alanları doldurunuz.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      showAlert("Geçerli bir e-posta giriniz.");
      return false;
    }
    if (regPass1.length < 6) {
      showAlert("Şifre en az 6 karakter olmalıdır.");
      return false;
    }
    return true;
  };

  //idareten alert göster
  const showAlert = (message) => {
    const alertBox = document.createElement("div");
    alertBox.textContent = message;
    alertBox.style.position = "fixed";
    alertBox.style.top = "20px";
    alertBox.style.right = "20px";
    alertBox.style.padding = "10px 20px";
    alertBox.style.backgroundColor = "#f44336";
    alertBox.style.color = "white";
    alertBox.style.borderRadius = "5px";
    alertBox.style.zIndex = "9999";
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);
  };

  //axios ile istek gönder
  const handleRequest = async (url, data, successRedirect) => {
    try {
      await axios.post(url, data);
      window.location.href = successRedirect;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Bir hata oluştu.";
      if (errMsg.includes("password")) {
        showAlert("Şifre yanlış!");
      } else if (errMsg.includes("exists")) {
        showAlert("Bu e-posta ile zaten kayıtlısınız.");
      } else if (errMsg.includes("not found")) {
        showAlert("Kullanıcı bulunamadı.");
      } else {
        showAlert(errMsg);
      }
      console.error("Error:", errMsg);
    }
  };

  //event listener'lar(register)
  registerBtn.onclick = async () => {
    registerBtn.disabled = true;
    const { regName, regEmail, regPass1 } = getInputValues(["regName", "regEmail", "regPass1"]);
    if (!validateRegister({ regName, regEmail, regPass1 })) {
      registerBtn.disabled = false;
      return;
    }
    await handleRequest(`${api('/auth/register')}`, { name: regName, email: regEmail, password: regPass1 }, "../html/levelpage.html");
    registerBtn.disabled = false;
  };


  //event listener'lar(login)
  loginBtn.onclick = async () => {
    loginBtn.disabled = true;
    const { logEmail, logPassword } = getInputValues(["logEmail", "logPassword"]);
    if (!logEmail || !logPassword) {
      showAlert("E-posta ve şifre gereklidir.");
      loginBtn.disabled = false;
      return;
    }
    await handleRequest(`${api('/auth/login')}`, { email: logEmail, password: logPassword }, "../html/levelpage.html");
    loginBtn.disabled = false;
  };
});
