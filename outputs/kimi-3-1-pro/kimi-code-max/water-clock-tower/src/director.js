import * as THREE from 'three';

export const DURATION = 30;

const shots = [
  { start: 0, end: 4, from: [14.8, 9.8, 20.8], to: [13.5, 9.1, 19.3], target: [-2.35, 5.45, 0], targetTo: [-2.15, 5.4, 0] },
  { start: 4, end: 8, from: [4.6, 7.4, 10.8], to: [3.4, 6.9, 9.4], target: [-2.75, 4.7, 1], targetTo: [-2.55, 4.6, 1] },
  { start: 8, end: 12.5, from: [3.9, 4.25, 8.8], to: [2.9, 3.85, 8.0], target: [-2.15, 3.1, 1.3], targetTo: [-2.0, 3.1, 1.3] },
  { start: 12.5, end: 17, from: [5.5, 7.8, 10.2], to: [4.4, 7.4, 9.1], target: [-1.3, 6.1, 0.3], targetTo: [-1.2, 6.1, 0.3] },
  { start: 17, end: 21, from: [5.8, 12.1, 8.5], to: [4.7, 11.7, 7.4], target: [-1.05, 10.65, 0.3], targetTo: [-0.9, 10.7, 0.3] },
  { start: 21, end: 25, from: [4.4, 8.9, 7.8], to: [3.5, 8.5, 7.0], target: [-0.6, 8.15, 1], targetTo: [-0.55, 8.15, 1] },
  { start: 25, end: 30.001, from: [13.8, 9.8, 20.3], to: [14.8, 10.4, 21.2], target: [-2.3, 5.4, 0], targetTo: [-2.2, 5.5, 0] },
];

const captions = [
  { start: 0, tag: '北宋 · 1092', title: '一座靠水运行的天文钟', body: '上层观测星象，中层自动报时，下层藏着整座仪象台的动力。' },
  { start: 4, tag: '01 · 水力之源', title: '高位水箱，把水送进受水斗', body: '水从稳定的液面落下。每只木斗接住水，也就接住了水的重量。' },
  { start: 8, tag: '02 · 以水为力', title: '水斗变重，推动枢轮', body: '水的重力对轮轴形成力矩。注意：它不是一直转，而是走一格、停一下。' },
  { start: 10.2, tag: '03 · 擒纵', title: '一满一放，一齿一停', body: '水斗达到重量，擒纵机构释放一齿，随后再次锁住。连续的水，被切成均匀的节拍。' },
  { start: 12.5, tag: '04 · 齿轮传动', title: '同一股力，沿轮轴向上', body: '枢轮带动立轴，再经齿轮改变转速与方向，把每一格转动送往上层。' },
  { start: 17, tag: '05 · 浑仪观天', title: '时间，转成星空的位置', body: '天时轴带动浑仪缓缓旋转，用来模拟日月星辰的周天运动。' },
  { start: 21, tag: '06 · 自动报时', title: '凸轮到点，钟槌敲响', body: '报时凸轮随传动链转动，到点释放钟槌。钟声，不需要人守着敲。' },
  { start: 25, tag: '从水到时间', title: '水给力，擒纵给节拍，齿轮送到每一处', body: '下层驱动，中层报时，上层观天——整座仪象台共用同一个时间源。' },
];

const chapters = [
  { start: 0, number: '01', name: '水力之源' },
  { start: 8, number: '02', name: '枢轮与擒纵' },
  { start: 12.5, number: '03', name: '轮轴传动' },
  { start: 17, number: '04', name: '浑仪观天' },
  { start: 21, number: '05', name: '木人报时' },
  { start: 25, number: '06', name: '同一座钟' },
];

const annotationData = [
  { id: 'tank', point: [-2.65, 5.92, 1.1], label: '高位水箱', sub: '持续供水', ranges: [[4, 8]], water: true },
  { id: 'inlet', point: [-1.02, 4.65, 1.4], label: '受水斗', sub: '接水增重', ranges: [[4, 10.2]], water: true },
  { id: 'wheel', point: [-1.65, 2.75, 1.75], label: '枢轮', sub: '水力驱动', ranges: [[0, 4], [8, 12.5], [25, 27.5]] },
  { id: 'pawl', point: [0.1, 3.15, 1.82], label: '擒纵爪', sub: '停 · 放 · 停', ranges: [[8, 12.5]] },
  { id: 'shaft', point: [-1.5, 5.05, 0.3], label: '立式传动轴', sub: '向上送力', ranges: [[12.5, 17]] },
  { id: 'gear', point: [-0.35, 6.85, 0.4], label: '齿轮组', sub: '变速换向', ranges: [[12.5, 17]] },
  { id: 'sphere', point: [0.55, 11.35, 0.5], label: '浑仪', sub: '模拟星象', ranges: [[0, 4], [17, 21], [25, 27.5]] },
  { id: 'cam', point: [0.15, 7.8, 1.05], label: '报时凸轮', sub: '到点释放', ranges: [[21, 25]] },
  { id: 'bell', point: [1.67, 8.35, 1.1], label: '木人击钟', sub: '自动报时', ranges: [[0, 4], [21, 25], [25, 27.5]] },
];

