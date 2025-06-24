````markdown
# 🎙️ TalkEz

**TalkEz** is a browser-based voice translation app that allows users to speak in one language, get real-time translation, and listen to the translated output in another language. It's built with **React** for the frontend and **FastAPI** for the backend translation service using the `googletrans` library.

## 🚀 Features

- 🎤 Real-time speech recognition using Web Speech API
- 🌍 Supports multiple languages (French, English, Spanish, German, Arabic, etc.)
- 🔁 Language switching capability (source ↔ target)
- 📣 Speech synthesis for translated text
- 🖥️ Stylish, responsive UI with language flags and transitions

## 🧑‍💻 Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** FastAPI + Python + `googletrans`
- **Others:** Web Speech API (for voice recognition and speech synthesis)

## 🛠️ Setup Instructions

### ⚙️ Backend (FastAPI)

1. Clone the repository:
   ```bash
   git clone https://github.com/R4M-0/TalkEz.git
````

2. Create a virtual environment and install dependencies:

   ```bash
   python -m venv venv
   source venv/bin/activate  # or .\venv\Scripts\activate on Windows
   pip install fastapi uvicorn googletrans==4.0.0-rc1
   ```

3. Run the FastAPI server:

   ```bash
   uvicorn translate_server:app --reload
   ```

### 🌐 Frontend (React)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the React development server:

   ```bash
   npm run dev
   ```

### ✅ Test the App

* Open your browser and go to `http://localhost:8080`.
* Speak into your microphone in the selected source language.
* Watch as your voice is transcribed, translated, and read out loud in the target language.

## 🔄 API Endpoint

* `POST /translate`

**Request body:**

```json
{
  "text": "Bonjour",
  "source": "fr",
  "target": "en"
}
```

**Response:**

```json
{
  "translatedText": "Hello"
}
```

## 🌍 Supported Languages

* French 🇫🇷
* English 🇺🇸
* Spanish 🇪🇸
* German 🇩🇪
* Italian 🇮🇹
* Portuguese 🇵🇹
* Japanese 🇯🇵
* Korean 🇰🇷
* Russian 🇷🇺
* Arabic 🇸🇦
