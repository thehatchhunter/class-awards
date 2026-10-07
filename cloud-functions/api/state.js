import { store, json, readConfig, ballotKeys, hashVoter, validVoterId } from "./_shared.js";

export async function onRequestGet({ request }) {
  try {
    const data = await readConfig();
    if (!data) return json({ configured: false });
    const totals = data.cats.map(() => Object.fromEntries(data.names.map((name) => [name, 0])));
    const keys = await ballotKeys();
    for (const key of keys) {
      const ballot = await store.get(key, { type: "json", consistency: "strong" });
      if (!ballot?.votes) continue;
      ballot.votes.forEach((name, index) => {
        if (totals[index] && Object.hasOwn(totals[index], name)) totals[index][name]++;
      });
    }
    const url = new URL(request.url);
    const voterId = url.searchParams.get("voterId");
    let alreadyVoted = false;
    if (validVoterId(voterId)) {
      alreadyVoted = Boolean(await store.get(`ballots/${hashVoter(voterId)}`, { consistency: "strong" }));
    }
    return json({ configured: true, data, totals, totalVotes: keys.length, alreadyVoted });
  } catch (error) {
    return json({ error: "Die Abstimmung ist gerade nicht erreichbar." }, 500);
  }
}
