import * as THREE from 'three';
import type { GameMap, NavNode } from './map';
import { segmentWalkable } from './map';

function nearestVisibleNode(map: GameMap, position: THREE.Vector3) {
  let best: NavNode | null = null;
  let bestScore = Infinity;
  let fallback = map.nodes[0];
  let fallbackDistance = Infinity;
  for (const node of map.nodes) {
    const distance = node.position.distanceToSquared(position);
    if (distance < fallbackDistance) {
      fallback = node;
      fallbackDistance = distance;
    }
    if (distance < bestScore && segmentWalkable(map, position, node.position)) {
      best = node;
      bestScore = distance;
    }
  }
  return best ?? fallback;
}

function heuristic(a: NavNode, b: NavNode) {
  return a.position.distanceTo(b.position);
}

export function findPath(map: GameMap, from: THREE.Vector3, target: THREE.Vector3): THREE.Vector3[] {
  if (segmentWalkable(map, from, target)) return [target.clone()];
  const start = nearestVisibleNode(map, from);
  const goal = nearestVisibleNode(map, target);
  const open = new Set<string>([start.id]);
  const cameFrom = new Map<string, string>();
  const g = new Map<string, number>([[start.id, 0]]);
  const f = new Map<string, number>([[start.id, heuristic(start, goal)]]);
  const byId = new Map(map.nodes.map((node) => [node.id, node]));

  while (open.size) {
    let currentId = '';
    let currentScore = Infinity;
    for (const id of open) {
      const score = f.get(id) ?? Infinity;
      if (score < currentScore) {
        currentId = id;
        currentScore = score;
      }
    }
    if (currentId === goal.id) {
      const ids = [currentId];
      while (cameFrom.has(ids[0])) ids.unshift(cameFrom.get(ids[0])!);
      const points = ids.map((id) => byId.get(id)!.position.clone());
      points.push(target.clone());
      return smoothPath(map, from, points);
    }
    open.delete(currentId);
    const current = byId.get(currentId)!;
    for (const linkId of current.links) {
      const neighbor = byId.get(linkId);
      if (!neighbor || !segmentWalkable(map, current.position, neighbor.position)) continue;
      const tentative = (g.get(currentId) ?? Infinity) + heuristic(current, neighbor);
      if (tentative >= (g.get(linkId) ?? Infinity)) continue;
      cameFrom.set(linkId, currentId);
      g.set(linkId, tentative);
      f.set(linkId, tentative + heuristic(neighbor, goal));
      open.add(linkId);
    }
  }
  return [start.position.clone(), target.clone()];
}

function smoothPath(map: GameMap, from: THREE.Vector3, points: THREE.Vector3[]) {
  const result: THREE.Vector3[] = [];
  let anchor = from.clone();
  let index = 0;
  while (index < points.length) {
    let furthest = index;
    for (let j = index; j < points.length; j++) {
      if (segmentWalkable(map, anchor, points[j])) furthest = j;
      else break;
    }
    result.push(points[furthest]);
    anchor = points[furthest];
    index = furthest + 1;
  }
  return result;
}

export function choosePatrolTarget(map: GameMap, team: 'CT' | 'T', random: () => number) {
  const ctTargets = ['a', 'aCross', 'b', 'ctMid', 'longA', 'cat', 'bExit'];
  const tTargets = ['long1', 'longA', 'catTurn', 'midN', 'b1', 'b2', 'aCross'];
  const ids = team === 'CT' ? ctTargets : tTargets;
  const targetId = ids[Math.floor(random() * ids.length)];
  return map.nodes.find((node) => node.id === targetId)!.position.clone();
}
