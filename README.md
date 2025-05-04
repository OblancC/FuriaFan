# FURIA Fans - Chatbot & Plataforma de Engajamento

Bem-vindo ao FURIA Fans! Este projeto é uma plataforma web para fãs do time de CS:GO da FURIA, com chatbot interativo, integração social e recursos para acompanhar o time em tempo real.

---

## ✨ Funcionalidades

- **Chatbot interativo** com comandos para lineup, próximos jogos, resultados, links oficiais e mais.
- **Integração com redes sociais** (Twitter, Discord, YouTube) para saber se o fã segue a FURIA.
- **Upload e validação de documentos** (Know Your Fan).
- **Perfil do usuário** com dados pessoais e sociais.
- **Notícias e agenda de jogos**.
- **Interface moderna e responsiva**.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React, Material-UI, React Router, Axios, Socket.io-client
- **Backend:** Node.js, Express, Socket.io, Mongoose, Passport.js (OAuth)
- **Banco de Dados:** MongoDB
- **APIs externas:** HLTV, Twitter API, Discord API, YouTube API
- **Infraestrutura:** Docker, Docker Compose, Google Cloud VM

---

## 📦 Como rodar localmente

### Pré-requisitos

- Node.js (v18+)
- Docker e Docker Compose
- MongoDB (ou use o container do Docker)

### 1. Clone o repositório

```bash
git clone https://github.com/OblancC/FuriaFan.git
cd FuriaFan
```

### 2. Configure as variáveis de ambiente

Crie os arquivos `.env` em `/backend` e `/frontend` conforme os exemplos:

**backend/.env**
```
MONGO_URI=mongodb://127.0.0.1:27017/furiafans
PORT=5000
SESSION_SECRET=
FRONTEND_URL=http://localhost:3000
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_CALLBACK_URL=http://localhost:5000/auth/twitter/callback
TWITTER_BEARER_TOKEN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
GOOGLE_APPLICATION_CREDENTIALS=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_CALLBACK_URL=http://localhost:5000/api/auth/discord/callback
FURIA_GUILD_ID=
```

**frontend/src/.env**
```
REACT_APP_API_URL=http://localhost:5000
```

### 3. Suba com Docker Compose

```bash
docker-compose up --build
```

Acesse o frontend em [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💻 Principais Comandos do Chatbot

- `lineup` ou `matchup`: mostra o time atual e coach
- `próximo jogo`: mostra o próximo confronto
- `resultado anterior` ou `últimos resultados`: últimos jogos
- `live` ou `ao vivo`: canais de transmissão
- `rede sociais` ou `organização`: redes oficiais da FURIA

---

## 👤 Know Your Fan

- Cadastro de dados pessoais e sociais
- Upload de documentos e validação (AI)
- Vinculação de redes sociais (Twitter, Discord, YouTube)
- Visualização de interações e atividades

---

## 📂 Estrutura do Projeto

```
furia-fans/
  backend/
    src/
      routes/
      models/
      mocks/
      ...
    .env
    Dockerfile
  frontend/
    src/
      components/
      pages/
      .env
      ...
    Dockerfile
  docker-compose.yml
  README.md
```

---

## 📝 Como contribuir

1. Fork este repositório
2. Crie uma branch: `git checkout -b minha-feature`
3. Faça commit das suas alterações: `git commit -m 'feat: minha nova feature'`
4. Push para a branch: `git push origin minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

> Projeto desenvolvido para o Challenge FURIA Fans. 