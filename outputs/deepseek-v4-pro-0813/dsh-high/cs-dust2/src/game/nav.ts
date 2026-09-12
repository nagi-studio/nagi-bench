import { navNodes, nearestNavNode, type NavNode } from './map';

export function findPath(startX: number, startZ: number, goalX: number, goalZ: number): NavNode[] {
  const start = nearestNavNode(startX, startZ);
  const goal = nearestNavNode(goalX, goalZ);
  if (!start || !goal) return [];
  if (start.id === goal.id) return [goal];

  const open: number[] = [start.id];
  const cameFrom = new Map<number, number>();
  const gScore = new Map<number, number>();
  const fScore = new Map<number, number>();
  gScore.set(start.id, 0);
  fScore.set(start.id, heuristic(start, goal));

  while (open.length > 0) {
    let currentIdx = 0;
    let bestF = Infinity;
    for (let i = 0; i < open.length; i++) {
      const f = fScore.get(open[i]) ?? Infinity;
      if (f < bestF) {
        bestF = f;
        currentIdx = i;
      }
    }
    const currentId = open.splice(currentIdx, 1)[0];
    const current = navNodes[currentId];
    if (currentId === goal.id) break;

    for (const nb of current.neighbors) {
      const tentative = (gScore.get(currentId) ?? Infinity) + 1;
      if (tentative < (gScore.get(nb) ?? Infinity)) {
        cameFrom.set(nb, currentId);
        gScore.set(nb, tentative);
        fScore.set(nb, tentative + heuristic(navNodes[nb], goal));
        if (!open.includes(nb)) open.push(nb);
      }
    }
  }

  if (!cameFrom.has(goal.id) && start.id !== goal.id) {
    // no path; return just the goal so the bot can try to move closer anyway
    return [goal];
  }

  const path: NavNode[] = [goal];
  let cur = goal.id;
  while (cur !== start.id && cameFrom.has(cur)) {
    cur = cameFrom.get(cur) as number;
    path.push(navNodes[cur]);
  }
  path.reverse();
  return path;
}

function heuristic(a: NavNode, b: NavNode): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

export function pathToPoints(path: NavNode[]): { x: number; z: number }[] {
  return path.map((n) => ({ x: n.x, z: n.z }));
}
