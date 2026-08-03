const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-btn");

let history = JSON.parse(
    localStorage.getItem("voidlure-history") || "[]"
);

let aiHistory = JSON.parse(
    localStorage.getItem("voidlure-ai-history") || "[]"
);

function saveHistory() {

    localStorage.setItem(
        "voidlure-history",
        JSON.stringify(history)
    );

    localStorage.setItem(
        "voidlure-ai-history",
        JSON.stringify(aiHistory)
    );

}

function scrollBottom() {

    chatMessages.scrollTop = chatMessages.scrollHeight;

}

function createMessage(sender, text, type) {

    const message = document.createElement("div");

    message.className = type;

    message.innerHTML = `
        <strong>${sender}</strong><br>
        ${text.replace(/\n/g, "<br>")}
    `;

    chatMessages.appendChild(message);

    scrollBottom();

    return message;

}

function loadHistory() {

    chatMessages.innerHTML = "";

    if (history.length === 0) {

        createMessage(
            "Voidlure",
            "Hello! I'm Voidlure Jarvis. How can I help you today?",
            "bot-message"
        );

        return;

    }

    history.forEach(msg => {

        createMessage(
            msg.sender,
            msg.text,
            msg.type
        );

    });

}

async function sendMessage() {

    const prompt = chatInput.value.trim();

    if (!prompt) return;

    createMessage(
        "You",
        prompt,
        "user-message"
    );

    history.push({
        sender: "You",
        text: prompt,
        type: "user-message"
    });

    aiHistory.push({
        role: "user",
        content: prompt
    });

    saveHistory();

    chatInput.value = "";

    const loading = createMessage(
        "Voidlure",
        "Thinking...",
        "bot-message loading"
    );

    sendButton.disabled = true;

    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                message: prompt,

                history: aiHistory

            })

        });

        const data = await response.json();

        loading.remove();

        if (data.error) {

            createMessage(
                "Voidlure",
                data.error,
                "bot-message"
            );

            return;

        }

        createMessage(
            "Voidlure",
            data.response,
            "bot-message"
        );

        history.push({

            sender: "Voidlure",

            text: data.response,

            type: "bot-message"

        });

        aiHistory.push({

            role: "assistant",

            content: data.response

        });

        if (aiHistory.length > 20) {

            aiHistory = aiHistory.slice(-20);

        }

        saveHistory();

    }

    catch (err) {

        loading.remove();

        createMessage(

            "Voidlure",

            "Unable to contact the AI server.",

            "bot-message"

        );

        console.error(err);

    }

    finally {

        sendButton.disabled = false;

        chatInput.focus();

    }

}

sendButton.addEventListener(
    "click",
    sendMessage
);

chatInput.addEventListener(
    "keydown",
    e => {

        if (e.key === "Enter") {

            e.preventDefault();

            sendMessage();

        }

    }
);

window.clearChat = () => {

    history = [];

    aiHistory = [];

    saveHistory();

    loadHistory();

};

loadHistory();
