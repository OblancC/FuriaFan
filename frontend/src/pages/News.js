import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { Box, Card, CardContent, CardMedia, CircularProgress, Button } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState(null);

  const fetchNews = async (pageNumber) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/news?page=${pageNumber}`, {
        withCredentials: true
      });
      
      if (pageNumber === 1) {
        setNews(response.data.news);
      } else {
        setNews(prev => [...prev, ...response.data.news]);
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
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Por favor, faça login para ver as notícias
        </Typography>
      </Container>
    );
  }

  if (loading && news.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
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

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Notícias da FURIA
        </Typography>

        <Grid container spacing={3}>
          {news.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {item.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(item.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {item.summary}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Carregar Mais'}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default News; 