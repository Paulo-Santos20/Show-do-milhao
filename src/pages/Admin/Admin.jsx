import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

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

  // Carregar perguntas do localStorage
  useEffect(() => {
    const savedQuestions = localStorage.getItem('quiz-questions');
    if (savedQuestions) {
      try {
        const parsed = JSON.parse(savedQuestions);
        console.log('📊 Perguntas carregadas do localStorage:', parsed.length);
        setQuestions(parsed);
      } catch (error) {
        console.error('❌ Erro ao carregar perguntas do localStorage:', error);
      }
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
      console.log('�� Estado atualizado');
      
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
    if (password === 'upa') {
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
          console.log('📖 Conteúdo bruto do arquivo:', e.target.result);
          
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
            alert('Formato de arquivo inválido! O arquivo deve conter um array de perguntas.');
            return;
          }

          console.log('📊 Perguntas encontradas:', importedQuestions.length);
          console.log('📝 Primeira pergunta:', importedQuestions[0]);

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
            value: prizeValues[index] || 1000000 // Valor baseado na posição
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
          alert(`Erro ao processar arquivo: ${error.message}`);
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

  // ✅ CARREGAR PERGUNTAS PADRÃO
  const loadDefaultQuestions = async () => {
    if (window.confirm('Isso substituirá todas as perguntas atuais pelas perguntas padrão. Continuar?')) {
      try {
        console.log('🔄 Carregando perguntas padrão...');
        const response = await fetch('/data/questions.json');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const defaultQuestions = await response.json();
        console.log('📊 Perguntas padrão carregadas:', defaultQuestions);
        
        // Reajustar valores
        const processedQuestions = defaultQuestions.map((q, index) => ({
          ...q,
          id: Date.now() + index,
          value: prizeValues[index] || 1000000
        }));
        
        const saved = saveQuestions(processedQuestions);
        
        if (saved) {
          alert('Perguntas padrão carregadas com sucesso!');
        } else {
          alert('Erro ao salvar perguntas padrão!');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar perguntas padrão:', error);
        alert(`Erro ao carregar perguntas padrão: ${error.message}`);
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
                title="Importar perguntas"
              >
                📥
              </button>
              <button 
                onClick={exportQuestions}
                className="export-btn"
                title="Exportar perguntas"
              >
                📤
              </button>
              <button 
                onClick={loadDefaultQuestions}
                className="default-btn"
                title="Carregar perguntas padrão"
              >
                🔄
              </button>
              <button 
                onClick={testDirectSave}
                className="test-btn"
                title="Teste direto (debug)"
              >
                ��
              </button>
            </div>
          </div>
          
          <div className="questions-list">
            {questions.map((q, index) => (
              <div key={q.id} className="question-item">
                <div className="question-info">
                  <span className="question-number">#{index + 1}</span>
                  <span className="question-value">R$ {q.value.toLocaleString('pt-BR')}</span>
                </div>
                <div className="question-preview">
                  {q.question.substring(0, 50)}...
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
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="delete-btn"
                    title="Deletar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área principal */}
        <div className="admin-main">
          {showPreview ? (
            /* Modo Preview */
            <div className="preview-container">
              <h3>Visualização do Quiz</h3>
              {questions.length === 0 ? (
                <div className="no-questions">
                  <p>Nenhuma pergunta cadastrada ainda.</p>
                  <button onClick={() => setShowPreview(false)} className="add-first-btn">
                    ➕ Adicionar Primeira Pergunta
                  </button>
                </div>
              ) : (
                <div className="preview-questions">
                  {questions.map((q, index) => (
                    <div key={q.id} className="preview-question">
                      <div className="preview-header">
                        <span>Pergunta {index + 1}/10</span>
                        <span>R$ {q.value.toLocaleString('pt-BR')}</span>
                      </div>
                      <h4>{q.question}</h4>
                      <div className="preview-options">
                        {q.options.map((option, optIndex) => (
                          <div 
                            key={optIndex} 
                            className={`preview-option ${optIndex === q.correctAnswer ? 'correct' : ''}`}
                          >
                            <span className="option-number">{optIndex + 1}</span>
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
              <h3>{isEditing ? 'Editar Pergunta' : 'Nova Pergunta'}</h3>
              
              <div className="form-group">
                <label>Pergunta *</label>
                <textarea
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    question: e.target.value
                  })}
                  placeholder="Digite a pergunta aqui..."
                  className="question-textarea"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Opções de Resposta *</label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="option-input-group">
                    <span className="option-label">Opção {index + 1}:</span>
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
                      placeholder={`Digite a opção ${index + 1}...`}
                      className="option-input"
                    />
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
                    <label className="radio-label">Correta</label>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>URL da Imagem (opcional)</label>
                <input
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
                      alt="Preview" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
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
                      ➕ Adicionar Pergunta
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;