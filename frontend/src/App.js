import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    // Requisição ao backend
    axios.get('http://localhost:5000')
      .then(response => setData(response.data))
      .catch(error => console.error('Erro na requisição:', error));
  }, []);

  return (
    <div className="App">
      <h1>Olá, Fã da FURIA!</h1>
      <p>{data}</p>
    </div>
  );
}

export default App;
