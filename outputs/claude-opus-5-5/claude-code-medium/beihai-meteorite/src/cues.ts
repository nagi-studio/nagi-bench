import type { SoundCue, VoiceCue } from "@agentbench/cinematic-player";

export const DURATION = 358;

/**
 * Complete speech manifest. Every subtitle on screen is rendered from this list;
 * the ids are stable so each line can later be dubbed and dropped in by id.
 */
export const voiceCues: VoiceCue[] = [
  // ── Cold open: geosynchronous orbit ──
  { id: "V01", kind: "monologue", speaker: "章北海", text: "脚下没有大地，四周只有空间。", delivery: "内心独白，极轻、平静，贴着头盔里的呼吸声说，几乎没有起伏", start: 7.0, end: 11.8 },
  { id: "V02", kind: "monologue", speaker: "章北海", text: "没有从哪里来，也不想到哪里去——只是存在着。", delivery: "内心独白，放慢，破折号处停半拍，尾音轻轻落下，带一点满足", start: 12.4, end: 18.2 },
  { id: "V03", kind: "monologue", speaker: "章北海", text: "父亲，您在天上，大概也是这种感觉吧。", delivery: "内心独白，低沉，“父亲”二字后停顿，语气罕见地柔软", start: 20.6, end: 26.4 },
  { id: "V04", kind: "broadcast", speaker: "黄河站广播", text: "高层工作会议结束。请与会人员到三号出口集合，出站合影。", delivery: "空间站公共频道，女声，标准平稳的播报腔，经头盔耳机传来，带轻微电子压缩感", start: 29.8, end: 35.6 },

  // ── Beijing, four months earlier ──
  { id: "V05", kind: "broadcast", speaker: "收音机", text: "……太空电梯首期工程投入运营，可控核聚变取得重大突破……", delivery: "老式收音机的新闻播音腔，从院墙里隔着距离传出，音量小、发闷，夹着电台底噪", start: 46.4, end: 51.0 },
  { id: "V06", kind: "broadcast", speaker: "收音机", text: "……评论认为，人类只是刚刚走到海边，连船坞都还没有搭起来。", delivery: "同上，播音员语气稳重，句尾渐弱被门内的声音盖过", start: 51.2, end: 55.6 },
  { id: "V07", kind: "dialogue", speaker: "收藏者", text: "来啦？快请进，随便看！", delivery: "五十多岁的北京男人，热情洪亮，从工作台前直起身招呼", start: 59.0, end: 61.6 },
  { id: "V08", kind: "monologue", speaker: "章北海", text: "大世界怎么变，他都沉在自己的小世界里。", delivery: "内心独白，平和，带着打量与欣赏", start: 62.8, end: 66.6 },
  { id: "V09", kind: "monologue", speaker: "章北海", text: "我们为生存而战时，多数人仍过着自己的日子——这让我踏实。", delivery: "内心独白，声音更暖，句尾微微放松", start: 66.9, end: 71.0 },
  { id: "V10", kind: "dialogue", speaker: "收藏者", text: "您是军人吧。现在的军人不太像军人了，可您，我一眼就看得出来。", delivery: "边斟茶边说，笑眯眯，带点老北京的得意", start: 72.0, end: 76.6 },
  { id: "V11", kind: "dialogue", speaker: "章北海", text: "您也当过兵。", delivery: "简短、笃定，不是疑问", start: 76.9, end: 78.6 },
  { id: "V12", kind: "dialogue", speaker: "收藏者", text: "好眼力！我大半辈子都在总参测绘局。", delivery: "一拍大腿式的爽朗，略带自豪", start: 78.9, end: 81.8 },
  { id: "V13", kind: "dialogue", speaker: "章北海", text: "怎么迷上陨石的？", delivery: "随意的好奇，目光扫过玻璃柜", start: 82.1, end: 84.0 },
  { id: "V14", kind: "dialogue", speaker: "收藏者", text: "当年随考察队穿越南极，专门在雪底下找陨石。", delivery: "回忆的语气，放慢，眼神飘远", start: 84.3, end: 88.2 },
  { id: "V15", kind: "dialogue", speaker: "收藏者", text: "它们来自尘世之外。每拿到一块，就像去了一趟外星世界。", delivery: "压低声音，像说一个秘密，满是痴迷", start: 88.4, end: 92.6 },
  { id: "V16", kind: "dialogue", speaker: "章北海", text: "地球本身就是星际物质聚成的——一块大陨石。", delivery: "微笑着摇头，语气轻松，像在开玩笑", start: 92.9, end: 96.4 },
  { id: "V17", kind: "dialogue", speaker: "章北海", text: "这茶杯是陨石，茶里的水据说是彗星带来的，也是陨石。", delivery: "举起茶杯示意，半真半假，眼神却很冷静", start: 96.6, end: 100.8 },
  { id: "V18", kind: "dialogue", speaker: "收藏者", text: "呵呵，你很精明，已经开始砍价了……不过我还是信自个儿的感觉。", delivery: "指着对方大笑，识破了的得意，后半句收回认真", start: 101.0, end: 105.0 },
  { id: "V19", kind: "dialogue", speaker: "收藏者", text: "镇宅之宝——火星来的。看这些小圆坑，可能是微生物化石。", delivery: "压低嗓音，郑重其事，像捧着圣物", start: 105.3, end: 109.4 },
  { id: "V20", kind: "dialogue", speaker: "收藏者", text: "有人出黄金价的一千倍，我都没卖。", delivery: "骄傲，一字一顿", start: 109.6, end: 112.0 },
  { id: "V21", kind: "dialogue", speaker: "章北海", text: "我要的不用贵重。比重大，受冲击不易碎，好加工。", delivery: "公事公办，像在念一份技术指标", start: 112.4, end: 116.4 },
  { id: "V22", kind: "dialogue", speaker: "收藏者", text: "要雕刻？", delivery: "随口一猜", start: 116.6, end: 117.8 },
  { id: "V23", kind: "dialogue", speaker: "章北海", text: "算是吧。最好能上车床。", delivery: "一带而过，不愿多解释", start: 118.0, end: 120.2 },
  { id: "V24", kind: "dialogue", speaker: "收藏者", text: "那就是铁陨石。铁镍为主，每立方厘米八克多，上车床没问题。", delivery: "转身开柜，内行人的利落，越说越快", start: 120.5, end: 125.2 },
  { id: "V25", kind: "dialogue", speaker: "章北海", text: "这样大小的——要三块。", delivery: "停顿后平静地说出数量", start: 125.5, end: 127.6 },
  { id: "V26", kind: "dialogue", speaker: "收藏者", text: "您看这交错的纹路，叫韦氏条纹，地球上可没有。", delivery: "开始为要价做铺垫，热络，手指点着纹路", start: 128.0, end: 131.5 },
  { id: "V27", kind: "dialogue", speaker: "收藏者", text: "这块是我在沙漠里找的，车陷进沙里，差点把命丢了。", delivery: "带点夸张的感慨，眼角瞟着对方反应", start: 131.7, end: 135.2 },
  { id: "V28", kind: "dialogue", speaker: "收藏者", text: "每块六万，三块十八万，您看怎么样？", delivery: "试探，故意把价报高，留出还价余地", start: 135.6, end: 139.4 },
  { id: "V29", kind: "dialogue", speaker: "章北海", text: "给个账号吧，我现在就付。", delivery: "毫不犹豫，已经掏出手机", start: 139.8, end: 142.2 },
  { id: "V30", kind: "dialogue", speaker: "收藏者", text: "呵呵……其实，我是准备你还价的。", delivery: "愣住半晌后尴尬地笑，声音发虚", start: 145.0, end: 148.6 },
  { id: "V31", kind: "dialogue", speaker: "章北海", text: "不，我接受。", delivery: "平静", start: 148.9, end: 150.4 },
  { id: "V32", kind: "dialogue", speaker: "收藏者", text: "现在太空航行平民化，行情跌了些，这些嘛，也就值……", delivery: "不好意思地往回找补，越说越快", start: 150.6, end: 153.4 },
  { id: "V33", kind: "dialogue", speaker: "章北海", text: "就这个价。算是我对要送的人的尊重。", delivery: "坚决地打断，“要送的人”四字放慢、压低，冷得让人发怵", start: 153.5, end: 157.8 },

  // ── Basement ──
  { id: "V34", kind: "monologue", speaker: "章北海", text: "全碎了。看不出一点加工的痕迹。", delivery: "内心独白，耳鸣未消的空洞感，满意但毫无喜色", start: 219.6, end: 223.8 },

  // ── Base One / approach ──
  { id: "V35", kind: "broadcast", speaker: "一号基地广播", text: "例行通告：外部作业窗口已开放，出舱人员请登记定位信号。", delivery: "基地内部广播，男声，机械平淡，舱壁回响", start: 227.0, end: 231.8 },
  { id: "V36", kind: "chatter", speaker: "通勤者", text: "B-7借过，我去船坞那边送一趟焊料。", delivery: "公共通勤频道，年轻男声，随意，背景有推进器的低鸣", start: 237.4, end: 241.0 },
  { id: "V37", kind: "chatter", speaker: "调度员", text: "收到。绕开三号出口，开会的领导要出来照相。", delivery: "公共频道，女声，懒洋洋的日常调度", start: 241.3, end: 245.6 },
  { id: "V38", kind: "radio", speaker: "摄影师", text: "出来了出来了，慢点儿，别喷太猛。", delivery: "合影频道，中年男声，热情，有点手忙脚乱", start: 258.6, end: 261.8 },
  { id: "V39", kind: "radio", speaker: "摄影师", text: "前排领导往中间靠一点……好。后排的同志，推进器先别喷。", delivery: "指挥口吻，客气又着急", start: 263.0, end: 267.6 },
  { id: "V40", kind: "radio", speaker: "摄影师", text: "光线正好，大家把面罩调成透明。", delivery: "高兴，像抓到好时机", start: 268.0, end: 271.4 },
  { id: "V41", kind: "chatter", speaker: "合影者", text: "哎哟，晃眼……这回总算能露个脸了。", delivery: "频道里有人说笑，几声轻松的笑", start: 272.4, end: 275.6 },
  { id: "V42", kind: "radio", speaker: "摄影师", text: "后两排还没站齐……前排领导稍等，等推进器的白雾散一散。", delivery: "略显抱歉，拖长了“稍等”", start: 285.6, end: 290.8 },

  // ── Ten seconds ──
  { id: "V43", kind: "monologue", speaker: "章北海", text: "他们也是无辜的。", delivery: "内心独白，极平，像陈述事实；背后是心跳", start: 308.8, end: 311.6 },
  { id: "V44", kind: "monologue", speaker: "章北海", text: "他们如履薄冰，开启了太空时代的黎明。", delivery: "内心独白，带着敬意，语速很慢", start: 311.9, end: 316.0 },
  { id: "V45", kind: "monologue", speaker: "章北海", text: "可正是那段经历，禁锢了他们的思想。", delivery: "内心独白，语气转冷", start: 316.3, end: 319.0 },
  { id: "V46", kind: "monologue", speaker: "章北海", text: "为了能飞向群星的飞船——必须消灭他们。", delivery: "内心独白，咬字清楚，破折号后斩钉截铁", start: 319.2, end: 322.0 },
  { id: "V47", kind: "radio", speaker: "合影者", text: "陨石雨！", delivery: "合影频道，惊叫破音，盖过电流噪声", start: 325.0, end: 326.6 },
  { id: "V48", kind: "radio", speaker: "合影者", text: "是陨石雨！快回站里！", delivery: "几个人同时喊，急促、恐慌、互相叠在一起", start: 326.8, end: 329.4 },
  { id: "V49", kind: "broadcast", speaker: "黄河站广播", text: "三号出口紧急开启！医疗组到气闸待命！", delivery: "公共频道，播报员失去了平稳，语速加快，背景警报", start: 330.0, end: 333.6 },
  { id: "V50", kind: "radio", speaker: "合影者", text: "拉住他！拉住他的手！", delivery: "喘着粗气，嘶喊", start: 335.0, end: 337.6 },

  // ── Return ──
  { id: "V51", kind: "monologue", speaker: "章北海", text: "三个人的死，保证不了什么。可我做了我能做的。", delivery: "内心独白，寒冷而平静，几乎没有情绪", start: 344.0, end: 348.2 },
  { id: "V52", kind: "monologue", speaker: "章北海", text: "父亲，在您的目光里，我可以安心了。", delivery: "内心独白，最后一句，声音放低，带一丝释然", start: 348.6, end: 352.8 },
];

