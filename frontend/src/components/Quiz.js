import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';

const questions = [
  // Seção 1: Estilo de Jogo
  {
    section: "Estilo de Jogo",
    question: "Quando a rodada começa, qual é sua primeira reação?",
    options: [
      { value: 'A', label: 'Pegar espaço e criar o primeiro contato com o inimigo' },
      { value: 'B', label: 'Cobrir os colegas e dar suporte com utilitários' },
      { value: 'C', label: 'Procurar um pixel longo para pegar o abate rápido' },
      { value: 'D', label: 'Evitar confronto inicial e esperar brechas' },
      { value: 'E', label: 'Analisar o round e pensar em qual jogada chamar' },
      { value: 'F', label: 'Me posicionar bem para segurar o rush no bomb' }
    ]
  },
  {
    section: "Estilo de Jogo",
    question: "Em um clutch (1v2), você tende a:",
    options: [
      { value: 'A', label: 'Ir pra cima e tentar o highlight' },
      { value: 'B', label: 'Procurar um jogador isolado e abrir espaço' },
      { value: 'C', label: 'Esperar o erro do inimigo e mirar fixo' },
      { value: 'D', label: 'Contornar o mapa tentando uma brecha inteligente' },
      { value: 'E', label: 'Calcular as chances e priorizar o plano mais lógico' },
      { value: 'F', label: 'Jogar no tempo e com calma, controlando a C4 ou o defuse' }
    ]
  },
  {
    section: "Estilo de Jogo",
    question: "Seu mapa favorito tem:",
    options: [
      { value: 'A', label: 'Muitos pontos de rush e combate rápido (ex: Mirage, Inferno)' },
      { value: 'B', label: 'Várias janelas para jogadas em conjunto (ex: Overpass)' },
      { value: 'C', label: 'Linhas longas e espaço para duelos de sniper (ex: Dust2)' },
      { value: 'D', label: 'Múltiplos caminhos e espaço para rotacionar (ex: Ancient)' },
      { value: 'E', label: 'Opções táticas variadas (ex: Nuke)' },
      { value: 'F', label: 'Situações de defesa técnica (ex: Vertigo)' }
    ]
  },
  // Seção 2: Psicologia em Jogo
  {
    section: "Psicologia em Jogo",
    question: "Quando alguém comete um erro no time, você:",
    options: [
      { value: 'A', label: 'Reage na hora com crítica direta' },
      { value: 'B', label: 'Dá cobertura e sugere outra forma' },
      { value: 'C', label: 'Fico calado, me concentro na próxima jogada' },
      { value: 'D', label: 'Tento jogar ao redor do erro' },
      { value: 'E', label: 'Analiso o round e dou um feedback calmo' },
      { value: 'F', label: 'Me adapto sem drama' }
    ]
  },
  {
    section: "Psicologia em Jogo",
    question: "Em situações de estresse, você:",
    options: [
      { value: 'A', label: 'Age por impulso, buscando resolver rápido' },
      { value: 'B', label: 'Respira e espera instruções ou call do IGL' },
      { value: 'C', label: 'Se isola e confia no seu instinto' },
      { value: 'D', label: 'Se adapta com frieza, mesmo sob pressão' },
      { value: 'E', label: 'Assume o controle e organiza' },
      { value: 'F', label: 'Mantém a posição e evita erros' }
    ]
  },
  {
    section: "Psicologia em Jogo",
    question: "Você prefere liderar ou seguir?",
    options: [
      { value: 'A', label: 'Prefiro ir na frente, não importa a call' },
      { value: 'B', label: 'Gosto de cumprir meu papel com confiança' },
      { value: 'C', label: 'Prefiro tomar decisões sozinho' },
      { value: 'D', label: 'Sigo o time, mas com espaço para improvisar' },
      { value: 'E', label: 'Gosto de estar no comando e pensar a jogada' },
      { value: 'F', label: 'Faço o que for preciso, mesmo se for "chato"' }
    ]
  },
  // Seção 3: Técnicas e Contribuição
  {
    section: "Técnicas e Contribuição",
    question: "Qual dessas habilidades você gostaria de dominar?",
    options: [
      { value: 'A', label: 'Reflexos rápidos e spray perfeito' },
      { value: 'B', label: 'Utilitários (smokes, flashes, molotovs)' },
      { value: 'C', label: 'Mira precisa e leitura de pixels' },
      { value: 'D', label: 'Timing e controle de mapa' },
      { value: 'E', label: 'Estratégias de ataque/defesa' },
      { value: 'F', label: 'Posicionamento e paciência' }
    ]
  },
  {
    section: "Técnicas e Contribuição",
    question: "Você se sente mais satisfeito quando:",
    options: [
      { value: 'A', label: 'Entra no bomb e abre dois abates' },
      { value: 'B', label: 'Suporta com flash e seu time elimina tudo' },
      { value: 'C', label: 'Dá um tiro limpo e muda o round' },
      { value: 'D', label: 'Ganha um clutch com movimentação inteligente' },
      { value: 'E', label: 'Vê sua estratégia funcionando' },
      { value: 'F', label: 'Segura o bomb contra 3 e vence' }
    ]
  },
  {
    section: "Técnicas e Contribuição",
    question: "Em um time ideal, seu papel seria:",
    options: [
      { value: 'A', label: 'A linha de frente, o que quebra a defesa' },
      { value: 'B', label: 'O braço direito do IGL' },
      { value: 'C', label: 'O sniper confiável' },
      { value: 'D', label: 'O jogador que pega as costas ou split' },
      { value: 'E', label: 'O cérebro da operação' },
      { value: 'F', label: 'O guardião do bombsite' }
    ]
  },
  // Seção 4: Estratégia e Comunicação
  {
    section: "Estratégia e Comunicação",
    question: "Durante uma call errada, você:",
    options: [
      { value: 'A', label: 'Vai mesmo assim e tenta resolver na bala' },
      { value: 'B', label: 'Executa o plano com boa vontade' },
      { value: 'C', label: 'Se adapta à jogada, mas não depende dela' },
      { value: 'D', label: 'Segue por fora, tentando surpreender' },
      { value: 'E', label: 'Corrige a call ou propõe uma mudança' },
      { value: 'F', label: 'Permanece atento e defende como puder' }
    ]
  },
  {
    section: "Estratégia e Comunicação",
    question: "Você prefere jogar com:",
    options: [
      { value: 'A', label: 'Pessoas agressivas e rápidas' },
      { value: 'B', label: 'Jogadores táticos e confiáveis' },
      { value: 'C', label: 'Companheiros que te deixem livre pra mirar' },
      { value: 'D', label: 'Times que joguem soltos, sem obrigação' },
      { value: 'E', label: 'Grupos organizados, com estratégia clara' },
      { value: 'F', label: 'Qualquer time, desde que eu possa fazer meu papel' }
    ]
  },
  {
    section: "Estratégia e Comunicação",
    question: "Quando está perdendo de 12x5, você:",
    options: [
      { value: 'A', label: 'Aumenta a agressividade' },
      { value: 'B', label: 'Tenta organizar o time com calma' },
      { value: 'C', label: 'Faz uma jogada individual ousada' },
      { value: 'D', label: 'Muda completamente sua movimentação' },
      { value: 'E', label: 'Analisa friamente a situação e tenta ajustar' },
      { value: 'F', label: 'Fecha o bombsite com segurança e espera erros' }
    ]
  }
];

