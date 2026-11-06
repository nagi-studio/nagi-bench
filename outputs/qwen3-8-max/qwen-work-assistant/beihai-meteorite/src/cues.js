/* ============================================================================
   Voice-cue manifest.
   Every intended voice line in the film lives here as one structured record with
   exactly the seven required fields: id, kind, speaker, text, delivery, start,
   end (seconds on the master timeline). On-screen subtitles are driven directly
   from this list, so recorded audio can later be attached cue-by-cue using `id`.
   No human voice is generated or synthesised anywhere in this project.

   The text is an original dramatisation of the public plot outline (a space-force
   commissar who hides his true belief, commissions bullets forged from meteorite
   so an assassination reads as a natural micrometeoroid strike, then sleeps
   toward the future). It paraphrases rather than reproduces any source novel.
   ========================================================================== */

// kind: one of dialogue | narration | monologue | broadcast | comms | ambient
export const CUES = [
  // ---- Act 0: the seed (hospital, father's deathbed) ----
  { id: 'v001', kind: 'narration', speaker: '旁白', text: '二〇〇七年，冬。一个人的一生，有时始于一句遗言。', delivery: '低沉、克制，近乎耳语', start: 4.0, end: 10.5 },
  { id: 'v002', kind: 'dialogue', speaker: '父亲', text: '孩子……往后的路，你要多想。想到别人想不到的地方。', delivery: '气若游丝，却字字用力', start: 11.5, end: 18.0 },
  { id: 'v003', kind: 'monologue', speaker: '章北海', text: '多想。我把这两个字，藏进往后余生的每一步。', delivery: '青年声线，内心独白，冷静', start: 19.0, end: 25.0 },

  // ---- Act 1: the conformist (space-force briefing) ----
  { id: 'v010', kind: 'broadcast', speaker: '会议广播', text: '太空军推进技术论证会，现在开始。议题：工质与无工质路线之取舍。', delivery: '平直、公事公办的合成播报腔', start: 32.0, end: 40.0 },
  { id: 'v011', kind: 'dialogue', speaker: '老航天', text: '无工质辐射驱动是空中楼阁！把有限的资源押上去，是拿全人类的命运赌博。', delivery: '年长、专断、拍案而起', start: 41.0, end: 49.5 },
  { id: 'v012', kind: 'dialogue', speaker: '章北海', text: '我完全支持老航天们的判断。稳健，才走得更远。', delivery: '表面恭顺、语气平和，暗藏锋芒', start: 50.5, end: 57.5 },
  { id: 'v013', kind: 'monologue', speaker: '章北海', text: '可我心里清楚：他们守着的，是一堵迟早要塌的墙。', delivery: '内心独白，与前一句的恭顺形成反差', start: 58.5, end: 65.0 },
  { id: 'v014', kind: 'comms', speaker: '同僚', text: '北海，你今天在会上说的那番话……真是你的想法？', delivery: '无线电私聊，犹疑', start: 68.0, end: 74.0 },
  { id: 'v015', kind: 'dialogue', speaker: '章北海', text: '想法不重要。重要的是四百年后，谁的判断能让人类活下去。', delivery: '压低声音，第一次露出真意', start: 75.0, end: 83.0 },

  // ---- Act 2: the meteorite and the bullets (workshop / basement) ----
  { id: 'v020', kind: 'narration', speaker: '旁白', text: '要骗过整个未来，凶器本身，也必须来自天上。', delivery: '低沉铺陈', start: 92.0, end: 98.0 },
  { id: 'v021', kind: 'dialogue', speaker: '工匠', text: '这块陨铁，密度和成分跟宇宙尘几乎一样。打成弹头……您这是要做什么？', delivery: '手艺人的谨慎与好奇', start: 99.5, end: 108.0 },
  { id: 'v022', kind: 'dialogue', speaker: '章北海', text: '做一件让后人受益、却让同时代的人恨我的事。别问，做完就忘了它。', delivery: '平静、不容置疑', start: 109.0, end: 117.0 },
  { id: 'v023', kind: 'monologue', speaker: '章北海', text: '陨石子弹。碎屑会像流星体一样散进真空，查无凶器，查无凶手。', delivery: '内心独白，精密而冰冷', start: 120.0, end: 128.0 },
  { id: 'v024', kind: 'ambient', speaker: '环境', text: '（机床切削陨铁的尖啸、弹头落进铁盘的脆响，在地下室里反复回荡）', delivery: '纯音效提示，无对白，字幕仅标注声景', start: 130.0, end: 140.0 },
  { id: 'v025', kind: 'monologue', speaker: '章北海', text: '父亲说要多想。我想得比谁都远——远到愿意独自背下这份罪。', delivery: '内心独白，情绪第一次起伏', start: 146.0, end: 155.0 },

  // ---- Act 3: the assassination (in vacuum, aboard the craft) ----
  { id: 'v030', kind: 'narration', speaker: '旁白', text: '试验舱外，三名老航天的身影，隔着面罩缓缓移动。', delivery: '冷静、带悬念', start: 168.0, end: 175.0 },
  { id: 'v031', kind: 'comms', speaker: '舱内通讯', text: '各注意，出舱程序正常，生命维持稳定。', delivery: '例行舱外通讯，毫无察觉', start: 176.5, end: 182.5 },
  { id: 'v032', kind: 'monologue', speaker: '章北海', text: '真空中听不见枪声。这一枪，只有我一个人知道它响过。', delivery: '内心独白，屏息', start: 184.0, end: 191.0 },
  { id: 'v033', kind: 'ambient', speaker: '环境', text: '（航天服内传导的闷响，面罩上骤起的白雾，碎屑如星尘般四散）', delivery: '纯音效提示，真空无声，仅主观闷震', start: 192.0, end: 200.0 },
  { id: 'v034', kind: 'comms', speaker: '舱内通讯', text: '三号……三号失去生命信号！是微流星体撞击！重复，微流星体撞击！', delivery: '惊慌的舱内警报式通报', start: 202.0, end: 210.0 },
  { id: 'v035', kind: 'monologue', speaker: '章北海', text: '他们到死都会相信，那是宇宙掷来的骰子。这正是我要的。', delivery: '内心独白，冷到极点', start: 212.0, end: 220.0 },

  // ---- Act 4: the verdict of history / hibernation ----
  { id: 'v040', kind: 'broadcast', speaker: '新闻播报', text: '事故调查结论：三起死亡均为高速微流星体撞击，无人为因素。', delivery: '官方播报腔', start: 232.0, end: 240.0 },
  { id: 'v041', kind: 'dialogue', speaker: '调查官', text: '章北海政委，案发时你在冬眠舱。时间线……对得上，你不可能是凶手。', delivery: '公事公办，无意间的讽刺', start: 241.5, end: 250.0 },
  { id: 'v042', kind: 'dialogue', speaker: '章北海', text: '我只是一个想得太多的普通人。', delivery: '平静作答，藏起一切', start: 251.0, end: 256.5 },
  { id: 'v043', kind: 'monologue', speaker: '章北海', text: '辐射驱动最终立项。人类会带着我押下的那个方向，走向星海。', delivery: '内心独白，如释重负又孤独', start: 258.0, end: 267.0 },
  { id: 'v044', kind: 'narration', speaker: '旁白', text: '他申请了"增援未来"计划，走进冬眠，把审判交给四百年后的时间。', delivery: '铺陈、渐弱', start: 270.0, end: 279.0 },

  // ---- Act 5: the future / solitude (ending) ----
  { id: 'v050', kind: 'ambient', speaker: '环境', text: '（冬眠舱的低鸣、解冻的嘶声、远方舰队引擎的余震）', delivery: '纯音效提示，跨时空的寂静', start: 292.0, end: 300.0 },
  { id: 'v051', kind: 'monologue', speaker: '章北海', text: '四百年了。我守住的秘密，连同我的名字，一起沉进了这片黑。', delivery: '内心独白，苍凉', start: 302.0, end: 311.0 },
  { id: 'v052', kind: 'dialogue', speaker: '未来军官', text: '章政委，欢迎回到未来。您想看的星空……现在就在眼前。', delivery: '年轻、敬重、带着时代距离感', start: 313.0, end: 320.5 },
  { id: 'v053', kind: 'monologue', speaker: '章北海', text: '多想。父亲，我照做了。只是这条路上，始终只有我一个人。', delivery: '内心独白，收束全片', start: 322.0, end: 331.0 },
  { id: 'v054', kind: 'narration', speaker: '旁白', text: '陨石子弹散作了星尘。而人类，终于朝着他赌上的方向，起航。', delivery: '终章旁白，缓慢、庄重', start: 334.0, end: 343.0 },
]

// Total timeline length in seconds (hard cap is 360s per the case prompt).
export const FILM_LENGTH = 356

// Sort cues by start time for the subtitle driver.
export const CUES_SORTED = CUES.slice().sort((a, b) => a.start - b.start)

export function activeCueAt(t) {
  for (const c of CUES_SORTED) {
    if (t >= c.start && t <= c.end) return c
  }
  return null
}
