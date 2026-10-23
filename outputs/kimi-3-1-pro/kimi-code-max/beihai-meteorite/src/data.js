export const DURATION = 306;

export const voiceCues = [
  { id: "v001", kind: "dialogue", speaker: "收藏者", text: "您是军人吧。现在的军人，已经不太像军人了。", delivery: "热情、随意，端着茶打量来客", start: 26.4, end: 31.4 },
  { id: "v002", kind: "dialogue", speaker: "章北海", text: "您也曾经是军人。", delivery: "平静、肯定，目光没有躲闪", start: 32.0, end: 34.5 },
  { id: "v003", kind: "dialogue", speaker: "收藏者", text: "它们来自尘世之外。每拿到一块，就像去了一个新的世界。", delivery: "眼睛发亮，像谈起真正珍爱之物", start: 37.0, end: 42.8 },
  { id: "v004", kind: "dialogue", speaker: "章北海", text: "地球本身也是一块陨石。所以，这杯茶也是。", delivery: "带一点笑意，语气温和", start: 43.5, end: 48.2 },
  { id: "v005", kind: "dialogue", speaker: "收藏者", text: "你很精明，已经开始砍价了。", delivery: "爽朗地笑着，并不介意", start: 48.5, end: 50.8 },
  { id: "v006", kind: "dialogue", speaker: "章北海", text: "不需要贵重。比重大，不易碎，能用车床加工。", delivery: "措辞准确，刻意不谈用途", start: 51.0, end: 55.7 },
  { id: "v007", kind: "dialogue", speaker: "收藏者", text: "铁陨石。这样的，三块，十八万。", delivery: "恢复了生意人的谨慎", start: 57.0, end: 60.5 },
  { id: "v008", kind: "dialogue", speaker: "章北海", text: "给个账号。现在就付。", delivery: "没有停顿，也没有讨价还价", start: 62.0, end: 64.2 },
  { id: "v009", kind: "dialogue", speaker: "收藏者", text: "其实……我是准备您还价的。", delivery: "尴尬地笑笑，声音渐低", start: 65.0, end: 68.0 },
  { id: "v010", kind: "dialogue", speaker: "章北海", text: "不，就这个价。算我对要送的人的尊重。", delivery: "郑重，最后半句几乎不可闻", start: 68.6, end: 73.0 },
  { id: "v011", kind: "broadcast", speaker: "航天广播", text: "太空电梯与可控核聚变，点燃了新的时代。但人类，才刚刚走到海岸。", delivery: "清澈、乐观的新闻播报，后半句转为克制", start: 75.0, end: 82.0 },
  { id: "v012", kind: "monologue", speaker: "章北海", text: "没有加工痕迹。足够像一场意外。", delivery: "内心低语，冷静得近乎无情", start: 150.0, end: 154.8 },
  { id: "v013", kind: "broadcast", speaker: "基地广播", text: "增援未来第一特遣队，进入冬眠前待命。", delivery: "平直的室内广播，带轻微电流质感", start: 158.8, end: 163.0 },
  { id: "v014", kind: "monologue", speaker: "章北海", text: "脚下没有大地，四周只有空间。父亲，我现在明白你了。", delivery: "缓慢、安宁，像终于抵达一个熟悉的地方", start: 181.0, end: 190.5 },
  { id: "v015", kind: "radio", speaker: "会议广播", text: "会议确认：有工质推进仍为舰队主方案。合影人员，请至三号气闸。", delivery: "正式、遥远，经无线电窄带传输", start: 194.8, end: 202.0 },
  { id: "v016", kind: "monologue", speaker: "章北海", text: "他们开启了太空时代。也正是那段历史，禁锢了他们。", delivery: "内心独白，敬重与决心并存", start: 203.0, end: 209.0 },
  { id: "v017", kind: "monologue", speaker: "章北海", text: "那条路，到不了群星。", delivery: "极轻，句尾没有犹豫", start: 211.0, end: 214.5 },
  { id: "v018", kind: "radio", speaker: "摄影师", text: "前排居中。面罩透明。后排再靠拢一点。", delivery: "隔着无线电指挥队形，语气专业而松弛", start: 216.0, end: 220.5 },
  { id: "v019", kind: "radio", speaker: "摄影师", text: "很好。保持十秒，都别动。", delivery: "看着取景器，尾音上扬", start: 223.0, end: 226.0 },
  { id: "v020", kind: "radio", speaker: "摄影师", text: "陨石雨！有人受伤！全体返回气闸！", delivery: "突然惊喊，呼吸急促，被无线电截断", start: 247.0, end: 251.5 },
  { id: "v021", kind: "radio", speaker: "站内通讯", text: "三号气闸紧急回收。医疗组待命。", delivery: "警报背景中的急促调度", start: 253.0, end: 257.0 },
  { id: "v022", kind: "monologue", speaker: "章北海", text: "他们也是无辜的。他们曾小心翼翼地，推开太空时代的门。", delivery: "内心低语，第一次出现迟疑", start: 263.5, end: 270.5 },
  { id: "v023", kind: "monologue", speaker: "章北海", text: "可要抵达群星，旧的方向必须结束。", delivery: "重新恢复冷静，并不轻松", start: 271.5, end: 276.0 },
  { id: "v024", kind: "radio", speaker: "新闻广播", text: "黄河站突发陨石雨，三名航天专家遇难。事故未造成更多伤亡。", delivery: "简短、审慎的晚间新闻", start: 278.0, end: 285.0 },
  { id: "v025", kind: "monologue", speaker: "章北海", text: "未来会如何选择，我不知道。父亲，我做了我能做的。", delivery: "疲惫、平静，最后留下长久沉默", start: 285.5, end: 292.0 },
  { id: "v026", kind: "broadcast", speaker: "冬眠系统", text: "增援未来程序确认。第一特遣队，冬眠开始。", delivery: "无感情的女性系统提示，清晰而遥远", start: 294.0, end: 299.0 }
];

