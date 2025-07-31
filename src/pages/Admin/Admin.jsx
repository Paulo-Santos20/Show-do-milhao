import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import { initializeDefaultQuestions, resetToDefaultQuestions } from '../../utils/defaultQuestions';

const Admin = () => {
  const navigate = useNavigate();
  
  // Estados do admin
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    id: null,
    question: '',
    options: ['', '', ''],
    correctAnswer: 0,
    value: 1000,
    image: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Valores dos prêmios
  const prizeValues = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000];

  // ✅ CARREGAR PERGUNTAS COM INICIALIZAÇÃO AUTOMÁTICA
  useEffect(() => {
    try {
      console.log('🔄 Inicializando admin com perguntas padrão...');
      
      // Garantir que as perguntas padrão estejam sempre disponíveis
      const loadedQuestions = initializeDefaultQuestions();
      setQuestions(loadedQuestions);
      
      console.log('✅ Admin inicializado com', loadedQuestions.length, 'perguntas');
    } catch (error) {
      console.error('❌ Erro ao inicializar admin:', error);
    }
    
    // Verificar autenticação
    const authStatus = sessionStorage.getItem('admin-authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ FUNÇÃO SAVEquestions COM LOGS
  const saveQuestions = (updatedQuestions) => {
    try {
      console.log('💾 Tentando salvar', updatedQuestions.length, 'perguntas');
      console.log('💾 Dados a serem salvos:', updatedQuestions);
      
      localStorage.setItem('quiz-questions', JSON.stringify(updatedQuestions));
      console.log('💾 Dados salvos no localStorage');
      
      setQuestions(updatedQuestions);
      console.log('💾 Estado atualizado');
      
      // Verificar se realmente foi salvo
      const saved = localStorage.getItem('quiz-questions');
      const parsed = JSON.parse(saved);
      console.log('🔍 Verificação: perguntas salvas no localStorage:', parsed.length);
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar perguntas:', error);
      return false;
    }
  };

  // Autenticação simples
  const handleLogin = () => {
    if (password === 'upa2024admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-authenticated', 'true');
      setPassword('');
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-authenticated');
  };

  // Adicionar nova pergunta
  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim() || 
        currentQuestion.options.some(opt => !opt.trim())) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    if (questions.length >= 10) {
      alert('Máximo de 10 perguntas permitido!');
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      id: Date.now(),
      value: prizeValues[questions.length] || 1000000
    };

    const updatedQuestions = [...questions, newQuestion];
    const saved = saveQuestions(updatedQuestions);
    
    if (saved) {
      resetForm();
      alert('Pergunta adicionada com sucesso!');
    } else {
      alert('Erro ao salvar pergunta!');
    }
  };

  // Editar pergunta existente
  const handleEditQuestion = (question) => {
    setCurrentQuestion(question);
    setIsEditing(true);
  };

  // Atualizar pergunta
  const handleUpdateQuestion = () => {
    if (!currentQuestion.question.trim() || 
        currentQuestion.options.some(opt => !opt.trim())) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const updatedQuestions = questions.map(q => 
      q.id === currentQuestion.id ? currentQuestion : q
    );
    
    const saved = saveQuestions(updatedQuestions);
    
    if (saved) {
      resetForm();
      alert('Pergunta atualizada com sucesso!');
    } else {
      alert('Erro ao atualizar pergunta!');
    }
  };

  // Deletar pergunta
  const handleDeleteQuestion = (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta pergunta?')) {
      const updatedQuestions = questions.filter(q => q.id !== id);
      
      // Reajustar valores dos prêmios
      const revaluedQuestions = updatedQuestions.map((q, index) => ({
        ...q,
        value: prizeValues[index] || 1000000
      }));
      
      const saved = saveQuestions(revaluedQuestions);
      
      if (saved) {
        alert('Pergunta deletada com sucesso!');
      } else {
        alert('Erro ao deletar pergunta!');
      }
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setCurrentQuestion({
      id: null,
      question: '',
      options: ['', '', ''],
      correctAnswer: 0,
      value: 1000,
      image: ''
    });
    setIsEditing(false);
  };

  // Reordenar perguntas
  const moveQuestion = (index, direction) => {
    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newQuestions.length) {
      [newQuestions[index], newQuestions[targetIndex]] = 
      [newQuestions[targetIndex], newQuestions[index]];
      
      // Reajustar valores dos prêmios
      const revaluedQuestions = newQuestions.map((q, idx) => ({
        ...q,
        value: prizeValues[idx] || 1000000
      }));
      
      saveQuestions(revaluedQuestions);
    }
  };

  // Exportar perguntas
  const exportQuestions = () => {
    if (questions.length === 0) {
      alert('Nenhuma pergunta para exportar!');
      return;
    }

    const exportData = {
      questions: questions,
      metadata: {
        title: "Show do Milhão da Enfermagem",
        description: "Quiz de conhecimentos em enfermagem da UPA 24h Igarassu",
        totalQuestions: questions.length,
        maxPrize: Math.max(...questions.map(q => q.value)),
        timePerQuestion: 60,
        exported: new Date().toISOString().split('T')[0],
        version: "1.0",
        category: "Enfermagem",
        institution: "UPA 24h Igarassu"
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `quiz-enfermagem-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert(`Arquivo ${exportFileDefaultName} baixado com sucesso!`);
  };

  // ✅ FUNÇÃO PARA VALIDAR PERGUNTAS IMPORTADAS (COM LOGS)
  const validateImportedQuestions = (questions) => {
    console.log('🔍 Iniciando validação de', questions.length, 'perguntas');
    
    if (!Array.isArray(questions)) {
      return { valid: false, error: 'Deve ser um array de perguntas' };
    }

    if (questions.length === 0) {
      return { valid: false, error: 'Array de perguntas está vazio' };
    }

    if (questions.length > 10) {
      return { valid: false, error: 'Máximo de 10 perguntas permitido' };
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      console.log(`🔍 Validando pergunta ${i + 1}:`, q);
      
      // Verificar propriedades obrigatórias
      if (!q.question || typeof q.question !== 'string' || q.question.trim() === '') {
        return { valid: false, error: `Pergunta ${i + 1}: texto da pergunta inválido` };
      }

      if (!q.options || !Array.isArray(q.options)) {
        return { valid: false, error: `Pergunta ${i + 1}: opções devem ser um array` };
      }

      if (q.options.length !== 3) {
        return { valid: false, error: `Pergunta ${i + 1}: deve ter exatamente 3 opções` };
      }

      // Verificar se todas as opções são strings não vazias
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j] || typeof q.options[j] !== 'string' || q.options[j].trim() === '') {
          return { valid: false, error: `Pergunta ${i + 1}, Opção ${j + 1}: texto inválido` };
        }
      }

      // Verificar resposta correta
      if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 2) {
        return { valid: false, error: `Pergunta ${i + 1}: resposta correta deve ser 0, 1 ou 2` };
      }
    }

    console.log('✅ Todas as perguntas passaram na validação');
    return { valid: true };
  };

  // Importar perguntas (COM DEBUG DETALHADO)
  const importQuestions = (event) => {
    const file = event.target.files[0];
    console.log('📁 Arquivo selecionado:', file);
    
    if (file) {
      console.log('📋 Detalhes do arquivo:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          console.log('📖 Conteúdo bruto do arquivo (primeiros 200 chars):', e.target.result.substring(0, 200));
          
          const fileContent = JSON.parse(e.target.result);
          console.log('🔍 Conteúdo parseado:', fileContent);
          
          let importedQuestions = [];

          // ✅ VERIFICAR DIFERENTES FORMATOS
          if (Array.isArray(fileContent)) {
            console.log('✅ Formato detectado: Array direto');
            importedQuestions = fileContent;
          } else if (fileContent.questions && Array.isArray(fileContent.questions)) {
            console.log('✅ Formato detectado: Objeto com propriedade questions');
            importedQuestions = fileContent.questions;
          } else {
            console.error('❌ Formato inválido:', fileContent);
            alert('Formato de arquivo inválido! O arquivo deve conter um array de perguntas ou um objeto com propriedade "questions".');
            return;
          }

          console.log('📊 Perguntas encontradas:', importedQuestions.length);
          if (importedQuestions.length > 0) {
            console.log('📝 Primeira pergunta:', importedQuestions[0]);
          }

          // ✅ VALIDAR ESTRUTURA DAS PERGUNTAS
          const validation = validateImportedQuestions(importedQuestions);
          console.log('🔍 Resultado da validação:', validation);
          
          if (!validation.valid) {
            console.error('❌ Validação falhou:', validation.error);
            alert(`Erro na validação: ${validation.error}`);
            return;
          }

          // ✅ REAJUSTAR IDs E VALORES
          const processedQuestions = importedQuestions.map((q, index) => ({
            ...q,
            id: Date.now() + index, // Novo ID único
            value: prizeValues[index] || 1000000, // Valor baseado na posição
            image: q.image || '' // Garantir que image existe
          }));

          console.log('🔄 Perguntas processadas:', processedQuestions);
          console.log('💾 Salvando perguntas...');
          
          // ✅ SALVAR E ATUALIZAR ESTADO
          const saved = saveQuestions(processedQuestions);
          console.log('💾 Resultado do salvamento:', saved);
          
          if (saved) {
            console.log('✅ Perguntas salvas com sucesso!');
            alert(`${processedQuestions.length} perguntas importadas com sucesso!`);
          } else {
            console.error('❌ Erro ao salvar perguntas');
            alert('Erro ao salvar perguntas!');
          }
          
          // Limpar input
          event.target.value = '';
          
        } catch (error) {
          console.error('❌ Erro ao processar arquivo:', error);
          alert(`Erro ao processar arquivo: ${error.message}\n\nVerifique se o arquivo é um JSON válido.`);
        }
      };
      
      reader.onerror = (error) => {
        console.error('❌ Erro ao ler arquivo:', error);
        alert('Erro ao ler arquivo!');
      };
      
      console.log('📖 Iniciando leitura do arquivo...');
      reader.readAsText(file);
    } else {
      console.log('❌ Nenhum arquivo selecionado');
    }
  };

  // ✅ CARREGAR PERGUNTAS PADRÃO (ATUALIZADO)
  const loadDefaultQuestions = () => {
    if (window.confirm('Isso substituirá todas as perguntas atuais pelas perguntas padrão. Continuar?')) {
      try {
        console.log('🔄 Carregando perguntas padrão...');
        const defaultQuestions = resetToDefaultQuestions();
        setQuestions(defaultQuestions);
        alert(`${defaultQuestions.length} perguntas padrão carregadas com sucesso!`);
      } catch (error) {
        console.error('❌ Erro ao carregar perguntas padrão:', error);
        alert(`Erro ao carregar perguntas padrão: ${error.message}`);
      }
    }
  };

  // ✅ CARREGAR PERGUNTAS HARDCODED DIRETAMENTE
  const loadHardcodedQuestions = () => {
    if (window.confirm('Isso substituirá todas as perguntas atuais pelas perguntas padrão (método direto). Continuar?')) {
      try {
        console.log('📋 Carregando perguntas hardcoded...');
        const defaultQuestions = resetToDefaultQuestions();
        setQuestions(defaultQuestions);
        alert(`${defaultQuestions.length} perguntas padrão carregadas com sucesso!`);
      } catch (error) {
        console.error('❌ Erro ao carregar perguntas hardcoded:', error);
        alert(`Erro: ${error.message}`);
      }
    }
  };

  // 🧪 FUNÇÃO DE TESTE
  const testDirectSave = () => {
    const testQuestions = [
      {
        id: Date.now(),
        question: "Pergunta de teste - Qual é a cor do céu?",
        options: ["Azul", "Verde", "Vermelho"],
        correctAnswer: 0,
        value: 1000,
        image: ""
      },
      {
        id: Date.now() + 1,
        question: "Pergunta de teste - Quantos dias tem uma semana?",
        options: ["5", "7", "10"],
        correctAnswer: 1,
        value: 2000,
        image: ""
      }
    ];
    
    console.log('🧪 Testando salvamento direto...');
    const saved = saveQuestions(testQuestions);
    
    if (saved) {
      alert('Teste direto funcionou! 2 perguntas de teste adicionadas.');
    } else {
      alert('Teste direto falhou!');
    }
  };

  // Tela de login
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <div className="login-header">
            <div className="upa-logo-login">
              <span className="upa-text-login">UPA 24h</span>
              <span className="upa-location-login">IGARASSU</span>
            </div>
            <h1>Painel Administrativo</h1>
            <h2>Show do Milhão da Enfermagem</h2>
          </div>
          
          <div className="login-form">
            <input
              type="password"
              placeholder="Digite a senha de administrador"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="password-input"
            />
            <button onClick={handleLogin} className="login-btn">
              🔐 Entrar
            </button>
            <div className="login-hint">
              <small>💡 Dica: A senha padrão é "upa2024admin"</small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header Admin */}
      <div className="admin-header">
        <div className="admin-title">
          <div className="upa-logo-admin">
            <span className="upa-text-admin">UPA 24h</span>
            <span className="upa-location-admin">IGARASSU</span>
          </div>
          <div className="admin-title-text">
            <h1>Painel Administrativo</h1>
            <h2>Show do Milhão da Enfermagem</h2>
          </div>
        </div>
        
        <div className="admin-actions">
          <button 
            onClick={() => setShowPreview(!showPreview)} 
            className="preview-btn"
          >
            {showPreview ? '📝 Editar' : '👁️ Visualizar'}
          </button>
          <button onClick={() => navigate('/game')} className="play-btn">
            🎮 Jogar
          </button>
          <button onClick={() => navigate('/')} className="home-btn">
            🏠 Início
          </button>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Sair
          </button>
        </div>
      </div>

      <div className="admin-content">
        {/* Sidebar com lista de perguntas */}
        <div className="admin-sidebar">
          <div className="questions-header">
            <h3>Perguntas ({questions.length}/10)</h3>
            <div className="import-export">
              <input
                type="file"
                accept=".json"
                onChange={importQuestions}
                style={{ display: 'none' }}
                id="import-file"
              />
              <button 
                onClick={() => document.getElementById('import-file').click()}
                className="import-btn"
                title="Importar perguntas de arquivo JSON"
              >
                📥
              </button>
              <button 
                onClick={exportQuestions}
                className="export-btn"
                title="Exportar perguntas para arquivo JSON"
                disabled={questions.length === 0}
              >
                📤
              </button>
              <button 
                onClick={loadDefaultQuestions}
                className="default-btn"
                title="Carregar perguntas padrão (substitui todas)"
              >
                🔄
              </button>
              <button 
                onClick={loadHardcodedQuestions}
                className="hardcoded-btn"
                title="Carregar perguntas padrão (método direto)"
              >
                📋
              </button>
              <button 
                onClick={testDirectSave}
                className="test-btn"
                title="Teste direto (debug) - adiciona 2 perguntas de exemplo"
              >
                🧪
              </button>
            </div>
          </div>
          
          <div className="questions-list">
            {questions.length === 0 ? (
              <div className="no-questions-sidebar">
                <p>Nenhuma pergunta cadastrada</p>
                <button 
                  onClick={loadDefaultQuestions}
                  className="load-default-small"
                >
                  🔄 Carregar Padrão
                </button>
              </div>
            ) : (
              questions.map((q, index) => (
                <div key={q.id} className="question-item">
                  <div className="question-info">
                    <span className="question-number">#{index + 1}</span>
                    <span className="question-value">R$ {q.value.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="question-preview">
                    {q.question.length > 50 ? `${q.question.substring(0, 50)}...` : q.question}
                  </div>
                  <div className="question-actions">
                    <button 
                      onClick={() => moveQuestion(index, 'up')}
                      disabled={index === 0}
                      className="move-btn"
                      title="Mover para cima"
                    >
                      ⬆️
                    </button>
                    <button 
                      onClick={() => moveQuestion(index, 'down')}
                      disabled={index === questions.length - 1}
                      className="move-btn"
                      title="Mover para baixo"
                    >
                      ⬇️
                    </button>
                    <button 
                      onClick={() => handleEditQuestion(q)}
                      className="edit-btn"
                      title="Editar pergunta"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="delete-btn"
                      title="Deletar pergunta"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Área principal */}
        <div className="admin-main">
          {showPreview ? (
            /* Modo Preview */
            <div className="preview-container">
              <h3>👁️ Visualização do Quiz</h3>
              {questions.length === 0 ? (
                <div className="no-questions">
                  <div className="no-questions-icon">📝</div>
                  <h4>Nenhuma pergunta cadastrada</h4>
                  <p>Comece adicionando perguntas ou carregue as perguntas padrão.</p>
                  <div className="no-questions-actions">
                    <button onClick={() => setShowPreview(false)} className="add-first-btn">
                      ➕ Adicionar Primeira Pergunta
                    </button>
                    <button onClick={loadDefaultQuestions} className="load-default-btn">
                      🔄 Carregar Perguntas Padrão
                    </button>
                  </div>
                </div>
              ) : (
                <div className="preview-questions">
                  {questions.map((q, index) => (
                    <div key={q.id} className="preview-question">
                      <div className="preview-header">
                        <span className="preview-number">Pergunta {index + 1}/10</span>
                        <span className="preview-value">R$ {q.value.toLocaleString('pt-BR')}</span>
                      </div>
                      <h4 className="preview-question-text">{q.question}</h4>
                      {q.image && (
                        <div className="preview-image">
                          <img src={q.image} alt="Imagem da pergunta" />
                        </div>
                      )}
                      <div className="preview-options">
                        {q.options.map((option, optIndex) => (
                          <div 
                            key={optIndex} 
                            className={`preview-option ${optIndex === q.correctAnswer ? 'correct' : ''}`}
                          >
                            <span className="option-letter">{String.fromCharCode(65 + optIndex)}</span>
                            <span className="option-text">{option}</span>
                            {optIndex === q.correctAnswer && <span className="correct-indicator">✅</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Modo Edição */
            <div className="form-container">
              <h3>{isEditing ? '✏️ Editar Pergunta' : '➕ Nova Pergunta'}</h3>
              
              <div className="form-group">
                <label htmlFor="question-input">Pergunta *</label>
                <textarea
                  id="question-input"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    question: e.target.value
                  })}
                  placeholder="Digite a pergunta aqui..."
                  className="question-textarea"
                  rows="3"
                  maxLength="500"
                />
                <small className="char-counter">
                  {currentQuestion.question.length}/500 caracteres
                </small>
              </div>

              <div className="form-group">
                <label>Opções de Resposta *</label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="option-input-group">
                    <span className="option-label">Opção {String.fromCharCode(65 + index)}:</span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...currentQuestion.options];
                        newOptions[index] = e.target.value;
                        setCurrentQuestion({
                          ...currentQuestion,
                          options: newOptions
                        });
                      }}
                      placeholder={`Digite a opção ${String.fromCharCode(65 + index)}...`}
                      className="option-input"
                      maxLength="200"
                    />
                    <label className="radio-container">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() => setCurrentQuestion({
                          ...currentQuestion,
                          correctAnswer: index
                        })}
                        className="correct-radio"
                      />
                      <span className="radio-label">Correta</span>
                    </label>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label htmlFor="image-input">URL da Imagem (opcional)</label>
                <input
                  id="image-input"
                  type="url"
                  value={currentQuestion.image}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    image: e.target.value
                  })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="image-input"
                />
                {currentQuestion.image && (
                  <div className="image-preview">
                    <img 
                      src={currentQuestion.image} 
                      alt="Preview da imagem" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                      onLoad={(e) => {
                        e.target.style.display = 'block';
                        e.target.nextSibling.style.display = 'none';
                      }}
                    />
                    <div className="image-error" style={{ display: 'none' }}>
                      ❌ Erro ao carregar imagem
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                {isEditing ? (
                  <>
                    <button onClick={handleUpdateQuestion} className="save-btn">
                      💾 Atualizar Pergunta
                    </button>
                    <button onClick={resetForm} className="cancel-btn">
                      ❌ Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleAddQuestion} 
                      className="add-btn"
                      disabled={questions.length >= 10}
                    >
                      ➕ Adicionar Pergunta ({questions.length}/10)
                    </button>
                    <button onClick={resetForm} className="clear-btn">
                      🧹 Limpar Formulário
                    </button>
                  </>
                )}
              </div>

              {questions.length >= 10 && (
                <div className="max-questions-warning">
                  ⚠️ Máximo de 10 perguntas atingido. Delete uma pergunta para adicionar outra.
                </div>
              )}

              {questions.length < 10 && questions.length > 0 && (
                <div className="questions-progress">
                  📊 Progresso: {questions.length}/10 perguntas cadastradas
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;