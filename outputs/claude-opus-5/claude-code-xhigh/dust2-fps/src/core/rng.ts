/**
 * 确定性随机数：所有涉及玩法的随机（弹道扩散、AI 抖动、出生点分配）都走这里，
 * 这样 headless 模拟可以复现问题。
 */
export class Rng {
  private state: number;

  constructor(seed = 0x2f6e2b1) {
    this.state = seed >>> 0;
    if (this.state === 0) this.state = 0x9e3779b9;
  }

  /** mulberry32 */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(lo: number, hi: number): number {
    return lo + (hi - lo) * this.next();
  }

  int(loInclusive: number, hiExclusive: number): number {
    return loInclusive + Math.floor(this.next() * (hiExclusive - loInclusive));
  }

  /** 近似正态分布（三次均匀采样求和），用于 AI 瞄准误差。 */
  gaussian(): number {
    return (this.next() + this.next() + this.next() - 1.5) * 1.1547;
  }

  bool(chance = 0.5): boolean {
    return this.next() < chance;
  }

  pick<T>(arr: readonly T[]): T {
    return arr[Math.min(arr.length - 1, Math.floor(this.next() * arr.length))];
  }

  shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }
}

/** 全局默认随机源（渲染层特效等非玩法随机可直接用）。 */
export const rng = new Rng(0x51f3a7c);
