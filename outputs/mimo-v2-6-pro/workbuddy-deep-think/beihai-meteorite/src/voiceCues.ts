/**
 * Structured voice cue list. Every line of spoken / broadcast / inner-monologue
 * content in the film lives here with exactly seven fields, so each line can be
 * recorded later and attached by id. Subtitles are rendered from this list as
 * bottom-centre 【speaker】text, kept in sync with the picture.
 */
export interface VoiceCue {
  id: string;
  kind: 'narration' | 'dialogue' | 'inner-monologue' | 'broadcast' | 'radio';
  speaker: string;
  text: string;
  delivery: string;
  start: number;
  end: number;
}

export const VOICE_CUES: VoiceCue[] = [
  {
    id: 'c01', kind: 'narration', speaker: '旁白',
    text: '二十一世纪中叶，人类把命运押在了化学火箭上。只有一个人，看得更远。',
    delivery: '沉稳、史诗感，略带宿命意味', start: 2, end: 13
  },
  {
    id: 'c02', kind: 'dialogue', speaker: '父亲',
    text: '北海，多想几步。要飞出太阳系，靠现在的火箭，不行。',
    delivery: '病榻前的低语，缓慢、笃定', start: 22, end: 33
  },
  {
    id: 'c03', kind: 'dialogue', speaker: '章北海',
    text: '我明白。我会走到那一天——用我的方式。',
    delivery: '克制、平静，尾音坚决', start: 36, end: 46
  },
  {
    id: 'c04', kind: 'narration', speaker: '旁白',
    text: '他成为恒星际战舰的第一批指挥官，却始终记得病房里的那盏灯。',
    delivery: '叙事推进，语速稍快', start: 62, end: 73
  },
  {
    id: 'c05', kind: 'broadcast', speaker: '广播',
    text: '……化学发动机路线论证会结束。与会专家一致认为：恒星际航行，应当缓行。',
    delivery: '公共广播腔，机械、字正腔圆', start: 86, end: 99
  },
  {
    id: 'c06', kind: 'inner-monologue', speaker: '章北海（内心）',
    text: '他们错了。历史，必须由清醒的人来推动。',
    delivery: '内心独白，气声，近耳', start: 103, end: 115
  },
  {
    id: 'c07', kind: 'radio', speaker: '通讯',
    text: '章队，舱外检修窗口已开启，陨石带活动平稳。',
    delivery: '无线电质感，带轻微失真', start: 148, end: 157
  },
  {
    id: 'c08', kind: 'dialogue', speaker: '章北海',
    text: '收到。我亲自去。',
    delivery: '简短、冷静', start: 160, end: 166
  },
  {
    id: 'c09', kind: 'narration', speaker: '旁白',
    text: '真空里，没有声音传得出去。他把那颗陨石子弹，一发一发推入枪膛。',
    delivery: '收紧的气息，紧张感递增', start: 184, end: 199
  },
  {
    id: 'c10', kind: 'inner-monologue', speaker: '章北海（内心）',
    text: '对不起。但人类，需要这条路。',
    delivery: '极轻，近乎无声的忏悔', start: 205, end: 213
  },
  {
    id: 'c11', kind: 'narration', speaker: '旁白',
    text: '一声只有他自己听得见的闷响。目标，坠入永恒的黑暗。',
    delivery: '冷静陈述，留白', start: 222, end: 236
  },
  {
    id: 'c12', kind: 'radio', speaker: '通讯',
    text: '报告：专家舱段遭遇微陨石撞击，三人失压身亡，初步判定为意外。',
    delivery: '电台播报，略带慌乱', start: 246, end: 258
  },
  {
    id: 'c13', kind: 'inner-monologue', speaker: '章北海（内心）',
    text: '从今天起，星舰地球，自己选择方向。',
    delivery: '坚定，低沉', start: 264, end: 275
  },
  {
    id: 'c14', kind: 'narration', speaker: '旁白',
    text: '他望向人马座的方向。自然选择——前进四。',
    delivery: '收束全片，庄严', start: 280, end: 294
  }
];

export const FILM_LENGTH = 310;

export function activeCue(t: number): VoiceCue | null {
  for (const c of VOICE_CUES) if (t >= c.start && t <= c.end) return c;
  return null;
}
