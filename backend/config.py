import os
from dotenv import load_dotenv

load_dotenv()


class Config:

    HOST = "127.0.0.1"

    PORT = 8000

    DEBUG = True

    AI_PROVIDER = os.getenv("AI_PROVIDER", "openrouter").lower()

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

    DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")

    MODEL = os.getenv(
        "MODEL",
        "deepseek/deepseek-chat-v3-0324:free"
    )


config = Config()
