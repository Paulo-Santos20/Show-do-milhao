import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeDefaultQuestions } from '../../utils/defaultQuestions';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ INICIALIZAR PERGUNTAS AUTOMATICAMENTE
  useEffect(() => {
    const initializeQuestions = async () => {
      try {
        console.log('🚀 Inicializando aplicação...');
        setIsLoading(true);
        
        // Inicializar perguntas padrão se necessário
        const questions = initializeDefaultQuestions();
        setQuestionsCount(questions.length);
        
        console.log('✅ Aplicação inicializada com', questions.length, 'perguntas');
      } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        setQuestionsCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    initializeQuestions();
  }, []);

  // Monitorar mudanças no localStorage (quando admin faz alterações)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedQuestions = localStorage.getItem('quiz-questions');
      if (savedQuestions) {
        const questions = JSON.parse(savedQuestions);
        setQuestionsCount(questions.length);
        console.log('🔄 Perguntas atualizadas:', questions.length);
      }
    };

    // Escutar mudanças no localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Verificar periodicamente (para mudanças na mesma aba)
    const interval = setInterval(() => {
      const savedQuestions = localStorage.getItem('quiz-questions');
      if (savedQuestions) {
        const questions = JSON.parse(savedQuestions);
        if (questions.length !== questionsCount) {
          setQuestionsCount(questions.length);
        }
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [questionsCount]);

  const handleStartGame = () => {
    if (questionsCount === 0) {
      alert('Erro ao carregar perguntas! Tente recarregar a página.');
      return;
    }
    navigate('/game');
  };

  // Tela de loading
  if (isLoading) {
    return (
      <div className="home-container">
        <div className="loading-screen">
          <div className="loading-content">
            <h1 className="loading-title">SHOW DO MILHÃO</h1>
            <h2 className="loading-subtitle">DA ENFERMAGEM</h2>
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
            <p className="loading-text">Carregando perguntas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Header com Logo UPA */}
      <div className="home-header">
        <div className="upa-logo">
          <div className="upa-main">
            <span className="upa-text">UPA 24h</span>
            <span className="upa-location">IGARASSU</span>
          </div>
        </div>
        
        <div className="admin-link">
          <button 
            onClick={() => navigate('/admin')} 
            className="admin-access-btn"
            title="Painel Administrativo"
          >
            ⚙️ Admin
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="home-content">
        <div className="title-section">
          <h1 className="main-title">SHOW DO MILHÃO</h1>
          <h2 className="subtitle">DA ENFERMAGEM</h2>
          <p className="description">
            Teste seus conhecimentos em enfermagem e concorra a prêmios de até R$ 1.000.000!
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="action-buttons">
          <button 
            className="start-button" 
            onClick={handleStartGame}
            disabled={questionsCount === 0}
          >
            🚀 JOGAR
          </button>
          
          <button 
            className="instructions-button" 
            onClick={() => setShowInstructions(true)}
          >
            📋 COMO JOGAR
          </button>
        </div>

        {/* Banners de Informações */}
        <div className="game-info">
          <div className="info-card">
            <div className="info-icon">🎯</div>
            <h3>10 Perguntas</h3>
            <p>Responda corretamente para avançar</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">⏱️</div>
            <h3>60 Segundos</h3>
            <p>Por pergunta para responder</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">💰</div>
            <h3>R$ 1.000.000</h3>
            <p>Prêmio máximo possível</p>
          </div>
        </div>

        {/* Status das perguntas */}
        <div className="questions-status">
          <p className="questions-count">
            📊 Perguntas disponíveis: <strong>{questionsCount}/10</strong>
          </p>
          {questionsCount === 10 && (
            <p className="questions-ready">
              ✅ Todas as perguntas estão prontas! Boa sorte!
            </p>
          )}
        </div>

        {/* Preview dos prêmios */}
        <div className="prize-preview">
          <h3>🏆 Escala de Prêmios</h3>
          <div className="prize-list">
            <div className="prize-item highlight">10. R$ 1.000.000</div>
            <div className="prize-item">9. R$ 500.000</div>
            <div className="prize-item">8. R$ 200.000</div>
            <div className="prize-item">7. R$ 100.000</div>
            <div className="prize-item">6. R$ 50.000</div>
            <div className="prize-item">5. R$ 20.000</div>
            <div className="prize-item">4. R$ 10.000</div>
            <div className="prize-item">3. R$ 5.000</div>
            <div className="prize-item">2. R$ 2.000</div>
            <div className="prize-item">1. R$ 1.000</div>
          </div>
        </div>
      </div>

      {/* Modal de Instruções */}
      {showInstructions && (
        <div className="instructions-overlay">
          <div className="instructions-modal">
            <div className="instructions-header">
              <h2>📋 Como Jogar</h2>
              <button 
                className="close-button"
                onClick={() => setShowInstructions(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="instructions-content">
              <div className="instruction-item">
                <span className="instruction-icon">🎯</span>
                <div>
                  <h4>Objetivo</h4>
                  <p>Responda corretamente às 10 perguntas sobre enfermagem para ganhar até R$ 1.000.000!</p>
                </div>
              </div>
              
              <div className="instruction-item">
                <span className="instruction-icon">⏱️</span>
                <div>
                  <h4>Tempo</h4>
                  <p>Você tem 60 segundos para responder cada pergunta. O cronômetro fica vermelho nos últimos 18 segundos.</p>
                </div>
              </div>
              
              <div className="instruction-item">
                <span className="instruction-icon">💰</span>
                <div>
                  <h4>Prêmios</h4>
                  <p>Cada pergunta correta aumenta seu prêmio. Uma resposta errada ou tempo esgotado encerra o jogo.</p>
                </div>
              </div>
              
              <div className="instruction-item">
                <span className="instruction-icon">🎵</span>
                <div>
                  <h4>Áudio</h4>
                  <p>O jogo possui música de fundo e efeitos sonoros. Você pode mutar/desmutar a qualquer momento.</p>
                </div>
              </div>
              
              <div className="instruction-item">
                <span className="instruction-icon">📱</span>
                <div>
                  <h4>Dispositivos</h4>
                  <p>O jogo funciona perfeitamente em computadores, tablets e smartphones.</p>
                </div>
              </div>
            </div>
            
            <div className="instructions-footer">
              <button 
                className="start-from-instructions"
                onClick={() => {
                  setShowInstructions(false);
                  handleStartGame();
                }}
                disabled={questionsCount === 0}
              >
                🚀 COMEÇAR AGORA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;