
export const speakText = (text: string, lang: string = 'en-US'): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (event) => {
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };

    // Get available voices and try to use a native voice for the language
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(lang.split('-')[0])) || voices[0];
    if (voice) {
      utterance.voice = voice;
    }

    speechSynthesis.speak(utterance);
  });
};

// Ensure voices are loaded
if ('speechSynthesis' in window) {
  speechSynthesis.getVoices();
  
  // Some browsers need this event to load voices
  speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
  };
}
