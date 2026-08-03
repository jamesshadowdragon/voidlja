const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-btn");

let history =
    JSON.parse(localStorage.getItem("voidlure-history") || "[]");

let aiHistory =
    JSON.parse(localStorage.getItem("voidlure-ai-history") || "[]");


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

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


function createMessage(sender, text, cls) {

    const div = document.createElement("div");

    div.className = cls;

    const formatted =
        cls === "bot-message"
            ? marked.parse(text)
            : text.replace(/\n/g, "<br>");

    div.innerHTML = `
        <strong>${sender}</strong><br>
        <span class="message-text">${formatted}</span>
    `;

    if (cls === "bot-message") {

        div.querySelectorAll("pre code").forEach(block => {

            hljs.highlightElement(block);

        });

        addCopyButtons();

    }

    chatMessages.appendChild(div);

    scrollBottom();

    return div;

}


function loadHistory() {

    chatMessages.innerHTML = "";

    if (history.length === 0) {

        createMessage(
            "Voidlure",
            "Hello! I'm Voidlure Jarvis.",
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

    sendButton.disabled = true;

    const botMessage = createMessage(

        "Voidlure",

        "",

        "bot-message"

    );

    const textElement =
        botMessage.querySelector(".message-text");

    let finalText = "";

    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                message: prompt,

                history: aiHistory

            })

        });

        if (!response.body) {

            throw new Error("Streaming unsupported.");

        }

        const reader =
            response.body.getReader();

        const decoder =
            new TextDecoder();

        let buffer = "";

        while (true) {

            const {

                value,

                done

            } = await reader.read();

            if (done) break;

            buffer += decoder.decode(
                value,
                {
                    stream: true
                }
            );

            const events =
                buffer.split("\n\n");

            buffer = events.pop();

            for (const event of events) {

                if (!event.startsWith("data:"))
                    continue;

                const json =
                    event.replace(
                        "data:",
                        ""
                    ).trim();

                if (!json) continue;

                try {

                    const data =
                        JSON.parse(json);

                   textElement.innerHTML = marked.parse(finalText);

textElement.querySelectorAll("pre code").forEach(block => {

    hljs.highlightElement(block);

});

addCopyButtons();

scrollBottom();

                    }

                }

                catch {

                }

            }

        }

        history.push({

            sender: "Voidlure",

            text: finalText,

            type: "bot-message"

        });

        aiHistory.push({

            role: "assistant",

            content: finalText

        });

        if (aiHistory.length > 20) {

            aiHistory =
                aiHistory.slice(-20);

        }

        saveHistory();

    }

    catch (err) {

        textElement.innerHTML =
            "Unable to contact the AI.";

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

function addCopyButtons() {

    document.querySelectorAll("pre").forEach(pre => {

        if (pre.querySelector(".copy-btn")) return;

        const button = document.createElement("button");

        button.className = "copy-btn";

        button.textContent = "Copy";

        button.onclick = async () => {

            const code = pre.querySelector("code");

            if (!code) return;

            await navigator.clipboard.writeText(code.innerText);

            button.textContent = "Copied!";

            setTimeout(() => {

                button.textContent = "Copy";

            }, 1500);

        };

        pre.appendChild(button);

    });

}

window.clearChat = () => {

    history = [];

    aiHistory = [];

    saveHistory();

    loadHistory();

};


loadHistory();
