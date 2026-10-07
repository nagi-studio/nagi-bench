import type { SoundCue, VoiceCue } from "@agentbench/cinematic-player";

/** Total running time of the film in seconds, title and end card included. */
export const DURATION = 312;

/**
 * The complete speech manifest. Every line is a subtitle only; no voice is synthesised.
 * Lines are cued to the shot they belong to and do not overlap one another.
 */
export const voiceCues: VoiceCue[] = [
  { id: "voice-001", kind: "narration", speaker: "旁白", text: "这里是老宅，一座小小的地质博物馆。", delivery: "低声，带一点旧时光的怀念", start: 9.0, end: 12.8 },
  { id: "voice-002", kind: "monologue", speaker: "章北海（内心）", text: "大多数人仍然守着自己的生活。在同志们为人类的生存而战时，这让他心里踏实。", delivery: "内敛，语速慢，句尾下沉", start: 14.0, end: 19.5 },
  { id: "voice-003", kind: "dialogue", speaker: "收藏者", text: "您是军人吧。", delivery: "热情、带着一点得意", start: 31.0, end: 32.8 },
  { id: "voice-004", kind: "dialogue", speaker: "收藏者", text: "现在的军人已经不太像军人了，但您我一眼就能看出来。", delivery: "感慨，语气轻快", start: 33.4, end: 37.0 },
  { id: "voice-005", kind: "dialogue", speaker: "章北海", text: "您也曾经是军人。", delivery: "平静，像是确认一件事", start: 37.6, end: 39.2 },
  { id: "voice-006", kind: "dialogue", speaker: "收藏者", text: "好眼力，我大半辈子都在测绘局服役。", delivery: "爽朗，略带自豪", start: 39.8, end: 42.6 },
  { id: "voice-007", kind: "dialogue", speaker: "章北海", text: "怎么会对陨石感兴趣呢？", delivery: "客气，带着好奇", start: 43.2, end: 45.0 },
  { id: "voice-008", kind: "dialogue", speaker: "收藏者", text: "十多年前，我随考察队穿越南极大陆，就是在雪下面找陨石，从那时就迷上了。", delivery: "回忆，语速渐慢", start: 45.6, end: 50.2 },
  { id: "voice-009", kind: "dialogue", speaker: "章北海", text: "地球本身就是星际物质汇聚形成的，我手里的茶杯也是陨石。您这些东西，应该是不稀罕的。", delivery: "打趣，笑意明显", start: 50.8, end: 56.4 },
  { id: "voice-010", kind: "dialogue", speaker: "收藏者", text: "呵呵，你很精明，已经开始砍价了。", delivery: "笑着指点，并不较真", start: 56.9, end: 58.9 },
  { id: "voice-011", kind: "dialogue", speaker: "章北海", text: "不需要很贵重的，要比重大，冲击下不易破碎，易加工。", delivery: "干脆，像在报技术参数", start: 59.5, end: 62.6 },
  { id: "voice-012", kind: "dialogue", speaker: "收藏者", text: "那就是铁陨石了。这三块成色都很好。", delivery: "专业，有些得意", start: 63.2, end: 65.4 },
  { id: "voice-013", kind: "dialogue", speaker: "收藏者", text: "国际市场上每克二十美元，这样吧，每块六万，三块十八万，怎么样？", delivery: "报价时略带试探", start: 66.0, end: 70.6 },
  { id: "voice-014", kind: "dialogue", speaker: "章北海", text: "给个账号吧，我现在就付款。", delivery: "果断，没有犹豫", start: 71.2, end: 73.4 },
  { id: "voice-015", kind: "dialogue", speaker: "收藏者", text: "其实，我是准备你还价的。", delivery: "尴尬地笑着", start: 74.0, end: 76.2 },
  { id: "voice-016", kind: "dialogue", speaker: "章北海", text: "不，我接受。", delivery: "平稳，语气坚定", start: 76.8, end: 78.0 },
  { id: "voice-017", kind: "dialogue", speaker: "收藏者", text: "你看，现在太空航行平民化了，价格毕竟跌了些，这些嘛，也就值……", delivery: "欲言又止，想再压一压价", start: 78.3, end: 82.3 },
  { id: "voice-018", kind: "dialogue", speaker: "章北海", text: "不，就这个价。就算表示我对要送的人的尊重吧。", delivery: "打断对方，语气郑重", start: 82.6, end: 87.4 },
  { id: "voice-019", kind: "narration", speaker: "旁白", text: "三块铁陨石，被切成三十六段，每段一支铅笔粗细。", delivery: "冷静，像在念工艺记录", start: 94.0, end: 98.5 },
  { id: "voice-020", kind: "narration", speaker: "旁白", text: "两年前全军换装的制式枪支用无壳子弹，弹头直接粘在发射药上，取下来很容易。", delivery: "平实，略带技术感", start: 108.0, end: 113.5 },
  { id: "voice-021", kind: "narration", speaker: "旁白", text: "四段陨石在牛肉里都碎成了细末，这正是他想要的结果。", delivery: "满意，一字一顿", start: 120.5, end: 125.5 },
  { id: "voice-022", kind: "narration", speaker: "旁白", text: "太空电梯建成了，可控核聚变也有了突破。但冷静的领导者们知道，人类只是拿着工具刚刚来到海岸边。", delivery: "宏观，语调沉稳", start: 131.0, end: 138.0 },
  { id: "voice-023", kind: "narration", speaker: "旁白", text: "增援未来计划，第一批特遣队由章北海指挥。", delivery: "平稳，像在交代背景", start: 139.0, end: 142.5 },
  { id: "voice-024", kind: "narration", speaker: "旁白", text: "他把航天服上的定位单元留在了一号基地的舱室里，监测系统不会知道他离开过。", delivery: "低沉，句子之间留出停顿", start: 146.0, end: 152.5 },
  { id: "voice-025", kind: "monologue", speaker: "章北海（内心）", text: "没有从哪里来，也不想到哪里去，只是存在着。", delivery: "极轻，像是在对自己说", start: 170.0, end: 175.5 },
  { id: "voice-026", kind: "narration", speaker: "旁白", text: "他想，父亲在天之灵，大概也是这样看着地球的。", delivery: "温和，带一点哽咽", start: 179.0, end: 184.5 },
  { id: "voice-027", kind: "radio", speaker: "黄河站调度", text: "合影开始，前排中间三位同志就位。", delivery: "通讯音质，语速平稳", start: 191.5, end: 194.5 },
  { id: "voice-028", kind: "narration", speaker: "旁白", text: "黄河站的合影选在日落的时刻，阳光照亮身后的空间站。", delivery: "平静，像在看着一幅画", start: 197.0, end: 202.0 },
  { id: "voice-029", kind: "monologue", speaker: "章北海（内心）", text: "无辜？他们也曾经是无辜的。可正是那段经历，禁锢了他们的思想。", delivery: "压低，咬字清楚", start: 207.5, end: 212.0 },
  { id: "voice-030", kind: "radio", speaker: "合影人员", text: "陨石雨！", delivery: "惊叫，通过通讯传出，音调发紧", start: 216.0, end: 217.6 },
  { id: "voice-031", kind: "radio", speaker: "黄河站调度", text: "全体回站，封闭出口。", delivery: "急促，尽量保持镇定", start: 223.0, end: 225.6 },
  { id: "voice-032", kind: "radio", speaker: "黄河站调度", text: "五名同志中弹，立即转运。", delivery: "急促，压着声音", start: 241.0, end: 244.5 },
  { id: "voice-033", kind: "radio", speaker: "合影人员", text: "快！把他拖回去！", delivery: "喘息，带着哭腔", start: 246.0, end: 248.5 },
  { id: "voice-034", kind: "narration", speaker: "旁白", text: "章北海注意到，那五名中弹者，是被别人拖回去的。", delivery: "冷，只陈述事实", start: 252.0, end: 257.0 },
  { id: "voice-035", kind: "narration", speaker: "旁白", text: "航天界那三个关键人物的死，并不能保证无工质辐射推进飞船成为主要研究方向。", delivery: "缓慢，每个字都很重", start: 266.0, end: 273.5 },
  { id: "voice-036", kind: "narration", speaker: "旁白", text: "但他做了自己能做的。", delivery: "极轻，像松了一口气", start: 276.5, end: 279.5 },
  { id: "voice-037", kind: "monologue", speaker: "章北海（内心）", text: "不管以后发生什么，在父亲从冥冥中投下的目光中，他可以安心了。", delivery: "平静，尾音放空", start: 283.5, end: 292.0 },
];

