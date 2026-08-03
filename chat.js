const API_URL = "http://127.0.0.1:8000/chat";

const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-btn");

let chatHistory = JSON.parse(localStorage.getItem("voidlure_chat") || "[]");

function saveHistory() {
    localStorage.setItem(
        "voidlure_chat",
        JSON.stringify(chatHistory)
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

    if (!chatMessages) return;

    chatMessages.innerHTML = "";

    if (chatHistory.length === 0) {

        createMessage(
            "Voidlure",
            "Hello! I'm Voidlure Jarvis.<br>How can I help you today?",
            "bot-message"
        );

        return;

    }

    chatHistory.forEach(msg => {

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

    chatHistory.push({

        sender: "You",

        text: prompt,

        type: "user-message"

    });

    saveHistory();

    chatInput.value = "";

    const loading = createMessage(

        "Voidlure",

        "Thinking...",

        "bot-message loading"

    );

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                message: prompt

            })

        });

        if (!response.ok) {

            throw new Error("Server Error");

        }

        const data = await response.json();

        loading.remove();

        createMessage(

            "Voidlure",

            data.response,

            "bot-message"

        );

        chatHistory.push({

            sender: "Voidlure",

            text: data.response,

            type: "bot-message"

        });

        saveHistory();

    }

    catch (error) {

        loading.remove();

        createMessage(

            "Voidlure",

            "Unable to connect to the backend.",

            "bot-message"

        );

        console.error(error);

    }

}

function clearChat() {

    chatHistory = [];

    saveHistory();

    loadHistory();

}

if (sendButton) {

    sendButton.addEventListener(

        "click",

        sendMessage

    );

}

if (chatInput) {

    chatInput.addEventListener(

        "keydown",

        e => {

            if (e.key === "Enter") {

                e.preventDefault();

                sendMessage();

            }

        }

    );

}

window.clearVoidlureChat = clearChat;

loadHistory();
