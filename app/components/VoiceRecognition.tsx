'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

export function VoiceRecognition({ onTranscript, isListening, setIsListening, transcript }: any) {
  const recognitionRef = useRef<any>(null);
  const isComponentMounted = useRef(true);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    
    // Fast Response ke liye settings
    recognition.continuous = false; // Sentence khatam hote hi result do
    recognition.interimResults = true; // Beech-beech mein dikhao (Speed)
    recognition.lang = 'hi-IN'; 

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      const confidence = result[0].confidence;

      // Filter: Agar confidence 0.8 se kam hai toh noise ho sakta hai
      if (confidence < 0.7) return; 

      onTranscript(text, recognition.lang);

      // Agar final result hai toh turant stop karke restart logic chalayein
      if (result.isFinal) {
        console.log("Final Capture:", text);
      }
    };

    recognition.onend = () => {
      // Auto-restart loop (Fastest way to keep listening without capturing background noise long-term)
      if (isListening && isComponentMounted.current) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
    return () => { isComponentMounted.current = false; };
  }, [isListening, onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={toggleListening}
        className={`p-5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-600'}`}
      >
        {isListening ? <Mic size={32} color="white" /> : <MicOff size={32} color="white" />}
      </button>
      
      {transcript && (
        <div className="p-3 bg-gray-100 rounded-lg border-l-4 border-blue-500 w-full max-w-sm">
          <p className="text-sm font-bold text-gray-700">{transcript}</p>
        </div>
      )}
    </div>
  );
}