/* --------------------------- sound cues --------------------------- */

type SC = Omit<SoundCue, "kind" | "id"> & { id?: string };
let n = 0;
const s = (sound: string, start: number, end: number, gain = 1, group = "sfx", extra: Partial<SoundCue> = {}): SoundCue => ({
  id: `S${String(++n).padStart(3, "0")}-${sound}`,
  kind: "sound",
  sound,
  start,
  end,
  gain,
  group,
  ...extra,
});
const amb = (sound: string, start: number, end: number, gain = 1, payload?: unknown): SoundCue =>
  s(sound, start, end, gain, "amb", { sustain: true, payload });
const mus = (sound: string, start: number, end: number, gain = 1, payload?: unknown): SoundCue =>
  s(sound, start, end, gain, "music", { sustain: true, payload });

const radioPairs = (start: number, end: number): SoundCue[] => [
  s("radioClick", start - 0.15, start + 0.1, 0.5, "radio"),
  s("radioClick", end, end + 0.25, 0.4, "radio"),
];

const shots30 = Array.from({ length: 30 }, (_, i) => {
  const burst = Math.floor(i / 10);
  return [294.8, 299.0, 303.4][burst]! + (i % 10) * 0.24;
});
export const SHOT_TIMES = shots30;
export const TEST_SHOTS = [205.0, 205.62, 206.1, 206.85];

