//bunu config.js içerisinden almalıyız.
const BASE_URL = "http://localhost:4000"; // Backend URL'sini tanımlayın

document.addEventListener("DOMContentLoaded", () => {
  //butona tıklanınca direk istek atıyor. burayı daha güvenli hale getirebiliriz.
  document.getElementById("registerBtn").onclick = async () => {
    //bunları daha estetik bir şekilde alabilirsin
    //ben iki dakka alim diye böle yaptım
    const nameField = document.getElementById("regName");
    const emailField = document.getElementById("regEmail");
    const passwordField = document.getElementById("regPass1");

    const name = nameField.value;
    const email = emailField.value;
    const password = passwordField.value;

    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        name: name,
        email: email,
        password: password,
      });
      window.location.href = "../html/levelpage.html";
      console.log("Register Response:", response.data);
    } catch (error) {
      //gelen hata kodlarına göre bir hata yönetimi yapılabilir
      console.error("Register Error:", error.response?.data || error.message);
    }
  };

  document.getElementById("enter-btn").onclick = async () => {
    //bunları daha estetik bir şekilde alabilirsin
    //ben iki dakka alim diye böle yaptım
    const emailField = document.getElementById("logEmail");
    const passwordField = document.getElementById("logPassword");

    const email = emailField.value;
    const password = passwordField.value;

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: email,
        password: password,
      });
      window.location.href = "../html/levelpage.html";
      console.log("Register Response:", response.data);
    } catch (error) {
      //gelen hata kodlarına göre bir hata yönetimi yapılabilir
      console.error("Register Error:", error.response?.data || error.message);
    }
  };
});
