import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CircularProgress, 
  Button, 
  Link,
  Chip,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_URLS } from '../config/api';

// Estilos personalizados
const FuriaCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#000000',
  color: '#ffffff',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
  },
}));

const FuriaButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#000000',
  '&:hover': {
    backgroundColor: '#FFC000',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: '#ffffff',
  borderBottom: '2px solid #ffffff',
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

const News = () => {
  const [news, setNews] = useState({
    furiaNews: [],
    allNews: []
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState(null);

  const fetchNews = async (pageNumber) => {
    try {
      const response = await axios.get(`${API_URLS.news.replace('/recommended', '')}?page=${pageNumber}`, {
        withCredentials: true
      });
      
      if (pageNumber === 1) {
        setNews(response.data.news || { furiaNews: [], allNews: [] });
      } else {
        setNews(prev => ({
          furiaNews: [...(prev.furiaNews || []), ...(response.data.news?.furiaNews || [])],
          allNews: [...(prev.allNews || []), ...(response.data.news?.allNews || [])]
        }));
      }
      
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNews(1);
    }
  }, [isAuthenticated]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage);
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4, color: '#ffffff' }}>
          Por favor, faça login para ver as notícias
        </Typography>
      </Container>
    );
  }

  if (loading && (!news.furiaNews || !news.allNews)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: '#ffffff' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  const NewsCard = ({ item }) => {
    return (
    <FuriaCard 
      sx={{ 
        mb: 6,
        maxWidth: 420, 
        margin: '0 auto', 
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 220,
        p: 2
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 0 }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ color: '#ffffff', fontWeight: 700 }}>
                    {item.title}
                  </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Chip 
            label={item.source} 
            size="small" 
            sx={{ 
                backgroundColor: '#ffffff', 
              color: '#000000',
              mr: 1
            }} 
          />
          <Typography variant="caption" sx={{ color: '#888888' }}>
                    {item.date ? new Date(item.date).toLocaleDateString() : ''}
                  </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#ffffff', mb: 1, maxHeight: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.description}
                  </Typography>
                  {item.link && (
          <Box sx={{ mt: 'auto' }}>
            <Link 
              href={item.link} 
              target="_blank" 
              rel="noopener" 
              sx={{ 
                  color: '#ffffff',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Ler notícia completa →
                      </Link>
                    </Box>
                  )}
                </CardContent>
    </FuriaCard>
  );
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Grid 
          container 
          spacing={0} 
          alignItems="flex-start" 
          justifyContent="center"
          columns={24}
        >
          {/* Coluna de Notícias da FURIA */}
          <Grid item xs={24} md={10} sx={{ px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SectionTitle variant="h4">
              Notícias da FURIA
            </SectionTitle>
            <Box sx={{ maxHeight: '80vh', overflowY: 'auto', pr: 1, width: '100%' }}>
              {news.furiaNews && news.furiaNews.length > 0 ? (
                news.furiaNews.map((item, idx) => (
                  <React.Fragment key={item._id || item.title}>
                    <NewsCard item={item} />
                    {idx < news.furiaNews.length - 1 && <Divider sx={{ bgcolor: '#ffffff', my: 2 }} />}
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body1" sx={{ color: '#888888' }}>
                  Nenhuma notícia da FURIA encontrada.
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Divisória vertical entre as colunas */}
          <Grid item md={1} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'stretch' }}>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: '#ffffff', mx: 2, height: '100%', width: '4px', borderRadius: 2 }} />
          </Grid>

          {/* Coluna de Todas as Notícias de CS */}
          <Grid item xs={24} md={10} sx={{ px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SectionTitle variant="h4">
              Todas as Notícias de CS
            </SectionTitle>
            <Box sx={{ maxHeight: '80vh', overflowY: 'auto', pr: 1, width: '100%' }}>
              {news.allNews && news.allNews.length > 0 ? (
                news.allNews.map((item, idx) => (
                  <React.Fragment key={item._id || item.title}>
                    <NewsCard item={item} />
                    {idx < news.allNews.length - 1 && <Divider sx={{ bgcolor: '#ffffff', my: 2 }} />}
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body1" sx={{ color: '#888888' }}>
                  Nenhuma notícia do HLTV encontrada.
                </Typography>
              )}
            </Box>
            </Grid>
        </Grid>

        {hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <FuriaButton
              variant="contained"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Carregar Mais'}
            </FuriaButton>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default News; 