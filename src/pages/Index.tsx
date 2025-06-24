
import React from 'react';
import VoiceTranslator from '../components/VoiceTranslator';

const Index = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#8c52ff' }}>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <img
            src="public/E.png"
            alt="TalkEz Logo"
            className="mx-auto w-48 md:w-64 object-contain"
          />
          <p className="text-lg text-white max-w-2xl mx-auto">
            You speak, we translate.
          </p>
        </header>
        <VoiceTranslator />
      </div>
    </div>
  );
};

export default Index;
