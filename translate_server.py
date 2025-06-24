from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from googletrans import Translator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

translator = Translator()

class TranslationRequest(BaseModel):
    text: str
    source: str
    target: str

@app.post("/translate")
async def translate(req: TranslationRequest):
    translated = translator.translate(req.text, src=req.source, dest=req.target)
    return {"translatedText": translated.text}

