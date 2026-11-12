import type { SoundCue, VoiceCue } from "@agentbench/cinematic-player";

export const DURATION = 348;

/**
 * 全部待配音内容的唯一清单。字幕直接由此驱动；后期按 id 逐条替换为配音。
 */
export const voiceCues: VoiceCue[] = [
  // ── 冷开场：闪前 ──
  { id: "v01", kind: "monologue", speaker: "章北海", text: "如果那一刻，有人朝这边看——", delivery: "内心独白，极低、平稳，几乎是耳语，贴着呼吸声", start: 7.6, end: 10.6 },
  { id: "v02", kind: "monologue", speaker: "章北海", text: "他只会看见一只萤火虫。", delivery: "内心独白，同上，句尾不收，留给沉默", start: 10.9, end: 14.2 },

  // ── 胡同 · 收藏者的家 ──
  { id: "v03", kind: "monologue", speaker: "章北海", text: "总有些幸运的人，守着自己钟爱的小世界。", delivery: "内心独白，温和，带一点羡慕", start: 37.0, end: 41.2 },
  { id: "v04", kind: "monologue", speaker: "章北海", text: "不管外面的大世界怎么变。这让我觉得踏实。", delivery: "内心独白，放慢，像在给自己找一个理由", start: 41.6, end: 46.6 },
  { id: "v05", kind: "dialogue", speaker: "收藏者", text: "您是军人吧。", delivery: "端茶时随口一问，北京口音，笑眯眯", start: 49.2, end: 51.8 },
  { id: "v06", kind: "dialogue", speaker: "收藏者", text: "现在的军人不太像军人了，可您，我一眼就看得出来。", delivery: "热络、自信，带点老兵的得意", start: 52.2, end: 57.6 },
  { id: "v07", kind: "dialogue", speaker: "章北海", text: "您也当过兵。", delivery: "平静，微笑，一语点破", start: 58.2, end: 60.6 },
  { id: "v08", kind: "dialogue", speaker: "收藏者", text: "好眼力！大半辈子都在总参测绘局。", delivery: "一拍大腿似的爽朗", start: 61.0, end: 64.8 },
  { id: "v09", kind: "dialogue", speaker: "收藏者", text: "这些石头来自尘世之外。每拿到一块，我就像去了一个新的外星世界。", delivery: "压低声音，像分享秘密，眼里有光", start: 65.4, end: 71.8 },
  { id: "v10", kind: "dialogue", speaker: "章北海", text: "地球本来就是星际物质聚成的。咱们脚下的石头，都是陨石。", delivery: "轻松的抬杠语气，带笑", start: 72.4, end: 77.6 },
  { id: "v11", kind: "dialogue", speaker: "章北海", text: "听说水是彗星带来的——这杯茶，也是陨石。", delivery: "举杯，半开玩笑", start: 78.0, end: 82.0 },
  { id: "v12", kind: "dialogue", speaker: "收藏者", text: "呵呵呵……你很精明，这就开始砍价了。", delivery: "笑出声，用手指点着对方", start: 82.5, end: 86.6 },
  { id: "v13", kind: "dialogue", speaker: "章北海", text: "不用太贵重。比重要大，受冲击不易碎，最好能上车床加工。", delivery: "收起笑意，语速平稳，像在报一张技术单", start: 87.2, end: 93.0 },
  { id: "v14", kind: "dialogue", speaker: "收藏者", text: "要雕刻是吧？那就是铁陨石了。", delivery: "了然，转身去开柜子", start: 93.5, end: 96.8 },
  { id: "v15", kind: "dialogue", speaker: "收藏者", text: "铁镍为主，每立方厘米八克多。瞧这交错的条纹——地球上可没有。", delivery: "如数家珍，手指在石面上比划", start: 97.3, end: 103.2 },
  { id: "v16", kind: "dialogue", speaker: "章北海", text: "这样大小的，要三块。", delivery: "干脆，不带情绪", start: 103.6, end: 106.0 },
  { id: "v17", kind: "dialogue", speaker: "收藏者", text: "每块六万，三块十八万……您看怎么样？", delivery: "试探，故意停顿，等着对方还价", start: 106.6, end: 111.0 },
  { id: "v18", kind: "dialogue", speaker: "章北海", text: "给个账号吧，我现在就付。", delivery: "立刻、平淡，像在说一件小事", start: 111.6, end: 114.8 },
  { id: "v19", kind: "dialogue", speaker: "收藏者", text: "呵呵……其实，我是准备让您还价的。", delivery: "尴尬地笑，挠头，声音变小", start: 118.0, end: 121.8 },
  { id: "v20", kind: "dialogue", speaker: "章北海", text: "不，就这个价。", delivery: "坚决地打断，声音不高", start: 122.4, end: 124.6 },
  { id: "v21", kind: "dialogue", speaker: "章北海", text: "就算是，表示我对要送的人的尊重吧。", delivery: "很慢，很轻，目光落在陨石上；这句是整部片子的暗钉", start: 125.2, end: 130.8 },

  // ── 同步轨道 ──
  { id: "v22", kind: "broadcast", speaker: "黄河站广播", text: "航天系统工作会议已结束。请全体与会人员到三号出口集合，准备合影。", delivery: "女声，标准播音腔，经无线电公共频道传入头盔，略带失真", start: 203.4, end: 209.8 },
  { id: "v23", kind: "monologue", speaker: "章北海", text: "定位单元留在了基地的舱室里。今天，没有人知道我出来过。", delivery: "内心独白，冷静，陈述事实", start: 210.6, end: 216.4 },
  { id: "v24", kind: "monologue", speaker: "章北海", text: "生命维持只够十二个小时。一号基地，只是远处的一个点。", delivery: "内心独白，平静，呼吸声之间", start: 219.6, end: 225.6 },
  { id: "v25", kind: "monologue", speaker: "章北海", text: "脚下没有大地。不从哪里来，也不往哪里去。只是存在着。", delivery: "内心独白，几乎是享受，语速很慢", start: 227.0, end: 233.8 },
  { id: "v26", kind: "monologue", speaker: "章北海", text: "父亲……你那里，也是这样吗？", delivery: "内心独白，声音第一次松动，停顿很长", start: 235.4, end: 240.6 },
  { id: "v27", kind: "radio", speaker: "摄影师", text: "慢一点，大家慢一点。领导们前排居中，后排往中间靠。", delivery: "公共频道，忙碌而愉快，背景有别人的笑声", start: 249.2, end: 254.6 },
  { id: "v28", kind: "radio", speaker: "摄影师", text: "面罩调透明——等推进器的白雾散一散。", delivery: "公共频道，耐心地指挥", start: 255.2, end: 259.4 },
  { id: "v29", kind: "radio", speaker: "与会者", text: "这夕阳，真值了。", delivery: "公共频道里一句闲聊，感叹，轻笑", start: 260.0, end: 262.2 },
  { id: "v30", kind: "radio", speaker: "摄影师", text: "好，都别动……保持住——", delivery: "公共频道，拖长音，全神贯注", start: 289.0, end: 292.4 },
  { id: "v31", kind: "monologue", speaker: "章北海", text: "他们也是无辜的。是他们小心翼翼地，开启了太空时代的黎明。", delivery: "内心独白，承认，但不动摇", start: 292.8, end: 298.0 },
  { id: "v32", kind: "monologue", speaker: "章北海", text: "可也正是那段经历，禁锢了他们。", delivery: "内心独白，冷下来，一字一顿", start: 298.4, end: 301.4 },
  { id: "v33", kind: "scene", speaker: "合影者（口型）", text: "陨石雨！", delivery: "无声的嘶喊——真空中听不见，只靠口型；配音可做极远、极闷的处理", start: 304.0, end: 306.4 },
  { id: "v34", kind: "broadcast", speaker: "黄河站广播", text: "警报！三号出口遭遇微陨石流，全体舱外人员立即返回！", delivery: "急促、重复感，警报声压在下面，频道削波失真", start: 306.8, end: 311.6 },
  { id: "v35", kind: "monologue", speaker: "章北海", text: "三个人的死，保证不了什么。但我做了我能做的。", delivery: "内心独白，寒冷而平静", start: 315.2, end: 320.6 },
  { id: "v36", kind: "monologue", speaker: "章北海", text: "在父亲的目光里，我可以安心了。", delivery: "内心独白，极轻，像一口长长的呼气", start: 325.0, end: 330.0 },
];

