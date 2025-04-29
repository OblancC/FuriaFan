const HLTV = require('hltv');

class HltvService {
  constructor() {
    this.hltv = HLTV;
  }

  async getFuriaMatches() {
    try {
      // Busca os próximos jogos
      const upcomingMatches = await this.hltv.getMatches();
      
      // Filtra apenas os jogos da FURIA
      const furiaMatches = upcomingMatches.filter(match => 
        match.team1.name === 'FURIA' || match.team2.name === 'FURIA'
      );

      // Formata os dados dos jogos
      const formattedMatches = await Promise.all(furiaMatches.map(async (match) => {
        const matchDetails = await this.hltv.getMatch({ id: match.id });
        
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
      // Busca os jogos ao vivo
      const liveMatches = await this.hltv.getMatches();
      
      // Filtra apenas os jogos ao vivo da FURIA
      const furiaLiveMatch = liveMatches.find(match => 
        (match.team1.name === 'FURIA' || match.team2.name === 'FURIA') && 
        match.status === 'LIVE'
      );

      if (!furiaLiveMatch) {
        return null;
      }

      // Busca detalhes do jogo ao vivo
      const matchDetails = await this.hltv.getMatch({ id: furiaLiveMatch.id });
      
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
}

module.exports = new HltvService(); 