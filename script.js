/* ==========================================
   LIVE CLOCK
========================================== */

function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const date = now.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const clock = document.getElementById("clock");
    const dateText = document.getElementById("date");

    if (clock) clock.textContent = time;
    if (dateText) dateText.textContent = date;

}

updateClock();
setInterval(updateClock, 1000);

/* ==========================================
   PARTICLES
========================================== */

const particleContainer = document.getElementById("particles");

if (particleContainer) {

    for (let i = 0; i < 120; i++) {

        const dot = document.createElement("span");

        const size = Math.random() * 3 + 1;

        dot.style.position = "absolute";
        dot.style.width = size + "px";
        dot.style.height = size + "px";
        dot.style.borderRadius = "50%";
        dot.style.background = "rgba(255,255,255,.8)";

        dot.style.left = Math.random() * 100 + "%";
        dot.style.top = Math.random() * 100 + "%";

        dot.style.opacity = Math.random();

        dot.style.animation =
            `float ${6 + Math.random() * 12}s linear infinite`;

        dot.style.animationDelay =
            `${Math.random() * 10}s`;

        particleContainer.appendChild(dot);

    }

}

/* ==========================================
   FLOAT ANIMATION
========================================== */

const style = document.createElement("style");

style.innerHTML = `
@keyframes float{

0%{

transform:
translateY(0px);

opacity:.2;

}

50%{

opacity:1;

}

100%{

transform:
translateY(-120px);

opacity:0;

}

}
`;

document.head.appendChild(style);

/* ==========================================
   HERO PARALLAX
========================================== */

const hero = document.querySelector(".hero");

if (hero) {

    hero.addEventListener("mousemove", e => {

        const rect = hero.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width;

        const y = (e.clientY - rect.top) / rect.height;

        hero.style.backgroundPosition =
            `${50 + x * 4}% ${50 + y * 4}%`;

    });

}

/* ==========================================
   CARD HOVER
========================================== */

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--x", x + "px");
        card.style.setProperty("--y", y + "px");

    });

});

/* ==========================================
   SEARCH BAR
========================================== */

const input = document.querySelector(".search-box input");

const sendButton = document.querySelector(".search-box button");

function sendPrompt() {

    const value = input.value.trim();

    if (!value) return;

    alert("Prompt: " + value);

    input.value = "";

}

if (sendButton) {

    sendButton.addEventListener("click", sendPrompt);

}

if (input) {

    input.addEventListener("keypress", e => {

        if (e.key === "Enter") {

            sendPrompt();

        }

    });

}

/* ==========================================
   QUICK ACTIONS
========================================== */

document.querySelectorAll(".quick-grid button").forEach(btn => {

    btn.addEventListener("click", () => {

        btn.animate(

            [

                { transform: "scale(1)" },

                { transform: "scale(.9)" },

                { transform: "scale(1)" }

            ],

            {

                duration: 180

            }

        );

    });

});

/* ==========================================
   HERO FADE
========================================== */

window.addEventListener("load", () => {

    document.body.style.opacity = "1";

});

/* ==========================================
   CONSOLE
========================================== */

console.log("%cVOIDLURE JARVIS",
"color:white;font-size:22px;font-weight:bold");

console.log("Dashboard Loaded");
