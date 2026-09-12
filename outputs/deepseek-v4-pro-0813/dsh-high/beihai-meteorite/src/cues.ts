import type { SoundCue, VoiceCue } from "@agentbench/cinematic-player";

/**
 * 全片唯一的语音 cue 清单（后期按 id 逐条配音并接入）。
 * 每个 cue 固定包含 id / kind / speaker / text / delivery / start / end 七个字段。
 * 字幕直接由这份清单驱动，屏幕上统一显示为【说话者】文本。
 */
export const voiceCues: VoiceCue[] = [
  // ── 第一幕 · 陨石 ──────────────────────────────────────────────
  {
    id: "v001",
    kind: "narration",
    speaker: "旁白",
    text: "它，始于三块来自天外的石头。",
    delivery: "低沉、缓慢，像在黑暗里点亮一盏灯，句尾悬停",
    start: 2.0,
    end: 10.0,
  },
  {
    id: "v002",
    kind: "dialogue",
    speaker: "收藏者",
    text: "您是军人吧。",
    delivery: "端茶时顺势一问，热络而笃定",
    start: 15.0,
    end: 18.5,
  },
  {
    id: "v003",
    kind: "dialogue",
    speaker: "章北海",
    text: "您也曾经是军人。",
    delivery: "平静，一眼看穿对方，不带情绪",
    start: 18.5,
    end: 22.0,
  },
  {
    id: "v004",
    kind: "dialogue",
    speaker: "收藏者",
    text: "我大半辈子都在总参测绘局。在南极的雪下面找陨石——它们来自尘世之外。",
    delivery: "带点自豪，语速渐快，说到“尘世之外”放轻",
    start: 32.0,
    end: 40.5,
  },
  {
    id: "v005",
    kind: "dialogue",
    speaker: "章北海",
    text: "地球就是一块大陨石，这茶杯里的水，也是彗星带来的陨石。",
    delivery: "半开玩笑，温和，举了举茶杯",
    start: 41.0,
    end: 47.0,
  },
  {
    id: "v006",
    kind: "dialogue",
    speaker: "收藏者",
    text: "呵呵，你很精明，已经开始砍价了。",
    delivery: "笑着，指点对方，语气亲热",
    start: 47.0,
    end: 51.0,
  },
  {
    id: "v007",
    kind: "dialogue",
    speaker: "章北海",
    text: "不需要贵重的。但比重要大，冲击下不易破碎，易加工——最好能车床加工。",
    delivery: "认真、克制，逐条说清，是买家也是军人的口吻",
    start: 56.0,
    end: 64.5,
  },
  {
    id: "v008",
    kind: "dialogue",
    speaker: "收藏者",
    text: "那就是铁陨石。每立方厘米八克多，金属性很强，车床没问题。",
    delivery: "专业、热切，如数家珍",
    start: 66.0,
    end: 72.5,
  },
  {
    id: "v009",
    kind: "dialogue",
    speaker: "收藏者",
    text: "这样大小的，每块六万，三块十八万。",
    delivery: "铺垫式报价，末尾略迟疑，等着对方还价",
    start: 75.0,
    end: 80.0,
  },
  {
    id: "v010",
    kind: "dialogue",
    speaker: "章北海",
    text: "我接受。就算是我对要送的人的尊重。",
    delivery: "斩钉截铁，没有还价，后半句低而郑重",
    start: 80.5,
    end: 85.5,
  },

  // ── 第二幕 · 未来 ──────────────────────────────────────────────
  {
    id: "v011",
    kind: "narration",
    speaker: "旁白",
    text: "太空电梯建成，可控核聚变突破。可冷静的人知道：人类刚刚来到海岸边，连造船的船坞，都还没有搭起来。",
    delivery: "新闻纪录片式的克制，后两句下沉，像在提醒",
    start: 86.0,
    end: 100.0,
  },
  {
    id: "v012",
    kind: "dialogue",
    speaker: "常伟思",
    text: "上级决定，实施增援未来计划。你，是第一支特遣队的指挥官。",
    delivery: "沉稳的上级口吻，一字一句，庄重",
    start: 106.0,
    end: 113.5,
  },
  {
    id: "v013",
    kind: "dialogue",
    speaker: "章北海",
    text: "进入冬眠前，让特遣队至少在太空中实习工作一年。上级不希望我们，成为那时不能出海的舰队政委吧？",
    delivery: "语气平缓却坚定，末尾是反问而非玩笑",
    start: 114.5,
    end: 124.5,
  },

  // ── 第三幕 · 制作 ──────────────────────────────────────────────
  {
    id: "v014",
    kind: "narration",
    speaker: "旁白",
    text: "深夜，车间空无一人。他把三块陨石，切成了三十六个圆柱。",
    delivery: "低语，机械声里几不可闻，只作必要交代",
    start: 134.0,
    end: 142.0,
  },
  {
    id: "v015",
    kind: "narration",
    speaker: "旁白",
    text: "两年前，全军换装无壳子弹。弹头直接粘在发射药上——取下来，很容易。",
    delivery: "冷静的说明，像在读一份技术手册",
    start: 160.0,
    end: 168.5,
  },
  {
    id: "v016",
    kind: "narration",
    speaker: "旁白",
    text: "四发试射，弹头在牛肉里碎成看不出加工痕迹的石屑。他满意了。",
    delivery: "压抑、克制，末尾“满意了”几乎无语气",
    start: 185.0,
    end: 192.5,
  },

  // ── 第四幕 · 等待 ──────────────────────────────────────────────
  {
    id: "v017",
    kind: "narration",
    speaker: "旁白",
    text: "在同步轨道的基地里，他等了三个月。现在，机会出现了。",
    delivery: "渐强的悬念感，最后一句压得极低",
    start: 200.0,
    end: 208.5,
  },
  {
    id: "v018",
    kind: "monologue",
    speaker: "章北海",
    text: "我飘浮在这片虚空中，已经斩断了与那个蓝色世界的联系。没有从哪里来，也不想到哪里去，只是存在着。",
    delivery: "内心独白，空旷、缓慢，像在失重里对自己说",
    start: 224.0,
    end: 237.0,
  },
  {
    id: "v019",
    kind: "monologue",
    speaker: "章北海",
    text: "父亲的在天之灵，大概，也是这种感觉。",
    delivery: "极轻，几近气声，尾音消散",
    start: 238.0,
    end: 245.0,
  },

  // ── 第五幕 · 射击 ──────────────────────────────────────────────
  {
    id: "v020",
    kind: "monologue",
    speaker: "章北海",
    text: "在地球上，最精良的狙击步枪也打不到五公里。可在太空中，一支手枪就够了。",
    delivery: "冷静到近乎冷酷的计算，语气平稳",
    start: 256.0,
    end: 265.0,
  },
  {
    id: "v021",
    kind: "monologue",
    speaker: "章北海",
    text: "这三个人，也是无辜的。可为了得到能够恒星际航行的飞船，必须消灭他们。他们的死，是对人类太空事业最后的贡献。",
    delivery: "内心审判般的独白，坚定、缓慢，没有犹豫",
    start: 286.0,
    end: 299.5,
  },
  {
    id: "v022",
    kind: "chatter",
    speaker: "人群",
    text: "陨石雨！",
    delivery: "透过面罩的口型读出，惊惶，短促",
    start: 307.0,
    end: 311.0,
  },

  // ── 第六幕 · 尾声 ──────────────────────────────────────────────
  {
    id: "v023",
    kind: "monologue",
    speaker: "章北海",
    text: "我做了自己能做的。无论以后发生什么，在父亲投下的目光中，我可以安心了。",
    delivery: "尘埃落定后的平静，最后一句松弛下来",
    start: 316.0,
    end: 328.5,
  },
  {
    id: "v024",
    kind: "narration",
    speaker: "旁白",
    text: "石头来自天外，也终将，归于天外。",
    delivery: "收束全片，悠远、留白，像呼吸停止前的一次叹息",
    start: 336.0,
    end: 344.5,
  },
];

