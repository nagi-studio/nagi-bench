/** Development-only: print shot midpoints and per-set triangle counts. */
import "./preview.ts";

const { createFilm } = await import("../src/film.ts");
const f = createFilm();
const frac = Number(process.argv[2] ?? 0.55);
console.log(f.shots.map((s) => +(s.start + (s.end - s.start) * frac).toFixed(2)).join(","));
for (const name of ["room", "yard", "shop", "cellar", "space"] as const) {
  let n = 0;
  f.ctx[name].group.traverse((o: any) => {
    if (o.isMesh && o.geometry.index) n += (o.geometry.index.count / 3) * (o.isInstancedMesh ? o.instanceMatrix.count : 1);
  });
  console.log(name, Math.round(n), "triangles");
}
