import type { VoiceCue } from "@agentbench/cinematic-player";

/**
 * The complete speech manifest. Nothing here is synthesised: each entry is a
 * line waiting for a voice actor, and the on-screen subtitle is driven directly
 * from this list. Fields: id, kind, speaker, text, delivery, start, end.
 */
export const voiceCues: VoiceCue[] = [
  // ── 序：同步轨道 ──
  { id: "v001", kind: "monologue", speaker: "章北海（内心）", text: "同步轨道上，每二十四小时，只有一次日落。", delivery: "极轻、极平，像在读一条航行日志；头盔内近讲，带一点呼吸声", start: 3.2, end: 7.2 },
  { id: "v002", kind: "monologue", speaker: "章北海（内心）", text: "我在等它。", delivery: "更低，停顿后落下，不带情绪", start: 8.0, end: 10.0 },

  // ── 胡同深处：收藏者 ──
  { id: "v010", kind: "dialogue", speaker: "收藏者", text: "哟，来客人了？请进，请进。地方小，您随便看。", delivery: "五十来岁，京腔，热络，嗓音敞亮；从工作台边抬头时说", start: 24.4, end: 29.2 },
  { id: "v011", kind: "dialogue", speaker: "收藏者", text: "您是军人吧？", delivery: "递茶时随口一问，带笑，笃定", start: 31.0, end: 33.0 },
  { id: "v012", kind: "dialogue", speaker: "收藏者", text: "现在的军人，已经不太像军人了。可您，我一眼就能看出来。", delivery: "半是感慨半是恭维，“一眼”略加重", start: 33.6, end: 38.4 },
  { id: "v013", kind: "dialogue", speaker: "章北海", text: "您也曾经是军人。", delivery: "平静的陈述句，声音低而稳，不是疑问", start: 39.2, end: 41.4 },
  { id: "v014", kind: "dialogue", speaker: "收藏者", text: "好眼力！大半辈子，都在总参测绘局。", delivery: "被说中后爽朗一笑，带点自豪", start: 42.0, end: 45.4 },
  { id: "v015", kind: "dialogue", speaker: "章北海", text: "怎么会迷上陨石呢？", delivery: "礼貌的好奇，目光扫过四壁的玻璃柜", start: 46.0, end: 48.6 },
  { id: "v016", kind: "dialogue", speaker: "收藏者", text: "它们来自尘世之外啊。", delivery: "放慢，近乎虔诚，像在介绍家人", start: 49.2, end: 52.2 },
  { id: "v017", kind: "dialogue", speaker: "收藏者", text: "我每拿到一块，就像去了一个新的外星世界。", delivery: "眼里有光，语速渐快，孩子气的兴奋", start: 52.6, end: 57.2 },
  { id: "v018", kind: "dialogue", speaker: "章北海", text: "这只是您的感觉。地球，就是一块大陨石。", delivery: "带一点笑意地摇头，语气温和却不容置疑", start: 58.0, end: 62.0 },
  { id: "v019", kind: "dialogue", speaker: "章北海", text: "我们脚下的石头是陨石，我手里的茶杯，也是陨石。", delivery: "不紧不慢，说到“茶杯”时举杯示意", start: 62.6, end: 67.0 },
  { id: "v020", kind: "dialogue", speaker: "章北海", text: "连杯里的水，据说都是彗星带来的。", delivery: "低头看茶，轻描淡写，尾音很轻", start: 67.6, end: 71.2 },
  { id: "v021", kind: "dialogue", speaker: "收藏者", text: "呵呵呵，你很精明——这就开始砍价了。", delivery: "指点着对方大笑，生意人的狡黠", start: 71.8, end: 75.8 },
  { id: "v022", kind: "dialogue", speaker: "收藏者", text: "说说看，您要什么样的？", delivery: "收住笑，进入行家口吻", start: 76.4, end: 78.8 },
  { id: "v023", kind: "dialogue", speaker: "章北海", text: "不必贵重。但要比重大，受冲击不易破碎，容易加工。", delivery: "像在念一份技术指标，三个条件逐条清晰", start: 79.4, end: 84.4 },
  { id: "v024", kind: "dialogue", speaker: "收藏者", text: "明白了，要雕刻？", delivery: "恍然，自以为猜中", start: 85.0, end: 87.2 },
  { id: "v025", kind: "dialogue", speaker: "章北海", text: "算是吧。最好，能上车床。", delivery: "“算是吧”之后有半拍停顿，声音无波澜", start: 87.8, end: 91.0 },
  { id: "v026", kind: "dialogue", speaker: "收藏者", text: "那就是铁陨石了。每立方厘米八克多，上车床没问题。", delivery: "边开柜门边说，如数家珍", start: 91.6, end: 96.0 },
  { id: "v027", kind: "dialogue", speaker: "章北海", text: "这样大小的，要三块。", delivery: "干脆，像下达数量", start: 96.6, end: 99.2 },
  { id: "v028", kind: "dialogue", speaker: "收藏者", text: "每块六万，三块十八万——怎么样？", delivery: "故意报高，试探，尾音上扬", start: 102.4, end: 106.4 },
  { id: "v029", kind: "dialogue", speaker: "章北海", text: "给个账号，我现在就付。", delivery: "没有任何犹豫，已经掏出手机", start: 107.0, end: 109.6 },
  { id: "v030", kind: "dialogue", speaker: "收藏者", text: "呵呵……其实，我是准备您还价的。", delivery: "愣了半天才出声，尴尬地干笑", start: 110.4, end: 114.0 },
  { id: "v031", kind: "dialogue", speaker: "章北海", text: "不。就这个价。", delivery: "很坚决地打断，短促", start: 114.6, end: 116.4 },
  { id: "v032", kind: "dialogue", speaker: "章北海", text: "就算是——我对要送的人的尊重吧。", delivery: "放慢、放低，目光落在三块石头上；全片第一处寒意", start: 117.0, end: 121.4 },

  // ── 车间与地下室 ──
  { id: "v040", kind: "monologue", speaker: "章北海（内心）", text: "碎屑，一粒也不能留下。", delivery: "耳语般的自我提醒，冷静、细致", start: 145.0, end: 148.6 },
  { id: "v041", kind: "monologue", speaker: "章北海（内心）", text: "三十六发，七点六二毫米。把弹头，换成陨石。", delivery: "清点式的平直语调，一字一顿", start: 150.0, end: 154.4 },
  { id: "v042", kind: "monologue", speaker: "章北海（内心）", text: "胶，是修补太空舱表皮用的。冷热交替，不会失效。", delivery: "技术说明的口吻；“太空舱”三个字不加强调，让观众自己听见", start: 155.2, end: 160.6 },
  { id: "v043", kind: "monologue", speaker: "章北海（内心）", text: "弹洞很小。飞行中，没有破碎。", delivery: "枪响后的耳鸣里，声音发闷、贴近", start: 171.0, end: 174.2 },
  { id: "v044", kind: "monologue", speaker: "章北海（内心）", text: "入肉即碎——看不出任何加工的痕迹。", delivery: "满意，但只是极轻的一点满意", start: 174.8, end: 178.8 },

  // ── 同步轨道：黄河站外五公里 ──
  { id: "v050", kind: "radio", speaker: "黄河站广播", text: "航天系统高层工作会议已经结束。全体与会人员，请到舱外集合，准备合影。", delivery: "女声公共频道广播，标准、明亮，经窄带无线电压缩，首尾有静噪声", start: 181.6, end: 188.0 },
  { id: "v051", kind: "monologue", speaker: "章北海（内心）", text: "定位单元留在了基地。这次外出，不会有任何记录。", delivery: "头盔内近讲，平稳，呼吸声垫底", start: 188.6, end: 192.8 },
  { id: "v052", kind: "monologue", speaker: "章北海（内心）", text: "脚下没有大地，四周只有空间。", delivery: "慢，松弛，几乎是享受", start: 193.8, end: 197.6 },
  { id: "v053", kind: "monologue", speaker: "章北海（内心）", text: "没有从哪里来，也不想到哪里去——只是存在着。", delivery: "更慢，句中长停顿，像漂浮本身", start: 198.2, end: 203.2 },
  { id: "v054", kind: "monologue", speaker: "章北海（内心）", text: "父亲的在天之灵，大概也是这种感觉。", delivery: "全片唯一的柔软；轻，略带沙哑", start: 204.2, end: 208.6 },
  { id: "v055", kind: "radio", speaker: "摄影师", text: "再飞远一点，才能把空间站拍全。好，停——", delivery: "年轻男声，合影频道，轻松、有点兴奋；无线电音色", start: 217.6, end: 222.0 },
  { id: "v056", kind: "radio", speaker: "摄影师", text: "后排往中间靠。前排的领导，请稍等一下。", delivery: "指挥排队的客气口吻，带笑", start: 222.8, end: 227.2 },
  { id: "v057", kind: "radio", speaker: "摄影师", text: "趁着日落，大家把面罩调成透明，露个脸。", delivery: "扬声招呼所有人", start: 228.0, end: 232.4 },
  { id: "v058", kind: "radio", speaker: "前排领导", text: "干了一辈子航天，头一回，在天上照相。", delivery: "六十多岁的男声，感慨、带笑，旁边有人轻声附和的笑", start: 233.2, end: 238.4 },
  { id: "v059", kind: "monologue", speaker: "章北海（内心）", text: "零下一百度。这只手，撑不了多久。", delivery: "压着呼吸说，短句，冷", start: 240.2, end: 244.2 },
  { id: "v060", kind: "monologue", speaker: "章北海（内心）", text: "三个月，同一套动作：取枪，装镜，换弹夹。", delivery: "节拍感，三个动作像口令", start: 245.6, end: 251.0 },
  { id: "v061", kind: "monologue", speaker: "章北海（内心）", text: "真空里没有风，没有重力。子弹一路都不会减速。", delivery: "瞄准时的自语，气息收紧", start: 252.8, end: 257.4 },
  { id: "v062", kind: "monologue", speaker: "章北海（内心）", text: "是他们，开启了太空时代的黎明。", delivery: "敬意是真的；平缓", start: 258.4, end: 261.6 },
  { id: "v063", kind: "monologue", speaker: "章北海（内心）", text: "可人类要造出恒星际飞船，就必须越过他们。", delivery: "没有恨意，只有结论；句末屏息", start: 262.2, end: 266.2 },
  { id: "v064", kind: "monologue", speaker: "章北海（内心）", text: "十秒。但愿他们，不要移动。", delivery: "近乎祈祷，极轻", start: 280.8, end: 284.4 },
  { id: "v065", kind: "monologue", speaker: "章北海（内心）", text: "无辜？……他们三个，也是无辜的。", delivery: "自问自答，“无辜”之后停一拍，声音第一次有重量", start: 285.6, end: 290.0 },
  { id: "v066", kind: "radio", speaker: "合影者甲", text: "怎么回事？！他的航天服在漏气！", delivery: "惊叫，破音，无线电过载失真", start: 294.4, end: 297.2 },
  { id: "v067", kind: "radio", speaker: "合影者乙", text: "陨石雨！是陨石雨！！", delivery: "女声，嘶喊，与警报声叠在一起", start: 297.8, end: 300.6 },
  { id: "v068", kind: "radio", speaker: "摄影师", text: "全体回舱！全功率！把伤员拖回去，快！", delivery: "先前轻松的声音完全变了，吼", start: 301.2, end: 304.8 },
  { id: "v069", kind: "monologue", speaker: "章北海（内心）", text: "……陨石雨。", delivery: "他听不见，只是从口型里读出了这个词；确认，极静", start: 305.8, end: 308.0 },
  { id: "v070", kind: "monologue", speaker: "章北海（内心）", text: "三个目标，各中五发以上。另有两人，是我故意打偏的。", delivery: "战果清点，毫无起伏", start: 309.2, end: 314.4 },
  { id: "v071", kind: "monologue", speaker: "章北海（内心）", text: "这样，才更像一场陨石雨。", delivery: "低，冷，句末几乎没有气息", start: 315.0, end: 318.2 },
  { id: "v072", kind: "monologue", speaker: "章北海（内心）", text: "这并不能保证什么。但我做了我能做的。", delivery: "疲惫之后的平静", start: 320.4, end: 325.0 },
  { id: "v073", kind: "monologue", speaker: "章北海（内心）", text: "父亲。无论以后发生什么——现在，我可以安心了。", delivery: "“父亲”单独成句，停顿；其余像一声长长的呼气", start: 326.6, end: 332.6 },

  // ── 尾声 ──
  { id: "v074", kind: "broadcast", speaker: "新闻广播", text: "……黄河空间站今日遭遇罕见陨石雨，三名航天系统负责人不幸遇难。", delivery: "老式收音机里的男播音员，沉痛、标准，小喇叭音色", start: 336.2, end: 343.4 },
  { id: "v075", kind: "dialogue", speaker: "收藏者", text: "陨石雨……", delivery: "停下手里的活，喃喃自语；惋惜里藏着一个收藏者本能的神往", start: 344.2, end: 346.6 },
];
