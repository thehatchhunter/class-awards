import { getStore } from "@edgeone/pages-blob";
import { createHash } from "node:crypto";

export const store = getStore({ name: "class-awards", consistency: "strong" });
export const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
});
export const hashVoter = (value) => createHash("sha256").update(value).digest("hex");
export async function readConfig() {
  return await store.get("config", { type: "json", consistency: "strong" });
}
export async function ballotKeys() {
  const { blobs } = await store.list({ prefix: "ballots/", consistency: "strong" });
  return blobs.map((item) => item.key);
}
export function validVoterId(value) {
  return typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value);
}
