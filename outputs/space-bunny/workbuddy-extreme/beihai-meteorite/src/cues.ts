/**
 * 语音 cue 清单。
 * 每条固定包含 id / kind / speaker / text / delivery / start / end 七个字段，
 * 字幕直接由本清单驱动，便于后期按 id 逐条配音接入。
 *
 * kind: dialogue 对白 | narration 旁白 | inner 内心独白 | comm 通讯 | ambient 场景内闲聊
 * 时间轴总长 348 秒，硬上限 360 秒。
 */
export interface Cue {
  id: string
  kind: 'dialogue' | 'narration' | 'inner' | 'comm' | 'ambient'
  speaker: string
  text: string
  delivery: string
  start: number
  end: number
}

export const CUES: Cue[] = [
  // ---------- 第一幕：水面之上（0-72s）----------
  {
    id: 'n01',
    kind: 'narration',
    speaker: '旁白',
    text: '公元二〇六八年，冬至。',
    delivery: '平静、克制，像纪录片开篇',
    start: 6,
    end: 13
  },
  {
    id: 'n02',
    kind: 'narration',
    speaker: '旁白',
    text: '罗辑行星的引力弹弓仍在工作，以三千公里每秒掠过海王星轨道。',
    delivery: '平稳叙述，略带距离感',
    start: 15,
    end: 26
  },
  {
    id: 'n03',
    kind: 'inner',
    speaker: '章北海',
    text: '四个世纪，只换来了两个字： 黑暗森林威慑。',
    delivery: '低声自语，几乎是自语的音量',
    start: 29,
    end: 37
  },
  {
    id: 'n04',
    kind: 'ambient',
    speaker: '舱内',
    text: '广播里的天气预报还在播报明日有雨。',
    delivery: '环境音，人声模糊，机械底噪',
    start: 40,
    end: 48
  },
  {
    id: 'n05',
    kind: 'inner',
    speaker: '章北海',
    text: '威慑纪元的人们早已忘了黑暗森林。',
    delivery: '平静陈述，不带情绪',
    start: 50,
    end: 59
  },
  {
    id: 'n06',
    kind: 'comm',
    speaker: '舰桥值班员',
    text: '舰长，古建国的全息通讯请求接入。',
    delivery: '公事公办的播报腔，合成音',
    start: 62,
    end: 71
  },

  // ---------- 第二幕：面壁者（72-168s）----------
  {
    id: 'n07',
    kind: 'dialogue',
    speaker: '希恩斯',
    text: '章北海，你的计划书上只写了四个字：保持威慑。',
    delivery: '压抑的克制，字斟句酌',
    start: 78,
    end: 88
  },
  {
    id: 'n08',
    kind: 'dialogue',
    speaker: '章北海',
    text: '四个字够了。剩下三千年，我们替他们想。',
    delivery: '沉稳，不容置疑',
    start: 90,
    end: 99
  },
  {
    id: 'n09',
    kind: 'dialogue',
    speaker: '希恩斯',
    text: '你是在赌后人会理解你。',
    delivery: '质疑，带着一点不解',
    start: 101,
    end: 108
  },
  {
    id: 'n10',
    kind: 'dialogue',
    speaker: '章北海',
    text: '不是赌。是赌他们只有这一条路可走。',
    delivery: '平静的陈述，末尾略沉',
    start: 110,
    end: 119
  },
  {
    id: 'n11',
    kind: 'inner',
    speaker: '章北海',
    text: '父亲的死教会我一件事：善良需要实力。',
    delivery: '内心，压抑，无回声',
    start: 122,
    end: 131
  },
  {
    id: 'n12',
    kind: 'dialogue',
    speaker: '比尔·希恩斯',
    text: '如果三千年后他们恨你怎么办？',
    delivery: '罕见地提高音量，随即又压下',
    start: 134,
    end: 142
  },
  {
    id: 'n13',
    kind: 'dialogue',
    speaker: '章北海',
    text: '那就恨。活着，比被原谅重要。',
    delivery: '极轻，却极硬',
    start: 144,
    end: 153
  },
  {
    id: 'n14',
    kind: 'narration',
    speaker: '旁白',
    text: '会议散去时，他没回头。',
    delivery: '叙述，节奏放慢',
    start: 156,
    end: 164
  },

  // ---------- 第三幕：面壁者号（168-248s）----------
  {
    id: 'n15',
    kind: 'inner',
    speaker: '章北海',
    text: '自然选择，前进四。',
    delivery: '命令式，一字一顿',
    start: 172,
    end: 178
  },
  {
    id: 'n16',
    kind: 'ambient',
    speaker: '舰员',
    text: '主引擎启动，舰体震动明显。',
    delivery: '闷响中的人声，含混',
    start: 180,
    end: 188
  },
  {
    id: 'n17',
    kind: 'dialogue',
    speaker: '东方延绪',
    text: '你真的相信，一艘船就能骗过整个太阳系？',
    delivery: '质疑，带着不安',
    start: 191,
    end: 200
  },
  {
    id: 'n18',
    kind: 'dialogue',
    speaker: '章北海',
    text: '不是骗。是让他们算错。',
    delivery: '冷静，甚至带一点笑意',
    start: 202,
    end: 210
  },
  {
    id: 'n19',
    kind: 'inner',
    speaker: '章北海',
    text: '我是最后一个执剑人，也是唯一的逃逸者。',
    delivery: '内心独白，冷静到近乎无情',
    start: 214,
    end: 223
  },
  {
    id: 'n20',
    kind: 'dialogue',
    speaker: '东方延绪',
    text: '如果你走了，这里谁说了算？',
    delivery: '压低声音',
    start: 226,
    end: 233
  },
  {
    id: 'n21',
    kind: 'dialogue',
    speaker: '章北海',
    text: '无人。',
    delivery: '极短，斩钉截铁',
    start: 235,
    end: 238
  },
  {
    id: 'n22',
    kind: 'narration',
    speaker: '旁白',
    text: '他给史强留了一颗子弹，和一句话。',
    delivery: '叙述，悬念',
    start: 241,
    end: 248
  },

  // ---------- 第四幕：陨石（248-330s）----------
  {
    id: 'n23',
    kind: 'comm',
    speaker: '史强',
    text: '章北海！你他妈还在里面！',
    delivery: '无线电失真，歇斯底里',
    start: 254,
    end: 262
  },
  {
    id: 'n24',
    kind: 'inner',
    speaker: '章北海',
    text: '他是自然选择，我是最后一道保险。',
    delivery: '内心，静',
    start: 265,
    end: 273
  },
  {
    id: 'n25',
    kind: 'inner',
    speaker: '章北海',
    text: '如果三千年后有人清算我，就让他们记起今天。',
    delivery: '内心，沉重',
    start: 276,
    end: 285
  },
  {
    id: 'n26',
    kind: 'dialogue',
    speaker: '章北海',
    text: '前进四。',
    delivery: '无线电静默中的一次低语，命令',
    start: 288,
    end: 292
  },
  {
    id: 'n27',
    kind: 'narration',
    speaker: '旁白',
    text: '那一刻，他成为了一颗陨石。',
    delivery: '叙述，最沉',
    start: 296,
    end: 303
  },
  {
    id: 'n28',
    kind: 'inner',
    speaker: '章北海',
    text: '我的母亲叫我回来。她说她在等我。',
    delivery: '内心，罕见地温柔',
    start: 306,
    end: 314
  },
  {
    id: 'n29',
    kind: 'narration',
    speaker: '旁白',
    text: '她的名字，叫罗辑。',
    delivery: '极轻，几乎是气声',
    start: 316,
    end: 322
  },
  {
    id: 'n30',
    kind: 'inner',
    speaker: '章北海',
    text: '主桅杆还在。不，还有陨石。',
    delivery: '内心，已在远去',
    start: 323,
    end: 329
  },

  // ---------- 尾（330-348s）----------
  {
    id: 'n31',
    kind: 'narration',
    speaker: '旁白',
    text: '三千年后，人类会记得他吗？',
    delivery: '提问，开放式',
    start: 332,
    end: 338
  },
  {
    id: 'n32',
    kind: 'narration',
    speaker: '旁白',
    text: '他从未打算被记得。',
    delivery: '收束，平静',
    start: 340,
    end: 347
  }
]

/** 按时间取当前应显示的 cue */
export function activeCue(t: number): Cue | null {
  for (const c of CUES) {
    if (t >= c.start && t <= c.end) return c
  }
  return null
}

export const TOTAL_DURATION = 348
