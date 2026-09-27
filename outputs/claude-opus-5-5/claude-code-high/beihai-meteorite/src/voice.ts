import type { VoiceCue } from "@agentbench/cinematic-player";

/**
 * Complete speech manifest. Every subtitle on screen is driven from this list;
 * dubbing can be attached later by `id`. No voice is synthesised.
 */
export const voiceCues: VoiceCue[] = [
  // ── Cold open: geosynchronous orbit, waiting.
  { id: "vo-001", kind: "radio", speaker: "电梯调度", text: "E-17，你偏离航道了，注意避开缆绳禁区。", delivery: "值班调度，语速快而平淡，例行公事；无线电压缩、轻微底噪", start: 13.4, end: 17.2 },
  { id: "vo-002", kind: "radio", speaker: "E-17号飞行者", text: "收到，E-17修正航向。", delivery: "年轻、随意，喘着一点气，像骑车人回话；无线电质感", start: 17.6, end: 20.0 },
  { id: "vo-003", kind: "monologue", speaker: "章北海（内心）", text: "脚下没有大地，四周只有空间。", delivery: "极轻、极慢，贴着耳朵的内心声，几乎不带情绪", start: 21.0, end: 25.2 },
  { id: "vo-004", kind: "monologue", speaker: "章北海（内心）", text: "没有从哪里来，也不想到哪里去，只是存在着。", delivery: "平静，带一丝享受；句间留呼吸", start: 27.8, end: 32.6 },
  { id: "vo-005", kind: "monologue", speaker: "章北海（内心）", text: "父亲的在天之灵，也许就是这种感觉。", delivery: "更低一度，温柔，尾音收住不外露", start: 33.4, end: 38.2 },

  // ── Flashback: the collector's courtyard house.
  { id: "vo-006", kind: "dialogue", speaker: "收藏者", text: "来了？快请进，随便看。", delivery: "热情爽朗，京腔，从工作台后抬头，手里还捏着放大镜", start: 53.0, end: 55.8 },
  { id: "vo-007", kind: "dialogue", speaker: "收藏者", text: "您是军人吧。", delivery: "边倒茶边随口一问，笃定而非疑问", start: 63.0, end: 65.0 },
  { id: "vo-008", kind: "dialogue", speaker: "收藏者", text: "现在的军人都不太像军人了，可您，我一眼就看得出来。", delivery: "得意，带点老派的感慨，笑着", start: 65.4, end: 70.2 },
  { id: "vo-009", kind: "dialogue", speaker: "章北海", text: "您也当过兵。", delivery: "温和、简短，微笑；陈述句", start: 70.8, end: 72.6 },
  { id: "vo-010", kind: "dialogue", speaker: "收藏者", text: "好眼力。总参测绘局，干了大半辈子。", delivery: "被说中的高兴，拍一下膝盖", start: 73.0, end: 77.4 },
  { id: "vo-011", kind: "dialogue", speaker: "收藏者", text: "它们来自尘世之外。每拿到一块，就像去了一趟新的外星世界。", delivery: "压低声音，近乎虔诚，眼睛盯着手里的石头", start: 80.6, end: 86.0 },
  { id: "vo-012", kind: "dialogue", speaker: "章北海", text: "地球本来就是星际物质聚成的——它自己就是一块大陨石。", delivery: "笑着摇头，轻松的抬杠语气", start: 86.6, end: 91.4 },
  { id: "vo-013", kind: "dialogue", speaker: "章北海", text: "听说地球上的水是彗星带来的。所以这杯茶，也是陨石。", delivery: "举起茶杯示意，半开玩笑，节奏放慢在最后四个字", start: 91.8, end: 96.6 },
  { id: "vo-014", kind: "dialogue", speaker: "收藏者", text: "呵呵呵……你很精明，已经开始砍价了。", delivery: "指着对方大笑，识破小把戏的快活", start: 96.9, end: 100.0 },
  { id: "vo-015", kind: "dialogue", speaker: "收藏者", text: "说说看，您需要什么样的？", delivery: "转入正题，生意人的利落", start: 100.6, end: 103.6 },
  { id: "vo-016", kind: "dialogue", speaker: "章北海", text: "不用太贵重。比重要大，受冲击不易碎，容易加工。", delivery: "平稳、精确，像在念技术指标；三个条件之间有停顿", start: 104.0, end: 109.4 },
  { id: "vo-017", kind: "dialogue", speaker: "收藏者", text: "要雕刻是吧？", delivery: "恍然，自以为猜中", start: 109.9, end: 111.6 },
  { id: "vo-018", kind: "dialogue", speaker: "章北海", text: "算是吧。最好能上车床。", delivery: "略一迟疑后点头，轻描淡写", start: 112.0, end: 114.8 },
  { id: "vo-019", kind: "dialogue", speaker: "收藏者", text: "那就是铁陨石了。铁和镍，每立方厘米八克多，车床加工没问题。", delivery: "如数家珍，越说越有兴致", start: 115.3, end: 121.2 },
  { id: "vo-020", kind: "dialogue", speaker: "章北海", text: "这样大小的，有三块吗？", delivery: "不看价签，只看石头；平静", start: 122.6, end: 125.4 },
  { id: "vo-021", kind: "dialogue", speaker: "收藏者", text: "三块成色都好——每块六万，三块十八万，怎么样？", delivery: "为要价做足铺垫后报数，试探，留出还价余地", start: 126.0, end: 131.0 },
  { id: "vo-022", kind: "dialogue", speaker: "章北海", text: "给个账号吧，我现在就付款。", delivery: "干脆，毫不犹豫，已经掏出手机", start: 131.6, end: 134.4 },
  { id: "vo-023", kind: "dialogue", speaker: "收藏者", text: "呵呵……其实，我是准备你还价的。", delivery: "愣住两秒后尴尬地笑，有点不好意思", start: 136.6, end: 140.0 },
  { id: "vo-024", kind: "dialogue", speaker: "章北海", text: "不，就这个价。", delivery: "坚决地打断，不重但不容商量", start: 140.6, end: 142.2 },
  { id: "vo-025", kind: "dialogue", speaker: "章北海", text: "就算是……表示我对要送的人的尊重吧。", delivery: "垂眼看着陨石，声音放轻；平静之下有重量，不解释", start: 143.2, end: 147.6 },

  // ── Present: the sun touches the Earth.
  { id: "vo-026", kind: "broadcast", speaker: "黄河站广播", text: "航天系统工作会议已结束。请与会人员前往三号气闸，日落时分舱外合影。", delivery: "站内公共广播经公共频道转发，标准播音腔，礼貌而程式化", start: 150.0, end: 156.5 },

  // ── Basement test.
  { id: "vo-027", kind: "monologue", speaker: "章北海（内心）", text: "弹孔很小。出膛的时候，它没有碎。", delivery: "耳鸣尚未散去，声音像隔着一层；冷静核对", start: 214.6, end: 218.8 },
  { id: "vo-028", kind: "monologue", speaker: "章北海（内心）", text: "航天服的面料，夹层里是保温棉和管线。", delivery: "陈述，像实验记录", start: 219.4, end: 223.8 },
  { id: "vo-029", kind: "monologue", speaker: "章北海（内心）", text: "碎了。看不出一点加工的痕迹。", delivery: "极轻，带一丝满意；最后一字落下后长停顿", start: 226.0, end: 230.4 },

  // ── Present: the airlock opens.
  { id: "vo-030", kind: "radio", speaker: "三号气闸控制", text: "三号气闸泄压完毕，舱门开启。", delivery: "机械、清晰的操作员报读，无线电质感", start: 239.0, end: 242.6 },
  { id: "vo-031", kind: "radio", speaker: "摄影师", text: "各位领导往中间靠一靠，后两排再往下一点……", delivery: "忙碌、客气，边比划边说，带笑意", start: 247.0, end: 251.6 },
  { id: "vo-032", kind: "radio", speaker: "摄影师", text: "光线正好。面罩调透明，大家露个脸。", delivery: "轻快，满意于夕照", start: 252.2, end: 256.0 },
  { id: "vo-033", kind: "radio", speaker: "与会者甲", text: "老了，出一趟舱跟打仗似的。", delivery: "上了年纪的自嘲，喘气，笑", start: 258.0, end: 261.0 },
  { id: "vo-034", kind: "radio", speaker: "与会者乙", text: "当年咱们几个，连上来的机会都没有啊。", delivery: "感慨、温和，带着老一辈的满足", start: 261.5, end: 265.6 },

  // ── Preparing to fire.
  { id: "vo-035", kind: "monologue", speaker: "章北海（内心）", text: "他们用微薄的投入，如履薄冰，开启了太空时代的黎明。", delivery: "真诚的敬意，缓慢；不是反讽", start: 267.0, end: 272.4 },
  { id: "vo-036", kind: "monologue", speaker: "章北海（内心）", text: "也正是那段经历，禁锢了他们的思想。", delivery: "语气一转，变硬、变冷", start: 273.2, end: 277.4 },
  { id: "vo-037", kind: "monologue", speaker: "章北海（内心）", text: "要得到能飞向群星的飞船，他们就必须消失。", delivery: "决断，平铺直叙，没有犹豫的余地", start: 278.4, end: 283.4 },

  // ── Ten seconds of flight.
  { id: "vo-038", kind: "radio", speaker: "摄影师", text: "好，都别动——等推进器的雾散一散。", delivery: "专注，压低，像按住呼吸", start: 299.4, end: 303.2 },
  { id: "vo-039", kind: "radio", speaker: "摄影师", text: "三——", delivery: "拉长的倒数", start: 303.8, end: 304.8 },
  { id: "vo-040", kind: "monologue", speaker: "章北海（内心）", text: "别动。", delivery: "几乎是祈祷，气声", start: 305.0, end: 306.2 },
  { id: "vo-041", kind: "radio", speaker: "摄影师", text: "二——", delivery: "拉长的倒数，下一拍被打断", start: 306.4, end: 307.6 },

  // ── Impact.
  { id: "vo-042", kind: "radio", speaker: "与会者", text: "陨石雨！", delivery: "尖叫，破音；无线电过载削波", start: 309.4, end: 310.8 },
  { id: "vo-043", kind: "radio", speaker: "与会者", text: "是陨石雨！快回站里！", delivery: "多人叠声的惊叫，混乱，气喘", start: 311.2, end: 313.6 },
  { id: "vo-044", kind: "broadcast", speaker: "黄河站广播", text: "警报：三号气闸外发生微陨石撞击，救援组立即出舱！", delivery: "急促但克制的值班员，背后警报声", start: 314.0, end: 318.4 },
  { id: "vo-045", kind: "radio", speaker: "与会者", text: "拉住他！往回拖！", delivery: "嘶喊，用力，呼吸急促", start: 318.8, end: 321.2 },

  // ── Return.
  { id: "vo-046", kind: "monologue", speaker: "章北海（内心）", text: "他们死了，辐射推进也未必就能成为方向。", delivery: "寒冷而平静，像在复盘", start: 325.8, end: 330.4 },
  { id: "vo-047", kind: "monologue", speaker: "章北海（内心）", text: "但我做了我能做的。父亲，我可以安心了。", delivery: "放松下来，第一次带出温度；“父亲”前停半拍", start: 331.0, end: 335.6 },

  // ── Coda: the collector's house, days later.
  { id: "vo-048", kind: "broadcast", speaker: "新闻广播", text: "本台消息：黄河空间站外昨日发生微陨石撞击事故，三名航天系统资深专家不幸遇难。", delivery: "老式收音机里的新闻播音，端正、略带电流声", start: 337.0, end: 343.2 },
  { id: "vo-049", kind: "broadcast", speaker: "新闻广播", text: "专家指出，近地轨道陨石雨极为罕见，属不可抗拒的自然事故。", delivery: "同上，平稳收尾", start: 343.6, end: 348.0 },
  { id: "vo-050", kind: "dialogue", speaker: "收藏者", text: "陨石雨……", delivery: "喃喃自语，带着收藏家的向往，毫无察觉", start: 348.3, end: 349.8 },
];
