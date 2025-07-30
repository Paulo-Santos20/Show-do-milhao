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
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);

  // Refs para áudio
  const backgroundMusicRef = useRef(null);
  const urgentMusicRef = useRef(null);
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);

  // Perguntas (mesmo código anterior)
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

  // Função para inicializar áudio após interação do usuário
  const initializeAudio = async () => {
    try {
      // Criar elementos de áudio
      backgroundMusicRef.current = new Audio();
      urgentMusicRef.current = new Audio();
      correctSoundRef.current = new Audio();
      incorrectSoundRef.current = new Audio();

      // Configurar áudios com URLs funcionais
      backgroundMusicRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuL0fPTgjMGHm7A7+OZURE=";
      urgentMusicRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuL0fPTgjMGHm7A7+OZURE=";
      correctSoundRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuL0fPTgjMGHm7A7+OZURE=";
      incorrectSoundRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuL0fPTgjMGHm7A7+OZURE=";

      // Configurar propriedades
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = 0.3;
      urgentMusicRef.current.loop = true;
      urgentMusicRef.current.volume = 0.5;
      correctSoundRef.current.volume = 0.7;
      incorrectSoundRef.current.volume = 0.7;

      // Tentar reproduzir um som silencioso para "desbloquear" o áudio
      await backgroundMusicRef.current.play();
      backgroundMusicRef.current.pause();

      setAudioInitialized(true);
      setShowAudioPrompt(false);

      // Iniciar música de fundo
      if (audioEnabled) {
        backgroundMusicRef.current.play().catch(console.log);
      }

    } catch (error) {
      console.log("Erro ao inicializar áudio:", error);
      setAudioInitialized(false);
    }
  };

  // Função para tocar som
  const playSound = (soundRef) => {
    if (audioEnabled && audioInitialized && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(console.log);
    }
  };

  // Função para parar som
  const stopSound = (soundRef) => {
    if (soundRef.current) {
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
    }
  };

  // Timer do jogo
  useEffect(() => {
    if (timeLeft > 0 && !showResult && audioInitialized) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      // Mudar música quando restam 10 segundos
      if (timeLeft === 10 && audioEnabled) {
        stopSound(backgroundMusicRef);
        playSound(urgentMusicRef);
      }

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, audioEnabled, audioInitialized]);

  const handleTimeUp = () => {
    stopSound(backgroundMusicRef);
    stopSound(urgentMusicRef);
    playSound(incorrectSoundRef);
    
    setShowResult(true);
    setTimeout(() => {
      navigate('/result', { state: { score, questionsAnswered: currentQuestion } });
    }, 2000);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswering) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswering(true);

    // Parar todas as músicas
    stopSound(backgroundMusicRef);
    stopSound(urgentMusicRef);

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
            
            // Reiniciar música de fundo
            playSound(backgroundMusicRef);
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

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    
    if (!audioEnabled && audioInitialized) {
      // Reativar áudio
      if (timeLeft > 10) {
        playSound(backgroundMusicRef);
      } else {
        playSound(urgentMusicRef);
      }
    } else {
      // Desativar áudio
      stopSound(backgroundMusicRef);
      stopSound(urgentMusicRef);
    }
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
                  setAudioEnabled(false);
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

        <div className="audio-controls">
          <button 
            className="audio-toggle" 
            onClick={toggleAudio}
            disabled={!audioInitialized}
          >
            {audioEnabled ? '🔊' : '🔇'}
          </button>
          {!audioInitialized && (
            <button 
              className="audio-init" 
              onClick={initializeAudio}
              title="Clique para ativar o áudio"
            >
              🎵
            </button>
          )}
        </div>
      </div>

      {/* Resto do código permanece igual... */}
      <div className="game-main-content">
        <div className="game-content-left">
          <div className="question-box">
            <div className="question-header">
              <span className="question-number">Pergunta {currentQuestion + 1}/10</span>
              <span className="question-value">R\$ {currentQuestionData?.value.toLocaleString('pt-BR')}</span>
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
              R\$ {score.toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="timer-box">
            <div className="timer-label">CRONÔMETRO</div>
            <div className={`timer-display ${timeLeft <= 10 ? 'warning' : ''}`}>
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
                <span className="ladder-value">R\$ {value.toLocaleString('pt-BR')}</span>
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