const cues = [];
const add = (id, sound, start, end, gain = 1, group = "sfx", sustain = false) => {
  cues.push({ id, kind: "sound", sound, start, end, gain, group, sustain });
};

add("amb-home", "homeRoom", 14, 74, 0.34, "ambience", true);
add("clock", "clock", 15, 16, 0.25);
add("clock-2", "clock", 18, 19, 0.2);
add("tea", "ceramic", 33.7, 34.3, 0.45);
add("cabinet", "cabinet", 50.2, 51.4, 0.5);
add("phone", "phone", 63.0, 64.0, 0.34);
add("warm-score", "warmScore", 14, 83, 0.32, "music", true);
add("space-score-a", "voidScore", 0, 14, 0.4, "music", true);
add("coast-score", "voidScore", 74, 84, 0.3, "music", true);
add("shop-room", "shopRoom", 84, 122, 0.36, "ambience", true);
add("lathe", "lathe", 90, 109, 0.52, "machinery", true);
add("lathe-start", "machineStart", 89.7, 91.0, 0.55, "machinery");
for (let i = 0; i < 9; i++) add(`cut-${i}`, "cutting", 94.4 + i * 1.45, 95.25 + i * 1.45, 0.38, "machinery");
for (let i = 0; i < 6; i++) add(`segment-${i}`, "metalTick", 106 + i * 1.12, 106.35 + i * 1.12, 0.24);
add("tool-off", "toolOff", 114.2, 116.2, 0.48);
add("dust-vac", "vacuum", 116.0, 120.5, 0.32, "machinery", true);
add("basement-room", "basementRoom", 122, 158, 0.42, "ambience", true);
add("basement-score", "pulseScore", 105, 179, 0.3, "music", true);
for (let i = 0; i < 8; i++) add(`round-${i}`, "bulletClick", 123.2 + i * 0.95, 123.6 + i * 0.95, 0.3);
add("mag-in", "magazine", 136.0, 137.0, 0.6);
add("slide", "slide", 138.0, 138.45, 0.65);
for (let i = 0; i < 4; i++) {
  add(`test-shot-${i}`, "indoorGun", 140.1 + i * 0.85, 141.0 + i * 0.85, 0.82, "ballistics");
  add(`test-hit-${i}`, "meatHit", 140.18 + i * 0.85, 140.6 + i * 0.85, 0.4, "ballistics");
}
add("cloth", "cloth", 146.4, 148.2, 0.4);
add("fragments", "fragments", 149.0, 150.0, 0.32);
add("base-room", "baseRoom", 158, 179, 0.35, "ambience", true);
add("locator", "locator", 163.2, 164.0, 0.35);
add("airlock", "airlock", 169.0, 174.0, 0.58);
add("depressurize", "depressurize", 172.0, 176.5, 0.44);
add("suit-breath", "suitBreath", 174, 277, 0.42, "suit", true);
add("void-score-b", "voidScore", 179, 228.8, 0.38, "music", true);
add("radio-a", "radioSquelch", 194.2, 194.7, 0.24, "radio");
add("radio-b", "radioSquelch", 215.5, 216.0, 0.22, "radio");
add("radio-c", "radioSquelch", 222.6, 223.0, 0.2, "radio");
add("glove", "glove", 218.3, 220.0, 0.38, "suit");
add("scope-lock", "magnet", 221.0, 221.5, 0.45, "suit");
add("tension-score", "tensionScore", 218, 263, 0.36, "music", true);

const volleys = [
  { start: 229.1, target: 0 },
  { start: 231.6, target: 1 },
  { start: 234.1, target: 2 },
];
for (const volley of volleys) {
  for (let i = 0; i < 10; i++) {
    const t = volley.start + i * 0.24;
    add(`space-shot-${volley.target}-${i}`, "suitShot", t, t + 0.24, 0.46, "suit");
  }
}
add("reload-1", "spaceReload", 231.36, 231.58, 0.42, "suit");
add("reload-2", "spaceReload", 233.86, 234.08, 0.42, "suit");
add("bullet-flight", "bulletSubject", 236.5, 246.4, 0.22, "suit", true);
add("radio-alarm", "radioAlarm", 247.0, 258.0, 0.25, "radio", true);
add("radio-panic", "radioSquelch", 246.7, 247.1, 0.3, "radio");
add("thrusters-return", "suitThruster", 251.8, 261.5, 0.32, "suit", true);
add("thrusters-zhang", "suitThruster", 263.0, 272.0, 0.3, "suit", true);
add("return-score", "returnScore", 263, 306, 0.34, "music", true);
add("base-room-return", "baseRoom", 277, 289, 0.3, "ambience", true);
add("locator-return", "locator", 278.0, 278.6, 0.3);
add("chamber-room", "chamberRoom", 289, 306, 0.32, "ambience", true);
add("pod-seal", "podSeal", 295.0, 298.5, 0.44);
add("cold-fade", "coldFade", 298.0, 306.0, 0.3, "ambience", true);
add("opening-shot", "suitShot", 11.7, 12.0, 0.42, "suit");

export const soundCues = cues;
export const volleyTimes = volleys.flatMap(({ start, target }) =>
  Array.from({ length: 10 }, (_, i) => ({ time: start + i * 0.24, target })),
);
export const impactTimes = [241.26, 243.76, 246.26];
