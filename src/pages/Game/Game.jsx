import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Game.css';

const Game = () => {
  const navigate = useNavigate();

  // Estados do jogo
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(1000);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const [questions, setQuestions] = useState([]);

  // Refs para áudio
  const backgroundMusicRef = useRef(null);
  const urgentMusicRef = useRef(null);
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);

  // Refs para controlar volumes originais
  const originalVolumes = useRef({
    background: 0.3,
    urgent: 0.5,
    correct: 0.7,
    incorrect: 0.7
  });

  // ✅ CARREGAR PERGUNTAS DO ADMIN
  useEffect(() => {
    const savedQuestions = localStorage.getItem('quiz-questions');
    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions);
      if (parsedQuestions.length > 0) {
        setQuestions(parsedQuestions);
      } else {
        // Se não há perguntas, redirecionar para admin
        alert('Nenhuma pergunta encontrada! Redirecionando para o painel administrativo.');
        navigate('/admin');
      }
    } else {
      // Perguntas padrão se não houver nada salvo
      setQuestions(getDefaultQuestions());
    }
  }, [navigate]);

  // Perguntas padrão (fallback)
  const getDefaultQuestions = () => [
    {
      id: 1,
      question: "São itens necessários para validar uma prescrição médica:",
      options: [
        "Nome do Paciente, nome social, carimbo, horário em que foi prescrito.",
        "Nome completo do Paciente, nome da medicação, dose, via de administração, frequência e horário, assinatura e carimbo médico (com CRM).",
        "Nome completo do paciente, nome da medicação, via de administração, horário, carimbo."
      ],
      correctAnswer: 1,
      value: 1000,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      question: "Um grupo de medicações em específico exige um maior cuidado em seu manuseio e administração. Esse grupo é denominado de:",
      options: [
        "Medicações de Alta Vigilância (MAV).",
        "Medicações de uso gravitacional.",
        "Medicações de uso supervisionado (MUS)."
      ],
      correctAnswer: 0,
      value: 2000,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop"
    }
    // Adicionar mais perguntas padrão conforme necessário
  ];

  const prizeValues = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000];

  // ✅ FUNÇÃO PARA INICIALIZAR E COMEÇAR ÁUDIO AUTOMATICAMENTE
  const initializeAudio = async () => {
    try {
      console.log("🎵 Inicializando sistema de áudio contínuo...");

      // Criar elementos de áudio
      backgroundMusicRef.current = new Audio("/audio/background-music.mp3");
      urgentMusicRef.current = new Audio("/audio/urgent-music.mp3");
      correctSoundRef.current = new Audio("/audio/correct-sound.mp3");
      incorrectSoundRef.current = new Audio("/audio/incorrect-sound.mp3");

      // ✅ CONFIGURAR PROPRIEDADES E VOLUMES
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = originalVolumes.current.background;

      urgentMusicRef.current.loop = true;
      urgentMusicRef.current.volume = 0; // Começa mutado

      correctSoundRef.current.volume = originalVolumes.current.correct;
      incorrectSoundRef.current.volume = originalVolumes.current.incorrect;

      // ✅ INICIAR AMBAS AS MÚSICAS (uma audível, outra mutada)
      console.log("🎵 Iniciando música de fundo...");
      await backgroundMusicRef.current.play();

      console.log("🎵 Iniciando música urgente (mutada)...");
      await urgentMusicRef.current.play();

      setAudioInitialized(true);
      setShowAudioPrompt(false);

      console.log("✅ Sistema de áudio inicializado com sucesso!");

    } catch (error) {
      console.log("⚠️ Erro na inicialização, mas continuando:", error);
      setAudioInitialized(true);
      setShowAudioPrompt(false);
    }
  };

  // ✅ FUNÇÃO PARA ALTERNAR ENTRE MÚSICA NORMAL E URGENTE
  const switchToUrgentMusic = () => {
    if (!audioInitialized) return;

    console.log("⚠️ Mudando para música urgente...");

    if (audioMuted) {      // Se está mutado, apenas trocar os volumes (ambos ficam 0)
      backgroundMusicRef.current.volume = 0;
      urgentMusicRef.current.volume = 0;
    } else {
      // Se não está mutado, fazer a transição
      backgroundMusicRef.current.volume = 0;
      urgentMusicRef.current.volume = originalVolumes.current.urgent;
    }
  };

  const switchToBackgroundMusic = () => {
    if (!audioInitialized) return;

    console.log("🎵 Mudando para música de fundo...");

    if (audioMuted) {
      // Se está mutado, ambos ficam 0
      backgroundMusicRef.current.volume = 0;
      urgentMusicRef.current.volume = 0;
    } else {
      // Se não está mutado, fazer a transição
      backgroundMusicRef.current.volume = originalVolumes.current.background;
      urgentMusicRef.current.volume = 0;
    }
  };

  // ✅ FUNÇÃO PARA TOCAR EFEITOS SONOROS
  const playSound = (soundRef) => {
    if (audioMuted || !audioInitialized || !soundRef.current) return;

    try {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(console.log);
    } catch (error) {
      console.log("Erro ao reproduzir efeito sonoro:", error);
    }
  };

  // ✅ FUNÇÃO PARA MUTAR/DESMUTAR TODOS OS ÁUDIOS
  const toggleMute = () => {
    if (!audioInitialized) {
      console.log("🎵 Inicializando áudio...");
      initializeAudio();
      return;
    }

    const newMutedState = !audioMuted;
    setAudioMuted(newMutedState);

    console.log(`🔇 ${newMutedState ? 'MUTANDO' : 'DESMUTANDO'} todos os áudios...`);

    if (newMutedState) {
      // ✅ MUTAR: Zerar volumes mas manter reprodução
      backgroundMusicRef.current.volume = 0;
      urgentMusicRef.current.volume = 0;
      correctSoundRef.current.volume = 0;
      incorrectSoundRef.current.volume = 0;
    } else {
      // ✅ DESMUTAR: Restaurar volumes baseado no contexto atual
      if (timeLeft > 18) {
        backgroundMusicRef.current.volume = originalVolumes.current.background;
        urgentMusicRef.current.volume = 0;
      } else {
        backgroundMusicRef.current.volume = 0;
        urgentMusicRef.current.volume = originalVolumes.current.urgent;
      }
      correctSoundRef.current.volume = originalVolumes.current.correct;
      incorrectSoundRef.current.volume = originalVolumes.current.incorrect;
    }
  };

  // ✅ TIMER COM CONTROLE DE MÚSICA POR VOLUME
  useEffect(() => {
    if (timeLeft > 0 && !showResult && audioInitialized) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      // Mudar música quando restam 18 segundos
      if (timeLeft === 18 && !isAnswering) {
        switchToUrgentMusic();
      }

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, audioInitialized, isAnswering, audioMuted]);

  const handleTimeUp = () => {
    // Parar músicas e tocar som de erro
    if (audioInitialized) {
      backgroundMusicRef.current.volume = 0;
      urgentMusicRef.current.volume = 0;
      playSound(incorrectSoundRef);
    }

    setShowResult(true);
    setTimeout(() => {
      navigate('/result', { state: { score, questionsAnswered: currentQuestion } });
    }, 2000);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswering) return;

    setSelectedAnswer(answerIndex);
    setIsAnswering(true);

    // Silenciar músicas temporariamente
    if (audioInitialized) {
      backgroundMusicRef.current.volume = 0;
      urgentMusicRef.current.volume = 0;
    }

    setTimeout(() => {
      const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;

      // Tocar som de feedback
      if (isCorrect) {
        playSound(correctSoundRef);
      } else {
        playSound(incorrectSoundRef);
      }

      if (isCorrect) {
        const newScore = questions[currentQuestion].value;
        setScore(newScore);

        setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setTimeLeft(60);
            setSelectedAnswer(null);
            setIsAnswering(false);

            // ✅ RETOMAR MÚSICA DE FUNDO (sempre começa normal)
            if (audioInitialized) {
              switchToBackgroundMusic();
            }
          } else {
            navigate('/result', { state: { score: newScore, questionsAnswered: questions.length, completed: true } });
          }
        }, 2000);
      } else {
        setTimeout(() => {
          navigate('/result', { state: { score, questionsAnswered: currentQuestion } });
        }, 2000);
      }
    }, 1000);
  };

  // ✅ VERIFICAR SE HÁ PERGUNTAS SUFICIENTES
  if (questions.length === 0) {
    return (
      <div className="game-container">
        <div className="no-questions-container">
          <h2>Nenhuma pergunta encontrada!</h2>
          <p>Configure as perguntas no painel administrativo primeiro.</p>
          <button onClick={() => navigate('/admin')} className="admin-btn">
            Ir para Admin
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const isCorrectAnswer = selectedAnswer === currentQuestionData?.correctAnswer;

  return (
    <div className="game-container">
      {/* Prompt para Ativar Áudio */}
      {showAudioPrompt && (
        <div className="audio-prompt-overlay">
          <div className="audio-prompt-content">
            <div className="audio-prompt-icon">🎵</div>
            <h2>Ativar Áudio do Jogo?</h2>
            <p>Para uma experiência completa, ative o áudio do Show do Milhão!</p>
            <div className="audio-prompt-buttons">
              <button
                className="audio-prompt-btn primary"
                onClick={initializeAudio}
              >
                🔊 Ativar Áudio
              </button>
              <button
                className="audio-prompt-btn secondary"
                onClick={() => {
                  setShowAudioPrompt(false);
                  setAudioMuted(true);
                  setAudioInitialized(true);
                }}
              >
                🔇 Jogar sem Áudio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header com Logo UPA */}
      <div className="game-header">
        <div className="upa-logo-header">
          <div className="upa-main-header">
            <span className="upa-text-header">UPA 24h</span>
            <span className="upa-location-header">IGARASSU</span>
          </div>
        </div>

        <div className="game-title-header">
          <h1 className="show-title-header">SHOW DO MILHÃO</h1>
          <h2 className="enfermagem-title-header">DA ENFERMAGEM</h2>
        </div>

        {/* ✅ BOTÃO DE MUTE/UNMUTE DESKTOP */}
        <div className="audio-controls">
          <button
            className={`audio-toggle-single ${!audioInitialized ? 'loading' :
                audioMuted ? 'disabled' : 'enabled'
              }`}
            onClick={toggleMute}
            title={
              !audioInitialized ? 'Clique para inicializar áudio' :
                audioMuted ? 'Ativar áudio' : 'Mutar áudio'
            }
          >
            {!audioInitialized ? '⏳' : audioMuted ? '��' : '🔊'}
          </button>
        </div>
      </div>

      {/* ✅ BOTÃO DE MUTE/UNMUTE MOBILE */}
      <div className="audio-controls-mobile">
        <button
          className={`audio-toggle-mobile ${!audioInitialized ? 'loading' :
              audioMuted ? 'disabled' : 'enabled'
            }`}
          onClick={toggleMute}
          title={
            !audioInitialized ? 'Clique para inicializar áudio' :
              audioMuted ? 'Ativar áudio' : 'Mutar áudio'
          }
        >
          {!audioInitialized ? '⏳' : audioMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div className="game-main-content">
        <div className="game-content-left">
          <div className="question-box">
            <div className="question-header">
              <span className="question-number">Pergunta {currentQuestion + 1}/{questions.length}</span>
              <span className="question-value">R$ {currentQuestionData?.value.toLocaleString('pt-BR')}</span>
            </div>

            <h2 className="question-text">{currentQuestionData?.question}</h2>

            <div className="options-container">
              {currentQuestionData?.options.map((option, index) => (
                <div
                  key={index}
                  className={`option-item ${selectedAnswer === index
                      ? isCorrectAnswer
                        ? 'correct'
                        : 'incorrect'
                      : ''
                    } ${isAnswering && index === currentQuestionData.correctAnswer
                      ? 'show-correct'
                      : ''
                    }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <span className="option-number">{index + 1}</span>
                  <p className="option-text">{option}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="game-sidebar-right">
          {currentQuestionData?.image && (
            <div className="question-image-container">
              <img
                src={currentQuestionData.image}
                alt={`Ilustração da pergunta ${currentQuestion + 1}`}
                className="question-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="score-box">
            <div className="score-label">PRÊMIO ATUAL</div>
            <div className="score-value">
              R$ {score.toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="timer-box">
            <div className="timer-label">CRONÔMETRO</div>
            <div className={`timer-display ${timeLeft <= 18 ? 'warning' : ''}`}>
              {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
          </div>

          <div className="prize-ladder">
            <div className="ladder-title">PRÊMIOS</div>
            {prizeValues.slice().reverse().map((value, index) => (
              <div
                key={index}
                className={`ladder-item ${score >= value ? 'achieved' : ''
                  } ${currentQuestionData?.value === value ? 'current' : ''
                  }`}
              >
                <span className="ladder-number">{10 - index}</span>
                <span className="ladder-value">R$ {value.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showResult && (
        <div className="result-overlay">
          <div className="result-content">
            <h2>Tempo Esgotado!</h2>
            <p>Redirecionando para o resultado...</p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;