/** 三十次击发的绝对时刻（与画面 muzzle flash / 弹道严格对齐）。 */
export const FIRE_TIMES: number[] = (() => {
  const times: number[] = [];
  const mags = [278.5, 282.0, 285.5];
  for (const start of mags) {
    for (let i = 0; i < 10; i += 1) times.push(start + i * 0.3);
  }
  return times;
})();

/** 子弹命中目标、白汽与血冰出现的绝对时刻。 */
export const IMPACT_TIME = 297.8;

/**
 * 全片声音 cue 清单。真空中的外部枪声一律不发声，只保留航天服内
 * 主观化的闷震（vac-thump）与供氧呼吸声；其他机械、脚步、撞击、
 * 推进器、门与混响枪声按分镜同步。
 */
export const soundCues: SoundCue[] = [
  // 第一幕 · 老宅
  { id: "sfx-shop-amb", kind: "sound", sound: "room-tone", group: "amb", gain: 0.16, sustain: true, start: 12.0, end: 86.0 },
  { id: "sfx-door-open", kind: "sound", sound: "door-open", group: "sfx", gain: 0.5, start: 13.2, end: 13.9 },
  { id: "sfx-door-close", kind: "sound", sound: "door-close", group: "sfx", gain: 0.45, start: 14.6, end: 15.2 },
  { id: "sfx-step-shop-1", kind: "sound", sound: "footstep-wood", group: "sfx", gain: 0.4, start: 14.0, end: 14.5 },
  { id: "sfx-step-shop-2", kind: "sound", sound: "footstep-wood", group: "sfx", gain: 0.4, start: 16.0, end: 16.5 },
  { id: "sfx-step-shop-3", kind: "sound", sound: "footstep-wood", group: "sfx", gain: 0.36, start: 30.0, end: 30.5 },
  { id: "sfx-step-shop-4", kind: "sound", sound: "footstep-wood", group: "sfx", gain: 0.36, start: 31.0, end: 31.5 },
  { id: "sfx-glass-1", kind: "sound", sound: "glass-light", group: "sfx", gain: 0.32, start: 33.5, end: 34.2 },
  { id: "sfx-metal-light-1", kind: "sound", sound: "metal-light", group: "sfx", gain: 0.4, start: 60.0, end: 60.6 },
  { id: "sfx-metal-light-2", kind: "sound", sound: "metal-light", group: "sfx", gain: 0.4, start: 68.0, end: 68.6 },
  { id: "sfx-metal-medium-1", kind: "sound", sound: "metal-medium", group: "sfx", gain: 0.5, start: 77.0, end: 77.7 },
  { id: "sfx-click-1", kind: "sound", sound: "ui-click", group: "sfx", gain: 0.4, start: 81.5, end: 82.2 },

  // 第二幕 · 未来
  { id: "sfx-elevator-amb", kind: "sound", sound: "space-drone", group: "amb", gain: 0.13, sustain: true, start: 86.0, end: 104.0 },
  { id: "sfx-office-amb", kind: "sound", sound: "room-tone", group: "amb", gain: 0.15, sustain: true, start: 104.0, end: 132.0 },

  // 第三幕 · 制作
  { id: "sfx-lathe-whine", kind: "sound", sound: "lathe-whine", group: "amb", gain: 0.2, sustain: true, start: 132.0, end: 158.0 },
  { id: "sfx-lathe-spin", kind: "sound", sound: "engine-circular", group: "amb", gain: 0.28, sustain: true, start: 132.5, end: 158.0 },
  { id: "sfx-lathe-switch", kind: "sound", sound: "ui-switch", group: "sfx", gain: 0.4, start: 133.0, end: 133.6 },
  { id: "sfx-cut-1", kind: "sound", sound: "mining", group: "sfx", gain: 0.55, start: 136.0, end: 138.0 },
  { id: "sfx-cut-2", kind: "sound", sound: "mining", group: "sfx", gain: 0.55, start: 142.0, end: 144.0 },
  { id: "sfx-cut-3", kind: "sound", sound: "mining", group: "sfx", gain: 0.55, start: 148.0, end: 150.0 },
  { id: "sfx-metal-light-3", kind: "sound", sound: "metal-light", group: "sfx", gain: 0.42, start: 145.5, end: 146.1 },
  { id: "sfx-basement-amb", kind: "sound", sound: "room-tone", group: "amb", gain: 0.16, sustain: true, start: 158.0, end: 198.0 },
  { id: "sfx-metal-light-4", kind: "sound", sound: "metal-light", group: "sfx", gain: 0.4, start: 162.5, end: 163.1 },
  { id: "sfx-metal-light-5", kind: "sound", sound: "metal-light", group: "sfx", gain: 0.4, start: 164.5, end: 165.1 },
  { id: "sfx-metal-light-6", kind: "sound", sound: "metal-light", group: "sfx", gain: 0.4, start: 166.5, end: 167.1 },
  { id: "sfx-metal-medium-2", kind: "sound", sound: "metal-medium", group: "sfx", gain: 0.45, start: 174.0, end: 174.7 },
  { id: "sfx-step-base-1", kind: "sound", sound: "footstep-concrete", group: "sfx", gain: 0.38, start: 160.0, end: 160.5 },
  { id: "sfx-step-base-2", kind: "sound", sound: "footstep-concrete", group: "sfx", gain: 0.38, start: 176.0, end: 176.5 },
  { id: "sfx-gunshot-1", kind: "sound", sound: "gunshot", group: "sfx", gain: 0.95, start: 184.6, end: 185.8 },
  { id: "sfx-meat-1", kind: "sound", sound: "soft-heavy", group: "sfx", gain: 0.5, start: 184.7, end: 185.3 },

  // 第四幕 · 等待（进入太空）
  { id: "sfx-space-drone", kind: "sound", sound: "space-drone", group: "amb", gain: 0.2, sustain: true, start: 198.0, end: 348.0 },
  { id: "sfx-suit-breath", kind: "sound", sound: "suit-breath", group: "amb", gain: 0.26, sustain: true, start: 198.0, end: 336.0 },
  { id: "sfx-oxygen", kind: "sound", sound: "oxygen-hiss", group: "amb", gain: 0.11, sustain: true, start: 198.0, end: 336.0 },
  { id: "sfx-radio-1", kind: "sound", sound: "computer-noise", group: "sfx", gain: 0.3, start: 200.0, end: 204.0 },
  { id: "sfx-thruster-1", kind: "sound", sound: "thruster", group: "sfx", gain: 0.5, start: 204.0, end: 207.5 },
  { id: "sfx-thruster-2", kind: "sound", sound: "thruster", group: "sfx", gain: 0.42, start: 214.0, end: 217.0 },

  // 第五幕 · 射击（真空：外部无枪声，仅主观闷震）
  ...FIRE_TIMES.map((t, i): SoundCue => ({
    id: `sfx-vac-thump-${String(i + 1).padStart(2, "0")}`,
    kind: "sound",
    sound: "vac-thump",
    group: "sfx",
    gain: 0.5,
    start: t,
    end: t + 0.28,
  })),

  // 第六幕 · 尾声
  { id: "sfx-thruster-3", kind: "sound", sound: "thruster", group: "sfx", gain: 0.5, start: 318.0, end: 322.0 },
  { id: "sfx-radio-2", kind: "sound", sound: "computer-noise", group: "sfx", gain: 0.3, start: 320.0, end: 326.0 },
  { id: "sfx-alarm", kind: "sound", sound: "alarm", group: "sfx", gain: 0.14, start: 320.0, end: 326.0 },
];
