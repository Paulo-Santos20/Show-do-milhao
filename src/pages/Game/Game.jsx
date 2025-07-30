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
  const [audioMuted, setAudioMuted] = useState(false); // ✅ Mudança: muted ao invés de enabled
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);

  // Refs para áudio
  const backgroundMusicRef = useRef(null);
  const urgentMusicRef = useRef(null);
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);

  // ✅ Refs para controlar volumes originais
  const originalVolumes = useRef({
    background: 0.3,
    urgent: 0.5,
    correct: 0.7,
    incorrect: 0.7
  });

  // Perguntas
  const questions = [
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
    },
    {
      id: 3,
      question: "São exemplos de Medicações de Alta Vigilância:",
      options: [
        "Cloreto de potássio, morfina e suxametônio.",
        "Paracetamol, Epinefrina e Diazepam.",
        "Dipirona, escitalopram e topiramato."
      ],
      correctAnswer: 0,
      value: 5000,
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      question: "Conforme o COREN e seus devidos registros literários e regulatórios, quais são os 9 certos das medicações:",
      options: [
        "1 - Paciente certo, 2 - medicamento certo, 3 - dose certa, 4 - via certa, 5 - hora certa, 6 - risco de alergia, 7 - orientação certa, 8 – forma farmacêutica certa, 9 resposta certa.",
        "1 - Paciente certo, 2 - medicamento certo, 3 - dose certa, 4 - via certa, 5 - hora certa, 6 – registro certo, 7 - orientação certa, 8 – forma farmacêutica certa, 9 resposta certa.",
        "1 - Paciente certo, 2 - medicamento certo, 3 - dose certa, 4 - via certa, 5 - hora certa, 6 – registro certo, 7 - orientação certa, 8 – forma farmacêutica certa, 9 Seringa correta."
      ],
      correctAnswer: 1,
      value: 10000,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      question: "São cuidados com o acesso venoso periférico:",
      options: [
        "Controle de volume infundido; assepsia do lúmen; teste de fluxo e refluxo; verificação de febre e frequência cardíaca.",
        "Lavagem das mãos; verificação do sítio (risco de flebite e demais complicações); Uso de luvas; assepsia do lúmen. Troca do AVP (72 horas).",
        "Assepsia do lúmen com cloreto de sódio à 0,9%, uso de luvas, comunicação com a enfermeira sobre risco de flebite."
      ],
      correctAnswer: 1,
      value: 20000,
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      question: "Sobre uso de luvas e medicação IM podemos considerar a afirmativa:",
      options: [
        "Nunca usar; não há necessidade em caso de administrações medicamentosas profundas.",
        "Usar em caso de contato com sangue e secreções, pele não íntegra, importante realizar a lavagem das mãos.",
        "Usar apenas quando solicitado pelo médico."
      ],
      correctAnswer: 1,
      value: 50000,
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop"
    },
    {
      id: 7,
      question: "Conforme a literatura qual o tempo recomendado para lavagem das mãos com água e sabão:",
      options: [
        "20 - 30 segundos",
        "40 - 60 segundos",
        "10 segundos"
      ],
      correctAnswer: 1,
      value: 100000,
      image: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&h=300&fit=crop"
    },
    {
      id: 8,
      question: "Quais as penalidades aplicáveis pelo COREN e pelo COFEN:",
      options: [
        "Advertência verbal; multa; censura; suspensão do exercício profissional; cassação.",
        "Advertência verbal; advertência escrita; multa; censura; suspensão do exercício profissional e cassação.",
        "Advertência verbal; retratação; cassação."
      ],
      correctAnswer: 1,
      value: 200000,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
    },
    {
      id: 9,
      question: "Petronila resolve dormir a noite toda, deixando assim de medicar seus pacientes, podemos dizer que Petronila (técnica de enfermagem) encontra-se agindo com:",
      options: [
        "Negligência.",
        "Imperícia.",
        "Imprudência."
      ],
      correctAnswer: 0,
      value: 500000,
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop"
    },
    {
      id: 10,
      question: "Maravilindo utiliza o mesmo espaçador em todos os pacientes, podemos afirmar que Maravilindo encontra-se agindo com:",
      options: [
        "Imperícia.",
        "Negligência.",
        "Imprudência."
      ],
      correctAnswer: 2,
      value: 1000000,
      image: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=400&h=300&fit=crop"
    }
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
    
    if (audioMuted) {
      // Se está mutado, apenas trocar os volumes (ambos ficam 0)
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
          <h2 class Name="enfermagem-title-header">DA ENFERMAGEM</h2>
        </div>

        {/* ✅ BOTÃO DE MUTE/UNMUTE */}
        <div className="audio-controls">
          <button 
            className={`audio-toggle-single ${
              !audioInitialized ? 'loading' : 
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
      </div>

      {/* Conteúdo Principal */}
      <div className="game-main-content">
        <div className="game-content-left">
          <div className="question-box">
            <div className="question-header">
              <span className="question-number">Pergunta {currentQuestion + 1}/10</span>
              <span className="question-value">R$ {currentQuestionData?.value.toLocaleString('pt-BR')}</span>
            </div>
            
            <h2 className="question-text">{currentQuestionData?.question}</h2>
            
            <div className="options-container">
              {currentQuestionData?.options.map((option, index) => (
                <div 
                  key={index} 
                  className={`option-item ${
                    selectedAnswer === index 
                      ? isCorrectAnswer 
                        ? 'correct' 
                        : 'incorrect'
                      : ''
                  } ${
                    isAnswering && index === currentQuestionData.correctAnswer 
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
          <div className="question-image-container">
            <img 
              src={currentQuestionData?.image} 
              alt={`Ilustração da pergunta ${currentQuestion + 1}`} 
              className="question-image"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x300/1E3A8A/FFFFFF?text=Imagem+da+Pergunta";
              }}
            />
          </div>

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
                className={`ladder-item ${
                  score >= value ? 'achieved' : ''
                } ${
                  currentQuestionData?.value === value ? 'current' : ''
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