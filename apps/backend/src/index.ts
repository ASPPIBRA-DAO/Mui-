import 'reflect-metadata';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { connectDB } from './config/db';
// Nota: Se essas rotas ainda tiverem erros de import, o VS Code vai avisar
import { todoRoutes } from './modules/todos/todo.routes';
import { userRoutes } from './modules/users/user.routes';

const app = new Hono<{ Bindings: { MONGO_URI: string } }>();

app.use('* ', cors());

app.route('/api/todos', todoRoutes);
app.route('/api/users', userRoutes);

app.get('/', (c) => c.text('Workers API Active! 🚀'));

export default {
  async fetch(request: Request, env: any, ctx: any) {
    // A variável MONGO_URI vem do Cloudflare (env)
    if (env.MONGO_URI) await connectDB(env.MONGO_URI);
    
    return app.fetch(request, env, ctx);
  },
};
