import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography, Avatar } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const welcomeMessage = {
  sender: 'bot',
  text: `Bem-vindo ao chat FURIA Fans!\n\nComandos disponíveis:\n- lineup ou matchup: mostra o time atual\n- próximo jogo: mostra o próximo confronto\n- resultado anterior ou últimos resultados: últimos jogos\n- live ou ao vivo: canais de transmissão\n- rede sociais ou organização: redes oficiais da FURIA\n\nDigite um comando para começar!`
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [welcomeShown, setWelcomeShown] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMessages([]);
    setNewMessage('');
    setWelcomeShown(false);
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/chat/general/messages`, {
          withCredentials: true
        });
        if (!response.data || response.data.length === 0) {
          setMessages([welcomeMessage]);
          setWelcomeShown(true);
        } else {
          setMessages(response.data);
          setWelcomeShown(false);
        }
      } catch (error) {
        setMessages([welcomeMessage]);
        setWelcomeShown(true);
      }
    };

    fetchMessages();
    socket.emit('join-room', 'general');

    socket.on('new-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('message-reaction', ({ messageId, reactions }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, reactions } : msg
        )
      );
    });

    return () => {
      socket.off('new-message');
      socket.off('message-reaction');
    };
  }, [location.pathname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = { sender: 'user', text: newMessage };
    setMessages((prev) => [...prev, userMsg]);
    setNewMessage('');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    try {
      const response = await axios.post(`${API_BASE}/api/bot`, { message: userMsg.text });
      let formattedResponse = response.data.response;
      setMessages((prev) => [...prev, { sender: 'bot', text: formattedResponse }]);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Erro ao obter resposta do bot.' }]);
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ flex: 1, overflow: 'auto', p: 2, mb: 2 }}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              mb: 2,
              alignItems: 'flex-start',
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
            }}
          >
            <Avatar
              sx={{ bgcolor: msg.sender === 'user' ? 'primary.main' : 'secondary.main', mr: msg.sender === 'user' ? 0 : 1, ml: msg.sender === 'user' ? 1 : 0 }}
              src={msg.sender === 'bot' ? process.env.PUBLIC_URL + '/assets/furia-logo.png' : undefined}
            >
              {msg.sender === 'user' ? (user?.name ? user.name[0] : 'U') : (msg.sender === 'bot' ? '' : 'B')}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {msg.sender === 'user' ? (user?.name || 'Você') : 'FURIA Bot'}
              </Typography>
              <Paper
                elevation={1}
                sx={{ p: 1, bgcolor: msg.sender === 'user' ? 'primary.light' : 'background.paper' }}
              >
                <Typography style={{ whiteSpace: 'pre-line', color: msg.sender === 'user' ? '#111' : undefined }}>
                  {msg.sender === 'bot' ? (
                    <ReactMarkdown components={{
                      a: ({ node, ...props }) => <a {...props} style={{ color: '#fff', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{props.children && props.children.length > 0 ? props.children : 'Saiba Mais'}</a>,
                      p: ({ node, children, ...props }) => {
                        const text = children[0];
                        if (typeof text === 'string' && text.includes('|')) {
                          const [content, link] = text.split('|');
                          return (
                            <p {...props}>
                              {content}
                              <a href={link.trim()} style={{ color: '#fff', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">
                                Saiba Mais
                              </a>
                            </p>
                          );
                        }
                        return <p {...props}>{children}</p>;
                      }
                    }}>
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </Typography>
              </Paper>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>
      <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{
            input: { color: '#fff' },
            '& .MuiInputBase-input::placeholder': { color: '#ccc', opacity: 1 }
          }}
        />
        <Button variant="contained" type="submit">
          Enviar
        </Button>
      </Box>
    </Box>
  );
};

export default Chat; 