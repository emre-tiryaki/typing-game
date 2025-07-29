document.addEventListener("DOMContentLoaded", () => {
  const loginContainer = document.querySelector(".login-container");
  const registerContainer = document.querySelector(".register-container");
  const forgotContainer = document.querySelector(".forgot-container");

  // Login / Register geçiş
  document.getElementById("showLogin")?.addEventListener("click", () => {
    loginContainer.style.display = "flex";
    registerContainer.style.display = "none";
    forgotContainer.style.display = "none";
  });

  document.getElementById("showRegister")?.addEventListener("click", () => {
    loginContainer.style.display = "none";
    registerContainer.style.display = "flex";
    forgotContainer.style.display = "none";
  });

  // ✅ E-posta kontrolü
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const regEmail = document.getElementById("regEmail");
  const emailMsg = document.getElementById("emailMsg");

  regEmail?.addEventListener("input", () => {
    emailMsg.textContent = isValidEmail(regEmail.value)
      ? "✅ E-posta geçerli."
      : "❌ Geçerli bir e-posta girin.";
    emailMsg.style.color = isValidEmail(regEmail.value) ? "green" : "red";
  });

  // ✅ Şifre kontrolü
  const pass1 = document.getElementById("regPass1");
  const pass2 = document.getElementById("regPass2");
  const pass1Msg = document.getElementById("pass1Msg");
  const pass2Msg = document.getElementById("pass2Msg");

  pass1?.addEventListener("input", () => {
    pass1Msg.textContent =
      pass1.value.length >= 6
        ? "✅ Şifre uygun."
        : "❌ Şifre en az 6 karakter olmalı.";
    pass1Msg.style.color = pass1.value.length >= 6 ? "green" : "red";
  });

  pass2?.addEventListener("input", () => {
    pass2Msg.textContent =
      pass2.value === pass1.value
        ? "✅ Şifreler eşleşti."
        : "❌ Şifreler eşleşmiyor.";
    pass2Msg.style.color = pass2.value === pass1.value ? "green" : "red";
  });

  // ✅ Şifre sıfırlama
  document.getElementById("forgotPasswordLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    loginContainer.style.display = "none";
    registerContainer.style.display = "none";
    forgotContainer.style.display = "flex";
  });

  const forgotEmail = document.getElementById("forgotEmail");
  const forgotMsg = document.getElementById("forgotMsg");

  forgotEmail?.addEventListener("input", () => {
    forgotMsg.textContent = isValidEmail(forgotEmail.value)
      ? "✅ E-posta uygun."
      : "❌ Geçerli bir e-posta girin.";
    forgotMsg.style.color = isValidEmail(forgotEmail.value) ? "green" : "red";
  });

  // ✅ Kod gönderme
  let sentCode = "123456";
  document.getElementById("sendResetCode")?.addEventListener("click", () => {
    if (isValidEmail(forgotEmail.value)) {
      alert("✅ Kod gönderildi! (Simülasyon: 123456)");
      document.getElementById("verifySection").style.display = "block";
    } else {
      alert("❌ Geçerli bir e-posta girin.");
    }
  });

  // ✅ Kod doğrulama ve yeni şifre
  document.getElementById("confirmReset")?.addEventListener("click", () => {
    const code = document.getElementById("resetCode").value;
    const newPass1 = document.getElementById("newPass1").value;
    const newPass2 = document.getElementById("newPass2").value;
    const codeMsg = document.getElementById("codeMsg");
    const newPassMsg = document.getElementById("newPassMsg");

    if (code !== sentCode) {
      codeMsg.textContent = "❌ Kod yanlış!";
      codeMsg.style.color = "red";
      return;
    }
    codeMsg.textContent = "✅ Kod doğru.";
    codeMsg.style.color = "green";

    if (newPass1.length < 6) {
      newPassMsg.textContent = "❌ Şifre en az 6 karakter olmalı.";
      newPassMsg.style.color = "red";
      return;
    }
    if (newPass1 !== newPass2) {
      newPassMsg.textContent = "❌ Şifreler eşleşmiyor.";
      newPassMsg.style.color = "red";
      return;
    }

    newPassMsg.textContent = "✅ Şifre sıfırlandı!";
    newPassMsg.style.color = "green";
    setTimeout(() => {
      alert("✅ Şifre değiştirildi. Giriş ekranına yönlendiriliyorsunuz...");
      forgotContainer.style.display = "none";
      loginContainer.style.display = "flex";
    }, 1500);
  });
});
