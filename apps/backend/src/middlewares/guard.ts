import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';

export const authenticate = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'Token de autenticação ausente ou mal formatado' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verify(token, 'your-secret-key');
    c.set('user', payload);
    await next();
  } catch (err) {
    return c.json({ message: 'Token inválido' }, 401);
  }
};