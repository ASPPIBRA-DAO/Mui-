// Define the environment bindings, including the D1 database
export interface Env {
  DB: D1Database;
}

// ES Module format worker
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check / Debug endpoint
    if (url.pathname === "/debug/db") {
      try {
        // Directly query the database using the binding
        const { results } = await env.DB.prepare("SELECT 'OK' as status;").all();
        return new Response(JSON.stringify(results), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Placeholder for the main API logic
    if (url.pathname.startsWith("/api/")) {
       return new Response("API endpoint placeholder. Implement your logic here.", { status: 200 });
    }

    // Default response
    return new Response("Hello World! Worker is running.");
  },
};
