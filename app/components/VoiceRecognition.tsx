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
  const shouldListenRef = useRef(false);
  const languageRef = useRef<'en-US' | 'hi-IN'>('hi-IN');

  // Initialize Web Speech API once
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsBrowserSupported(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    // Configuration - use continuous:false for better restart control
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let interimTranscript = '';

    recognition.onstart = () => {
      console.log('[v0] Speech recognition started');
    };

    recognition.onresult = (event: any) => {
      interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const trans = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          console.log('[v0] Final transcript:', trans);
          onTranscript(trans, languageRef.current);
          interimTranscript = '';
        } else {
          interimTranscript += trans + ' ';
        }
      }

      // Update UI with interim transcript
      if (interimTranscript) {
        onTranscript(interimTranscript.trim() + '...', languageRef.current);
      }
    };

    recognition.onerror = (event: any) => {
      // Ignore "aborted" errors - they're intentional when we stop/restart recognition
      if (event.error !== 'aborted') {
        console.error('[v0] Speech recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      console.log('[v0] Speech recognition ended, shouldListen:', shouldListenRef.current);
      // Auto-restart if user wants to keep listening
      if (shouldListenRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.error('[v0] Failed to restart recognition:', e);
          }
        }, 100);
      } else {
        setIsListening(false);
      }
    };

    return () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch (e) {
          console.error('[v0] Error aborting recognition:', e);
        }
      }
    };
  }, [onTranscript, setIsListening]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      if (isListening) {
        console.log('[v0] Stopping listening');
        shouldListenRef.current = false;
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        console.log('[v0] Starting listening with language:', languageRef.current);
        shouldListenRef.current = true;
        recognitionRef.current.lang = languageRef.current;
        recognitionRef.current.start();
        setIsListening(true);
      }
    } catch (error) {
      console.error('[v0] Error toggling listening:', error);
      setIsListening(false);
    }
  }, [isListening, setIsListening]);

  const changeLanguage = useCallback((newLang: 'en-US' | 'hi-IN') => {
    console.log('[v0] Changing language to:', newLang);
    setLanguage(newLang);
    languageRef.current = newLang;
    
    // If listening, restart with new language
    if (isListening && recognitionRef.current) {
      try {
        shouldListenRef.current = true;
        recognitionRef.current.abort();
        setTimeout(() => {
          recognitionRef.current.lang = newLang;
          recognitionRef.current.start();
        }, 100);
      } catch (error) {
        console.error('[v0] Error changing language:', error);
      }
    }
  }, [isListening]);

  if (!isBrowserSupported) {
    return (
      <div className="p-4 bg-destructive/20 text-destructive rounded-lg">
        <p>🔴 Voice recognition not supported in your browser</p>
        <p className="text-sm mt-2">Please use Chrome, Edge, or Safari for voice features</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Language Selector */}
      <div className="flex gap-2 justify-center mb-4">
        <button
          onClick={() => changeLanguage('hi-IN')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            language === 'hi-IN'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-secondary'
          }`}
        >
          🇮🇳 हिंदी
        </button>
        <button
          onClick={() => changeLanguage('en-US')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            language === 'en-US'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-secondary'
          }`}
        >
          🇺🇸 English
        </button>
      </div>

      {/* Microphone Button */}
      <div className="flex justify-center">
        <button
          onClick={toggleListening}
          className={`p-6 rounded-full transition-all transform ${
            isListening
              ? 'bg-destructive text-white scale-110 animate-pulse'
              : 'bg-primary text-primary-foreground hover:scale-105'
          }`}
          title={isListening ? 'Stop Listening' : 'Start Listening'}
        >
          {isListening ? (
            <Mic size={40} className="animate-bounce" />
          ) : (
            <MicOff size={40} />
          )}
        </button>
      </div>

      {/* Status and Transcript */}
      <div className="space-y-2">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isListening ? (
              <span className="flex items-center justify-center gap-2">
                <Volume2 className="animate-spin" size={16} />
                {language === 'hi-IN' ? 'सुन रहे हैं...' : 'Listening...'}
              </span>
            ) : (
              <span>{language === 'hi-IN' ? 'माइक दबाएं' : 'Press mic to start'}</span>
            )}
          </p>
        </div>

        {transcript && (
          <div className="p-4 bg-card rounded-lg border-2 border-primary">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              {language === 'hi-IN' ? 'आपका कहना:' : 'You said:'}
            </p>
            <p className="text-lg font-bold text-foreground break-words">{transcript}</p>
          </div>
        )}
      </div>

      {/* Listening Indicator */}
      {isListening && (
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-8 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
