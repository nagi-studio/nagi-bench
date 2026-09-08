/**
 * VOICE CUE MANIFEST
 * ==================
 *
 * Every intended spoken line in the film lives here, and only here. The
 * on-screen subtitle is rendered directly from this table, so a later pass can
 * record each line by `id` and drop it in without touching the direction.
 *
 * Presentation is fixed: bottom-centre, `【speaker】text`.
 *
 * Fields (exactly seven, as required):
 *   id       stable cue id for recording / mixing
 *   kind     dialogue | voiceover | narration | broadcast | radio
 *   speaker  who is speaking (shown inside 【】)
 *   text     the line itself
 *   delivery performance note for the voice actor
 *   start    seconds on the film clock
 *   end      seconds on the film clock
 *
 * No human voice is synthesised by the project. Silence is used deliberately:
 * the shooting itself carries no dialogue.
 */

export type CueKind = "dialogue" | "voiceover" | "narration" | "broadcast" | "radio";

export interface VoiceCue {
  id: string;
  kind: CueKind;
  speaker: string;
  text: string;
  delivery: string;
  start: number;
  end: number;
}

export const VOICE_CUES: VoiceCue[] = [
  /* ---------------- Act I · the debate ---------------- */
  {
    id: "v01",
    kind: "dialogue",
    speaker: "老航天甲",
    text: "工质驱动是唯一现实的路。它成熟、稳妥，明天就能上马。",
    delivery: "沉稳、不容置疑，像在宣读一份早已写好的结论",
    start: 21.5,
    end: 28.6
  },
  {
    id: "v02",
    kind: "dialogue",
    speaker: "老航天乙",
    text: "把工质驱动做到极致，人类就有机会。",
    delivery: "恳切，带着长者的耐心",
    start: 29.6,
    end: 36.4
  },
  {
    id: "v03",
    kind: "narration",
    speaker: "旁白",
    text: "太空军内部的争论，持续了三年。",
    delivery: "冷静、克制，几乎是档案的语气",
    start: 38.0,
    end: 44.4
  },
  {
    id: "v04",
    kind: "voiceover",
    speaker: "章北海（内心）",
    text: "工质驱动的舰队，在黑暗森林里，连一次真正的加速都撑不过去。",
    delivery: "极轻，几乎不动嘴唇；每个字都想清楚了才落下",
    start: 46.6,
    end: 55.4
  },
  {
    id: "v05",
    kind: "voiceover",
    speaker: "章北海（内心）",
    text: "要改变路线，就必须改变决定路线的人。",
    delivery: "平静得可怕，没有一丝犹豫",
    start: 58.6,
    end: 66.0
  },

  /* ---------------- Act II · the instrument ---------------- */
  {
    id: "v06",
    kind: "dialogue",
    speaker: "古董商",
    text: "这块阿勒泰陨铁，压手。您要是喜欢，就当标本带走。",
    delivery: "市井、随意，完全不知道自己在卖什么",
    start: 72.6,
    end: 80.2
  },
  {
    id: "v07",
    kind: "voiceover",
    speaker: "章北海（内心）",
    text: "陨铁软、脆，密度高。",
    delivery: "像在核对参数，不带情绪",
    start: 86.0,
    end: 91.6
  },
  {
    id: "v08",
    kind: "dialogue",
    speaker: "章北海",
    text: "要一副子弹。",
    delivery: "简短，礼数周全，不容追问",
    start: 99.0,
    end: 104.4
  },
  {
    id: "v09",
    kind: "dialogue",
    speaker: "老工匠",
    text: "打什么？",
    delivery: "手上不停，只抬眼看了他一秒",
    start: 105.6,
    end: 109.8
  },
  {
    id: "v10",
    kind: "dialogue",
    speaker: "章北海",
    text: "人。",
    delivery: "一个字，像把刀收回鞘里",
    start: 110.6,
    end: 114.4
  },
  {
    id: "v11",
    kind: "dialogue",
    speaker: "老工匠",
    text: "谁？",
    delivery: "声音更低，带着一点了然",
    start: 115.6,
    end: 120.4
  },
  {
    id: "v12",
    kind: "dialogue",
    speaker: "章北海",
    text: "……您不必知道。",
    delivery: "温和，甚至带着歉意",
    start: 121.6,
    end: 127.2
  },
  {
    id: "v13",
    kind: "narration",
    speaker: "旁白",
    text: "弹芯包一层薄铜被甲，出膛即剥落，不带膛线；碎在人体里，和陨石雨的残片无法区分。",
    delivery: "技术档案般的平稳，最后半句稍作停顿",
    start: 128.6,
    end: 136.2
  },

  /* ---------------- Act III · the basement ---------------- */
  {
    id: "v14",
    kind: "dialogue",
    speaker: "老航天丙",
    text: "下一次评审，我把模型再算一遍。",
    delivery: "闲聊，边走边说",
    start: 138.6,
    end: 145.0
  },
  {
    id: "v15",
    kind: "dialogue",
    speaker: "老航天甲",
    text: "灯又坏了。这地方，越来越像坟墓。",
    delivery: "笑了一下，自己也不信这句玩笑",
    start: 146.0,
    end: 152.6
  },
  {
    id: "v16",
    kind: "dialogue",
    speaker: "老航天乙",
    text: "老章最近话很少。",
    delivery: "随口提起，没有别的意思",
    start: 154.0,
    end: 159.8
  },
  {
    id: "v17",
    kind: "dialogue",
    speaker: "老航天甲",
    text: "他一向如此。",
    delivery: "漫不经心，替同伴把话说完",
    start: 160.8,
    end: 165.4
  },
  {
    id: "v18",
    kind: "voiceover",
    speaker: "章北海（内心）",
    text: "三声。够了。",
    delivery: "事后才浮上来的念头，极轻，带着耳鸣",
    start: 190.0,
    end: 196.0
  },

  /* ---------------- Act IV · the cover ---------------- */
  {
    id: "v19",
    kind: "dialogue",
    speaker: "调查员",
    text: "没有膛线，没有可追溯的弹头。体内是铁镍碎片——成分与陨石完全一致。一起罕见的陨石雨坠落事故。",
    delivery: "照本宣科，越读越像结论",
    start: 200.6,
    end: 212.0
  },
  {
    id: "v20",
    kind: "narration",
    speaker: "旁白",
    text: "报告很短。没有人怀疑太空军内部，也没有人怀疑章北海。",
    delivery: "平直，不带评判",
    start: 214.0,
    end: 220.0
  },
  {
    id: "v21",
    kind: "dialogue",
    speaker: "评审主持",
    text: "无工质聚变辐射驱动方案——通过。",
    delivery: "会议主持人的标准腔调",
    start: 230.0,
    end: 235.8
  },
  {
    id: "v22",
    kind: "dialogue",
    speaker: "评审席",
    text: "没有人知道，该感谢谁。",
    delivery: "压低的声音，不是问题，是叹息",
    start: 238.0,
    end: 244.0
  },

  /* ---------------- Act V · reckoning / ignition ---------------- */
  {
    id: "v23",
    kind: "voiceover",
    speaker: "章北海（内心）",
    text: "我知道，我成了一个杀人的人。",
    delivery: "独自面对玻璃时，才允许自己承认",
    start: 248.6,
    end: 256.0
  },
  {
    id: "v24",
    kind: "voiceover",
    speaker: "章北海（内心）",
    text: "我忘不掉他们谈笑的样子，也忘不掉枪声在墙上的回响。",
    delivery: "记忆闪回时的低语",
    start: 262.0,
    end: 270.2
  },
  {
    id: "v25",
    kind: "voiceover",
    speaker: "章北海（内心）",
    text: "可如果人类还能在黑暗森林里活下去——",
    delivery: "第一次出现一点温度，随即收住",
    start: 278.0,
    end: 286.0
  },
  {
    id: "v28",
    kind: "broadcast",
    speaker: "试验场广播",
    text: "各系统注意，聚变辐射驱动一号机，点火倒计时三十秒。",
    delivery: "经过公共广播的压缩与回声，机械、克制",
    start: 292.0,
    end: 298.4
  },
  {
    id: "v29",
    kind: "radio",
    speaker: "通讯",
    text: "遥测正常。磁场约束稳定。",
    delivery: "无线电里的短促确认，带一点电流噪声",
    start: 300.0,
    end: 305.0
  },
  {
    id: "v26",
    kind: "voiceover",
    speaker: "章北海（内心）",
    text: "也许，就是因为这个夜晚。",
    delivery: "几乎是耳语，被推进器的轰鸣吞掉一半",
    start: 314.0,
    end: 322.0
  },
  {
    id: "v27",
    kind: "narration",
    speaker: "旁白",
    text: "危机纪元第四年，人类选择了更快的飞船。",
    delivery: "收束全片的旁白，平静，留白",
    start: 330.0,
    end: 338.4
  }
];

/** The cue active at time t, if any. */
export function cueAt(t: number): VoiceCue | undefined {
  return VOICE_CUES.find((c) => t >= c.start && t < c.end);
}

/** 【speaker】text, exactly the required presentation. */
export function subtitleText(c: VoiceCue): string {
  return `【${c.speaker}】${c.text}`;
}

export function validateCues(): string[] {
  const errs: string[] = [];
  const ids = new Set<string>();
  for (const c of VOICE_CUES) {
    if (ids.has(c.id)) errs.push(`duplicate cue id ${c.id}`);
    ids.add(c.id);
    if (!(c.end > c.start)) errs.push(`${c.id}: end must be after start`);
    if (c.start < 0) errs.push(`${c.id}: negative start`);
    if (!c.text.trim()) errs.push(`${c.id}: empty text`);
    if (!c.speaker.trim()) errs.push(`${c.id}: empty speaker`);
  }
  const sorted = [...VOICE_CUES].sort((a, b) => a.start - b.start);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start < sorted[i - 1].end - 0.001) {
      errs.push(`overlap: ${sorted[i - 1].id} (${sorted[i - 1].end}) -> ${sorted[i].id} (${sorted[i].start})`);
    }
  }
  return errs;
}
