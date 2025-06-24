import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Volume2, Loader2, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TranscriptDisplay from './TranscriptDisplay';
import { translateText } from '../utils/translation';
import { speakText } from '../utils/speechSynthesis';
import { toast } from 'sonner';

const languages = [
  { code: 'fr-FR', label: 'French (France)', flag: '🇫🇷' },
  { code: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { code: 'es-ES', label: 'Spanish (Spain)', flag: '🇪🇸' },
  { code: 'de-DE', label: 'German (Germany)', flag: '🇩🇪' },
  { code: 'it-IT', label: 'Italian (Italy)', flag: '🇮🇹' },
  { code: 'pt-PT', label: 'Portuguese (Portugal)', flag: '🇵🇹' },
  { code: 'ja-JP', label: 'Japanese', flag: '🇯🇵' },
  { code: 'ko-KR', label: 'Korean', flag: '🇰🇷' },
  { code: 'ru-RU', label: 'Russian', flag: '🇷🇺' },
  { code: 'ar-SA', label: 'Arabic', flag: '🇸🇦' },
];

const VoiceTranslator = () => {
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const [sourceLang, setSourceLang] = useState('fr-FR');
  const [targetLang, setTargetLang] = useState('en-US');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      toast.error('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = sourceLang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptChunk;
        } else {
          interimTranscript += transcriptChunk;
        }
      }

      setTranscript(finalTranscript + interimTranscript);

      if (finalTranscript) {
        handleTranslation(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast.error(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [sourceLang]);

  const handleTranslation = async (text: string) => {
    if (!text.trim()) return;

    setIsTranslating(true);
    try {
      const translatedText = await translateText(
        text,
        sourceLang.split('-')[0],
        targetLang.split('-')[0]
      );
      setTranslation(translatedText);
      toast.success('Translation completed!');
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) return;

    setTranscript('');
    setTranslation('');
    setIsListening(true);
    recognitionRef.current.lang = sourceLang;
    recognitionRef.current.start();
    toast.info(`Listening... Speak in ${languages.find(l => l.code === sourceLang)?.label || 'selected language'}`);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleSpeakTranslation = useCallback(async () => {
    if (!translation.trim()) {
      toast.error('No translation to speak');
      return;
    }

    setIsSpeaking(true);
    try {
      await speakText(translation, targetLang);
    } catch {
      toast.error('Speech synthesis failed');
    } finally {
      setIsSpeaking(false);
    }
  }, [translation, targetLang]);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setTranscript('');
    setTranslation('');
  };

  if (!isSupported) {
    return (
      <Card className="max-w-2xl mx-auto p-8 text-center rounded-2xl shadow-lg bg-red-50 border border-red-300">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Browser Not Supported</h2>
        <p className="text-red-600 text-lg">
          Your browser doesn't support speech recognition. Please use Chrome, Edge, or another compatible browser.
        </p>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-6">
      {/* Language Selector with Swap Button */}
      <Card className="flex justify-center items-center gap-6 p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl border border-purple-300">
        <div className="flex flex-col items-center space-y-2">
          <label className="text-lg font-semibold text-purple-700 select-none">Source Language</label>
          <select
            className="text-lg rounded-xl border border-purple-400 px-6 py-2 cursor-pointer shadow-md transition hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300 bg-white"
            value={sourceLang}
            onChange={e => setSourceLang(e.target.value)}
          >
            {languages.map(({ code, label, flag }) => (
              <option key={code} value={code}>
                {flag} {label}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <Button
          variant="outline"
          size="icon"
          className="rotate-90 text-purple-700 hover:text-purple-900 hover:bg-purple-200 transition duration-300 shadow-md"
          aria-label="Swap languages"
          onClick={handleSwapLanguages}
          title="Swap source and target languages"
        >
          <Repeat className="w-6 h-6" />
        </Button>

        <div className="flex flex-col items-center space-y-2">
          <label className="text-lg font-semibold text-purple-700 select-none">Target Language</label>
          <select
            className="text-lg rounded-xl border border-purple-400 px-6 py-2 cursor-pointer shadow-md transition hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300 bg-white"
            value={targetLang}
            onChange={e => setTargetLang(e.target.value)}
          >
            {languages.map(({ code, label, flag }) => (
              <option key={code} value={code}>
                {flag} {label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Voice Control */}
      <Card className="p-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-200 flex flex-col items-center space-y-8">
        <Button
          onClick={isListening ? stopListening : startListening}
          size="lg"
          className={`w-28 h-28 rounded-full shadow-xl transition transform duration-300 ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 animate-pulse shadow-red-400'
              : 'bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
          }`}
          disabled={isTranslating}
          aria-label={isListening ? 'Stop Listening' : 'Start Listening'}
        >
          {isListening ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
        </Button>

        <div className="text-center max-w-md">
          <p className="text-xl font-semibold text-gray-800">
            {isListening
              ? `Listening... Speak in ${languages.find(l => l.code === sourceLang)?.label}`
              : `Press to speak in ${languages.find(l => l.code === sourceLang)?.label}`}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {isListening
              ? 'Tap again to stop recording.'
              : `We'll translate your speech to ${languages.find(l => l.code === targetLang)?.label}.`}
          </p>
        </div>
      </Card>

      {/* Transcript & Translation */}
      <div className="grid md:grid-cols-2 gap-8">
        <TranscriptDisplay
          title={`${languages.find(l => l.code === sourceLang)?.flag} ${languages.find(l => l.code === sourceLang)?.label} (Original)`}
          content={transcript}
          isLoading={isListening}
          placeholder={`Your speech in ${languages.find(l => l.code === sourceLang)?.label} will appear here...`}
          language={sourceLang.split('-')[0] as 'fr' | 'en' | 'es' | 'de' | 'it'}
        />
        <TranscriptDisplay
          title={`${languages.find(l => l.code === targetLang)?.flag} ${languages.find(l => l.code === targetLang)?.label} (Translation)`}
          content={translation}
          isLoading={isTranslating}
          placeholder={`Translation in ${languages.find(l => l.code === targetLang)?.label} will appear here...`}
          language={targetLang.split('-')[0] as 'fr' | 'en' | 'es' | 'de' | 'it'}
          showSpeakerButton={!!translation}
          onSpeak={handleSpeakTranslation}
          isSpeaking={isSpeaking}
        />
      </div>

      {/* Status */}
      {(isTranslating || isSpeaking) && (
        <Card className="p-4 bg-indigo-50/80 backdrop-blur-sm border border-indigo-200 rounded-xl flex justify-center items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-indigo-700 font-semibold text-lg">
            {isTranslating && 'Translating...'}
            {isSpeaking && 'Speaking translation...'}
          </span>
        </Card>
      )}
    </div>
  );
};

export default VoiceTranslator;
