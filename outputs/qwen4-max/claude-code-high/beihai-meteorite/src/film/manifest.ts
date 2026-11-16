import type { VoiceCue, SoundCue } from "@agentbench/cinematic-player";

export const FILM_DURATION = 345;

/* ================================================================== */
/* VOICE MANIFEST — every spoken line, driven straight to subtitles.   */
/* Seven fixed fields: id, kind, speaker, text, delivery, start, end.  */
/* No human voice is synthesized; these exist to be dubbed later.      */
/* ================================================================== */

export const voiceCues: VoiceCue[] = [
  { id: "v01", kind: "narration", speaker: "旁白", text: "危机纪元十五年。北京，一条普通的胡同。", delivery: "平静、克制，带一点旧日的温度", start: 9.0, end: 15.0 },

  { id: "v02", kind: "dialogue", speaker: "收藏者", text: "来了？随便看。我这辈子，就攒了这么些石头。", delivery: "热情、松弛，像招呼老朋友", start: 19.0, end: 23.5 },
  { id: "v03", kind: "narration", speaker: "旁白", text: "当章北海为人类的生存而战时，大多数人仍执著于自己固有的生活。这让他心里感到温暖和踏实。", delivery: "低缓、温柔", start: 24.5, end: 30.5 },

  { id: "v04", kind: "dialogue", speaker: "收藏者", text: "您是军人吧。", delivery: "试探、笃定", start: 32.0, end: 34.5 },
  { id: "v05", kind: "dialogue", speaker: "收藏者", text: "现在的军人不太像军人了，可您，我一眼就看得出来。", delivery: "感慨、亲切", start: 35.5, end: 41.0 },
  { id: "v06", kind: "dialogue", speaker: "章北海", text: "您也曾经是军人。", delivery: "平静、肯定", start: 42.0, end: 45.0 },
  { id: "v07", kind: "dialogue", speaker: "收藏者", text: "好眼力。我大半辈子，都在总参测绘局。", delivery: "爽朗、怀旧", start: 46.0, end: 49.0 },

  { id: "v08", kind: "dialogue", speaker: "章北海", text: "怎么会迷上陨石？", delivery: "好奇、温和", start: 50.0, end: 53.0 },
  { id: "v09", kind: "dialogue", speaker: "收藏者", text: "十多年前，我在南极的雪下面找陨石。它们来自尘世之外，遥远的太空。", delivery: "神往、放慢", start: 54.0, end: 60.5 },
  { id: "v10", kind: "dialogue", speaker: "收藏者", text: "每拿到一块，就像去了一个新的外星世界。", delivery: "孩子气的欣喜", start: 61.0, end: 65.0 },

  { id: "v11", kind: "dialogue", speaker: "章北海", text: "地球就是星际物质汇聚成的。所以地球是一块大陨石，脚下的石头是陨石，我手里的茶杯也是陨石。", delivery: "含笑、从容", start: 66.0, end: 73.5 },
  { id: "v12", kind: "dialogue", speaker: "章北海", text: "连这杯里的水，都是彗星带来的。", delivery: "举举茶杯，打趣", start: 74.0, end: 77.5 },
  { id: "v13", kind: "dialogue", speaker: "收藏者", text: "呵呵，你很精明，已经开始砍价了。", delivery: "被逗乐、指点着笑", start: 78.0, end: 81.0 },

  { id: "v14", kind: "dialogue", speaker: "收藏者", text: "说说看，您要什么样的？", delivery: "爽快、生意口吻", start: 82.0, end: 85.0 },
  { id: "v15", kind: "dialogue", speaker: "章北海", text: "不贵重的。比重大，冲击下不易碎，易加工，最好能上车床。", delivery: "不动声色、字字精确", start: 86.0, end: 91.5 },
  { id: "v16", kind: "dialogue", speaker: "收藏者", text: "那就是铁陨石了。铁、镍，每立方厘米八克多。", delivery: "内行、热心", start: 92.0, end: 95.5 },
  { id: "v17", kind: "dialogue", speaker: "章北海", text: "这样大小的，要三块。", delivery: "干脆", start: 96.0, end: 98.5 },
  { id: "v18", kind: "dialogue", speaker: "章北海", text: "给个账号，我现在就付款。", delivery: "平静、不容迟疑", start: 99.0, end: 101.0 },

  { id: "v19", kind: "dialogue", speaker: "收藏者", text: "呵呵……其实，我是准备您还价的。", delivery: "尴尬、赔笑", start: 102.0, end: 106.0 },
  { id: "v20", kind: "dialogue", speaker: "章北海", text: "不，就这个价。就算……表示我对要送的人的尊重吧。", delivery: "坚决，句尾藏着一丝不易察觉的沉重", start: 107.0, end: 112.5 },

  { id: "v21", kind: "narration", speaker: "旁白", text: "电梯与聚变鼓舞了世界，但这只是海岸边的第一步。增援未来计划启动，章北海被选为第一批特遣队指挥官。", delivery: "庄重、推进", start: 113.0, end: 120.0 },

  { id: "v22", kind: "narration", speaker: "旁白", text: "他把三块陨石切成三十六根铅笔粗细的圆柱，再切成小段。", delivery: "冷静、工序感", start: 121.0, end: 128.0 },
  { id: "v23", kind: "monologue", speaker: "章北海·独白", text: "三十六颗。一颗都不能浪费。", delivery: "极低、专注", start: 129.0, end: 135.0 },

  { id: "v24", kind: "narration", speaker: "旁白", text: "他收起每一粒碎屑，拆下那把为石材特制的刀具。不留痕迹。", delivery: "压低、冷峻", start: 137.0, end: 143.5 },

  { id: "v25", kind: "narration", speaker: "旁白", text: "隐蔽的地下室。无壳子弹的弹头直接粘在发射药上。他用修补太空舱的胶，把陨石段粘上每一支发射药。", delivery: "工序感、压抑", start: 145.0, end: 153.5 },
  { id: "v26", kind: "monologue", speaker: "章北海·独白", text: "这种胶，能扛住太空里剧烈的冷热交替。", delivery: "冷静、确认", start: 154.5, end: 159.5 },

  { id: "v27", kind: "narration", speaker: "旁白", text: "狭小的地下室里，枪声像爆炸一样震耳欲聋。", delivery: "在枪响之后落下，克制", start: 169.0, end: 175.0 },

  { id: "v28", kind: "monologue", speaker: "章北海·独白", text: "四段陨石都碎了，成了看不出加工痕迹的碎石。很好。", delivery: "冷静、满意", start: 179.0, end: 186.0 },

  { id: "v30", kind: "narration", speaker: "旁白", text: "黄河空间站，太空电梯的配重，太空中最大的人造物体。散落的设施，像大草原上的游牧帐篷。", delivery: "辽阔、放缓", start: 189.0, end: 197.0 },
  { id: "v31", kind: "narration", speaker: "旁白", text: "八十公里外，是太空军的一号基地。", delivery: "平静、点出", start: 198.0, end: 202.0 },

  { id: "v32", kind: "monologue", speaker: "章北海·独白", text: "定位单元留在舱里。这次外出，不会留下任何记录。", delivery: "冷静、蓄意", start: 203.0, end: 209.0 },

  { id: "v33", kind: "narration", speaker: "旁白", text: "会议已经结束。他在等全体与会者出来合影——等日落。", delivery: "等待感、压低", start: 211.0, end: 218.0 },
  { id: "v34", kind: "monologue", speaker: "章北海·独白", text: "生命维持系统，只剩十二个小时。", delivery: "清醒、紧迫藏在平静下", start: 219.0, end: 222.0 },

  { id: "v35", kind: "monologue", speaker: "章北海·独白", text: "脚下没有大地，四周只有空间。没有从哪里来，也不想到哪里去。只是存在着。", delivery: "极缓、出神，近乎耳语", start: 224.0, end: 233.0 },
  { id: "v36", kind: "monologue", speaker: "章北海·独白", text: "我喜欢这种感觉。父亲在天之灵，可能也是这种感觉。", delivery: "温柔、思念", start: 235.0, end: 242.0 },

  { id: "v37", kind: "narration", speaker: "旁白", text: "太阳开始接触地球的边缘。十公里外，圆形密封门仍紧闭着。", delivery: "屏息、聚焦", start: 247.0, end: 253.0 },

  { id: "v38", kind: "radio", speaker: "摄影师", text: "各单位注意，合影准备。面罩调透明，露出脸。", delivery: "公事公办、清晰", start: 259.0, end: 263.5 },
  { id: "v39", kind: "chatter", speaker: "与会者", text: "往中间靠……后排再高一点。", delivery: "嘈杂、随意", start: 264.0, end: 267.0 },
  { id: "v40", kind: "narration", speaker: "旁白", text: "夕照下的海洋，一半深蓝，一半橘红。", delivery: "诗意、轻", start: 267.5, end: 270.0 },

  { id: "v41", kind: "monologue", speaker: "章北海·独白", text: "前排正中。三个目标，都在。", delivery: "锁定、冷", start: 271.0, end: 275.0 },
  { id: "v42", kind: "narration", speaker: "旁白", text: "真空，无重力。子弹沿绝对稳定的直线前进，不减速。一支普通手枪，就能击中十公里外。", delivery: "冷静、物理的确定性", start: 276.0, end: 282.0 },

  { id: "v43", kind: "monologue", speaker: "章北海·独白", text: "他们也是无辜的。曾用最微薄的投入，如履薄冰地开启太空时代的黎明。", delivery: "沉重、克制", start: 283.0, end: 290.0 },
  { id: "v44", kind: "monologue", speaker: "章北海·独白", text: "但那段经历禁锢了他们的思想。为了恒星际的飞船——必须消灭他们。", delivery: "冷峻、决绝", start: 291.0, end: 297.5 },

  { id: "v45", kind: "monologue", speaker: "章北海·独白", text: "十秒。祈祷你们，不要移动。", delivery: "紧绷、屏息", start: 299.0, end: 305.0 },

  { id: "v46", kind: "radio", speaker: "与会者", text: "陨石雨！陨石雨！", delivery: "惊恐、嘶喊", start: 307.0, end: 310.0 },
  { id: "v47", kind: "radio", speaker: "与会者", text: "有人中弹！推进器全开，快撤回！", delivery: "慌乱、急促", start: 311.0, end: 314.5 },
  { id: "v48", kind: "radio", speaker: "摄影师", text: "把伤员拖回去！快！", delivery: "嘶吼", start: 315.0, end: 318.0 },
  { id: "v49", kind: "monologue", speaker: "章北海·独白", text: "五个。包括那三个。", delivery: "确认、无波", start: 318.5, end: 320.0 },

  { id: "v50", kind: "monologue", speaker: "章北海·独白", text: "我知道，这三个人的死，不能保证无工质辐射推进成为方向。但我做了我能做的。", delivery: "寒冷而平静", start: 321.0, end: 330.0 },
  { id: "v51", kind: "monologue", speaker: "章北海·独白", text: "在父亲的目光下，我可以安心了。", delivery: "释然、极轻", start: 331.0, end: 334.0 },

  { id: "v52", kind: "monologue", speaker: "章北海·独白", text: "只是存在着。", delivery: "回声般的耳语，余韵", start: 337.0, end: 342.0 },
];

