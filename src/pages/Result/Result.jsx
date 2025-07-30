import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Result.css';

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);

  // Dados recebidos do jogo
  const { score = 0, questionsAnswered = 0, completed = false } = location.state || {};

  // Determinar o tipo de resultado
  const getResultType = () => {
    if (completed) return 'champion';
    if (score >= 100000) return 'excellent';
    if (score >= 20000) return 'good';
    if (score >= 5000) return 'fair';
    return 'tryAgain';
  };

  const resultType = getResultType();

  // Mensagens baseadas no desempenho
  const getResultMessage = () => {
    switch (resultType) {
      case 'champion':
        return {
          title: '🏆 PARABÉNS, CAMPEÃO! 🏆',
          subtitle: 'Você conquistou o prêmio máximo!',
          message: 'Incrível! Você respondeu todas as perguntas corretamente e se tornou o grande campeão do Show do Milhão da Enfermagem!',
          emoji: '🎉',
          color: '#FFD700'
        };
      case 'excellent':
        return {
          title: '⭐ EXCELENTE DESEMPENHO! ⭐',
          subtitle: 'Você foi muito bem!',
          message: 'Fantástico! Seu conhecimento em enfermagem é impressionante. Continue estudando e na próxima você pode chegar ao milhão!',
          emoji: '🌟',
          color: '#32CD32'
        };
      case 'good':
        return {
          title: '👏 BOM TRABALHO! 👏',
          subtitle: 'Você teve um bom desempenho!',
          message: 'Muito bem! Você demonstrou um bom conhecimento. Com mais estudo, você pode alcançar prêmios ainda maiores!',
          emoji: '👍',
          color: '#4169E1'
        };
      case 'fair':
        return {
          title: '📚 CONTINUE ESTUDANDO! 📚',
          subtitle: 'Você está no caminho certo!',
          message: 'Bom começo! Continue se dedicando aos estudos de enfermagem e você conseguirá resultados ainda melhores!',
          emoji: '💪',
          color: '#FF6347'
        };
      default:
        return {
          title: '🎯 TENTE NOVAMENTE! 🎯',
          subtitle: 'Não desista!',
          message: 'Todo profissional de enfermagem começou do zero. Continue estudando e praticando. A próxima tentativa será melhor!',
          emoji: '🚀',
          color: '#FF4500'
        };
    }
  };

  const resultMessage = getResultMessage();

  // Salvar no ranking (localStorage)
  const saveToRanking = () => {
    const rankings = JSON.parse(localStorage.getItem('showDoMilhaoRanking') || '[]');
    const newEntry = {
      id: Date.now(),
      score,
      questionsAnswered,
      completed,
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR')
    };
    
    rankings.push(newEntry);
    rankings.sort((a, b) => b.score - a.score);
    rankings.splice(10); // Manter apenas top 10
    
    localStorage.setItem('showDoMilhaoRanking', JSON.stringify(rankings));
  };

  useEffect(() => {
    // Salvar resultado no ranking
    saveToRanking();

    // Animações de entrada
    setTimeout(() => setAnimateScore(true), 500);
    
    if (resultType === 'champion' || resultType === 'excellent') {
      setTimeout(() => setShowConfetti(true), 1000);
    }
  }, []);

  const handlePlayAgain = () => {
    navigate('/game');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewRanking = () => {
    navigate('/ranking');
  };

  return (
    <div className="result-container">
      {/* Confetes animados */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div key={i} className={`confetti confetti-${i % 6}`}></div>
          ))}
        </div>
      )}

      {/* Logos do cabeçalho */}
      <div className="result-header">
        <div className="header-logos">
          <div className="upa-logo-result">
            <span className="upa-text">UPA 24h</span>
            <span className="upa-location">IGARASSU</span>
          </div>
        </div>
        
        <div className="game-title-result">
          <h1>SHOW DO MILHÃO DA ENFERMAGEM</h1>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="result-main">
        {/* Card de resultado */}
        <div className="result-card" style={{ borderColor: resultMessage.color }}>
          <div className="result-icon" style={{ color: resultMessage.color }}>
            {resultMessage.emoji}
          </div>
          
          <h1 className="result-title" style={{ color: resultMessage.color }}>
            {resultMessage.title}
          </h1>
          
          <h2 className="result-subtitle">
            {resultMessage.subtitle}
          </h2>
          
          <p className="result-message">
            {resultMessage.message}
          </p>

          {/* Estatísticas do jogo */}
          <div className="result-stats">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <span className="stat-label">Prêmio Conquistado</span>
                <span 
                  className={`stat-value ${animateScore ? 'animate' : ''}`}
                  style={{ color: resultMessage.color }}
                >
                  R$ {score.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">❓</div>
              <div className="stat-info">
                <span className="stat-label">Perguntas Respondidas</span>
                <span className="stat-value">
                  {questionsAnswered} de 10
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-label">Taxa de Acerto</span>
                <span className="stat-value">
                  {questionsAnswered > 0 ? Math.round((questionsAnswered / 10) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏅</div>
              <div className="stat-info">
                <span className="stat-label">Status</span>
                <span className="stat-value" style={{ color: resultMessage.color }}>
                  {completed ? 'Concluído' : 'Incompleto'}
                </span>
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="progress-section">
            <div className="progress-label">
              Progresso no Jogo: {questionsAnswered}/10 perguntas
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(questionsAnswered / 10) * 100}%`,
                  backgroundColor: resultMessage.color 
                }}
              ></div>
            </div>
          </div>

          {/* Mensagem motivacional */}
          <div className="motivation-box">
            <h3>💡 Dica para a Próxima</h3>
            <p>
              {completed 
                ? "Você dominou o Show do Milhão! Que tal desafiar seus colegas?"
                : questionsAnswered >= 5
                ? "Você está quase lá! Revise os conceitos básicos de enfermagem e tente novamente."
                : "Foque nos fundamentos da enfermagem: anatomia, fisiologia e procedimentos básicos."
              }
            </p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="result-actions">
          <button 
            className="action-button primary"
            onClick={handlePlayAgain}
          >
            <span className="button-icon">🎮</span>
            Jogar Novamente
          </button>

          <button 
            className="action-button secondary"
            onClick={handleViewRanking}
          >
            <span className="button-icon">🏆</span>
            Ver Ranking
          </button>

          <button 
            className="action-button tertiary"
            onClick={handleGoHome}
          >
            <span className="button-icon">🏠</span>
            Voltar ao Início
          </button>
        </div>

        {/* Compartilhamento (futuro) */}
        <div className="share-section">
          <h3>Compartilhe seu resultado!</h3>
          <p>Consegui R$ {score.toLocaleString('pt-BR')} no Show do Milhão da Enfermagem! 🏥💰</p>
          <div className="share-buttons">
            <button className="share-button whatsapp">
              <span>📱</span> WhatsApp
            </button>
            <button className="share-button facebook">
              <span>📘</span> Facebook
            </button>
            <button className="share-button twitter">
              <span>🐦</span> Twitter
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="result-footer">
        <p>© 2025 Show do Milhão da Enfermagem - Continue aprendendo! 📚</p>
      </footer>
    </div>
  );
};

export default Result;