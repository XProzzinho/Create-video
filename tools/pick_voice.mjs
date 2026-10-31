// Lista as vozes HeyGen (starfish) e escolhe uma voz masculina em português.
import { writeFileSync } from "node:fs";
import { heygenAuthHeaders, heygenJSON } from "../.agents/skills/media-use/audio/scripts/lib/heygen.mjs";
const all = [];
for (const q of ["&language=Portuguese", "&language=pt", ""]) {
  try {
    const p = await heygenJSON(`/voices?engine=starfish&type=public&limit=100${q}`, { headers: heygenAuthHeaders() });
    for (const v of p.data ?? p.voices ?? []) if (!all.find((a) => a.voice_id === v.voice_id)) all.push(v);
  } catch (e) { console.error("lista falhou", q, e.message); }
}
writeFileSync("out/voices.json", JSON.stringify(all, null, 2));
const pt = all.filter((v) => /portug|pt/i.test(`${v.language ?? ""} ${v.locale ?? ""}`));
const male = pt.filter((v) => /^m/i.test(String(v.gender ?? "")));
const want = process.env.VOICE || (male[0] ?? pt[0] ?? all.find((v) => /^m/i.test(String(v.gender ?? ""))) ?? all[0])?.voice_id;
console.log(want || "");
