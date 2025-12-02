
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import userRoutes from './modules/users/user.routes';

// Define que o 'c.env' terá a tipagem gerada pelo wrangler types
type Bindings = Cloudflare.Env;

const app = new OpenAPIHono<{ Bindings: Bindings }>();

// 1. Middlewares Globais
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', secureHeaders());

// 2. CORS e Segurança de Cabeçalhos
app.use('/api/*', cors({
  origin: ['http://localhost:5173', 'https://asppibra-dao.com'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// 3. Tratamento Global de Erros
app.onError((err, c) => {
  console.error(err);
  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ocorreu um erro inesperado no servidor.',
    }
  }, 500);
});

// 4. Documentação OpenAPI
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'API do Sistema de Governança',
    version: '1.0.0',
    description: 'Uma API para gerenciar a governança da ASPPIBRA.'
  }
});

// 5. Rota de Healthcheck
app.get('/', (c) => {
  return c.text('🟢 API do Sistema de Governança está online! (Powered by Hono)');
});

// 6. Rotas da API
app.route('/users', userRoutes);


// Exporta o handler padrão para o Cloudflare Workers
export default app;
