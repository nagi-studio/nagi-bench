import { voiceCues, soundCues, FIRE_TIMES, IMPACT_TIME } from "../src/cues";

const DURATION = 348;
const errors: string[] = [];

const seenVoice = new Set<string>();
for (const c of voiceCues) {
  for (const [k, v] of Object.entries({ id: c.id, kind: c.kind, speaker: c.speaker, text: c.text, delivery: c.delivery })) {
    if (typeof v !== "string" || !v.trim()) errors.push(`voice ${c.id}: ${k} empty`);
  }
  if (seenVoice.has(c.id)) errors.push(`voice dup id ${c.id}`);
  seenVoice.add(c.id);
  if (!(c.start >= 0 && c.end > c.start && c.end <= DURATION)) errors.push(`voice ${c.id}: bad range ${c.start}-${c.end}`);
}

const seenSound = new Set<string>();
for (const c of soundCues) {
  if (seenSound.has(c.id)) errors.push(`sound dup id ${c.id}`);
  seenSound.add(c.id);
  if (!(c.start >= 0 && c.end > c.start && c.end <= DURATION)) errors.push(`sound ${c.id}: bad range ${c.start}-${c.end}`);
}

for (let i = 0; i < FIRE_TIMES.length; i += 1) {
  const t = FIRE_TIMES[i]!;
  if (!(t >= 0 && t <= DURATION)) errors.push(`fire time ${i} out of range`);
  if (i > 0 && t <= FIRE_TIMES[i - 1]!) errors.push(`fire times not monotonic at ${i}`);
}
if (FIRE_TIMES.length !== 30) errors.push(`expected 30 fire times, got ${FIRE_TIMES.length}`);
if (!(IMPACT_TIME > FIRE_TIMES[29]! && IMPACT_TIME <= DURATION)) errors.push(`impact time ordering wrong`);

// 所有语音 cue 必须覆盖在对应的镜头时间窗内（粗校验）。
const shotBounds: Array<[string, number, number]> = [
  ["s_title", 0, 12], ["s_shop_entry", 12, 30], ["s_shop_martian", 30, 52], ["s_shop_deal", 52, 86],
  ["s_elevator", 86, 104], ["s_office", 104, 132], ["s_workshop", 132, 158], ["s_basement_make", 158, 178],
  ["s_basement_test", 178, 198], ["s_space_depart", 198, 222], ["s_space_wait", 222, 252], ["s_space_aim", 252, 278],
  ["s_space_fire", 278, 298], ["s_space_impact", 298, 318], ["s_space_return", 318, 334], ["s_coda", 334, 348],
];
for (let i = 1; i < shotBounds.length; i += 1) {
  if (shotBounds[i]![1] !== shotBounds[i - 1]![2]) errors.push(`gap between shots at ${shotBounds[i - 1]![0]} / ${shotBounds[i]![0]}`);
}
if (shotBounds[0]![1] !== 0) errors.push("first shot must start at 0");
if (shotBounds[shotBounds.length - 1]![2] !== DURATION) errors.push("last shot must end at duration");

if (errors.length) {
  console.error("SMOKE TEST FAILED:");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
console.log(`SMOKE TEST OK: ${voiceCues.length} voice cues, ${soundCues.length} sound cues, ${FIRE_TIMES.length} shots.`);
