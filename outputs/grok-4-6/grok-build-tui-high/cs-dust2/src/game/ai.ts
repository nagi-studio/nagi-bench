import type { Team } from "./types";
import { astar, nearestNav, type Dust2World } from "./map/Dust2";
import type { Actor } from "./actor";

export function pickSite(): "A" | "B" {
  return Math.random() < 0.55 ? "A" : "B";
}

export function assignRoles(actors: Actor[], playerTeam: Team, execSite: "A" | "B"): void {
  const t = actors.filter((a) => a.team === "T");
  const ct = actors.filter((a) => a.team === "CT");
  const other = execSite === "A" ? "B" : "A";
  t.forEach((a, i) => {
    if (i === 0) a.site = execSite;
    else if (i === 1 || i === 2) a.site = execSite;
    else if (i === 3) a.site = "mid";
    else a.site = other;
  });
  ct.forEach((a, i) => {
    if (i <= 1) a.site = "A";
    else if (i <= 3) a.site = "B";
    else a.site = "mid";
  });
}

export function sitePos(site: "A" | "B" | "mid"): { x: number; z: number } {
  if (site === "A") return { x: 34, z: 28 };
  if (site === "B") return { x: -36, z: 26 };
  return { x: 0, z: 16 };
}

export function holdPos(team: Team, site: "A" | "B" | "mid", jitter: number): { x: number; z: number } {
  const c = sitePos(site);
  if (team === "CT") {
    if (site === "A") return { x: 28 + jitter, z: 34 };
    if (site === "B") return { x: -30 + jitter, z: 32 };
    return { x: 2 + jitter * 0.3, z: 22 };
  }
  return { x: c.x + jitter, z: c.z };
}

export function buildPath(world: Dust2World, a: Actor, tx: number, tz: number): void {
  const from = nearestNav(world, a.x, a.z);
  const to = nearestNav(world, tx, tz);
  a.path = astar(world, from, to);
  a.pathI = 0;
  a.destX = tx;
  a.destZ = tz;
}

export function nextSteer(world: Dust2World, a: Actor): { x: number; z: number } | null {
  if (!a.path.length) return { x: a.destX, z: a.destZ };
  while (a.pathI < a.path.length) {
    const n = world.nav[a.path[a.pathI]];
    if (!n) break;
    const d = Math.hypot(n.x - a.x, n.z - a.z);
    if (d < 1.4) {
      a.pathI++;
      continue;
    }
    return { x: n.x, z: n.z };
  }
  return { x: a.destX, z: a.destZ };
}