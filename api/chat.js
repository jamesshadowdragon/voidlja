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

        const { message } = req.body;

        if (!message || message.trim() === "") {
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

You are a modern AI desktop assistant.

Rules:

- Be friendly.
- Be professional.
- Give accurate answers.
- Format code using markdown.
- Use bullet lists when helpful.
- Never mention OpenRouter unless asked.
- Keep responses concise unless the user requests detail.`
                },

                {
                    role: "user",
                    content: message
                }

            ]

        });

        return res.status(200).json({

            response:
                completion.choices[0].message.content

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            error: "Internal Server Error"

        });

    }

}
