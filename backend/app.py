from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ai import ai

app = FastAPI(
    title="Voidlure Jarvis API",
    version="1.0.0"
)

# Allow your frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Later you can restrict this to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@app.get("/")
async def root():
    return {
        "name": "Voidlure Jarvis API",
        "status": "online"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(data: ChatRequest):

    reply = await ai.chat(data.message)

    return ChatResponse(
        response=reply
    )
