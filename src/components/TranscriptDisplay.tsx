import React from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TranscriptDisplayProps {
  title: string;
  content: string;
  isLoading?: boolean;
  placeholder: string;
  language: string; // now generic string like 'fr', 'en', 'es'
  showSpeakerButton?: boolean;
  onSpeak?: () => void;
  isSpeaking?: boolean;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  title,
  content,
  isLoading = false,
  placeholder,
  language,
  showSpeakerButton = false,
  onSpeak,
  isSpeaking = false
}) => {
  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case 'fr':
        return '🇫🇷';
      case 'en':
        return '🇺🇸';
      case 'es':
        return '🇪🇸';
      case 'de':
        return '🇩🇪';
      case 'it':
        return '🇮🇹';
      default:
        return '🏳️'; // default flag
    }
  };

  return (
    <Card className="h-64 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <span>{getLanguageFlag(language)}</span>
            <span>{title}</span>
          </h3>
          
          {showSpeakerButton && content && (
            <Button
              onClick={onSpeak}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1 hover:bg-blue-50"
              disabled={isSpeaking}
            >
              {isSpeaking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {isSpeaking ? 'Speaking...' : 'Listen'}
              </span>
            </Button>
          )}
        </div>
        
        <div className="flex-1 bg-gray-50/50 rounded-lg p-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : content ? (
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          ) : (
            <p className="text-gray-400 italic">
              {placeholder}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TranscriptDisplay;