/** Shot-free sound design: sample and procedural cues on the same absolute timeline. */
const footsteps: SoundCue[] = Array.from({ length: 24 }, (_, index) => {
  const start = 9.0 + index * 0.62;
  return {
    id: `sfx-step-${String(index + 1).padStart(2, "0")}`,
    kind: "sound",
    sound: ["step-a", "step-b", "step-c"][index % 3],
    group: "sfx",
    gain: 0.45,
    start,
    end: start + 0.4,
  };
});

const shotThumps: SoundCue[] = [
  ...Array.from({ length: 10 }, (_, index) => 209.0 + index * 0.4),
  ...Array.from({ length: 10 }, (_, index) => 214.5 + index * 0.4),
  ...Array.from({ length: 10 }, (_, index) => 219.5 + index * 0.4),
].map((start, index) => ({
  id: `sfx-shot-${String(index + 1).padStart(2, "0")}`,
  kind: "sound",
  sound: "suit-thump",
  group: "suit",
  gain: 0.5,
  start,
  end: start + 0.6,
}));

const cutHits: SoundCue[] = Array.from({ length: 22 }, (_, index) => {
  const start = 94.0 + index * 0.45;
  return {
    id: `sfx-cut-${String(index + 1).padStart(2, "0")}`,
    kind: "sound",
    sound: index % 2 === 0 ? "metal-cut-a" : "metal-cut-b",
    group: "sfx",
    gain: 0.35,
    start,
    end: start + 0.4,
  };
});