export const soundCues: SoundCue[] = [
  // cold open
  amb("suitBreath", 0.5, 37.6, 0.9, { rate: 0.23, depth: 1 }),
  amb("suitHum", 2.0, 37.6, 0.6),
  mus("padSpace", 4.0, 37.6, 0.55, { root: 38, bright: 0.25 }),
  ...radioPairs(29.8, 35.6),
  s("radioBed", 29.7, 35.8, 0.35, "radio", { sustain: true }),
  s("scopeRaise", 27.6, 28.6, 0.6),
  s("titleBoom", 37.8, 44.5, 0.9, "music"),

  // hutong
  amb("cityDusk", 44.8, 58.2, 0.8),
  s("footsteps", 45.3, 54.6, 0.55, "sfx", { payload: { rate: 1.75, surface: "stone" } }),
  s("oldRadio", 46.0, 58.0, 0.45, "amb", { sustain: true }),
  s("bikeBell", 49.2, 50.4, 0.35),
  s("doorCreak", 54.8, 56.6, 0.5),

  // collector's room
  amb("roomTone", 56.0, 158.6, 0.55),
  amb("clockTick", 56.0, 158.6, 0.38),
  mus("padWarm", 57.0, 100.5, 0.32, { root: 50 }),
  s("stoneSet", 60.0, 60.6, 0.4),
  s("teaPour", 72.0, 75.2, 0.6),
  s("cupSet", 75.4, 75.9, 0.55),
  s("cupSet", 96.7, 97.2, 0.4),
  s("safeOpen", 105.2, 106.7, 0.7),
  s("glassSlide", 120.6, 121.8, 0.55),
  s("stoneSet", 122.3, 122.9, 0.6),
  s("stoneSet", 126.3, 126.9, 0.5),
  s("stoneSet", 126.9, 127.5, 0.45),
  s("stoneSet", 127.4, 128.0, 0.55),
  s("phoneTap", 141.0, 142.0, 0.5),
  s("phonePay", 155.6, 156.6, 0.6),
  mus("padTension", 139.6, 158.4, 0.3, { root: 37 }),
  s("doorClose", 160.3, 162.4, 0.95),

  // workshop
  amb("workshopTone", 162.4, 185.2, 0.6),
  s("lampSwitch", 163.0, 163.4, 0.6),
  s("latheSpin", 164.4, 178.4, 0.75, "sfx", { sustain: true }),
  s("latheCut", 165.6, 170.0, 0.55),
  s("latheCut", 171.2, 174.5, 0.55),
  s("latheCut", 175.0, 177.8, 0.55),
  s("toolClink", 179.6, 180.2, 0.6),
  s("chipsSweep", 180.6, 182.4, 0.5),
  s("lampSwitch", 183.6, 184.0, 0.6),

  // basement
  amb("basementTone", 185.0, 226.0, 0.6),
  ...[186.6, 187.4, 188.3, 189.1].map((t) => s("pliersPull", t, t + 0.5, 0.55)),
  ...[190.6, 191.4, 192.2].map((t) => s("slugSet", t, t + 0.4, 0.5)),
  ...[201.0, 201.4, 201.8, 202.2].map((t) => s("magLoad", t, t + 0.3, 0.6)),
  s("magInsert", 202.9, 203.4, 0.75),
  s("slideRack", 203.6, 204.2, 0.8),
  ...TEST_SHOTS.map((t) => s("gunshotRoom", t, t + 2.4, 0.85)),
  s("tinnitus", 205.0, 214.0, 0.35),
  s("clothCut", 215.2, 217.4, 0.55),
  s("shardPour", 217.8, 218.8, 0.6),
  s("caseClose", 224.0, 224.6, 0.6),
  mus("padSpace", 214.0, 226.0, 0.25, { root: 33, bright: 0.1 }),

  // base one cabin
  amb("cabinHum", 226.0, 234.2, 0.6),
  s("velcro", 228.6, 229.4, 0.6),
  s("locatorBeep", 229.6, 233.8, 0.25),
  s("hatchCycle", 232.0, 234.2, 0.6),

  // geosynchronous orbit (inside the suit)
  amb("suitBreath", 234.0, 342.0, 0.8, { rate: 0.24, depth: 0.9 }),
  amb("suitHum", 234.0, 358.0, 0.5),
  mus("padSpace", 234.2, 294.0, 0.45, { root: 38, bright: 0.35 }),
  s("thrusterSuit", 236.0, 238.6, 0.6),
  s("radioBed", 237.2, 245.8, 0.3, "radio", { sustain: true }),
  ...radioPairs(237.4, 241.0),
  ...radioPairs(241.3, 245.6),
  s("radioBed", 258.4, 291.0, 0.25, "radio", { sustain: true }),
  ...radioPairs(258.6, 261.8),
  ...radioPairs(263.0, 267.6),
  ...radioPairs(268.0, 271.4),
  ...radioPairs(285.6, 290.8),
  s("visorClick", 271.2, 271.5, 0.25),
  s("heartbeat", 274.0, 334.0, 0.55, "sfx", { sustain: true, payload: { bpm: 62 } }),
  s("gloveRing", 280.0, 282.0, 0.7),
  s("gearPull", 283.4, 284.6, 0.55),
  s("magnetClack", 288.2, 288.8, 0.8),
  s("shotsConducted", 294.6, 307.0, 1.0, "sfx", { payload: { times: shots30 } }),
  s("magChange", 297.3, 298.4, 0.7),
  s("magChange", 301.7, 302.8, 0.7),
  mus("tensionDrone", 296.0, 322.2, 0.42),
  s("subHit", 322.0, 326.0, 0.8, "music"),
  s("radioBed", 324.6, 338.2, 0.4, "radio", { sustain: true }),
  ...radioPairs(325.0, 329.4),
  s("radioAlarm", 329.6, 338.0, 0.32, "radio", { sustain: true }),
  ...radioPairs(330.0, 333.6),
  ...radioPairs(335.0, 337.6),
  s("thrusterSuit", 343.0, 349.0, 0.7),
  amb("suitBreath", 342.0, 356.0, 0.6, { rate: 0.18, depth: 0.7 }),
  mus("finale", 341.5, 358.0, 0.55),
];

export type { SC };
