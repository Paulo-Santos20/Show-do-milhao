import { useState, useEffect, useRef, useCallback } from 'react';

const useAudio = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const [isBackgroundPlaying, setIsBackgroundPlaying] = useState(false);
  
  // Refs para os áudios
  const backgroundMusicRef = useRef(null);
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);
  const tickSoundRef = useRef(null);
  const timeWarningSoundRef = useRef(null);

  // URLs dos áudios locais
  const audioSources = {
    backgroundMusic: '/audio/background-music.mp3',
    correctSound: '/audio/correct-sound.mp3',
    incorrectSound: '/audio/incorrect-sound.mp3',
    tickSound: '/audio/timer-tick.mp3',
    timeWarning: '/audio/urgent-music.mp3'
  };

  // Inicializar áudios
  useEffect(() => {
    const initAudio = () => {
      try {
        console.log('🎵 Inicializando sistema de áudio...');
        
        // Música de fundo (loop)
        backgroundMusicRef.current = new Audio(audioSources.backgroundMusic);
        backgroundMusicRef.current.loop = true;
        backgroundMusicRef.current.volume = 0.3;
        backgroundMusicRef.current.preload = 'auto';
        
        // Event listeners para a música de fundo
        backgroundMusicRef.current.addEventListener('play', () => {
          console.log('🎵 Música de fundo iniciada');
          setIsBackgroundPlaying(true);
        });
        
        backgroundMusicRef.current.addEventListener('pause', () => {
          console.log('🔇 Música de fundo pausada');
          setIsBackgroundPlaying(false);
        });
        
        backgroundMusicRef.current.addEventListener('ended', () => {
          console.log('🔄 Música de fundo terminou (vai reiniciar automaticamente)');
        });
        
        // Som de resposta correta
        correctSoundRef.current = new Audio(audioSources.correctSound);
        correctSoundRef.current.volume = 1;
        correctSoundRef.current.preload = 'auto';
        
        // Som de resposta incorreta
        incorrectSoundRef.current = new Audio(audioSources.incorrectSound);
        incorrectSoundRef.current.volume = 1;
        incorrectSoundRef.current.preload = 'auto';
        
        // Som de tick do timer
        tickSoundRef.current = new Audio(audioSources.tickSound);
        tickSoundRef.current.volume = 0.2; // Volume mais baixo para o tick
        tickSoundRef.current.preload = 'auto';
        
        // Som de aviso de tempo
        timeWarningSoundRef.current = new Audio(audioSources.timeWarning);
        timeWarningSoundRef.current.volume = 1;
        timeWarningSoundRef.current.preload = 'auto';

        console.log('🎵 Sistema de áudio inicializado');
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Erro ao inicializar áudio:', error);
        setIsLoading(false);
      }
    };

    initAudio();

    // Cleanup
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.removeEventListener('play', () => {});
        backgroundMusicRef.current.removeEventListener('pause', () => {});
        backgroundMusicRef.current.removeEventListener('ended', () => {});
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  // Função para habilitar áudio (deve ser chamada após interação do usuário)
  const enableAudio = useCallback(async () => {
    try {
      console.log('🎵 Habilitando áudio...');
      
      // Tentar tocar e pausar imediatamente a música de fundo para "destravar" o áudio
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.volume = 0;
        const playPromise = backgroundMusicRef.current.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          backgroundMusicRef.current.pause();
          backgroundMusicRef.current.currentTime = 0;
          backgroundMusicRef.current.volume = 0.3;
        }
      }

      setAudioEnabled(true);
      setShowAudioPrompt(false);
      console.log('✅ Áudio habilitado com sucesso!');
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao habilitar áudio:', error);
      setAudioEnabled(false);
      return false;
    }
  }, []);

  // Função para desabilitar áudio
  const disableAudio = useCallback(() => {
    console.log('🔇 Desabilitando áudio...');
    
    // Parar música de fundo
    if (backgroundMusicRef.current && !backgroundMusicRef.current.paused) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
    
    setAudioEnabled(false);
    setShowAudioPrompt(false);
  }, []);

  // Função para tocar música de fundo
  const playBackgroundMusic = useCallback(async () => {
    if (!audioEnabled || isMuted || !backgroundMusicRef.current) {
      console.log('🔇 Música de fundo não pode ser tocada:', { audioEnabled, isMuted, hasRef: !!backgroundMusicRef.current });
      return;
    }
    
    // Verificar se já está tocando
    if (!backgroundMusicRef.current.paused) {
      console.log('🎵 Música de fundo já está tocando');
      return;
    }
    
    try {
      backgroundMusicRef.current.currentTime = 0;
      const playPromise = backgroundMusicRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('🎵 Música de fundo iniciada com sucesso');
      }
    } catch (error) {
      console.error('❌ Erro ao tocar música de fundo:', error);
    }
  }, [audioEnabled, isMuted]);

  // Função para parar música de fundo
  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current && !backgroundMusicRef.current.paused) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
      console.log('🔇 Música de fundo parada');
    }
  }, []);

  // Função para tocar som de resposta correta
  const playCorrectSound = useCallback(async () => {
    if (!audioEnabled || isMuted || !correctSoundRef.current) return;
    
    try {
      correctSoundRef.current.currentTime = 0;
      const playPromise = correctSoundRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('🎵 Som de resposta correta tocado');
      }
    } catch (error) {
      console.error('❌ Erro ao tocar som de resposta correta:', error);
    }
  }, [audioEnabled, isMuted]);

  // Função para tocar som de resposta incorreta
  const playIncorrectSound = useCallback(async () => {
    if (!audioEnabled || isMuted || !incorrectSoundRef.current) return;
    
    try {
      incorrectSoundRef.current.currentTime = 0;
      const playPromise = incorrectSoundRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('🎵 Som de resposta incorreta tocado');
      }
    } catch (error) {
      console.error('❌ Erro ao tocar som de resposta incorreta:', error);
    }
  }, [audioEnabled, isMuted]);

  // Função para tocar som de tick do timer
  const playTickSound = useCallback(async () => {
    if (!audioEnabled || isMuted || !tickSoundRef.current) return;
    
    try {
      // Criar uma nova instância para permitir sobreposição
      const tickAudio = tickSoundRef.current.cloneNode();
      tickAudio.volume = 0.2;
      tickAudio.currentTime = 0;
      
      const playPromise = tickAudio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (error) {
      console.error('❌ Erro ao tocar som de tick:', error);
    }
  }, [audioEnabled, isMuted]);

  // Função para tocar som de aviso de tempo
  const playTimeWarningSound = useCallback(async () => {
    if (!audioEnabled || isMuted || !timeWarningSoundRef.current) return;
    
    try {
      timeWarningSoundRef.current.currentTime = 0;
      const playPromise = timeWarningSoundRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('🎵 Som de aviso de tempo tocado');
      }
    } catch (error) {
      console.error('❌ Erro ao tocar som de aviso de tempo:', error);
    }
  }, [audioEnabled, isMuted]);

  // Função para alternar mute
  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (newMutedState) {
      // Se mutou, parar música de fundo
      stopBackgroundMusic();
      console.log('🔇 Áudio mutado');
    } else {
      // Se desmutou e áudio está habilitado, tocar música de fundo
      if (audioEnabled) {
        playBackgroundMusic();
        console.log('🔊 Áudio desmutado');
      }
    }
    
    return newMutedState;
  }, [isMuted, audioEnabled, stopBackgroundMusic, playBackgroundMusic]);

  // Função para definir volume da música de fundo
  const setBackgroundVolume = useCallback((volume) => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  return {
    // Estados
    isMuted,
    isLoading,
    audioEnabled,
    showAudioPrompt,
    isBackgroundPlaying,
    
    // Funções de controle
    enableAudio,
    disableAudio,
    toggleMute,
    setBackgroundVolume,
    
    // Funções de reprodução
    playBackgroundMusic,
    stopBackgroundMusic,
    playCorrectSound,
    playIncorrectSound,
    playTickSound,
    playTimeWarningSound,
    
    // Setters
    setShowAudioPrompt,
    setIsMuted
  };
};

export { useAudio };
export default useAudio;