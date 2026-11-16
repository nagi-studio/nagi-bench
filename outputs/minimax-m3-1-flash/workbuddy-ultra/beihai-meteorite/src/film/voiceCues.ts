// Voice cue manifest — the single source of truth for every line that needs to be
// voiced later. Each cue carries exactly seven fields: id / kind / speaker / text /
// delivery / start / end. The on-screen subtitles are driven straight from this list.

export type CueKind = 'dialogue' | 'narration' | 'monologue' | 'broadcast' | 'radio' | 'ambient'

export interface VoiceCue {
  id: string
  kind: CueKind
  speaker: string
  text: string
  delivery: string
  start: number
  end: number
}

export const VOICE_CUES: VoiceCue[] = [
  {
    id: 'c01', kind: 'monologue', speaker: '章北海',
    text: '父亲说，石头会记得人类击碎它的那一下。',
    delivery: '克制、低声，像在心里复述一句听过很多遍的话',
    start: 6.4, end: 12.6,
  },
  {
    id: 'c02', kind: 'dialogue', speaker: '父亲',
    text: '你看到的那片星图，后面还有更暗的一片。',
    delivery: '苍老、缓慢，尾音下沉',
    start: 15.2, end: 21.4,
  },
  {
    id: 'c03', kind: 'monologue', speaker: '章北海',
    text: '我没有回答。有些问题要等很多年才能回答。',
    delivery: '平静，近乎耳语',
    start: 23.0, end: 29.2,
  },
  {
    id: 'c04', kind: 'radio', speaker: '空间站',
    text: '气闸三号准备就绪，请确认舱外作业许可。',
    delivery: '标准播报，无感情，略带电流底噪',
    start: 52.0, end: 58.6,
  },
  {
    id: 'c05', kind: 'monologue', speaker: '章北海',
    text: '那天我带了两把枪，一把用来结束争论。',
    delivery: '冷、稳，语速均匀',
    start: 62.4, end: 68.0,
  },
  {
    id: 'c06', kind: 'broadcast', speaker: '空间站',
    text: '注意，走廊减压开始重复广播，请佩戴面罩。',
    delivery: '机械女声，均匀，没有停顿',
    start: 74.5, end: 81.8,
  },
  {
    id: 'c07', kind: 'monologue', speaker: '章北海',
    text: '真空里没有声音。这反而让瞄准变得诚实。',
    delivery: '平静，略带思索',
    start: 96.0, end: 102.4,
  },
  {
    id: 'c08', kind: 'dialogue', speaker: '老航天',
    text: '你还是来了。我以为你会留在岸上。',
    delivery: '沙哑、疲惫，带着一丝苦笑',
    start: 121.6, end: 127.4,
  },
  {
    id: 'c09', kind: 'monologue', speaker: '章北海',
    text: '他说这句话的时候，准星没有晃。',
    delivery: '极轻，几乎是自言自语',
    start: 130.0, end: 135.6,
  },
  {
    id: 'c10', kind: 'dialogue', speaker: '老航天',
    text: '这一枪之后，你就再也不是原来那个人了。',
    delivery: '低、慢，最后一个字几乎听不见',
    start: 138.2, end: 144.6,
  },
  {
    id: 'c11', kind: 'monologue', speaker: '章北海',
    text: '我知道。石头会记得。',
    delivery: '笃定，没有一丝犹豫',
    start: 147.0, end: 151.2,
  },
  {
    id: 'c12', kind: 'broadcast', speaker: '空间站',
    text: '站务通报：三号气闸重新加压，全部人员请返回舱内。',
    delivery: '标准播报，语速略快',
    start: 166.0, end: 172.8,
  },
  {
    id: 'c13', kind: 'monologue', speaker: '章北海',
    text: '我摘下手套，把坐标记在那块屏幕上。',
    delivery: '平静，动作与叙述同步',
    start: 176.4, end: 182.6,
  },
  {
    id: 'c14', kind: 'narration', speaker: '旁白',
    text: '从此以后的四百年，人类第一次把目光投向星海深处。',
    delivery: '沉稳、缓慢，略带回响',
    start: 188.0, end: 196.4,
  },
]

export const TOTAL_SECONDS = 200