export class FilmDirector {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;
    this.currentCaption = -1;
    this.ui = {
      opening: document.querySelector('#opening'),
      chapter: document.querySelector('#chapter-card'),
      chapterNumber: document.querySelector('#chapter-number'),
      chapterName: document.querySelector('#chapter-name'),
      caption: document.querySelector('#caption'),
      captionTag: document.querySelector('#caption-tag'),
      captionTitle: document.querySelector('#caption-title'),
      captionBody: document.querySelector('#caption-body'),
      endTitle: document.querySelector('#end-title'),
    };
    this.annotations = annotationData.map((data) => {
      const element = document.createElement('div');
      element.className = `annotation${data.water ? ' water' : ''}`;
      element.innerHTML = `<span class="dot"></span><span class="label"><small>${data.sub}</small>${data.label}</span>`;
      document.querySelector('#annotations').appendChild(element);
      return { ...data, element, world: new THREE.Vector3(...data.point) };
    });
  }

  update(time) {
    const shot = shots.find((item) => time >= item.start && time < item.end) ?? shots[shots.length - 1];
    const linear = THREE.MathUtils.clamp((time - shot.start) / (shot.end - shot.start), 0, 1);
    const t = linear * linear * (3 - 2 * linear);
    const position = new THREE.Vector3(...shot.from).lerp(new THREE.Vector3(...shot.to), t);
    const target = new THREE.Vector3(...shot.target).lerp(new THREE.Vector3(...shot.targetTo), t);
    if (this.camera.aspect < 0.85) {
      const factor = 1.35;
      position.sub(target).multiplyScalar(factor).add(target);
      if (shot.start === 0 || shot.start === 25) target.x = -0.7;
    }
    this.camera.position.copy(position);
    this.camera.lookAt(target);
    this.camera.updateMatrixWorld();

    this.ui.opening.classList.toggle('hidden', time >= 3.65);
    this.ui.chapter.classList.toggle('visible', time >= 4 && time < 27.5);
    this.ui.endTitle.classList.toggle('visible', time >= 27.5);
    this.ui.caption.classList.toggle('quiet', time < 3.8 || time >= 27.5);
    const chapter = [...chapters].reverse().find((item) => time >= item.start) ?? chapters[0];
    this.ui.chapterNumber.textContent = chapter.number;
    this.ui.chapterName.textContent = chapter.name;
    const index = captions.findLastIndex((item) => time >= item.start);
    if (index !== this.currentCaption) {
      this.currentCaption = index;
      const caption = captions[index];
      this.ui.captionTag.textContent = caption.tag;
      this.ui.captionTitle.textContent = caption.title;
      this.ui.captionBody.textContent = caption.body;
    }
    this.updateAnnotations(time);
  }

  updateAnnotations(time) {
    const width = innerWidth;
    const height = innerHeight;
    for (const item of this.annotations) {
      if (item.id === 'pawl') {
        item.element.querySelector('small').textContent = this.scene.mechanics.locked ? '已锁住 · 正在接水' : '释放 · 走一齿';
      } else if (item.id === 'inlet') {
        item.element.querySelector('small').textContent = `水重 ${Math.round((this.scene.mechanics.weighedFill ?? 0) * 100)}%`;
      }
      const active = item.ranges.some(([start, end]) => time >= start && time < end);
      const projected = item.world.clone().project(this.camera);
      const x = (projected.x * 0.5 + 0.5) * width;
      const y = (-projected.y * 0.5 + 0.5) * height;
      const visible = active && projected.z < 1 && x > 20 && x < width - 20 && y > 105 && y < height - 175;
      item.element.classList.toggle('visible', visible);
      item.element.classList.toggle('flip', x > width * 0.7);
      item.element.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
    }
  }
}
