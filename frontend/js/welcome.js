document.addEventListener("DOMContentLoaded", function () {
    const texts = [
        "Klavyede hızlan!",
        "On parmak yazmayı öğren",
        "dönerci olmak vardı şimdi",
        "Yavaş yazmaktan sıkılmadın mı?",
        "osbir"                // :D sarıyo
    ];
    const h1 = document.querySelector(".hero h1");
    let i = 0;
    let textIndex = 0;

    function typeWriter(text, cb) {
        if (i < text.length) {
            h1.textContent += text.charAt(i);
            i++;
            setTimeout(() => typeWriter(text, cb), 80);
        } else if (cb) {
            setTimeout(cb, 700);
        }
    }

    function deleteWriter(cb) {
        if (h1.textContent.length > 0) {
            h1.textContent = h1.textContent.slice(0, -1);
            setTimeout(() => deleteWriter(cb), 40);
        } else if (cb) {
            setTimeout(cb, 400);
        }
    }

    function startAnimation() {
        i = 0;
        typeWriter(texts[textIndex], () => {
            deleteWriter(() => {
                textIndex = (textIndex + 1) % texts.length;
                i = 0;
                typeWriter(texts[textIndex], () => {
                    deleteWriter(() => {
                        textIndex = (textIndex + 1) % texts.length;
                        i = 0;
                        typeWriter(texts[textIndex], () => {
                            deleteWriter(() => {
                                textIndex = (textIndex + 1) % texts.length;
                                startAnimation();
                            });
                        });
                    });
                });
            });
        });
    }

    h1.textContent = "";
    startAnimation();
});

//login sayfasına yonlendir
document.querySelector('.login-btn').onclick = function () {
    window.location.href = "login.html";
};