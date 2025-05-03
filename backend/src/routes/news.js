const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const axios = require('axios');
const RSSParser = require('rss-parser');
const rssParser = new RSSParser({
  customFields: {
    item: ['media:content', 'media:thumbnail']
  }
});
const News = require('../models/News');

// Lista de interesses disponíveis
const AVAILABLE_INTERESTS = {
  teams: ['furia'],
  games: ['csgo', 'valorant', 'lol', 'dota2', 'fifa'],
  categories: ['esports', 'campeonatos', 'transferencias', 'noticias']
};

// Função para analisar interesses do usuário
const analyzeUserInterests = (user) => {
  // Se o usuário tiver interesses definidos, use-os
  if (user.interests && user.interests.length > 0) {
    return user.interests;
  }
  
  // Caso contrário, retorne interesses padrão
  return ['furia', 'csgo', 'esports'];
};

// Função para buscar notícias do banco de dados dos últimos 7 dias
async function fetchNewsFromDB() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const news = await News.find({ receivedAt: { $gte: sevenDaysAgo } }).sort({ date: -1 });
  return news;
}

// Função para salvar notícias novas no banco de dados
async function saveNewsBatch(newsArray) {
  for (const item of newsArray) {
    const exists = await News.findOne({ title: item.title, date: item.date });
    if (!exists) {
      await News.create(item);
    }
  }
}

// Função para buscar notícias do HLTV
async function fetchHLTVNews(interests) {
  try {
    console.log('Iniciando busca de notícias do HLTV...');
    const feed = await rssParser.parseURL('https://www.hltv.org/rss/news');
    console.log('Feed RSS do HLTV obtido com sucesso:', feed.items?.length || 0, 'itens encontrados');
    
    if (!feed.items || feed.items.length === 0) {
      console.log('Nenhum item encontrado no feed do HLTV');
      return { furiaNews: [], allNews: [] };
    }

    // Log dos primeiros itens para debug
    console.log('Primeiros itens do feed:', feed.items.slice(0, 2).map(item => ({
      title: item.title,
      content: item.contentSnippet?.substring(0, 100)
    })));
    
    // Filtro para notícias da FURIA
    const furiaNews = feed.items.filter(item => {
      const title = item.title.toLowerCase();
      const content = item.contentSnippet?.toLowerCase() || '';
      
      return title.includes('furia') || 
             content.includes('furia') ||
             title.includes('fúria') || 
             content.includes('fúria');
    });

    // Todas as notícias do HLTV
    const allNews = feed.items.map(item => ({
      title: item.title,
      description: item.contentSnippet,
      date: item.pubDate,
      source: 'HLTV',
      link: item.link
    }));
    
    // Formatar notícias da FURIA
    const formattedFuriaNews = furiaNews.map(item => ({
      title: item.title,
      description: item.contentSnippet,
      date: item.pubDate,
      source: 'HLTV',
      relevance: 'high',
      link: item.link
    }));
    
    console.log('Notícias da FURIA encontradas:', formattedFuriaNews.length);
    console.log('Total de notícias do HLTV:', allNews.length);
    
    return {
      furiaNews: formattedFuriaNews,
      allNews: allNews
    };
  } catch (err) {
    console.error('Erro detalhado ao buscar notícias do HLTV:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    return { furiaNews: [], allNews: [] };
  }
}

// Rota para obter interesses disponíveis
router.get('/interests', isAuthenticated, (req, res) => {
  res.json(AVAILABLE_INTERESTS);
});

// Rota para atualizar interesses do usuário
router.put('/interests', isAuthenticated, async (req, res) => {
  try {
    const { interests } = req.body;
    
    // Validar interesses
    const validInterests = interests.filter(interest => 
      Object.values(AVAILABLE_INTERESTS).flat().includes(interest.toLowerCase())
    );
    
    if (validInterests.length === 0) {
      return res.status(400).json({ error: 'Nenhum interesse válido fornecido' });
    }
    
    // Atualizar interesses do usuário
    req.user.interests = validInterests;
    await req.user.save();
    
    res.json({ message: 'Interesses atualizados com sucesso', interests: validInterests });
  } catch (error) {
    console.error('Erro ao atualizar interesses:', error);
    res.status(500).json({ error: 'Erro ao atualizar interesses' });
  }
});

// Rota para obter notícias recomendadas
router.get('/recommended', isAuthenticated, async (req, res) => {
  try {
    // Buscar notícias do banco de dados dos últimos 7 dias
    let newsFromDB = await fetchNewsFromDB();
    if (newsFromDB.length > 0) {
      // Separar FURIA e outras
      const furiaNews = newsFromDB.filter(n => n.title.toLowerCase().includes('furia') || n.description?.toLowerCase().includes('furia'));
      const allNews = newsFromDB;
      return res.json({
        furiaNews,
        allNews
      });
    }
    // Se não houver notícias recentes, buscar do HLTV e salvar
    const user = req.user;
    const interests = analyzeUserInterests(user);
    const { furiaNews, allNews } = await fetchHLTVNews(interests);
    await saveNewsBatch([...furiaNews, ...allNews]);
    return res.json({
      furiaNews,
      allNews
    });
  } catch (error) {
    console.error('Erro ao processar recomendações:', error);
    res.status(500).json({ error: 'Erro ao buscar notícias recomendadas' });
  }
});

// Rota para listar todas as notícias com paginação
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9; // 3x3 grid
    const skip = (page - 1) * limit;

    // Buscar notícias do banco de dados dos últimos 7 dias
    let newsFromDB = await fetchNewsFromDB();
    if (newsFromDB.length > 0) {
      // Separar FURIA e outras
      const furiaNews = newsFromDB.filter(n => n.title.toLowerCase().includes('furia') || n.description?.toLowerCase().includes('furia'));
      const uniqueAllNews = newsFromDB.filter(n => !furiaNews.some(f => f.title === n.title));
      // Paginação
      const furiaNewsPage = furiaNews.slice(skip, skip + limit);
      const allNewsPage = uniqueAllNews.slice(skip, skip + limit);
      const hasMore = skip + limit < Math.max(furiaNews.length, uniqueAllNews.length);
      return res.json({
        news: {
          furiaNews: furiaNewsPage,
          allNews: allNewsPage
        },
        hasMore
      });
    }
    // Se não houver notícias recentes, buscar do HLTV e salvar
    const user = req.user;
    const interests = analyzeUserInterests(user);
    const { furiaNews, allNews } = await fetchHLTVNews(interests);
    await saveNewsBatch([...furiaNews, ...allNews]);
    // Paginação
    const uniqueAllNews = allNews.filter(news => !furiaNews.some(furiaNews => furiaNews.title === news.title));
    const furiaNewsPage = furiaNews.slice(skip, skip + limit);
    const allNewsPage = uniqueAllNews.slice(skip, skip + limit);
    const hasMore = skip + limit < Math.max(furiaNews.length, uniqueAllNews.length);
    return res.json({
      news: {
        furiaNews: furiaNewsPage,
        allNews: allNewsPage
      },
      hasMore 
    });
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    res.status(500).json({ error: 'Erro ao buscar notícias' });
  }
});

module.exports = router; 