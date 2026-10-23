import { Machine } from "../src/machine.js";
const m = await Machine.create();
const H = 1/120;
const ev = [];
for (let i = 0; i < 34 / H; i++) { m.substep(H);
  while (m.events.length) { const e = m.events.shift();
    if (["release","escape","load","dump","pour"].includes(e.type)) ev.push(`${e.t.toFixed(1)}:${e.type}`); } }
console.log(ev.join("  "));
const esc = ev.filter(x=>x.includes("escape")).map(x=>parseFloat(x));
console.log("escapes:", esc.length, "| 间隔:", esc.slice(1).map((v,i)=>(v-esc[i]).toFixed(1)).join(","));
