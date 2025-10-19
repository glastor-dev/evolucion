import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceSearchOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export const useVoiceSearch = (options: VoiceSearchOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Verificar si el navegador soporta Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();

      // Configuración
      recognitionRef.current.lang = options.lang || 'es-ES';
      recognitionRef.current.continuous = options.continuous || false;
      recognitionRef.current.interimResults = options.interimResults || true;

      // Event listeners
      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Voice search error:', event.error);
        setError(event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
      console.warn('Web Speech API not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [options.lang, options.continuous, options.interimResults]);

  // Iniciar búsqueda por voz
  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Voice search not supported');
      return;
    }

    try {
      setTranscript('');
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error('Error starting voice recognition:', err);
      setError('Failed to start voice recognition');
    }
  }, [isSupported]);

  // Detener búsqueda por voz
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  // Alternar búsqueda por voz
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Resetear transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
  };
};
