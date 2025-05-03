const express = require('express');
const router = express.Router();
const furiaPlayers = require('../mocks/furiaPlayers');
const furiaMatchesMock = require('../mocks/furiaMatches');
const furiaResultsMock = require('../mocks/furiaResults');
const furiaOrg = require('../mocks/furiaOrg');
const furiaLiveMock = require('../mocks/furiaLive');

// Dados simulados (você pode integrar com dados reais depois)

router.post('/', async (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();
  let resposta = '';

  try {
    if (msg.includes('matchup') || msg.includes('lineup')) {
      // Usar dados mockados
      const starters = furiaPlayers.players.filter(p => p.status === 'STARTER');
      let respostaJogadores = starters.map(p => {
        let redes = [];
        if (p.social.faceit) redes.push(`[Faceit](${p.social.faceit})`);
        if (p.social.twitter) redes.push(`[X](${p.social.twitter})`);
        if (p.social.instagram) redes.push(`[Instagram](${p.social.instagram})`);
        if (p.social.twitch) redes.push(`[Twitch](${p.social.twitch})`);
        return `- ${p.name} (Rating: ${p.rating})${redes.length > 0 ? '\n    ' + redes.join(' | ') : ''}`;
      }).join('\n');
      // Coach
      let coachRedes = [];
      if (furiaPlayers.coach.social) {
        if (furiaPlayers.coach.social.faceit) coachRedes.push(`[Faceit](${furiaPlayers.coach.social.faceit})`);
        if (furiaPlayers.coach.social.twitter) coachRedes.push(`[X](${furiaPlayers.coach.social.twitter})`);
        if (furiaPlayers.coach.social.instagram) coachRedes.push(`[Instagram](${furiaPlayers.coach.social.instagram})`);
        if (furiaPlayers.coach.social.twitch) coachRedes.push(`[Twitch](${furiaPlayers.coach.social.twitch})`);
      }
      const coach = furiaPlayers.coach ? furiaPlayers.coach.name : 'Desconhecido';
      resposta = `Lineup atual da FURIA:\n${respostaJogadores}\nCoach: ${coach}${coachRedes.length > 0 ? '\n    ' + coachRedes.join(' | ') : ''}`;
    } else if (msg.includes('próximo jogo') || msg.includes('proximo jogo') || msg.includes('calendario') || msg.includes('agenda')) {
      // Usar mock para o próximo jogo
      const agora = Date.now();
      const proximos = furiaMatchesMock.filter(m => m.date && m.date > agora);
      if (proximos.length > 0) {
        const proximo = proximos.sort((a, b) => a.date - b.date)[0];
        // Calcular diferença
        let diffMs = proximo.date - agora;
        const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        diffMs -= diffDias * (1000 * 60 * 60 * 24);
        const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
        diffMs -= diffHoras * (1000 * 60 * 60);
        const diffMin = Math.floor(diffMs / (1000 * 60));
        diffMs -= diffMin * (1000 * 60);
        const diffSeg = Math.floor(diffMs / 1000);
        const tempoRestante = `${String(diffDias).padStart(2, '0')}:${String(diffHoras).padStart(2, '0')}:${String(diffMin).padStart(2, '0')}:${String(diffSeg).padStart(2, '0')}`;
        resposta = `Próximo jogo da FURIA:\n${proximo.team1.name} vs ${proximo.team2.name}\nEvento: ${proximo.event.name}\nData: ${new Date(proximo.date).toLocaleDateString('pt-BR')}\nHorário: 05:00 (Brasília)\nFaltam: ${tempoRestante}`;
      } else {
        resposta = 'Nenhum jogo futuro da FURIA encontrado.';
      }
    } else if (msg.includes('resultado anterior') || msg.includes('últimos resultados') || msg.includes('ultimos resultados') || msg.includes('ultimo') || msg.includes('resultado')) {
      // Usar mock para últimos resultados
      const ultimos = furiaResultsMock.slice(0, 5).map(r => 
        `${new Date(r.date).toLocaleDateString('pt-BR')}: ${r.team1.name} ${r.team1.score}x${r.team2.score} ${r.team2.name} (${r.event.name}) [Saiba Mais](${r.link})`
      ).join('\n');
      resposta = `Últimos jogos da FURIA:\n${ultimos}`;
    } else if (msg.includes('rede sociais') || msg.includes('perfil') || msg.includes('organização') || msg.includes('org')) {
      // Resposta para redes sociais da organização
      resposta = `Redes sociais da FURIA:
[X](${furiaOrg.twitter}) | [Twitch](${furiaOrg.twitch}) | [Instagram](${furiaOrg.instagram}) | [Loja oficial](${furiaOrg.loja})`;
    } else if (msg.includes('live') || msg.includes('ao vivo')) {
      // Resposta para canais de transmissão ao vivo
      if (furiaLiveMock.length > 0) {
        resposta = 'Canais transmitindo o jogo ao vivo:\n' + furiaLiveMock.map(s => `[${s.name}](${s.link})`).join(' | ');
      } else {
        resposta = 'Nenhum jogo da FURIA ao vivo no momento.';
      }
    } else if (msg.includes('calendário do mês') || msg.includes('jogos do mês')) {
      resposta = 'Nenhum jogo da FURIA neste mês.';
    } else {
      resposta = 'Desculpe, não entendi. Tente usar: lineup, próximo jogo, resultados, calendário do mês, perfil ou live.';
    }
  } catch (err) {
    resposta = 'Erro ao buscar dados do HLTV. Tente novamente mais tarde.';
  }

  res.json({ response: resposta });
});

module.exports = router; 