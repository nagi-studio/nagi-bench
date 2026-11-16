import type { VoiceCue } from "@agentbench/cinematic-player";

/**
 * The complete speech manifest. Every subtitle is driven from this list.
 * Seven authored fields per cue: id, kind, speaker, text, delivery, start, end.
 * No voice is synthesised — these are subtitles for later dubbing by id.
 */
export const voiceCues: VoiceCue[] = [
  // ---- Act 1 · The collector ----
  { id: "v001", kind: "narration", speaker: "旁白", text: "胡同深处，一座光线黯淡的老宅，像个小型的地质博物馆。大部分人仍执著于固有的生活——这让他心里，感到温暖和踏实。", delivery: "沉静、克制，带一丝暖意，句尾留白", start: 7.0, end: 15.0 },
  { id: "v002", kind: "dialogue", speaker: "收藏者", text: "哎，来了！随便看，随便看。", delivery: "热情、爽朗，主人迎客的语气", start: 15.6, end: 18.6 },
  { id: "v003", kind: "dialogue", speaker: "收藏者", text: "您是军人吧。", delivery: "端茶时随口一问，笃定", start: 19.4, end: 21.8 },
  { id: "v004", kind: "dialogue", speaker: "收藏者", text: "现在的军人，已经不太像军人了。但您，我一眼就能看出来。", delivery: "感慨，带着老兵的自信", start: 22.4, end: 28.6 },
  { id: "v005", kind: "dialogue", speaker: "章北海", text: "您也曾经是军人。", delivery: "平静，陈述而非疑问", start: 29.4, end: 32.0 },
  { id: "v006", kind: "dialogue", speaker: "收藏者", text: "好眼力。我大半辈子，都是在总参测绘局服役。", delivery: "被说中的欣然，坦然", start: 32.8, end: 38.4 },
  { id: "v007", kind: "dialogue", speaker: "章北海", text: "怎么会对陨石感兴趣呢？", delivery: "赞赏地打量四周，温和好奇", start: 39.2, end: 42.4 },
  { id: "v008", kind: "dialogue", speaker: "收藏者", text: "十多年前，我随考察队穿越南极，在雪下面找陨石，从此就迷上了。它们来自尘世之外，遥远的太空……每拿到一块，就像去了一个新的外星世界。", delivery: "沉浸、神往，越说越亮，沉浸在自己的小世界里", start: 43.0, end: 57.0 },
  { id: "v009", kind: "dialogue", speaker: "章北海", text: "这只是您的感觉。地球，就是由星际物质汇聚形成的——地球，就是一块大陨石。我们脚下的石头是陨石，我手里的茶杯，也是陨石。", delivery: "笑着摇头，从容、睿智，语气轻松", start: 58.0, end: 70.0 },
  { id: "v010", kind: "dialogue", speaker: "章北海", text: "据说，地球上的水是彗星带来的。所以……这茶杯里盛的，也是陨石。您这些，应该是不稀罕的。", delivery: "举举茶杯，半开玩笑的狡黠", start: 70.8, end: 78.0 },
  { id: "v011", kind: "dialogue", speaker: "收藏者", text: "呵呵呵，你很精明，已经开始砍价了……不过，我还是相信自个儿的感觉。", delivery: "指点着对方大笑，宠溺的无奈", start: 78.8, end: 85.0 },
  { id: "v012", kind: "dialogue", speaker: "收藏者", text: "看这个——火星来的，指甲盖大小。有人出黄金一千倍的价，我都没答应。", delivery: "迫不及待地炫耀镇宅之宝，压低声音的珍重", start: 85.8, end: 92.0 },
  { id: "v013", kind: "dialogue", speaker: "章北海", text: "我要三块铁陨石。比重大，冲击下不易破碎，最好能用车床加工。", delivery: "切入正题，平静、明确", start: 92.8, end: 98.6 },
  { id: "v014", kind: "dialogue", speaker: "收藏者", text: "铁陨石不多，只占百分之五。这样大小和成色……每块六万，三块，十八万。", delivery: "为要价做铺垫，试探", start: 99.2, end: 105.0 },
  { id: "v015", kind: "dialogue", speaker: "章北海", text: "给个账号。我现在就付款。", delivery: "拿出手机，毫不迟疑", start: 105.6, end: 108.4 },
  { id: "v016", kind: "dialogue", speaker: "收藏者", text: "呵呵……其实，我是准备你还价的。", delivery: "半天没吱声，尴尬地笑", start: 109.0, end: 112.0 },
  { id: "v017", kind: "dialogue", speaker: "章北海", text: "不，就这个价。就算表示……我对要送的人的尊重吧。", delivery: "坚决地打断，平静里有千钧之重，'尊重'二字微微一顿", start: 112.6, end: 118.6 },

  // ---- Act 2 · The bridge / era ----
  { id: "v018", kind: "narration", speaker: "旁白", text: "太空电梯和可控核聚变，给了世界两个巨大的鼓舞。但冷静的人知道——人类只是拿着工具，刚刚来到海岸边。", delivery: "宏观、冷静，史诗感的铺陈", start: 120.0, end: 128.0 },
  { id: "v019", kind: "narration", speaker: "旁白", text: "增援未来计划：政工干部冬眠，驰援未来。他，是第一批特遣队的指挥官。", delivery: "庄重，点明身份", start: 128.8, end: 134.6 },
  { id: "v020", kind: "dialogue", speaker: "章北海", text: "上级不希望我们在那时，成为不能出海的舰队政委吧？", delivery: "对常伟思，平静而坚持，请示的口吻", start: 135.4, end: 140.6 },
  { id: "v021", kind: "dialogue", speaker: "常伟思", text: "批准了。一个月后，你们三十个人，上天。", delivery: "沉稳、赞许，一锤定音", start: 141.2, end: 145.0 },

  // ---- Act 3 · The workshop ----
  { id: "v022", kind: "narration", speaker: "旁白", text: "下班后的研究所，空无一人。一台先进的数控机床。", delivery: "冷峻、压低，进入秘密的节奏", start: 147.0, end: 152.0 },
  { id: "v023", kind: "monologue", speaker: "章北海", text: "三块陨石，切成三十六段。尽量，不浪费一点原料。", delivery: "内心独白，专注、精确，近乎仪式", start: 153.0, end: 158.6 },
  { id: "v024", kind: "monologue", speaker: "章北海", text: "碎屑收好，刀具拆下。不留痕迹。", delivery: "冷静收尾，一丝不苟", start: 160.0, end: 164.0 },

  // ---- Act 4 · The basement ----
  { id: "v025", kind: "narration", speaker: "旁白", text: "剩下的工作，在一间隐蔽的地下室里完成。三十六发，7.62毫米手枪子弹。", delivery: "紧绷、低沉，悬念收紧", start: 167.0, end: 173.0 },
  { id: "v026", kind: "monologue", speaker: "章北海", text: "无壳弹。弹头直接粘在发射药上，取下来，很容易。", delivery: "机械般的精确，不带感情", start: 174.0, end: 179.6 },
  { id: "v027", kind: "monologue", speaker: "章北海", text: "修补太空舱表皮的胶。再剧烈的冷热交替，也不会失效。", delivery: "确认、笃定", start: 181.0, end: 186.6 },
  { id: "v028", kind: "monologue", speaker: "章北海", text: "试一发。", delivery: "极短，屏息前的决定", start: 188.0, end: 189.6 },
  { id: "v029", kind: "monologue", speaker: "章北海", text: "碎了。看不出加工的痕迹。就像……天然的陨石。", delivery: "审视掌心碎石，满意，近乎温柔", start: 195.0, end: 201.0 },
  { id: "v030", kind: "monologue", speaker: "章北海", text: "很好。", delivery: "两字，落定", start: 201.8, end: 203.4 },

  // ---- Act 5 · Space · the void ----
  { id: "v031", kind: "monologue", speaker: "章北海", text: "三个月了。一号基地。定位单元留在舱里——这次外出，不会留下任何记录。", delivery: "失重中的平静内心，冷而稳", start: 205.0, end: 213.0 },
  { id: "v032", kind: "monologue", speaker: "章北海", text: "生命维持系统，只能撑十二个小时。这之前，我必须回到八十公里外的一号基地。", delivery: "陈述时限，毫无波澜", start: 214.0, end: 221.6 },
  { id: "v033", kind: "monologue", speaker: "章北海", text: "脚下没有大地，四周只有空间。没有从哪里来，也不想到哪里去。只是存在着。我喜欢这种感觉。", delivery: "放空、辽远，近乎冥想的安宁", start: 223.0, end: 233.0 },
  { id: "v034", kind: "monologue", speaker: "章北海", text: "父亲在天之灵……也许，就是这种感觉。", delivery: "极轻，一丝柔软的追思", start: 234.0, end: 239.0 },

  // ---- Act 5 · sunset / the photograph ----
  { id: "v035", kind: "narration", speaker: "旁白", text: "太阳开始接触地球的边缘。会议散了——按照惯例，与会者要到太空里，拍一张合影。", delivery: "画面感，节奏放缓，等待", start: 240.6, end: 247.6 },
  { id: "v036", kind: "radio", speaker: "摄影师", text: "各就各位。推进器的白雾，散一散。", delivery: "无线电，带电流噪声，指挥的口吻", start: 249.0, end: 253.0 },
  { id: "v037", kind: "radio", speaker: "摄影师", text: "面罩调透明，露出脸来。", delivery: "无线电，例行指令", start: 256.0, end: 259.0 },
  { id: "v038", kind: "monologue", speaker: "章北海", text: "三个目标。都在前排，正中。", delivery: "锁定，冷峻，呼吸不变", start: 261.0, end: 265.0 },

  // ---- Act 5 · preparation ----
  { id: "v039", kind: "monologue", speaker: "章北海", text: "真空不是问题，发射药自带氧化剂。要考虑的，是温度。", delivery: "技术性的冷静，动作不停", start: 268.6, end: 274.0 },
  { id: "v040", kind: "monologue", speaker: "章北海", text: "三个月，取枪、装镜、换弹夹——我练了上千遍。", delivery: "肌肉记忆的笃定", start: 274.8, end: 279.6 },

  // ---- Act 5 · the shot ----
  { id: "v041", kind: "monologue", speaker: "章北海", text: "五公里。真空，无重力，没有阻力。弹道，是一条绝对的直线。", delivery: "扣扳机前的最后确认，极静", start: 281.0, end: 287.6 },
  { id: "v042", kind: "monologue", speaker: "章北海", text: "击中时的速度，就是出膛的速度。", delivery: "冷静到近乎冷酷", start: 289.0, end: 292.6 },

  // ---- Act 5 · flight / the moral calculus ----
  { id: "v043", kind: "monologue", speaker: "章北海", text: "他们也是无辜的。用最微薄的投入，小心翼翼，如履薄冰，开启了太空时代的黎明。", delivery: "承认对方的无辜，沉重而诚实", start: 294.0, end: 301.6 },
  { id: "v044", kind: "monologue", speaker: "章北海", text: "可正是那段经历，禁锢了他们的思想。要飞向恒星……就必须消灭他们。", delivery: "信念压倒情感，'必须'二字斩钉截铁", start: 302.4, end: 308.6 },
  { id: "v045", kind: "monologue", speaker: "章北海", text: "我故意让几颗走偏。多几道伤口，就更像一场——自然的陨石雨。", delivery: "算计的冷静，'陨石雨'三字微微放轻", start: 309.4, end: 315.0 },

  // ---- Act 5 · impact ----
  { id: "v046", kind: "dialogue", speaker: "合影者", text: "陨石雨！", delivery: "口型，无声的惊叫，隔着面罩读出——这是片名的落点", start: 316.0, end: 318.6 },
  { id: "v047", kind: "radio", speaker: "黄河站通讯", text: "陨石雨！全体撤回过渡舱！快！", delivery: "无线电里的惊慌，电流声、警报底噪", start: 319.2, end: 322.6 },
  { id: "v048", kind: "radio", speaker: "黄河站通讯", text: "有人中弹！拖回去！快拖回去！", delivery: "急促、混乱，呼喊", start: 323.2, end: 326.6 },

  // ---- Act 5 · coda ----
  { id: "v049", kind: "monologue", speaker: "章北海", text: "三个人的死，不能保证什么。但我做了，我能做的。", delivery: "寒冷而平静，尽责后的释然", start: 328.0, end: 335.0 },
  { id: "v050", kind: "monologue", speaker: "章北海", text: "不管以后发生什么——在父亲从冥冥中投下的目光里，我可以安心了。", delivery: "极静，归于安宁，句尾消散", start: 336.0, end: 344.0 },
  { id: "v051", kind: "narration", speaker: "旁白", text: "他的心，像周围空寂的太空一般——寒冷，而平静。", delivery: "收束，余韵，渐弱", start: 345.0, end: 350.6 },
];
