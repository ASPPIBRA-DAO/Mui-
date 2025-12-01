import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

// Define que o 'c.env' terá a tipagem gerada pelo wrangler types
// Isso ativa o autocomplete para c.env.DB e c.env.ASSETS
type Bindings = Cloudflare.Env;

const app = new Hono<{ Bindings: Bindings }>();

// 1. Middlewares Globais
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors());

// 2. Rota de Healthcheck (Raiz)
app.get('/', (c) => {
  return c.text('🟢 API do Sistema de Governança está online! (Powered by Hono)');
});

// 3. Exemplo: Endpoint para listar usuários (Integrado ao D1)
app.get('/users', async (c) => {
  try {
    // O TypeScript agora sabe que .DB existe graças ao Generics <{ Bindings }>
    const { results } = await c.env.DB.prepare("SELECT * FROM users").all();
    
    return c.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (e) {
    console.error(e);
    return c.json({ 
      success: false, 
      error: (e as Error).message 
    }, 500);
  }
});

// Exporta o handler padrão para o Cloudflare Workers
export default app;