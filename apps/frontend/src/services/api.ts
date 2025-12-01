// 1. Importamos o Axios (o carteiro que leva e traz as cartas)
import axios from 'axios';

// 2. Criamos uma "instância". É como deixar o remetente padrão configurado.
const api = axios.create({
  // Aqui dizemos: "O Backend mora nesse endereço". 
  // O backend agora roda na porta 8787 com o Wrangler.
  baseURL: 'http://localhost:8787', 
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
