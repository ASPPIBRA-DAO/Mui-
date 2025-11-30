async function uploadAsset(env: Env, key: string, data: ArrayBuffer) {
  await env.ASSETS.put(key, data);
}


async function getAsset(env: Env, key: string) {
  const object = await env.ASSETS.get(key);
  return object ? await object.arrayBuffer() : null;
}
