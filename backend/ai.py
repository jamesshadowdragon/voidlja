import httpx

from config import config


class AIClient:

    def __init__(self):
        self.provider = config.AI_PROVIDER

    async def chat(self, message: str):

        if self.provider == "openrouter":
            return await self._openrouter(message)

        if self.provider == "openai":
            return await self._openai(message)

        if self.provider == "deepseek":
            return await self._deepseek(message)

        return "Invalid AI provider configured."

    async def _openrouter(self, message: str):

        headers = {
            "Authorization": f"Bearer {config.OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": config.MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are Voidlure Jarvis, a modern AI desktop assistant. "
                        "Be concise, helpful, professional, and friendly."
                    )
                },
                {
                    "role": "user",
                    "content": message
                }
            ]
        }

        try:

            async with httpx.AsyncClient(timeout=60) as client:

                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json=payload
                )

                response.raise_for_status()

                data = response.json()

                return data["choices"][0]["message"]["content"]

        except Exception as e:
            return f"OpenRouter Error: {e}"

    async def _openai(self, message: str):
        return "OpenAI support will be added next."

    async def _deepseek(self, message: str):
        return "DeepSeek direct API support will be added next."


ai = AIClient()
