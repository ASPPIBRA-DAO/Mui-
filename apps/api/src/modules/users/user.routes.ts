
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { ParamsSchema, QuerySchema, CreateUserSchema, UpdateUserSchema, UserSchema, SuccessResponseSchema, ErrorResponseSchema } from './user.schema';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from './user.service';

const users = new OpenAPIHono();

// 1. Listar Usuários
const ListUsersRoute = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: QuerySchema,
  },
  responses: {
    200: {
      description: 'Lista de usuários',
      content: {
        'application/json': {
          schema: SuccessResponseSchema.extend({ data: z.array(UserSchema) }),
        },
      },
    },
  },
});

users.openapi(ListUsersRoute, async (c) => {
  const { limit } = c.req.valid('query');
  const userList = await getUsers(c, limit);
  return c.json({ success: true, data: userList }, 200);
});

// 2. Obter Usuário por ID
const GetUserRoute = createRoute({
  method: 'get',
  path: '/:id',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      description: 'Usuário encontrado',
      content: {
        'application/json': {
          schema: SuccessResponseSchema.extend({ data: UserSchema }),
        },
      },
    },
    404: {
      description: 'Usuário não encontrado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

users.openapi(GetUserRoute, async (c) => {
  const { id } = c.req.valid('param');
  const user = await getUserById(c, id);
  if (!user) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Usuário não encontrado' } }, 404);
  }
  return c.json({ success: true, data: user }, 200);
});

// 3. Criar Usuário
const CreateUserRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Usuário criado',
      content: {
        'application/json': {
          schema: SuccessResponseSchema.extend({ data: UserSchema }),
        },
      },
    },
  },
});

users.openapi(CreateUserRoute, async (c) => {
  const user = c.req.valid('json');
  const newUser = await createUser(c, user);
  return c.json({ success: true, data: newUser }, 201);
});

// 4. Atualizar Usuário
const UpdateUserRoute = createRoute({
  method: 'put',
  path: '/:id',
  request: {
    params: ParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Usuário atualizado',
      content: {
        'application/json': {
          schema: SuccessResponseSchema.extend({ data: UserSchema }),
        },
      },
    },
  },
});

users.openapi(UpdateUserRoute, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.req.valid('json');
  const updatedUser = await updateUser(c, id, user);
  return c.json({ success: true, data: updatedUser }, 200);
});

// 5. Deletar Usuário
const DeleteUserRoute = createRoute({
  method: 'delete',
  path: '/:id',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      description: 'Usuário deletado',
      content: {
        'application/json': {
          schema: SuccessResponseSchema.extend({ data: z.object({ id: z.string() }) }),
        },
      },
    },
  },
});

users.openapi(DeleteUserRoute, async (c) => {
  const { id } = c.req.valid('param');
  const deletedId = await deleteUser(c, id);
  return c.json({ success: true, data: { id: deletedId } }, 200);
});

export default users;
