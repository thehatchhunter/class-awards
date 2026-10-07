import { store, json, readConfig, ballotKeys } from "./_shared.js";

export async function onRequestPost({ request, env }) {
  try {
    const expected = env?.ADMIN_PIN;
    const supplied = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!expected || !supplied || supplied !== expected) return json({ error: "Admin-Code stimmt nicht." }, 403);
    const data = await request.json();
    const className = String(data.className || "").trim().slice(0, 60);
    const names = Array.isArray(data.names) ? [...new Set(data.names.map((x) => String(x).trim()).filter(Boolean))] : [];
    const cats = Array.isArray(data.cats) ? data.cats.map((x) => String(x).trim()).filter(Boolean) : [];
    if (!className || names.length < 2 || names.length > 300 || cats.length < 1 || cats.length > 100) {
      return json({ error: "Bitte gib einen Klassennamen, mindestens zwei Personen und Awards ein." }, 400);
    }
    if (cats.some((cat) => cat.length > 120) || names.some((name) => name.length > 80)) {
      return json({ error: "Ein Name oder Award ist zu lang." }, 400);
    }
    if ((await ballotKeys()).length) return json({ error: "Es gibt bereits Stimmen. Setze die Abstimmung erst zurück, bevor du die Liste änderst." }, 409);
    await store.setJSON("config", { className, names, cats });
    return json({ ok: true });
  } catch (error) {
    return json({ error: "Die Einstellungen konnten nicht gespeichert werden." }, 500);
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const expected = env?.ADMIN_PIN;
    const supplied = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!expected || !supplied || supplied !== expected) return json({ error: "Admin-Code stimmt nicht." }, 403);
    for (const key of await ballotKeys()) await store.delete(key);
    return json({ ok: true });
  } catch (error) {
    return json({ error: "Stimmen konnten nicht zurückgesetzt werden." }, 500);
  }
}
