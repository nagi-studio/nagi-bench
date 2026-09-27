/** Editorial clock. Total running time stays under the six-minute limit. */
export const DURATION = 350;

/** Vacuum flight time from muzzle to suit, compressed for the cut. */
export const FLIGHT = 9.4;

export interface Round {
  t: number;
  target: number;
}

/** Twelve rounds, three short bursts. Two are allowed to drift. */
export const ROUNDS: Round[] = [
  { t: 291.15, target: 0 },
  { t: 291.33, target: 0 },
  { t: 291.51, target: 0 },
  { t: 291.69, target: 0 },
  { t: 292.95, target: 1 },
  { t: 293.13, target: 1 },
  { t: 293.31, target: 1 },
  { t: 293.49, target: 4 },
  { t: 294.75, target: 2 },
  { t: 294.93, target: 2 },
  { t: 295.11, target: 2 },
  { t: 295.29, target: 7 },
];

export const FIRE_TIMES = ROUNDS.map((round) => round.t);

export const TEST_FIRES = [178.55, 179.4, 180.25, 181.1];

export function firstImpact(): number {
  return ROUNDS[0]!.t + FLIGHT;
}

export function impactOf(index: number): number | null {
  let best: number | null = null;
  for (const round of ROUNDS) {
    if (round.target !== index) continue;
    const at = round.t + FLIGHT;
    best = best === null ? at : Math.min(best, at);
  }
  return best;
}

/** When this person starts to move: their own hit, or the moment the group sees vapor. */
export function reactAt(index: number): number {
  const own = impactOf(index);
  const seen = firstImpact() + 0.4;
  return own === null ? seen : Math.min(own, seen);
}

export function flashes(times: readonly number[], time: number, decay = 0.12): number {
  let sum = 0;
  for (const start of times) {
    const age = time - start;
    if (age >= 0 && age < decay) sum += 1 - age / decay;
  }
  return sum;
}
