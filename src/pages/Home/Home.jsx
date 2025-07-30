import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartGame = () => {
    setIsStarting(true);
    
    // Animação de transição antes de iniciar o jogo
    setTimeout(() => {
      navigate('/game');
    }, 1000);
  };

  return (
    <div className="home-container">
      {/* Logos do canto superior esquerdo */}
      <div className="logo-area">
        <div className="upa-logos">
          <div className="upa-main">
            <span className="upa-text">UPA 24h</span>
            <span className="upa-location">IGARASSU</span>
          </div>
          <div className="government-logos">
            <div className="pe-logo">
              <span className="pe-text">GOVERNO DE</span>
              <span className="pe-state">PERNAMBUCO</span>
            </div>
            <div className="hcp-logo">
              <span className="hcp-text">HCP</span>
              <span className="hcp-subtitle">GESTÃO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Jogar no canto superior direito */}
      <button 
        className={`play-button ${isStarting ? 'starting' : ''}`}
        onClick={handleStartGame}
        disabled={isStarting}
      >
        {isStarting ? 'Iniciando...' : 'Jogar'}
      </button>

      {/* Conteúdo principal centralizado */}
      <div className="main-content">
        {/* Logo principal "SHOW do MILHÃO" */}
        <div className="main-title">
          <div className="coin-background">
            <div className="coin-inner">
              <h1 className="show-title">
                <span className="show-text">SHOW</span>
                <span className="do-text">do</span>
                <span className="milhao-text">MILHÃO</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Subtítulo "DA ENFERMAGEM" */}
        <div className="subtitle">
          <h2 className="enfermagem-title">DA ENFERMAGEM</h2>
        </div>
      </div>

      {/* Overlay de transição */}
      {isStarting && (
        <div className="transition-overlay">
          <div className="loading-spinner"></div>
          <p>Preparando o Show do Milhão...</p>
        </div>
      )}
    </div>
  );
};

export default Home;