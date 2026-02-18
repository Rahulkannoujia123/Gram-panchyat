'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceRecognitionProps {
  onTranscript: (text: string, language: string) => void;
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  transcript: string;
}

export function VoiceRecognition({
  onTranscript,
  isListening,
  setIsListening,
  transcript,
}: VoiceRecognitionProps) {
  const [language, setLanguage] = useState<'en-US' | 'hi-IN'>('hi-IN');
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const languageRef = useRef(language);

  // Language update ko ref mein sync rakhein taaki recognition events ko latest value mile
  useEffect(() => {
    languageRef.current = language;
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsBrowserSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Isse lambi baat-cheet record hogi
    recognition.interimResults = true;
    recognition.lang = languageRef.current;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptChunk;
        } else {
          interimTranscript += transcriptChunk;
        }
      }

      // Agar final text hai toh vahi bheinzein, warna interim dikhayein
      const textToDisplay = finalTranscript || interimTranscript;
      if (textToDisplay) {
        onTranscript(textToDisplay, languageRef.current);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech Error:', event.error);
      if (event.error === 'not-allowed') {
        alert("Microphone access denied! Please enable it in browser settings.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      // Agar state abhi bhi listening hai, matlab network ya timeout se ruka hai, toh restart karein
      if (isListening) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onTranscript, setIsListening, isListening]); // isListening dependency restart logic ke liye zaroori hai

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = languageRef.current;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Start error:", e);
      }
    }
  }, [isListening, setIsListening]);

  // Language switch function
  const changeLanguage = (newLang: 'en-US' | 'hi-IN') => {
    setLanguage(newLang);
    if (isListening) {
      // Restart taaki nayi language apply ho sake
      recognitionRef.current?.stop();
      setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.lang = newLang;
          recognitionRef.current.start();
        }
      }, 300);
    }
  };

  if (!isBrowserSupported) {
    return <div className="p-4 bg-red-100 text-red-600 rounded-lg">Browser support nahi hai.</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="flex gap-4">
        <button 
          onClick={() => changeLanguage('hi-IN')}
          className={`px-4 py-2 rounded ${language === 'hi-IN' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >🇮🇳 हिंदी</button>
        <button 
          onClick={() => changeLanguage('en-US')}
          className={`px-4 py-2 rounded ${language === 'en-US' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >🇺🇸 English</button>
      </div>

      <button
        onClick={toggleListening}
        className={`p-8 rounded-full transition-all ${isListening ? 'bg-red-500 animate-pulse scale-110' : 'bg-blue-500'}`}
      >
        {isListening ? <Mic size={48} color="white" /> : <MicOff size={48} color="white" />}
      </button>

      <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-xl border">
        <p className="text-sm text-gray-400 mb-2">{isListening ? "सुन रहे हैं..." : "बोलने के लिए माइक दबाएं"}</p>
        <p className="text-lg min-h-[3rem]">{transcript || "..."}</p>
      </div>
    </div>
  );
}
