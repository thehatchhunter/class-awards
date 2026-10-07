import { store, json, readConfig, hashVoter, validVoterId } from "./_shared.js";

export async function onRequestPost({ request }) {
  try {
    const { voterId, votes } = await request.json();
    const data = await readConfig();
    if (!data) return json({ error: "Die Gala wurde noch nicht eingerichtet." }, 409);
    if (!validVoterId(voterId) || !Array.isArray(votes) || votes.length !== data.cats.length ||
        votes.some((name) => typeof name !== "string" || !data.names.includes(name))) {
      return json({ error: "Bitte wähle für jeden Award eine gültige Person." }, 400);
    }
    const key = `ballots/${hashVoter(voterId)}`;
    const prior = await store.get(key, { type: "json", consistency: "strong" });
    if (prior) return json({ error: "Von diesem Gerät wurde bereits abgestimmt." }, 409);
    await store.setJSON(key, { votes, submittedAt: new Date().toISOString() }, { onlyIfNew: true });
    const saved = await store.get(key, { type: "json", consistency: "strong" });
    if (!saved || JSON.stringify(saved.votes) !== JSON.stringify(votes)) {
      return json({ error: "Von diesem Gerät wurde bereits abgestimmt." }, 409);
    }
    return json({ ok: true });
  } catch (error) {
    return json({ error: "Deine Stimme konnte nicht gespeichert werden. Bitte versuche es erneut." }, 500);
  }
}
