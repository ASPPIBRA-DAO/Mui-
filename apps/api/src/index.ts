export default {
  async fetch(request: Request, env: Env) {
    const db = env.DB;

    const { results } = await db.prepare(
      "SELECT name FROM governance_entities LIMIT 10"
    ).all();

    return Response.json(results);
  }
}
