const { HLTV } = require('hltv');

class HltvService {
  async getFuriaMatches() {
    try {
      // Busca apenas os jogos da FURIA usando o filtro teamIds
      const furiaMatches = await HLTV.getMatches();
      // Log completo para depuração
      console.log('LOG COMPLETO HLTV.getMatches({ teamIds: [8297] }):', JSON.stringify(furiaMatches, null, 2));
      // Formata os dados dos jogos
      const formattedMatches = await Promise.all(furiaMatches.map(async (match) => {
        const matchDetails = await HLTV.getMatch({ id: match.id });
        return {
          id: match.id,
          team1: {
            name: match.team1.name,
            logo: match.team1.logo,
            score: matchDetails.team1.score
          },
          team2: {
            name: match.team2.name,
            logo: match.team2.logo,
            score: matchDetails.team2.score
          },
          maps: matchDetails.maps.map(map => ({
            name: map.name,
            team1Score: map.team1Score,
            team2Score: map.team2Score,
            status: map.status
          })),
          status: match.status,
          date: match.date,
          event: {
            name: match.event.name,
            logo: match.event.logo
          }
        };
      }));
      return formattedMatches;
    } catch (error) {
      console.error('Erro ao buscar jogos da FURIA:', error);
      throw error;
    }
  }

  async getLiveMatch() {
    try {
      // Busca apenas os jogos da FURIA usando o filtro teamIds
      const liveMatches = await HLTV.getMatches({});
      // Log completo para depuração
      console.log('LOG COMPLETO HLTV.getMatches({ teamIds: [8297] }) [LIVE]:', JSON.stringify(liveMatches, null, 2));
      // Filtra apenas os jogos ao vivo da FURIA
      const furiaLiveMatch = liveMatches.find(match => match.status === 'LIVE');
      if (!furiaLiveMatch) {
        return null;
      }
      // Busca detalhes do jogo ao vivo
      const matchDetails = await HLTV.getMatch({ id: furiaLiveMatch.id });
      return {
        id: furiaLiveMatch.id,
        team1: {
          name: furiaLiveMatch.team1.name,
          logo: furiaLiveMatch.team1.logo,
          score: matchDetails.team1.score
        },
        team2: {
          name: furiaLiveMatch.team2.name,
          logo: furiaLiveMatch.team2.logo,
          score: matchDetails.team2.score
        },
        maps: matchDetails.maps.map(map => ({
          name: map.name,
          team1Score: map.team1Score,
          team2Score: map.team2Score,
          status: map.status
        })),
        status: furiaLiveMatch.status,
        event: {
          name: furiaLiveMatch.event.name,
          logo: furiaLiveMatch.event.logo
        }
      };
    } catch (error) {
      console.error('Erro ao buscar jogo ao vivo da FURIA:', error);
      throw error;
    }
  }

  async getAllMatches() {
    try {
      const allMatches = await HLTV.getMatches();
      console.log('LOG COMPLETO HLTV.getMatches():', JSON.stringify(allMatches, null, 2));
      const furiaMatches = allMatches.filter(
        match => match.team1.name === 'FURIA' || match.team2.name === 'FURIA'
      );
      return furiaMatches;
    } catch (error) {
      console.error('Erro ao buscar todos os jogos:', error);
      throw error;
    }
  }
}

module.exports = new HltvService(); 