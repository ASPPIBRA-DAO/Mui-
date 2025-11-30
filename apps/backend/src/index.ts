import { Hono } from 'hono';
import { cors } from 'hono/cors';
// Não precisamos de reflect-metadata, connectDB ou rotas agora.

// Tipagem MÍNIMA das variáveis (apenas as que o Hono precisa)
type Bindings = {
  // O Mongoose é a causa da falha. Removemos a referência.
  DUMMY_VARIABLE: string; 
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

// Rota Simples para provar que o servidor está vivo
app.get('/', (c) => c.text('API BASE FUNCIONAL. Typegoose/Mongoose removidos.'));

// PONTO DE ENTRADA DO WORKERS
export default {
  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {
    // O Wrangler/Miniflare deve conseguir iniciar e responder a esta rota.
    return app.fetch(request, env, ctx);
  },
};