const roles = {
  'A': 'Entry Fragger',
  'B': 'Support',
  'C': 'AWPer (Sniper)',
  'D': 'Lurker',
  'E': 'In-Game Leader (IGL)',
  'F': 'Anchor'
};

const roleDescriptions = {
  'A': 'Você é um Entry Fragger nato! Sua agressividade controlada e reflexos rápidos são ideais para abrir espaços e criar vantagens numéricas para o time. Você não tem medo de entrar primeiro e criar oportunidades.',
  'B': 'Como Support, você é o pilar do time! Sua capacidade de trabalhar em equipe e conhecimento de utilitários fazem toda diferença. Você sabe que uma flash bem jogada ou uma smoke perfeita podem mudar o round.',
  'C': 'Nascido para ser AWPer! Sua paciência e precisão são suas maiores virtudes. Você tem o dom de controlar linhas importantes e criar picks que mudam o rumo da partida.',
  'D': 'Lurker é sua vocação! Você tem um ótimo game sense e timing perfeito para fazer jogadas inteligentes. Sua capacidade de ler o jogo e pegar flancos é excepcional.',
  'E': 'Você tem a alma de um IGL! Sua capacidade de leitura do jogo e liderança natural fazem de você o cérebro do time. Você sabe coordenar estratégias e adaptar as táticas quando necessário.',
  'F': 'Anchor é seu papel ideal! Sua consistência e capacidade de segurar posições são admiráveis. Você é o último bastião da defesa, mantendo a calma mesmo sob pressão extrema.'
};

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [currentSection, setCurrentSection] = useState(questions[0].section);

  const handleAnswer = (event) => {
    setAnswers({
      ...answers,
      [currentQuestion]: event.target.value
    });
  };

  const calculateResult = () => {
    const counts = Object.values(answers).reduce((acc, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

    let maxCount = 0;
    let maxRole = 'A';

    Object.entries(counts).forEach(([role, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxRole = role;
      }
    });

    setResult(maxRole);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentSection(questions[currentQuestion + 1].section);
    } else {
      calculateResult();
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setCurrentSection(questions[0].section);
  };

  if (result) {
    return (
      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4, backgroundColor: '#1a1a1a', color: '#fff' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#fff', textAlign: 'center' }}>
          Seu perfil é: {roles[result]}
        </Typography>
        <Typography variant="body1" paragraph sx={{ textAlign: 'center', mb: 4 }}>
          {roleDescriptions[result]}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="outlined" 
            onClick={handleReset}
            sx={{ 
              color: '#fff',
              borderColor: '#fff',
              '&:hover': {
                borderColor: '#fff',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Fazer o quiz novamente
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4, backgroundColor: '#1a1a1a', color: '#fff' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#fff', textAlign: 'center', mb: 3 }}>
        Qual é sua posição ideal no CS?
      </Typography>
      
      <Typography variant="h6" gutterBottom sx={{ color: '#fff', textAlign: 'center', mb: 4 }}>
        {currentSection}
      </Typography>

      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper activeStep={currentQuestion} alternativeLabel>
          {questions.map((_, index) => (
            <Step key={index}>
              <StepLabel></StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        {questions[currentQuestion].question}
      </Typography>

      <FormControl component="fieldset" sx={{ width: '100%', mb: 4 }}>
        <RadioGroup
          value={answers[currentQuestion] || ''}
          onChange={handleAnswer}
        >
          {questions[currentQuestion].options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio sx={{ 
                color: '#fff',
                '&.Mui-checked': {
                  color: '#fff',
                }
              }} />}
              label={option.label}
              sx={{ 
                mb: 2,
                color: '#fff',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px'
                }
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={() => {
            setCurrentQuestion(Math.max(0, currentQuestion - 1));
            setCurrentSection(questions[Math.max(0, currentQuestion - 1)].section);
          }}
          disabled={currentQuestion === 0}
          sx={{ 
            color: '#fff',
            borderColor: '#fff',
            '&:hover': {
              borderColor: '#fff',
              backgroundColor: 'rgba(255,255,255,0.1)'
            },
            '&.Mui-disabled': {
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'rgba(255,255,255,0.3)'
            }
          }}
        >
          Anterior
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!answers[currentQuestion]}
          sx={{ 
            backgroundColor: '#fff',
            color: '#000',
            '&:hover': {
              backgroundColor: '#e0e0e0'
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(255,255,255,0.3)',
              color: '#000'
            }
          }}
        >
          {currentQuestion === questions.length - 1 ? 'Ver resultado' : 'Próxima'}
        </Button>
      </Box>
    </Paper>
  );
} 