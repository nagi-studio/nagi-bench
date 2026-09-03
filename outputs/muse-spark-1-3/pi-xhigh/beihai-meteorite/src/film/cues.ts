// Voice-cue list drives all subtitles. No synthesized voices; every cue renders as 【speaker】text.
export interface Cue {
  id: string;
  kind: 'dialogue' | 'narration' | 'monologue' | 'radio' | 'broadcast';
  speaker: string;
  text: string;
  delivery: string;
  start: number;
  end: number;
}

export interface Shot {
  id: string;
  title: string;
  start: number;
  end: number;
}

export const TOTAL = 300;

export const SHOTS: Shot[] = [
  { id: 's1', title: '片头', start: 0, end: 14 },
  { id: 's2', title: '渔村夜', start: 14, end: 48 },
  { id: 's3', title: '坠落', start: 48, end: 78 },
  { id: 's4', title: '清晨', start: 78, end: 112 },
  { id: 's5', title: '争论', start: 112, end: 138 },
  { id: 's6', title: '出海', start: 138, end: 172 },
  { id: 's7', title: '登岛', start: 172, end: 206 },
  { id: 's8', title: '拾石', start: 206, end: 238 },
  { id: 's9', title: '风暴归航', start: 238, end: 276 },
  { id: 's10', title: '尾声', start: 276, end: 300 },
];

export const CUES: Cue[] = [
  { id: 'c01', kind: 'radio', speaker: '电台', text: '北海海域今夜有流星雨，渔船注意避让，重复，渔船注意避让。', delivery: '沙哑，断续，混着电流杂音', start: 20, end: 27 },
  { id: 'c02', kind: 'dialogue', speaker: '村长', text: '海里长出一座岛，石头还在发烫，谁也不许靠近。', delivery: '低沉，压住场面', start: 84, end: 92 },
  { id: 'c03', kind: 'dialogue', speaker: '阿棠', text: '它是从天上掉下来的，总得有人去看看。', delivery: '倔强，声音不大但不让步', start: 96, end: 104 },
  { id: 'c04', kind: 'dialogue', speaker: '老周', text: '灯塔的灯照了三十年，头一回照见天上掉东西。', delivery: '苍老，带着笑，又有点发抖', start: 118, end: 127 },
  { id: 'c05', kind: 'dialogue', speaker: '村长', text: '浪还没有停，去了就回不来。', delivery: '警告，顿了顿', start: 129, end: 136 },
  { id: 'c06', kind: 'monologue', speaker: '阿棠', text: '奶奶说，掉进海里的星星，会替人指路。', delivery: '轻声，像说给自己听', start: 150, end: 159 },
  { id: 'c07', kind: 'radio', speaker: '老周', text: '阿棠，听见就回话，雾起来了，跟着灯走。', delivery: '对讲机，急促', start: 182, end: 190 },
  { id: 'c08', kind: 'dialogue', speaker: '阿棠', text: '听见了，岛上有光，跟灯塔一个颜色。', delivery: '对讲机，带着风声', start: 192, end: 200 },
  { id: 'c09', kind: 'monologue', speaker: '阿棠', text: '你别怕，我带你回家。', delivery: '极轻，贴着石头说', start: 214, end: 224 },
  { id: 'c10', kind: 'broadcast', speaker: '老周', text: '所有船回港！所有船回港！跟着我的灯！', delivery: '广播喇叭，嘶哑用力', start: 246, end: 254 },
  { id: 'c11', kind: 'dialogue', speaker: '阿棠', text: '周爷爷，我看见灯了！', delivery: '喊出来，哭腔里带着笑', start: 256, end: 264 },
  { id: 'c12', kind: 'narration', speaker: '旁白', text: '后来，灯塔多了一盏不灭的灯。过往的船都说，那一束光里，有一颗星在指路。', delivery: '平静，渐弱', start: 282, end: 293 },
];

export function cueAt(t: number): Cue | null {
  for (const c of CUES) {
    if (t >= c.start && t <= c.end) return c;
  }
  return null;
}

export function shotAt(t: number): Shot {
  for (const s of SHOTS) {
    if (t >= s.start && t < s.end) return s;
  }
  return SHOTS[SHOTS.length - 1];
}
