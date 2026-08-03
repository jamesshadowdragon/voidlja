/* ==========================================
   LIVE CLOCK
========================================== */

function updateClock() {

    const now = new Date();

    const clock = document.getElementById("clock");
    const date = document.getElementById("date");

    if (clock) {

        clock.textContent = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

    }

    if (date) {

        date.textContent = now.toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

    }

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
        dot.style.animation = `float ${6 + Math.random() * 10}s linear infinite`;
        dot.style.animationDelay = `${Math.random() * 8}s`;

        particleContainer.appendChild(dot);

    }

}

const style = document.createElement("style");

style.innerHTML = `
@keyframes float{

0%{

transform:translateY(0);

opacity:.2;

}

50%{

opacity:1;

}

100%{

transform:translateY(-120px);

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

        card.style.setProperty("--x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--y", `${e.clientY - rect.top}px`);

    });

});


/* ==========================================
   QUICK ACTION ANIMATION
========================================== */

document.querySelectorAll(".quick-grid button").forEach(button => {

    button.addEventListener("click", () => {

        button.animate([
            { transform: "scale(1)" },
            { transform: "scale(.92)" },
            { transform: "scale(1)" }
        ], {
            duration: 180
        });

    });

});


/* ==========================================
   AI CHAT
========================================== */

const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-btn");
const chatMessages = document.getElementById("chat-messages");

function addMessage(text, className) {

    if (!chatMessages) return;

    const message = document.createElement("div");

    message.className = className;

    message.innerHTML = text.replace(/\n/g, "<br>");

    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    return message;

}

async function sendPrompt() {

    if (!chatInput) return;

    const prompt = chatInput.value.trim();

    if (!prompt) return;

    addMessage(
        `<strong>You</strong><br>${prompt}`,
        "user-message"
    );

    chatInput.value = "";

    const loading = addMessage(
        `<strong>Voidlure</strong><br>Thinking...`,
        "bot-message loading"
    );

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/chat",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: prompt
                })

            }
        );

        if (!response.ok) {

            throw new Error("Backend Error");

        }

        const data = await response.json();

        loading.remove();

        addMessage(
            `<strong>Voidlure</strong><br>${data.response}`,
            "bot-message"
        );

    }

    catch (err) {

        loading.remove();

        addMessage(
            `<strong>Voidlure</strong><br>Unable to connect to the backend.<br><br>Make sure FastAPI is running.`,
            "bot-message"
        );

        console.error(err);

    }

}

if (sendButton) {

    sendButton.addEventListener("click", sendPrompt);

}

if (chatInput) {

    chatInput.addEventListener("keydown", e => {

        if (e.key === "Enter") {

            e.preventDefault();

            sendPrompt();

        }

    });

}


/* ==========================================
   PAGE LOAD
========================================== */

window.addEventListener("load", () => {

    document.body.style.opacity = "1";

});


/* ==========================================
   CONSOLE
========================================== */

console.log(
    "%cVOIDLURE JARVIS",
    "font-size:22px;font-weight:bold;color:white;"
);

console.log("Dashboard Loaded Successfully");