// ── 声音 ──
let n = 0;
const s = (sound: string, start: number, end: number, gain = 1, sustain = false, group = "sfx"): SoundCue => ({
  id: `sfx-${String(++n).padStart(3, "0")}-${sound}`,
  kind: "sound",
  sound,
  group,
  gain,
  sustain,
  start,
  end,
});

export const SHOT_TIMES: number[] = [];
for (let i = 0; i < 10; i++) SHOT_TIMES.push(277.0 + i * 0.26);
for (let i = 0; i < 10; i++) SHOT_TIMES.push(280.9 + i * 0.26);
for (let i = 0; i < 10; i++) SHOT_TIMES.push(284.8 + i * 0.26);

export const ROOM_SHOTS = [181.0, 181.7, 182.4, 183.1];

export const soundCues: SoundCue[] = [
  // 冷开场
  s("suit-fan", 0, 15, 0.5, true, "amb"),
  s("breath-calm", 0, 15, 0.7, true, "amb"),
  s("vac-thump", 6.2, 6.7, 0.6),
  s("vac-thump", 6.6, 7.1, 0.6),
  s("vac-thump", 7.0, 7.5, 0.6),
  s("title-boom", 15.1, 21, 0.9),
  // 胡同
  s("hutong", 21, 33.4, 0.8, true, "amb"),
  s("door-creak", 30.2, 32, 0.5),
  s("room", 33, 132, 0.7, true, "amb"),
  s("pad-house", 33, 118, 0.45, true, "music"),
  s("tea-pour", 47.6, 49.6, 0.6),
  s("cup", 50.0, 50.6, 0.6),
  s("cup", 81.6, 82.2, 0.4),
  s("glass-door", 93.8, 95.0, 0.6),
  s("stone", 96.0, 96.6, 0.7),
  s("stone", 104.2, 104.8, 0.7),
  s("stone", 105.0, 105.6, 0.6),
  s("stone", 105.7, 106.3, 0.6),
  s("pay", 115.4, 116.4, 0.5),
  s("pad-dread", 121.5, 134, 0.6, true, "music"),
  // 车间
  s("hall", 132, 158, 0.7, true, "amb"),
  s("lathe", 136.5, 151.5, 0.55, true),
  s("cnc-beep", 136.2, 136.6, 0.4),
  s("cnc-beep", 151.2, 151.8, 0.4),
  s("clink", 153.2, 153.6, 0.5),
  s("clink", 154.0, 154.4, 0.4),
  s("switch", 156.6, 157.0, 0.6),
  // 地下室
  s("bulb", 158, 200, 0.6, true, "amb"),
  s("pliers", 159.6, 160.2, 0.6),
  s("pliers", 160.9, 161.5, 0.6),
  s("pliers", 162.2, 162.8, 0.6),
  s("pliers", 163.5, 164.1, 0.6),
  s("glue", 166.6, 168.2, 0.4),
  s("clink", 168.6, 169.0, 0.4),
  s("clink", 170.4, 170.8, 0.4),
  s("magload", 173.9, 174.3, 0.6),
  s("magload", 174.6, 175.0, 0.6),
  s("magload", 175.3, 175.7, 0.6),
  s("magload", 176.0, 176.4, 0.6),
  s("maginsert", 177.4, 177.9, 0.7),
  s("slide", 178.3, 178.9, 0.7),
  ...ROOM_SHOTS.map((t) => s("gun-room", t, t + 2.4, 1.0)),
  s("tinnitus", 183.3, 192, 0.35),
  s("knife", 187.4, 188.6, 0.6),
  s("fragments", 190.4, 191.4, 0.6),
  s("case", 196.0, 196.6, 0.6),
  s("switch", 199.2, 199.6, 0.6),
  // 太空
  s("suit-fan", 200, 336, 0.5, true, "amb"),
  s("breath-calm", 200, 262, 0.7, true, "amb"),
  s("breath-tense", 262, 300, 0.75, true, "amb"),
  s("breath-held", 300, 312, 0.7, true, "amb"),
  s("breath-calm", 312, 336, 0.6, true, "amb"),
  s("pad-space", 200, 262, 0.5, true, "music"),
  s("radio-bed", 203.2, 210.0, 0.5),
  s("radio-bed", 249.0, 262.4, 0.45),
  s("radio-bed", 288.8, 292.6, 0.45),
  s("radio-bed", 306.6, 311.9, 0.55),
  s("radio-alarm", 306.6, 311.9, 0.45),
  s("hatch-light", 246.0, 246.6, 0.3),
  s("ring", 264.4, 265.2, 0.7),
  s("seal-hiss", 265.0, 266.4, 0.45),
  s("holster", 267.8, 268.5, 0.6),
  s("magnet", 270.9, 271.4, 0.8),
  s("maginsert-vac", 272.9, 273.4, 0.7),
  ...SHOT_TIMES.map((t) => s("vac-thump", t, t + 0.5, 0.85)),
  s("reload-vac", 279.7, 280.5, 0.7),
  s("reload-vac", 283.6, 284.4, 0.7),
  s("heart", 287.6, 304, 0.75, true),
  s("hit-sting", 302.0, 308, 0.5),
  s("thruster", 316.0, 327, 0.5, true),
  s("pad-end", 318, 348, 0.55, true, "music"),
];
