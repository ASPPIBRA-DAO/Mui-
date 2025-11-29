
// 1. Importamos o Axios (o carteiro que leva e traz as cartas)
import axios from 'axios';

// 2. Criamos uma "instância". É como deixar o remetente padrão configurado.
const api = axios.create({
  // Aqui dizemos: "O Backend mora nesse endereço". 
  // Se mudar o backend de lugar, você só altera essa linha e o site todo atualiza.
  baseURL: 'http://localhost:3000', 
});

// 3. Interceptor (O "Mordomo" automático)
// Toda vez que sair uma requisição (request) do seu site...
api.interceptors.request.use((config) => {
  
  // ...o mordomo olha no bolso (localStorage) se tem um crachá (token).
  const token = localStorage.getItem('token'); 
  
  // Se tiver crachá, ele cola na testa da requisição.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // E deixa a requisição seguir viagem.
  return config;
});

export default api;
