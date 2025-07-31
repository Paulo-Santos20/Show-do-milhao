import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeDefaultQuestions } from '../../utils/defaultQuestions';
import useAudio from '../../hooks/useAudio';
import './Game.css';

const Game = () => {
  const navigate = useNavigate();
  
  // Hook de áudio
  const {
    isMuted,
    audioEnabled,
    showAudioPrompt,
    isBackgroundPlaying,
    enableAudio,
    disableAudio,
    toggleMute,
    playBackgroundMusic,
    stopBackgroundMusic,
    playCorrectSound,
    playIncorrectSound,
    playTickSound,
    playTimeWarningSound,
    setShowAudioPrompt
  } = useAudio();
  
  // Estados do jogo
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameEnded, setGameEnded] = useState(false);
  const [finalPrize, setFinalPrize] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  // ✅ CARREGAR PERGUNTAS COM INICIALIZAÇÃO AUTOMÁTICA
  useEffect(() => {
    const loadQuestions = () => {
      try {
        console.log('🎮 Carregando perguntas para o jogo...');
        setIsLoading(true);
        
        const loadedQuestions = initializeDefaultQuestions();
        
        if (loadedQuestions && loadedQuestions.length > 0) {
          setQuestions(loadedQuestions);
          console.log('✅ Perguntas carregadas para o jogo:', loadedQuestions.length);
        } else {
          console.error('❌ Nenhuma pergunta disponível');
          alert('Erro ao carregar perguntas! Redirecionando para a página inicial.');
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('❌ Erro ao carregar perguntas:', error);
        alert('Erro ao carregar perguntas! Redirecionando para a página inicial.');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [navigate]);

  // ✅ INICIAR MÚSICA DE FUNDO APENAS UMA VEZ QUANDO O JOGO COMEÇAR
  useEffect(() => {
    if (!isLoading && questions.length > 0 && audioEnabled && !isMuted && !gameStarted && !isBackgroundPlaying) {
      console.log('�� Iniciando jogo e música de fundo...');
      setGameStarted(true);
      playBackgroundMusic();
    }
  }, [isLoading, questions.length, audioEnabled, isMuted, gameStarted, isBackgroundPlaying, playBackgroundMusic]);

  // ✅ TIMER COM SOM DE TICK (sem afetar música de fundo)
  useEffect(() => {
    if (isLoading || gameEnded || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        // Som de tick nos últimos 10 segundos
        if (prev <= 10 && prev > 1) {
          playTickSound();
        }
        
        // Som de aviso nos últimos 18 segundos (uma vez)
        if (prev === 18) {
          playTimeWarningSound();
        }
        
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, gameEnded, showResult, isLoading, playTickSound, playTimeWarningSound]);

  // Função quando o tempo acaba
  const handleTimeUp = useCallback(() => {
    if (gameEnded) return;
    
    console.log('⏰ Tempo esgotado!');
    playIncorrectSound();
    setGameEnded(true);
    setFinalPrize(currentQuestion > 0 ? questions[currentQuestion - 1]?.value || 0 : 0);
    
    setTimeout(() => {
      stopBackgroundMusic(); // Parar música antes de navegar
      navigate('/result', { 
        state: { 
          prize: currentQuestion > 0 ? questions[currentQuestion - 1]?.value || 0 : 0,
          questionsAnswered: currentQuestion,
          reason: 'timeout'
        } 
      });
    }, 2000);
  }, [currentQuestion, gameEnded, questions, navigate, playIncorrectSound, stopBackgroundMusic]);

  // ✅ FUNÇÃO PARA SELECIONAR RESPOSTA COM SOM (sem afetar música de fundo)
  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null || gameEnded) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestionData = questions[currentQuestion];
    const correct = answerIndex === currentQuestionData.correctAnswer;
    setIsCorrect(correct);
    
    // Tocar som baseado na resposta (sem parar música de fundo)
    if (correct) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
    
    setTimeout(() => {
      if (correct) {
        if (currentQuestion === questions.length - 1) {
          // Última pergunta - ganhou o jogo!
          setFinalPrize(currentQuestionData.value);
          setGameEnded(true);
          setTimeout(() => {
            stopBackgroundMusic(); // Parar música antes de navegar
            navigate('/result', { 
              state: { 
                prize: currentQuestionData.value,
                questionsAnswered: currentQuestion + 1,
                reason: 'completed'
              } 
            });
          }, 2000);
        } else {
          // Próxima pergunta (música continua)
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setTimeLeft(60);
        }
      } else {
        // Resposta errada - fim de jogo
        setFinalPrize(currentQuestion > 0 ? questions[currentQuestion - 1]?.value || 0 : 0);
        setGameEnded(true);
        setTimeout(() => {
          stopBackgroundMusic(); // Parar música antes de navegar
          navigate('/result', { 
            state: { 
              prize: currentQuestion > 0 ? questions[currentQuestion - 1]?.value || 0 : 0,
              questionsAnswered: currentQuestion,
              reason: 'wrong_answer'
            } 
          });
        }, 2000);
      }
    }, 2000);
  };

  // Função para desistir
  const handleQuit = () => {
    if (window.confirm('Tem certeza que deseja desistir? Você levará o prêmio atual.')) {
      const currentPrize = currentQuestion > 0 ? questions[currentQuestion - 1]?.value || 0 : 0;
      stopBackgroundMusic();
      navigate('/result', { 
        state: { 
          prize: currentPrize,
          questionsAnswered: currentQuestion,
          reason: 'quit'
        } 
      });
    }
  };

  // ✅ PROMPT DE ÁUDIO
  const handleAudioChoice = (enable) => {
    if (enable) {
      enableAudio();
    } else {
      disableAudio();
    }
  };

  // ✅ CLEANUP AO SAIR DO COMPONENTE
  useEffect(() => {
    return () => {
      stopBackgroundMusic();
    };
  }, [stopBackgroundMusic]);

  // Tela de loading
  if (isLoading) {
    return (
      <div className="game-container">
        <div className="loading-screen">
          <div className="loading-content">
            <h1 className="loading-title">PREPARANDO O JOGO</h1>
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
            <p className="loading-text">Carregando perguntas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="game-container">
        <div className="error-screen">
          <h1>❌ Erro</h1>
          <p>Nenhuma pergunta disponível!</p>
          <button onClick={() => navigate('/')} className="back-btn">
            🏠 Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const currentPrize = currentQuestion > 0 ? questions[currentQuestion - 1]?.value || 0 : 0;

  return (
    <div className="game-container">
      {/* ✅ PROMPT DE ÁUDIO */}
      {showAudioPrompt && (
        <div className="audio-prompt-overlay">
          <div className="audio-prompt-content">
            <div className="audio-prompt-icon">🎵</div>
            <h2>Experiência Completa</h2>
            <p>
              Deseja ativar os efeitos sonoros e música de fundo para uma experiência mais imersiva?
            </p>
            <div className="audio-prompt-buttons">
              <button 
                onClick={() => handleAudioChoice(true)}
                className="audio-prompt-btn primary"
              >
                🔊 Sim, com áudio
              </button>
              <button 
                onClick={() => handleAudioChoice(false)}
                className="audio-prompt-btn secondary"
              >
                🔇 Não, silencioso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header do jogo */}
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
            onClick={toggleMute}
            className={`audio-toggle-single ${
              !audioEnabled ? 'loading' : 
              isMuted ? 'disabled' : 'enabled'
            }`}
            title={
              !audioEnabled ? 'Áudio não habilitado' :
              isMuted ? 'Ativar som' : 'Desativar som'
            }
          >
            {!audioEnabled ? '🔇' : isMuted ? '��' : isBackgroundPlaying ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* Controle de áudio mobile */}
      <div className="audio-controls-mobile">
        <button 
          onClick={toggleMute}
          className={`audio-toggle-mobile ${
            !audioEnabled ? 'loading' : 
            isMuted ? 'disabled' : 'enabled'
          }`}
          title={
            !audioEnabled ? 'Áudio não habilitado' :
            isMuted ? 'Ativar som' : 'Desativar som'
          }
        >
          {!audioEnabled ? '��' : isMuted ? '��' : isBackgroundPlaying ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Área principal do jogo */}
      <div className="game-main-content">
        {/* Coluna da esquerda - Pergunta e opções */}
        <div className="game-content-left">
          <div className="question-box">
            <div className="question-header">
              <div className="question-number">
                Pergunta {currentQuestion + 1}/10
              </div>
              <div className="question-value">
                R\$ {currentQuestionData?.value.toLocaleString('pt-BR')}
              </div>
            </div>
            
            <h2 className="question-text">
              {currentQuestionData?.question}
            </h2>
            
            <div className="options-container">
              {currentQuestionData?.options.map((option, index) => (
                <div
                  key={index}
                  className={`option-item ${
                    selectedAnswer === index 
                      ? isCorrect 
                        ? 'correct' 
                        : 'incorrect'
                      : selectedAnswer !== null && index === currentQuestionData.correctAnswer
                        ? 'show-correct'
                        : ''
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  style={{ 
                    pointerEvents: selectedAnswer !== null ? 'none' : 'auto',
                    cursor: selectedAnswer !== null ? 'default' : 'pointer'
                  }}
                >
                  <div className="option-number">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="option-text">{option}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna da direita - Sidebar */}
        <div className="game-sidebar-right">
          {/* Imagem da pergunta - só mostra se existir e carregar */}
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
                onLoad={(e) => {
                  e.target.style.display = 'block';
                  e.target.parentElement.style.display = 'block';
                }}
              />
            </div>
          )}
          
          {/* Prêmio atual */}
          <div className="score-box">
            <div className="score-label">Prêmio Atual</div>
            <div className="score-value">R\$ {currentPrize.toLocaleString('pt-BR')}</div>
          </div>
          
          {/* Timer */}
          <div className="timer-box">
            <div className="timer-label">Tempo Restante</div>
            <div className={`timer-display ${timeLeft <= 18 ? 'warning' : ''}`}>
              {timeLeft}s
            </div>
          </div>

          {/* Escala de prêmios */}
          <div className="prize-ladder">
            <div className="ladder-title">🏆 Prêmios</div>
            {questions.slice().reverse().map((q, index) => {
              const questionNumber = questions.length - index;
              const isCurrentQuestion = questionNumber === currentQuestion + 1;
              const isCompleted = questionNumber <= currentQuestion;
              
              return (
                <div 
                  key={q.id} 
                  className={`ladder-item ${
                    isCurrentQuestion ? 'current' : 
                    isCompleted ? 'achieved' : ''
                  }`}
                >
                  <span className="ladder-number">{questionNumber}</span>
                  <span className="ladder-value">
                    R\$ {q.value.toLocaleString('pt-BR')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedback visual quando responde */}
      {selectedAnswer !== null && (
        <div className="result-overlay">
          <div className="result-content">
            {isCorrect ? (
              <>
                <h2>✅ Correto!</h2>
                <p>Você ganhou R\$ {currentQuestionData?.value.toLocaleString('pt-BR')}!</p>
                <div className="loading-spinner"></div>
              </>
            ) : (
              <>
                <h2>❌ Resposta Incorreta!</h2>
                <p>Você leva R\$ {currentPrize.toLocaleString('pt-BR')}</p>
                <div className="loading-spinner"></div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Botão de desistir (mobile) */}
      <button 
        onClick={handleQuit} 
        className="quit-btn-mobile"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(220, 38, 38, 0.9)',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          zIndex: 999,
          display: window.innerWidth <= 768 ? 'block' : 'none'
        }}
      >
        🚪 Desistir
      </button>
    </div>
  );
};

export default Game;