import { Hono } from "hono";

const app = new Hono();

// TESTE R2 -----------------------------------------
app.get("/r2/test", async (c) => {
  const r2 = c.env.R2;

  // Write
  await r2.put("tests/hello.txt", "R2 is working ✔");

  // Read
  const file = await r2.get("tests/hello.txt");
  const text = await file.text();

  return c.json({ ok: true, text });
});

// UPLOAD (qualquer arquivo) -------------------------
app.post("/upload", async (c) => {
  const blob = await c.req.blob();
  const ext = blob.type.split("/")[1] || "bin";
  const key = `uploads/${crypto.randomUUID()}.${ext}`;

  await c.env.R2.put(key, blob);

  return c.json({
    uploaded: true,
    key,
    url: `${c.env.ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`
  });
});

// DOWNLOAD ------------------------------------------
app.get("/file/:key", async (c) => {
  const key = c.req.param("key");
  const file = await c.env.R2.get(key);

  if (!file) return c.text("Arquivo não encontrado", 404);

  return new Response(file.body, {
    headers: { "Content-Type": file.httpMetadata?.contentType || "application/octet-stream" }
  });
});

// DELETE --------------------------------------------
app.delete("/file/:key", async (c) => {
  await c.env.R2.delete(c.req.param("key"));
  return c.json({ deleted: true });
});

export default app;
