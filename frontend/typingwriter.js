document.addEventListener("DOMContentLoaded", function () {
    const texts = [
        "Klavyede hızlan!",
        "On parmak yazmayı öğren",
        "Yavaş yazmaktan sıkılmadın mı?"
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

window.onload = function () {
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    let stars = [];
    const numStars = 80;

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.2 + 0.3,
            speed: Math.random() * 0.15 + 0.05
        });
    }

    function drawStars() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#fff";
        for (let i = 0; i < numStars; i++) {
            let s = stars[i];
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    function moveStars() {
        for (let i = 0; i < numStars; i++) {
            let s = stars[i];
            s.y += s.speed;
            if (s.y > h) {
                s.y = 0;
                s.x = Math.random() * w;
            }
        }
    }

    function animate() {
        drawStars();
        moveStars();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
    });

    animate();
};