//
//  分镜: 镜头与字幕(不受物理限制)
//
const V3 = (x, y, z) => ({ x, y, z });
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/* 每个镜头: [起始, 结束, 机位from, 机位to, 注视from, 注视to, 章节号, 章节名] */
const SHOTS = [
  [0.0, 5.6, V3(33, 14, 40), V3(26, 16, 32), V3(0, 14, 0), V3(0, 15, 0), "序幕", "水运仪象台"],
  [5.6, 12.0, V3(5.8, 20.6, 9.6), V3(3.9, 19.7, 7.0), V3(-.4, 17.4, -1.2), V3(-.5, 17.0, -1.2), "第一幕", "一斗水的重量"],
  [12.0, 19.2, V3(-11.4, 8.6, 3.4), V3(-10.2, 8.3, 2.2), V3(-3.8, 8.4, -1.2), V3(-3.9, 8.9, -1.2), "第二幕", "天条与枢衡"],
  [19.2, 25.6, V3(9.8, 9.4, 15.6), V3(7.4, 11.2, 12.4), V3(-1.5, 11.0, -1.2), V3(-2.6, 11.8, -1.2), "第三幕", "天关 · 擒纵"],
  [25.6, 32.5, V3(11.2, 21.0, 17.4), V3(3.6, 27.6, 10.6), V3(0, 22, 0), V3(0, 26.4, 0), "第四幕", "天球 · 一昼夜"],
];

/* 字幕: [起始, 结束, 主句, 副句] */
const CAPS = [
  [0.4, 5.4, "水运仪象台",
    "北宋 · 苏颂 · 元祐三年(1088)。一座全部由水驱动的天文钟塔——不费人力,不用畜力。"],
  [5.8, 11.6, "一斗水的重量",
    "天池保持恒定水位,水斗把水袋匀速注入轮顶受水壶。每一斗水的重量,就是整台机器唯一的动力。"],
  [12.2, 18.9, "天条 · 枢衡",
    "水斗压向轮缘,轮子想转;轮身把「天条」杠杆压得翘起,另一端的秤砣「枢衡」被慢慢抬起——这是一杆秤。"],
  [19.4, 25.3, "天关 · 擒纵",
    "水一满,杠杆翻过门槛,「天关」被拨开:枢轮只准走过一格——一只水斗的距离。咔嗒。下一只水斗随即顶上来。"],
  [25.7, 32.2, "天球 · 一昼夜",
    "枢轮的慢转经立轴与齿轮传到塔顶:天球一昼夜恰好转一周,与天空同步。水退回下池,再被提上天池——钟鼓,按时自鸣。"],
];

export class Director {
  constructor(cam, ui) {
    this.cam = cam; this.ui = ui;
    this.cur = { ...SHOTS[0] };
  }

  shot(t) {
    let s = SHOTS[SHOTS.length - 1];
    for (const it of SHOTS) if (t >= it[0] && t < it[1]) { s = it; break; }
    const u = Math.min(1, Math.max(0, (t - s[0]) / (s[1] - s[0])));
    const e = ease(u);
    // 手持微晃
    const sw = Math.sin(t * 1.7) * .07 + Math.sin(t * .71) * .05;
    const sw2 = Math.cos(t * 1.31) * .06;
    this.cam.position.set(
      lerp(s[2].x, s[3].x, e) + sw,
      lerp(s[2].y, s[3].y, e) + sw2,
      lerp(s[2].z, s[3].z, e) + sw * .6);
    const tx = lerp(s[4].x, s[5].x, e), ty = lerp(s[4].y, s[5].y, e), tz = lerp(s[4].z, s[5].z, e);
    this.cam.lookAt(tx, ty, tz);
    this.cam.rotation.z += sw2 * .006;

    if (this.ui) {
      const chap = this.ui.chapter;
      if (chap.dataset.no !== s[6]) {
        chap.dataset.no = s[6];
        chap.querySelector("#chapNo").textContent = s[6];
        chap.querySelector("#chapName").textContent = s[7];
        chap.classList.add("show");
      }
    }
  }

  caps(t) {
    const cap = this.ui.cap;
    let found = null;
    for (const c of CAPS) if (t >= c[0] && t < c[1]) { found = c; break; }
    if (!found) { cap.classList.remove("show"); return; }
    if (cap.dataset.k !== found[2]) {
      cap.dataset.k = found[2];
      cap.querySelector("#capTitle").textContent = found[2];
      cap.querySelector("#capBody").textContent = found[3];
    }
    cap.classList.add("show");
  }
}
