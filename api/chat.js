import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed"
        });
    }

    try {

        const {
            message,
            history = []
        } = req.body;

        if (!message || !message.trim()) {

            return res.status(400).json({
                error: "Message is required."
            });

        }

        const completion = await client.chat.completions.create({

            model: "deepseek/deepseek-chat-v3-0324:free",

            messages: [

                {
                    role: "system",
                    content: `You are Voidlure Jarvis.

You are an advanced AI desktop assistant created by Voidlure.

Your personality:

- Friendly
- Professional
- Intelligent
- Concise
- Helpful

Rules:

- Always answer naturally.
- Format code using markdown.
- Use bullet points when helpful.
- Use tables when appropriate.
- Never reveal API keys.
- Never mention OpenRouter unless the user specifically asks.
- If you don't know something, say so instead of making it up.
- Remember previous conversation messages that are provided in the history.`
                },

                ...history,

                {
                    role: "user",
                    content: message
                }

            ],

            temperature: 0.7,

            max_tokens: 1500

        });

        const reply =
            completion.choices?.[0]?.message?.content ||
            "I couldn't generate a response.";

        return res.status(200).json({

            response: reply

        });

    }

    catch (err) {

        console.error("OpenRouter Error:", err);

        return res.status(500).json({

            error: "Failed to contact the AI service."

        });

    }

}
