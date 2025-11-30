export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    // Exemplo: Endpoint para listar usuários
    if (url.pathname === "/users") {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM users").all();
        return new Response(JSON.stringify(results), {
          headers: { "content-type": "application/json" },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    return new Response("API do Sistema de Governança está online!");
  },
};