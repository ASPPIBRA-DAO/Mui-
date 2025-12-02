
import { eq } from 'drizzle-orm';
import { Context } from 'hono';
import { db } from '../../db';
import { users } from '../../db/schema';
import { CreateUserSchema, UpdateUserSchema } from './user.schema';

// Listar usuários com limite opcional
export const getUsers = async (c: Context, limit: number | undefined) => {
  const d1 = db(c.env.DB);
  const result = await d1.select().from(users).limit(limit || 10); // Default limit to 10
  return result;
};

// Obter usuário por ID
export const getUserById = async (c: Context, id: string) => {
  const d1 = db(c.env.DB);
  const result = await d1.select().from(users).where(eq(users.id, id));
  return result[0];
};

// Criar um novo usuário
export const createUser = async (c: Context, user: typeof CreateUserSchema._type) => {
  const d1 = db(c.env.DB);
  const newId = crypto.randomUUID();
  const newUser = {
    id: newId,
    ...user,
    createdAt: new Date().toISOString(),
  };

  await d1.insert(users).values(newUser);

  // Busca o usuário recém-criado para retornar o objeto completo
  const createdUser = await getUserById(c, newId);
  return createdUser;
};

// Atualizar um usuário
export const updateUser = async (c: Context, id: string, user: typeof UpdateUserSchema._type) => {
  const d1 = db(c.env.DB);
  await d1.update(users).set(user).where(eq(users.id, id));
  const updatedUser = await getUserById(c, id);
  return updatedUser;
};

// Deletar um usuário
export const deleteUser = async (c: Context, id: string) => {
  const d1 = db(c.env.DB);
  await d1.delete(users).where(eq(users.id, id));
  return id; // Retorna o ID do usuário deletado
};
