// Perguntas padrão do Show do Milhão da Enfermagem
export const defaultQuestions = [
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
    image: ""
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
    image: ""
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
    image: ""
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
    image: ""
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
    image: ""
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
    image: ""
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
    image: ""
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
    image: ""
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
    image: ""
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
    image: ""
  }
];

// Função para inicializar perguntas padrão
export const initializeDefaultQuestions = () => {
  try {
    const existingQuestions = localStorage.getItem('quiz-questions');
    
    if (!existingQuestions || JSON.parse(existingQuestions).length === 0) {
      console.log('🔄 Inicializando perguntas padrão...');
      
      // Adicionar IDs únicos e timestamps
      const questionsWithIds = defaultQuestions.map((q, index) => ({
        ...q,
        id: Date.now() + index,
        value: [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000][index]
      }));
      
      localStorage.setItem('quiz-questions', JSON.stringify(questionsWithIds));
      console.log('✅ Perguntas padrão inicializadas com sucesso!');
      
      return questionsWithIds;
    } else {
      const parsed = JSON.parse(existingQuestions);
      console.log('📊 Perguntas existentes carregadas:', parsed.length);
      return parsed;
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar perguntas:', error);
    return defaultQuestions;
  }
};

// Função para resetar para perguntas padrão
export const resetToDefaultQuestions = () => {
  try {
    console.log('🔄 Resetando para perguntas padrão...');
    
    const questionsWithIds = defaultQuestions.map((q, index) => ({
      ...q,
      id: Date.now() + index,
      value: [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000][index]
    }));
    
    localStorage.setItem('quiz-questions', JSON.stringify(questionsWithIds));
    console.log('✅ Reset para perguntas padrão concluído!');
    
    return questionsWithIds;
  } catch (error) {
    console.error('❌ Erro ao resetar perguntas:', error);
    return defaultQuestions;
  }
};