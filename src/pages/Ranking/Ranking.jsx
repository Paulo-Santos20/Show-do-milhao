import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Ranking.css';

const Ranking = () => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);
  const [filter, setFilter] = useState('all'); // all, completed, today
  const [sortBy, setSortBy] = useState('score'); // score, date, questions
  const [showStats, setShowStats] = useState(false);

  // Carregar rankings do localStorage
  useEffect(() => {
    const savedRankings = JSON.parse(localStorage.getItem('showDoMilhaoRanking') || '[]');
    setRankings(savedRankings);
  }, []);

  // Filtrar e ordenar rankings
  const getFilteredRankings = () => {
    let filtered = [...rankings];

    // Aplicar filtros
    switch (filter) {
      case 'completed':
        filtered = filtered.filter(rank => rank.completed);
        break;
      case 'today':
        const today = new Date().toLocaleDateString('pt-BR');
        filtered = filtered.filter(rank => rank.date === today);
        break;
      default:
        break;
    }

    // Aplicar ordenação
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.id) - new Date(a.id));
        break;
      case 'questions':
        filtered.sort((a, b) => b.questionsAnswered - a.questionsAnswered);
        break;
      default: // score
        filtered.sort((a, b) => b.score - a.score);
        break;
    }

    return filtered;
  };

  const filteredRankings = getFilteredRankings();

  // Estatísticas gerais
  const getStats = () => {
    if (rankings.length === 0) return null;

    const totalGames = rankings.length;
    const completedGames = rankings.filter(r => r.completed).length;
    const totalScore = rankings.reduce((sum, r) => sum + r.score, 0);
    const avgScore = Math.round(totalScore / totalGames);
    const highestScore = Math.max(...rankings.map(r => r.score));
    const avgQuestions = Math.round(rankings.reduce((sum, r) => sum + r.questionsAnswered, 0) / totalGames);

    return {
      totalGames,
      completedGames,
      avgScore,
      highestScore,
      avgQuestions,
      completionRate: Math.round((completedGames / totalGames) * 100)
    };
  };

  const stats = getStats();

  // Limpar ranking
  const clearRanking = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o ranking? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('showDoMilhaoRanking');
      setRankings([]);
    }
  };

  // Obter medalha baseada na posição
  const getMedal = (position) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  // Obter cor baseada no score
  const getScoreColor = (score) => {
    if (score >= 1000000) return '#FFD700'; // Ouro
    if (score >= 500000) return '#C0C0C0'; // Prata
    if (score >= 100000) return '#CD7F32'; // Bronze
    if (score >= 50000) return '#4169E1'; // Azul
    if (score >= 20000) return '#32CD32'; // Verde
    return '#FF6347'; // Vermelho
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handlePlayGame = () => {
    navigate('/game');
  };

  return (
    <div className="ranking-container">
      {/* Header */}
      <div className="ranking-header">
        <div className="header-logos">
          <div className="upa-logo-ranking">
            <span className="upa-text">UPA 24h</span>
            <span className="upa-location">IGARASSU</span>
          </div>
        </div>
        
        <div className="ranking-title">
          <h1>🏆 RANKING FINAL 🏆</h1>
          <h2>SHOW DO MILHÃO DA ENFERMAGEM</h2>
        </div>

        <div className="header-actions">
          <button className="header-btn" onClick={handlePlayGame}>
            🎮 Jogar
          </button>
          <button className="header-btn" onClick={handleGoHome}>
            🏠 Início
          </button>
        </div>
      </div>

      {/* Controles e Filtros */}
      <div className="ranking-controls">
        <div className="filters">
          <div className="filter-group">
            <label>Filtrar por:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Todos os Jogos</option>
              <option value="completed">Jogos Completos</option>
              <option value="today">Hoje</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Ordenar por:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="score">Maior Pontuação</option>
              <option value="questions">Mais Perguntas</option>
              <option value="date">Mais Recente</option>
            </select>
          </div>
        </div>

        <div className="control-buttons">
          <button 
            className="control-btn stats-btn"
            onClick={() => setShowStats(!showStats)}
          >
            📊 {showStats ? 'Ocultar' : 'Mostrar'} Estatísticas
          </button>
          
          {rankings.length > 0 && (
            <button 
              className="control-btn clear-btn"
              onClick={clearRanking}
            >
              🗑️ Limpar Ranking
            </button>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      {showStats && stats && (
        <div className="stats-section">
          <h3>📈 Estatísticas Gerais</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎮</div>
              <div className="stat-info">
                <span className="stat-number">{stats.totalGames}</span>
                <span className="stat-label">Jogos Realizados</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <span className="stat-number">{stats.completedGames}</span>
                <span className="stat-label">Jogos Completos</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <span className="stat-number">R$ {stats.avgScore.toLocaleString('pt-BR')}</span>
                <span className="stat-label">Pontuação Média</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <span className="stat-number">R$ {stats.highestScore.toLocaleString('pt-BR')}</span>
                <span className="stat-label">Maior Pontuação</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">❓</div>
              <div className="stat-info">
                <span className="stat-number">{stats.avgQuestions}/10</span>
                <span className="stat-label">Perguntas Média</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-number">{stats.completionRate}%</span>
                <span className="stat-label">Taxa de Conclusão</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="ranking-main">
        {filteredRankings.length === 0 ? (
          <div className="empty-ranking">
            <div className="empty-icon">🎯</div>
            <h3>Nenhum resultado encontrado</h3>
            <p>
              {rankings.length === 0 
                ? "Ainda não há jogadores no ranking. Seja o primeiro a jogar!"
                : "Nenhum resultado corresponde aos filtros selecionados."
              }
            </p>
            <button className="play-button" onClick={handlePlayGame}>
              🎮 Começar a Jogar
            </button>
          </div>
        ) : (
          <>
            {/* Pódio (Top 3) */}
            {filteredRankings.length >= 3 && filter === 'all' && sortBy === 'score' && (
              <div className="podium-section">
                <h3>🏆 Pódio dos Campeões</h3>
                <div className="podium">
                  {/* 2º Lugar */}
                  <div className="podium-place second">
                    <div className="podium-medal">🥈</div>
                    <div className="podium-info">
                      <div className="podium-position">2º</div>
                      <div className="podium-score" style={{ color: getScoreColor(filteredRankings[1].score) }}>
                        R$ {filteredRankings[1].score.toLocaleString('pt-BR')}
                      </div>
                      <div className="podium-details">
                        {filteredRankings[1].questionsAnswered}/10 perguntas
                      </div>
                      <div className="podium-date">{filteredRankings[1].date}</div>
                    </div>
                  </div>

                  {/* 1º Lugar */}
                  <div className="podium-place first">
                    <div className="podium-medal">🥇</div>
                    <div className="podium-info">
                      <div className="podium-position">1º</div>
                      <div className="podium-score" style={{ color: getScoreColor(filteredRankings[0].score) }}>
                        R$ {filteredRankings[0].score.toLocaleString('pt-BR')}
                      </div>
                      <div className="podium-details">
                        {filteredRankings[0].questionsAnswered}/10 perguntas
                      </div>
                      <div className="podium-date">{filteredRankings[0].date}</div>
                    </div>
                  </div>

                  {/* 3º Lugar */}
                  <div className="podium-place third">
                    <div className="podium-medal">🥉</div>
                    <div className="podium-info">
                      <div className="podium-position">3º</div>
                      <div className="podium-score" style={{ color: getScoreColor(filteredRankings[2].score) }}>
                        R$ {filteredRankings[2].score.toLocaleString('pt-BR')}
                      </div>
                      <div className="podium-details">
                        {filteredRankings[2].questionsAnswered}/10 perguntas
                      </div>
                      <div className="podium-date">{filteredRankings[2].date}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabela de Ranking */}
            <div className="ranking-table-section">
              <h3>📋 Classificação Completa</h3>
              <div className="table-container">
                <table className="ranking-table">
                  <thead>
                    <tr>
                      <th>Posição</th>
                      <th>Pontuação</th>
                      <th>Perguntas</th>
                      <th>Status</th>
                      <th>Data</th>
                      <th>Horário</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRankings.map((rank, index) => (
                      <tr 
                        key={rank.id} 
                        className={`ranking-row ${rank.completed ? 'completed' : 'incomplete'}`}
                      >
                        <td className="position-cell">
                          <span className="medal">{getMedal(index + 1)}</span>
                          <span className="position-number">{index + 1}º</span>
                        </td>
                        <td className="score-cell">
                          <span 
                            className="score-value"
                            style={{ color: getScoreColor(rank.score) }}
                          >
                            R$ {rank.score.toLocaleString('pt-BR')}
                          </span>
                        </td>
                        <td className="questions-cell">
                          <span className="questions-count">{rank.questionsAnswered}/10</span>
                          <div className="questions-bar">
                            <div 
                              className="questions-fill"
                              style={{ width: `${(rank.questionsAnswered / 10) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="status-cell">
                          <span className={`status-badge ${rank.completed ? 'completed' : 'incomplete'}`}>
                            {rank.completed ? '✅ Completo' : '⏸️ Incompleto'}
                          </span>
                        </td>
                        <td className="date-cell">{rank.date}</td>
                        <td className="time-cell">{rank.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mensagem de Congratulações */}
      {filteredRankings.length > 0 && (
        <div className="congratulations-section">
          <h3>🎉 Parabéns a todos os participantes!</h3>
          <p>O conhecimento de vocês salva vidas! Continue estudando e praticando.</p>
          <div className="event-info">
            <p>Um evento da <strong>UPA 24h Igarassu</strong></p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="ranking-footer">
        <p>© 2025 Show do Milhão da Enfermagem - Desenvolvido com ❤️ para profissionais da saúde</p>
      </footer>
    </div>
  );
};

export default Ranking;