const pelletClatter: SoundCue[] = Array.from({ length: 12 }, (_, index) => {
  const start = 97.0 + index * 0.6;
  return { id: `sfx-pellet-${String(index + 1).padStart(2, "0")}`, kind: "sound", sound: "pellet", group: "sfx", gain: 0.3, start, end: start + 0.4 };
});

const gunshots: SoundCue[] = [117.0, 117.5, 118.0, 118.5, 119.0].flatMap((start, index) => [
  { id: `sfx-gun-body-${index + 1}`, kind: "sound", sound: "shot-body", group: "sfx", gain: 0.8, start, end: start + 1.2 },
  { id: `sfx-gun-crack-${index + 1}`, kind: "sound", sound: "gun-crack", group: "sfx", gain: 0.9, start, end: start + 1.6 },
  { id: `sfx-bundle-${index + 1}`, kind: "sound", sound: "bundle-hit", group: "sfx", gain: 0.5, start: start + 0.04, end: start + 0.6 },
] as SoundCue[]);

export const soundCues: SoundCue[] = [
  // Title and hutong.
  { id: "sfx-title-bell", kind: "sound", sound: "bell-title", group: "sfx", gain: 0.6, start: 0.4, end: 4.4 },
  { id: "amb-night", kind: "sound", sound: "amb-night", group: "amb", gain: 0.7, sustain: true, start: 7.0, end: 30.0 },
  ...footsteps,
  { id: "sfx-gate-open", kind: "sound", sound: "door-open", group: "sfx", gain: 0.7, start: 26.8, end: 28.0 },
  { id: "sfx-gate-close", kind: "sound", sound: "door-close", group: "sfx", gain: 0.7, start: 29.0, end: 30.0 },

  // Collector room.
  { id: "amb-room", kind: "sound", sound: "room-warm", group: "amb", gain: 0.6, sustain: true, start: 30.0, end: 92.0 },
  { id: "sfx-tray-set", kind: "sound", sound: "glass-tap", group: "sfx", gain: 0.5, start: 68.0, end: 68.6 },
  { id: "sfx-stone-tap", kind: "sound", sound: "stone-tap", group: "sfx", gain: 0.5, start: 63.0, end: 63.6 },
  { id: "sfx-tray-metal", kind: "sound", sound: "metal-thud", group: "sfx", gain: 0.45, start: 80.6, end: 81.2 },

  // Lathe room.
  { id: "amb-lathe", kind: "sound", sound: "lathe-spindle", group: "amb", gain: 0.35, sustain: true, start: 92.0, end: 106.0 },
  ...cutHits,
  ...pelletClatter,

  // Underground room.
  { id: "amb-lamp", kind: "sound", sound: "lamp-hum", group: "amb", gain: 0.25, sustain: true, start: 106.0, end: 130.0 },
  { id: "sfx-clip-1", kind: "sound", sound: "switch-a", group: "sfx", gain: 0.5, start: 109.0, end: 109.4 },
  { id: "sfx-clip-2", kind: "sound", sound: "switch-a", group: "sfx", gain: 0.5, start: 109.6, end: 110.0 },
  { id: "sfx-clip-3", kind: "sound", sound: "switch-a", group: "sfx", gain: 0.5, start: 110.4, end: 110.8 },
  { id: "sfx-clip-4", kind: "sound", sound: "switch-a", group: "sfx", gain: 0.5, start: 111.0, end: 111.4 },
  { id: "sfx-clip-5", kind: "sound", sound: "switch-a", group: "sfx", gain: 0.5, start: 111.8, end: 112.2 },
  { id: "sfx-mag-1", kind: "sound", sound: "switch-b", group: "sfx", gain: 0.6, start: 113.5, end: 114.1 },
  { id: "sfx-mag-2", kind: "sound", sound: "switch-b", group: "sfx", gain: 0.6, start: 115.0, end: 115.6 },
  ...gunshots,
  { id: "sfx-shards", kind: "sound", sound: "metal-thud", group: "sfx", gain: 0.35, start: 121.0, end: 121.6 },

  // Elevator, base and the float.
  { id: "amb-space", kind: "sound", sound: "space-pad", group: "amb", gain: 0.3, sustain: true, start: 130.0, end: 302.0 },
  { id: "suit-breath", kind: "sound", sound: "suit-breath", group: "suit", gain: 0.45, sustain: true, start: 144.0, end: 302.0 },
  { id: "sfx-locator", kind: "sound", sound: "switch-b", group: "suit", gain: 0.45, start: 147.5, end: 148.1 },
  { id: "sfx-thrust", kind: "sound", sound: "thruster", group: "suit", gain: 0.35, start: 165.0, end: 166.6 },

  // Photograph and scope. Shots are silent in vacuum; only suit-conducted thumps and radio reach us.
  { id: "suit-heartbeat", kind: "sound", sound: "heartbeat", group: "suit", gain: 0.55, sustain: true, start: 196.0, end: 248.0 },
  { id: "sfx-radio-1", kind: "sound", sound: "radio-hiss", group: "radio", gain: 0.12, start: 191.0, end: 195.0 },
  { id: "sfx-radio-beep", kind: "sound", sound: "radio-beep", group: "radio", gain: 0.3, start: 191.0, end: 191.4 },
  { id: "sfx-glove-1", kind: "sound", sound: "switch-a", group: "suit", gain: 0.4, start: 203.0, end: 203.4 },
  { id: "sfx-glove-2", kind: "sound", sound: "switch-a", group: "suit", gain: 0.4, start: 204.0, end: 204.4 },
  ...shotThumps,
  { id: "sfx-reload-1", kind: "sound", sound: "switch-b", group: "suit", gain: 0.45, start: 213.2, end: 213.8 },
  { id: "sfx-reload-2", kind: "sound", sound: "switch-b", group: "suit", gain: 0.45, start: 218.2, end: 218.8 },
  { id: "sfx-radio-2", kind: "sound", sound: "radio-hiss", group: "radio", gain: 0.12, start: 215.8, end: 217.8 },
  { id: "sfx-radio-3", kind: "sound", sound: "radio-hiss", group: "radio", gain: 0.12, start: 222.8, end: 225.8 },
  { id: "sfx-radio-4", kind: "sound", sound: "radio-beep", group: "radio", gain: 0.3, start: 240.5, end: 240.9 },
  { id: "sfx-radio-5", kind: "sound", sound: "radio-hiss", group: "radio", gain: 0.12, start: 240.8, end: 244.8 },
  { id: "sfx-radio-6", kind: "sound", sound: "radio-hiss", group: "radio", gain: 0.12, start: 245.8, end: 249.0 },

  // Ending.
  { id: "sfx-end-bell", kind: "sound", sound: "bell-end", group: "sfx", gain: 0.5, start: 302.0, end: 306.0 },
];
