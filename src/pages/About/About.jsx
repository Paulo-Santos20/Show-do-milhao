import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('rules');

  const handleGoHome = () => {
    navigate('/');
  };

  const handleStartGame = () => {
    navigate('/game');
  };

  const handleViewRanking = () => {
    navigate('/ranking');
  };

  const prizeValues = [
    { level: 1, value: 1000 },
    { level: 2, value: 2000 },
    { level: 3, value: 5000 },
    { level: 4, value: 10000 },
    { level: 5, value: 20000 },
    { level: 6, value: 50000 },
    { level: 7, value: 100000 },
    { level: 8, value: 200000 },
    { level: 9, value: 500000 },
    { level: 10, value: 1000000 }
  ];

  const nursingTopics = [
    "Anatomia e Fisiologia Humana",
    "Farmacologia e Administração de Medicamentos",
    "Procedimentos de Enfermagem",
    "Cuidados Intensivos e Emergência",
    "Saúde Pública e Epidemiologia",
    "Ética e Legislação em Enfermagem",
    "Cuidados Materno-Infantis",
    "Geriatria e Cuidados ao Idoso",
    "Prevenção e Controle de Infecções",
    "Primeiros Socorros e Suporte Básico de Vida"
  ];

  return (
    <div className="about-container">
      {/* Header */}
      <div className="about-header">
        <div className="header-logos">
          <div className="upa-logo-about">
            <span className="upa-text">UPA 24h</span>
            <span className="upa-location">IGARASSU</span>
          </div>
        </div>
        
        <div className="about-title">
          <h1>📚 COMO JOGAR</h1>
          <h2>SHOW DO MILHÃO DA ENFERMAGEM</h2>
        </div>

        <div className="header-actions">
          <button className="header-btn" onClick={handleStartGame}>
            🎮 Jogar Agora
          </button>
          <button className="header-btn" onClick={handleGoHome}>
            🏠 Início
          </button>
        </div>
      </div>

      {/* Navegação por Seções */}
      <div className="section-navigation">
        <button 
          className={`nav-btn ${activeSection === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveSection('rules')}
        >
          📋 Regras do Jogo
        </button>
        <button 
          className={`nav-btn ${activeSection === 'prizes' ? 'active' : ''}`}
          onClick={() => setActiveSection('prizes')}
        >
          💰 Tabela de Prêmios
        </button>
        <button 
          className={`nav-btn ${activeSection === 'topics' ? 'active' : ''}`}
          onClick={() => setActiveSection('topics')}
        >
          📖 Temas de Estudo
        </button>
        <button 
          className={`nav-btn ${activeSection === 'tips' ? 'active' : ''}`}
          onClick={() => setActiveSection('tips')}
        >
          �� Dicas e Estratégias
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div className="about-main">
        {/* Seção: Regras do Jogo */}
        {activeSection === 'rules' && (
          <div className="content-section rules-section">
            <div className="section-header">
              <h2>📋 Regras do Jogo</h2>
              <p>Entenda como funciona o Show do Milhão da Enfermagem</p>
            </div>

            <div className="rules-grid">
              <div className="rule-card">
                <div className="rule-icon">🎯</div>
                <h3>Objetivo</h3>
                <p>Responda corretamente 10 perguntas progressivas de enfermagem para conquistar o prêmio máximo de <strong>R$ 1.000.000</strong>!</p>
              </div>

              <div className="rule-card">
                <div className="rule-icon">⏱️</div>
                <h3>Tempo Limite</h3>
                <p>Você tem <strong>60 segundos</strong> para responder cada pergunta. O cronômetro fica vermelho nos últimos 10 segundos!</p>
              </div>

              <div className="rule-card">
                <div className="rule-icon">❓</div>
                <h3>Formato das Perguntas</h3>
                <p>Cada pergunta possui <strong>4 alternativas</strong> (A, B, C, D). Apenas uma resposta está correta.</p>
              </div>

              <div className="rule-card">
                <div className="rule-icon">📈</div>
                <h3>Progressão</h3>
                <p>Os valores aumentam a cada pergunta. Responda corretamente para avançar para o próximo nível de prêmio.</p>
              </div>

              <div className="rule-card">
                <div className="rule-icon">❌</div>
                <h3>Fim de Jogo</h3>
                <p>O jogo termina se você <strong>errar uma pergunta</strong> ou o <strong>tempo esgotar</strong>. Você leva o prêmio da última pergunta correta.</p>
              </div>

              <div className="rule-card">
                <div className="rule-icon">🏆</div>
                <h3>Ranking</h3>
                <p>Sua pontuação é salva automaticamente no ranking. Compete com outros profissionais de enfermagem!</p>
              </div>
            </div>

            <div className="game-flow">
              <h3>🔄 Fluxo do Jogo</h3>
              <div className="flow-steps">
                <div className="flow-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Início</h4>
                    <p>Clique em "Jogar" na tela inicial</p>
                  </div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Pergunta</h4>
                    <p>Leia a pergunta e as 4 alternativas</p>
                  </div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Resposta</h4>
                    <p>Clique na alternativa que considera correta</p>
                  </div>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Resultado</h4>
                    <p>Veja se acertou e avance ou termine o jogo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Seção: Tabela de Prêmios */}
        {activeSection === 'prizes' && (
          <div className="content-section prizes-section">
            <div className="section-header">
              <h2>💰 Tabela de Prêmios</h2>
              <p>Veja quanto você pode ganhar em cada nível</p>
            </div>

            <div className="prizes-container">
              <div className="prizes-table">
                <div className="table-header">
                  <span>Pergunta</span>
                  <span>Valor do Prêmio</span>
                  <span>Dificuldade</span>
                </div>
                
                {prizeValues.reverse().map((prize) => (
                  <div 
                    key={prize.level} 
                    className={`prize-row ${prize.level === 10 ? 'jackpot' : ''} ${prize.level >= 8 ? 'high-value' : ''}`}
                  >
                    <span className="question-number">
                      {prize.level === 10 ? '🏆' : prize.level}ª Pergunta
                    </span>
                    <span className="prize-value">
                      R$ {prize.value.toLocaleString('pt-BR')}
                    </span>
                    <span className="difficulty-level">
                      {prize.level <= 3 ? '🟢 Fácil' : 
                       prize.level <= 6 ? '🟡 Médio' : 
                       prize.level <= 8 ? '🟠 Difícil' : '🔴 Muito Difícil'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="prize-highlights">
                <div className="highlight-card jackpot-card">
                  <div className="highlight-icon">🏆</div>
                  <h3>PRÊMIO MÁXIMO</h3>
                  <div className="highlight-value">R$ 1.000.000</div>
                  <p>Responda todas as 10 perguntas corretamente!</p>
                </div>

                <div className="highlight-card milestone-card">
                  <div className="highlight-icon">🎯</div>
                  <h3>MARCOS IMPORTANTES</h3>
                  <ul>
                    <li><strong>R$ 20.000</strong> - 5ª pergunta</li>
                    <li><strong>R$ 100.000</strong> - 7ª pergunta</li>
                    <li><strong>R$ 500.000</strong> - 9ª pergunta</li>
                  </ul>
                </div>

                <div className="highlight-card strategy-card">
                  <div className="highlight-icon">🧠</div>
                  <h3>ESTRATÉGIA</h3>
                  <p>As primeiras perguntas são mais fáceis. Use-as para ganhar confiança e construir sua pontuação base!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Seção: Temas de Estudo */}
        {activeSection === 'topics' && (
          <div className="content-section topics-section">
            <div className="section-header">
              <h2>📖 Temas de Estudo</h2>
              <p>Principais áreas da enfermagem que podem aparecer no jogo</p>
            </div>

            <div className="topics-grid">
              {nursingTopics.map((topic, index) => (
                <div key={index} className="topic-card">
                  <div className="topic-icon">
                    {index === 0 ? '🫀' : 
                     index === 1 ? '💊' : 
                     index === 2 ? '🩺' : 
                     index === 3 ? '🚨' : 
                     index === 4 ? '🌍' : 
                     index === 5 ? '⚖️' : 
                     index === 6 ? '👶' : 
                     index === 7 ? '👴' : 
                     index === 8 ? '🦠' : '🆘'}
                  </div>
                  <h3>{topic}</h3>
                  <div className="topic-details">
                    {index === 0 && <p>Estrutura e funcionamento do corpo humano, sistemas orgânicos.</p>}
                    {index === 1 && <p>Medicamentos, dosagens, vias de administração, efeitos colaterais.</p>}
                    {index === 2 && <p>Técnicas de enfermagem, curativos, coleta de exames.</p>}
                    {index === 3 && <p>UTI, emergências médicas, suporte avançado de vida.</p>}
                    {index === 4 && <p>Prevenção de doenças, vigilância sanitária, vacinação.</p>}
                    {index === 5 && <p>Código de ética, direitos do paciente, legislação profissional.</p>}
                    {index === 6 && <p>Gravidez, parto, cuidados neonatais, aleitamento materno.</p>}
                    {index === 7 && <p>Cuidados específicos para idosos, doenças geriátricas.</p>}
                    {index === 8 && <p>Precauções, isolamento, controle de infecção hospitalar.</p>}
                    {index === 9 && <p>RCP, OVACE, atendimento pré-hospitalar, emergências.</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="study-recommendations">
              <h3>📚 Recomendações de Estudo</h3>
              <div className="recommendations-grid">
                <div className="recommendation-card">
                  <h4>📖 Literatura Básica</h4>
                  <ul>
                    <li>Fundamentos de Enfermagem - Potter & Perry</li>
                    <li>Tratado de Enfermagem Médico-Cirúrgica - Brunner</li>
                    <li>Manual de Procedimentos de Enfermagem</li>
                    <li>Farmacologia para Enfermagem - Karch</li>
                  </ul>
                </div>

                <div className="recommendation-card">
                  <h4>🌐 Recursos Online</h4>
                  <ul>
                    <li>Portal do COFEN (Conselho Federal de Enfermagem)</li>
                    <li>Biblioteca Virtual em Saúde (BVS)</li>
                    <li>SciELO - Artigos Científicos</li>
                    <li>Protocolos do Ministério da Saúde</li>
                  </ul>
                </div>

                <div className="recommendation-card">
                  <h4>🎯 Foco de Estudo</h4>
                  <ul>
                    <li>Revise procedimentos básicos regularmente</li>
                    <li>Mantenha-se atualizado com protocolos</li>
                    <li>Pratique cálculos de medicação</li>
                    <li>Estude casos clínicos reais</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Seção: Dicas e Estratégias */}
        {activeSection === 'tips' && (
          <div className="content-section tips-section">
            <div className="section-header">
              <h2>💡 Dicas e Estratégias</h2>
              <p>Maximize suas chances de sucesso no Show do Milhão</p>
            </div>

            <div className="tips-container">
              <div className="tips-category">
                <h3>🎯 Durante o Jogo</h3>
                <div className="tips-list">
                  <div className="tip-item">
                    <div className="tip-icon">⏰</div>
                    <div className="tip-content">
                      <h4>Gerencie o Tempo</h4>
                      <p>Leia a pergunta com calma, mas não demore muito. Você tem 60 segundos - use-os sabiamente!</p>
                    </div>
                  </div>

                  <div className="tip-item">
                    <div className="tip-icon">🔍</div>
                    <div className="tip-content">
                      <h4>Leia Todas as Alternativas</h4>
                      <p>Mesmo que ache que sabe a resposta, leia todas as opções. Às vezes há pegadinhas!</p>
                    </div>
                  </div>

                  <div className="tip-item">
                    <div className="tip-icon">❌</div>
                    <div className="tip-content">
                      <h4>Elimine Opções Incorretas</h4>
                      <p>Se não souber a resposta, elimine as alternativas que claramente estão erradas.</p>
                    </div>
                  </div>

                  <div className="tip-item">
                    <div className="tip-icon">🧘</div>
                    <div className="tip-content">
                      <h4>Mantenha a Calma</h4>
                      <p>A pressão pode atrapalhar. Respire fundo e confie no seu conhecimento profissional.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tips-category">
                <h3>📚 Preparação</h3>
                <div className="tips-list">
                  <div className="tip-item">
                    <div className="tip-icon">📖</div>
                    <div className="tip-content">
                      <h4>Estude Regularmente</h4>
                      <p>Dedique pelo menos 30 minutos diários para revisar conceitos de enfermagem.</p>
                    </div>
                  </div>

                  <div className="tip-item">
                    <div className="tip-icon">💊</div>
                    <div className="tip-content">
                      <h4>Foque em Farmacologia</h4>
                      <p>Medicamentos e dosagens são temas frequentes. Mantenha-se atualizado!</p>
                    </div>
                  </div>

                  <div className="tip-item">
                    <div className="tip-icon">🩺</div>
                    <div className="tip-content">
                      <h4>Pratique Procedimentos</h4>
                      <p>Revise constantemente os procedimentos básicos e avançados de enfermagem.</p>
                    </div>
                  </div>

                  <div className="tip-item">
                    <div className="tip-icon">📰</div>
                    <div className="tip-content">
                      <h4>Acompanhe Atualizações</h4>
                      <p>Fique por dentro das novidades em protocolos e diretrizes de saúde.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tips-category">
                <h3>🏆 Estratégias Avançadas</h3>
                <div className="tips-list">
                  <div className="tip-item">
                    <div className="tip-icon">🎲</div>
                    <div className="tip-content">
                      <h4>Jogue Várias Vezes</h4>
                      <p>Cada tentativa é uma oportunidade de aprender. Analise seus erros e melhore!</p>
                    </div>
                  </div>

                  <div className="tip-item">
                    <div className="tip-icon">👥</div>
                    <div className="tip-content">
                      <h4>Estude em Grupo</h4>
                      <p>Discuta casos clínicos com colegas. O conhecimento compartilhado é mais sólido.</p>
                    </div>
                  </div>

                  <div className="tip-item">
                    <div className="tip-icon">📊</div>
                    <div className="tip-content">
                      <h4>Analise o Ranking</h4>
                      <p>Veja as pontuações de outros jogadores para entender seu nível de conhecimento.</p>
                    </div>
                  </div>

                  <div className="tip-item">
                    <div className="tip-icon">🎯</div>
                    <div className="tip-content">
                      <h4>Defina Metas</h4>
                      <p>Estabeleça objetivos graduais: primeiro R$ 20.000, depois R$ 100.000, e assim por diante.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="motivation-section">
              <div className="motivation-card">
                <h3>🌟 Lembre-se</h3>
                <p>
                  "O conhecimento que você adquire jogando pode salvar vidas na prática! 
                  Cada pergunta respondida corretamente fortalece sua competência profissional 
                  e contribui para um cuidado de enfermagem de excelência."
                </p>
                <div className="motivation-author">
                  <strong>- Equipe UPA 24h Igarassu</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>🚀 Pronto para o Desafio?</h2>
          <p>Teste seus conhecimentos e compete pelo prêmio máximo!</p>
          <div className="cta-buttons">
            <button className="cta-btn primary" onClick={handleStartGame}>
              🎮 Começar Jogo
            </button>
            <button className="cta-btn secondary" onClick={handleViewRanking}>
              🏆 Ver Ranking
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>🏥 UPA 24h Igarassu</h4>
            <p>Unidade de Pronto Atendimento comprometida com a excelência no cuidado e na educação continuada dos profissionais de enfermagem.</p>
          </div>
          <div className="footer-section">
            <h4>📞 Contato</h4>
            <p>Para dúvidas sobre o jogo ou sugestões de melhorias, entre em contato com a equipe de enfermagem da UPA.</p>
          </div>
          <div className="footer-section">
            <h4>🎯 Objetivo</h4>
            <p>Promover o aprendizado contínuo e a atualização dos conhecimentos em enfermagem de forma lúdica e interativa.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Show do Milhão da Enfermagem - Desenvolvido com ❤️ para salvar vidas</p>
        </div>
      </footer>
    </div>
  );
};

export default About;