/* ================================================================== */
/* SOUND CUES — all synthesized at runtime via Web Audio.              */
/* Vacuum rule: outside gunfire/impacts are SILENT in space; only      */
/* suit-conducted thumps, breathing, radio and subjective score sound. */
/* The basement gunshot, by contrast, is loud and strongly reflected.  */
/* ================================================================== */

const S = (id: string, sound: string, start: number, end: number, group = "sfx", gain = 0.8, sustain = false): SoundCue =>
  ({ id, kind: "sound", sound, group, gain, sustain, start, end });

export const soundCues: SoundCue[] = [
  // --- score / drone beds ---
  S("sc-open", "scoreOpen", 0, 8, "score", 0.7, true),
  S("sc-warm", "scoreWarm", 49, 113, "score", 0.5, true),
  S("sc-make", "scoreTension", 120, 160, "score", 0.45, true),
  S("sc-void", "scoreVoid", 222, 246, "score", 0.6, true),
  S("sc-fire", "scoreFire", 282, 306, "score", 0.5, true),
  S("sc-end", "scoreEnd", 320, 345, "score", 0.6, true),

  // --- ambience ---
  S("amb-hutong", "hutong", 8, 17, "amb", 0.6, true),
  S("amb-room", "roomTone", 17, 113, "amb", 0.5, true),
  S("amb-workshop", "workshopHum", 120, 144, "amb", 0.5, true),
  S("amb-basement", "basementTone", 144, 188, "amb", 0.5, true),
  S("amb-space", "spaceDrone", 188, 334, "amb", 0.45, true),
  S("amb-breath", "suitBreath", 210, 334, "amb", 0.7, true),
  S("amb-heart", "heartbeat", 282, 306, "amb", 0.6, true),
  S("amb-radio", "radioStatic", 258, 320, "amb", 0.3, true),

  // --- Earth foley ---
  S("fx-door", "doorOpen", 9.5, 11, "sfx", 0.7),
  S("fx-tea", "teaPour", 33, 35.5, "sfx", 0.6),
  S("fx-cabinet", "glassCase", 50, 51.5, "sfx", 0.5),
  S("fx-stone", "stoneSet", 92, 94, "sfx", 0.7),
  S("fx-phone", "phonePay", 99.5, 101, "sfx", 0.6),

  // --- workshop ---
  S("fx-cnc", "cncSpindle", 122, 135, "sfx", 0.6, true),
  S("fx-cut", "cutTicks", 124, 134, "sfx", 0.5),
  S("fx-servo", "servo", 130, 131.5, "sfx", 0.5),
  S("fx-blade", "bladeRemove", 138, 140.5, "sfx", 0.7),

  // --- basement ---
  S("fx-pliers", "pliers", 146, 158, "sfx", 0.6),
  S("fx-glue", "glueSqueeze", 152, 153.5, "sfx", 0.5),
  S("fx-mag", "magLoad", 161, 163, "sfx", 0.7),
  S("fx-gunshot", "basementGunshot", 165, 168, "sfx", 1.0),
  S("fx-tinnitus", "tinnitus", 166, 177, "sfx", 0.5),
  S("fx-cloth", "clothOpen", 179, 181, "sfx", 0.6),
  S("fx-gravel", "gravelPour", 182, 184.5, "sfx", 0.6),

  // --- space (only suit-conducted / radio / subjective) ---
  S("fx-locator", "locatorBeep", 204, 207, "sfx", 0.5),
  S("fx-radio-beep", "radioBeep", 259, 260, "sfx", 0.4),
  S("fx-glove", "gloveOff", 272, 274, "sfx", 0.6),
  S("fx-draw", "gunDraw", 275, 277, "sfx", 0.6),
  S("fx-mount", "scopeMount", 278, 280, "sfx", 0.6),
  // conducted recoil thumps — one per firing burst (NOT external gunfire)
  S("fx-thump1", "suitThump", 283.0, 283.6, "sfx", 0.7),
  S("fx-thump2", "suitThump", 284.2, 284.8, "sfx", 0.7),
  S("fx-thump3", "suitThump", 285.4, 286.0, "sfx", 0.7),
  S("fx-reload1", "magReload", 288, 289.5, "sfx", 0.6),
  S("fx-thump4", "suitThump", 290.0, 290.6, "sfx", 0.7),
  S("fx-thump5", "suitThump", 291.2, 291.8, "sfx", 0.7),
  S("fx-reload2", "magReload", 293, 294.5, "sfx", 0.6),
  S("fx-thump6", "suitThump", 295.0, 295.6, "sfx", 0.7),
  S("fx-thump7", "suitThump", 296.2, 296.8, "sfx", 0.7),
  // subjective sub-tone when the visor cracks (felt, not heard)
  S("fx-subject", "subjectiveHit", 309, 311, "score", 0.5),
  // Zhang's own thruster, conducted through the suit
  S("fx-thrust", "thrusterConducted", 320, 327, "sfx", 0.6, true),
];