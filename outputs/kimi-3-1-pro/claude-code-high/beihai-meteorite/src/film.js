import * as THREE from "three";
import { applyPose, walk, float, aim } from "@agentbench/voxel-kit";
import { shotTimes } from "./cues.js";

const clamp = (v) => Math.max(0, Math.min(1, v));
const smooth = (v) => { const x = clamp(v); return x * x * (3 - 2 * x); };
const between = (time, start, end) => smooth((time - start) / (end - start));
const envelope = (time, start, end, fade = 1) => between(time, start, start + fade) * (1 - between(time, end - fade, end));
const v3 = (a) => new THREE.Vector3(...a);
const mix = (a, b, t) => a + (b - a) * t;

function setCamera(camera, position, target, fov = 42) {
  camera.position.copy(Array.isArray(position) ? v3(position) : position);
  camera.lookAt(Array.isArray(target) ? v3(target) : target);
  camera.fov = fov; camera.updateProjectionMatrix();
}
function setSuit(figure, texture, key) {
  if (figure.root.userData.suitState === key) return;
  figure.setClothes(texture); figure.root.userData.suitState = key;
}
function poseHold(figure, time, amount = 1) {
  applyPose(figure, {
    neck: [Math.sin(time * .7) * .018, Math.sin(time * .39) * .06, 0],
    armR: [-1.12 * amount + Math.sin(time * .8) * .025, 0, .08],
    armL: [-.82 * amount, 0, -.12],
    lift: Math.sin(time * 1.3) * .06,
  });
}
function setHomeProps(home, { mugs = false, magnifier = false, phone = false, meteors = false } = {}) {
  home.collectorMug.visible = mugs; home.zhangMug.visible = mugs; home.magnifier.visible = magnifier;
  home.phone.visible = phone; home.benchMeteors.forEach(rock => { rock.visible = meteors; });
}
function workshopPieces(workshop, count) {
  workshop.pieces.forEach((piece, i) => { piece.visible = i < count; });
}
function meetingFormation(space, time, emerging = false) {
  for (const a of space.attendees) {
    const q = emerging ? smooth((time - 200 - a.index * .085) / 8.5) : 1;
    a.figure.root.visible = q > .005;
    a.figure.root.position.lerpVectors(a.start, a.form, q);
    a.figure.root.position.y += Math.sin(time * .45 + a.index) * .025 * q;
    a.figure.root.rotation.set(0, 0, Math.sin(time * .25 + a.index) * .025);
    applyPose(a.figure, { ...float(time + a.index * .7), armR: [-.5, 0, .18], armL: [-.55, 0, -.18] });
    a.plume.visible = emerging && q > .05 && q < .92;
    const clear = time >= 208;
    const key = clear ? "clear" : "opaque";
    // Textures are supplied by createFilm through space.suitTextures.
    const set = space.suitTextures(a, clear, false);
    setSuit(a.figure, set, key);
  }
}

export function createFilm(context) {
  const { camera, scene, worlds, ui } = context;
  const { home, workshop, basement, space } = worlds;
  // Keep costume switching centralized and deterministic across seeks.
  space.suitTextures = (a, clear, cracked) => {
    if (cracked) return worlds.cast.clothes.suitCracked.texture;
    if (a.target >= 0) return worlds.cast.clothes.targets[a.target][clear ? "clear" : "opaque"].texture;
    return worlds.cast.clothes[clear ? "suitClear" : "suitOpaque"].texture;
  };
  const activate = (name) => {
    for (const [key, world] of Object.entries({ home, workshop, basement, space })) world.root.visible = key === name;
    const backgrounds = { home: 0x17130f, workshop: 0x10191d, basement: 0x100e0c, space: 0x01040a };
    scene.background = new THREE.Color(backgrounds[name]);
    scene.fog = name === "space" ? null : new THREE.FogExp2(backgrounds[name], name === "basement" ? .055 : .022);
    if (name === "home") {
      home.zhang.root.visible = true; home.collector.root.visible = true;
      home.radio.visible = false; home.endMug.visible = false; home.motes.rotation.y = 0;
      home.doorLight.intensity = 1.25; home.deskLight.intensity = 32;
    } else if (name === "space") {
      space.zhang.root.visible = true; space.zhang.root.position.set(0, 0, 0); space.zhang.root.rotation.set(0, Math.PI, 0);
      space.sun.position.set(-3, -3, -78); space.hatch.position.x = 0;
      space.sunlight.position.set(-25, 16, 12);
      space.signalMaterial.color.setHex(0x6e3029); space.signalMaterial.emissive.setHex(0x6e130d);
      space.pistol.visible = false; space.scope.visible = true; space.floatingScope.visible = false; space.mountedScope.visible = false;
      space.flash.visible = false; space.flashLight.intensity = 0; space.thruster.visible = false; space.bullets.visible = false;
      space.puffs.forEach(p => { p.points.visible = false; });
    } else if (name === "workshop") { workshop.zhang.root.visible = true; workshop.cutter.visible = true; }
    else if (name === "basement") basement.zhang.root.visible = true;
  };
  const settledOrbit = (time) => {
    space.earth.rotation.y = time * .002; space.sun.position.set(-5, -10, -78); space.sunlight.position.set(-5, -8, -70);
    space.hatch.position.x = 1.15; space.signalMaterial.color.setHex(0x4a9a68); space.signalMaterial.emissive.setHex(0x1c8a42);
    space.zhang.root.position.set(0, 0, 0);
  };
  const shot = (id, start, end, world, update) => ({ id, start, end, enter: () => activate(world), update: (frame) => update(frame.time, frame.localTime) });
  const shots = [
    shot("orbit-title", 0, 14, "space", (time) => {
      space.zhang.root.visible = false; space.attendees.forEach(a => { a.figure.root.visible = false; });
      space.bullets.visible = false; space.sun.visible = true;
      space.earth.rotation.y = time * .002;
      setCamera(camera, [mix(-2, 1, between(time, 0, 14)), mix(6, 3, between(time, 0, 14)), 10], [-5, -1, -42], mix(46, 41, between(time, 0, 14)));
    }),
    shot("home-entry", 14, 28, "home", (time, local) => {
      home.zhang.root.visible = true; home.collector.root.visible = true; home.radio.visible = false; home.endMug.visible = false;
      home.doorLight.intensity = 1.25; home.deskLight.intensity = 32;
      setHomeProps(home, { magnifier: local < 11.5, mugs: local > 12 });
      const entering = local < 5;
      home.zhang.root.position.z = mix(3.5, 1.35, smooth(local / 5));
      if (entering) applyPose(home.zhang, walk(time, 1.05)); else poseHold(home.zhang, time, local > 12 ? .75 : .08);
      poseHold(home.collector, time + 1, local > 12 ? .7 : .35);
      home.collector.joints.neck.rotation.y = -.15 + Math.sin(time * .4) * .04;
      setCamera(camera, [mix(-3.7, -2.25, between(time, 14, 27)), mix(2.15, 1.72, between(time, 14, 27)), mix(4.0, 2.7, between(time, 14, 27))], [0, 1.25, -1.6], 43);
    }),
    shot("home-tea", 28, 47, "home", (time) => {
      setHomeProps(home, { mugs: true }); home.zhang.root.position.set(-.4, 0, 1.35);
      poseHold(home.zhang, time, .78); poseHold(home.collector, time + .8, .74);
      home.zhang.joints.neck.rotation.x = time > 42 ? -.08 : .02;
      if (time < 38) setCamera(camera, [2.55, 1.72, -2.75], [-.35, 1.37, 1.05], 39);
      else setCamera(camera, [mix(-2.2, -1.6, between(time, 38, 47)), 1.62, -.25], [.28, 1.42, -2.55], 40);
    }),
    shot("home-choice", 47, 64, "home", (time) => {
      setHomeProps(home, { meteors: true });
      poseHold(home.collector, time, .45); poseHold(home.zhang, time, .08);
      home.collector.joints.armR.rotation.x = -1.15; home.collector.joints.armR.rotation.z = .35;
      if (time < 55) setCamera(camera, [mix(1.7, 1.1, between(time, 47, 55)), 1.48, .15], [0, 1.13, -1.3], 35);
      else setCamera(camera, [-3.15, 1.8, .6], [0, 1.25, -1.6], 43);
    }),
    shot("home-price", 64, 76, "home", (time) => {
      setHomeProps(home, { meteors: true, phone: time > 68.7 });
      poseHold(home.collector, time, .18); poseHold(home.zhang, time, time > 68.7 ? .45 : .05);
      home.collector.joints.neck.rotation.x = time > 66 ? .12 : 0;
      setCamera(camera, [mix(1.85, 1.35, between(time, 64, 76)), 1.67, -2.6], [-.35, 1.42, 1.1], 38);
    }),
    shot("workshop-wide", 76, 86, "workshop", (time, local) => {
      workshop.zhang.root.visible = true; workshop.stocks.forEach(r => { r.visible = true; }); workshop.rods.forEach(r => { r.visible = false; });
      workshopPieces(workshop, 0); workshop.coolant.visible = false; workshop.shavingBag.visible = false;
      workshop.key.intensity = mix(2, 48, between(time, 80, 81));
      workshop.zhang.root.position.z = mix(4.0, 1.65, smooth(local / 6));
      if (local < 6) applyPose(workshop.zhang, walk(time, 1)); else poseHold(workshop.zhang, time, .25);
      setCamera(camera, [mix(5, 3.5, between(time, 76, 86)), mix(3.1, 2.4, between(time, 76, 86)), 5], [0, 1.35, -1.1], 46);
    }),
    shot("cnc-cut", 86, 104, "workshop", (time) => {
      workshop.key.intensity = 48; workshop.stocks.forEach((r, i) => { r.visible = time < 98 + i * 1.2; }); workshop.rods.forEach(r => { r.visible = false; });
      workshopPieces(workshop, 0); workshop.shavingBag.visible = false; workshop.coolant.visible = time > 91;
      workshop.spindle.position.y = 2.12 + Math.sin(time * 3.2) * .18; workshop.spindle.rotation.y = time * 18; workshop.table.position.x = Math.sin(time * .8) * .25;
      poseHold(workshop.zhang, time, .35);
      const positions = workshop.coolantPositions;
      for (let i = 0; i < positions.length / 3; i++) { const p = (time * 1.8 + i * .073) % 1; const a = i * 2.399; positions[i * 3] = Math.cos(a) * p * .65; positions[i * 3 + 1] = 1.35 - p * .65; positions[i * 3 + 2] = .15 + Math.sin(a) * p * .65; }
      workshop.coolant.geometry.attributes.position.needsUpdate = true;
      const text = `N 00 / 36\nφ 7.62  L 11.0`; if (workshop.screen.current !== text) { workshop.screen.draw(text); workshop.screen.current = text; }
      setCamera(camera, [time < 95 ? 2.8 : -2.5, 2.0, 2.65], [0, 1.45, -1.05], 34);
    }),
    shot("cnc-count", 104, 118, "workshop", (time) => {
      const count = Math.min(36, Math.floor(between(time, 104, 117.5) * 37)); workshopPieces(workshop, count);
      workshop.stocks.forEach(r => { r.visible = false; }); workshop.rods.forEach(r => { r.visible = time < 109; }); workshop.coolant.visible = time < 112;
      workshop.spindle.position.y = 2.12 + Math.sin(time * 3.2) * .18; workshop.spindle.rotation.y = time * 18; workshop.table.position.x = Math.sin(time * .8) * .25;
      const text = `N ${String(count).padStart(2, "0")} / 36\n${count === 36 ? "COMPLETE" : "CUTTING"}`; if (workshop.screen.current !== text) { workshop.screen.draw(text); workshop.screen.current = text; }
      poseHold(workshop.zhang, time, .25);
      setCamera(camera, [mix(4.5, 3.7, between(time, 104, 118)), mix(2.8, 2.15, between(time, 104, 118)), 2.75], [2.65, 1.0, .1], 37);
    }),
    shot("workshop-clean", 118, 128, "workshop", (time) => {
      workshopPieces(workshop, time < 124 ? 36 : 0); workshop.rods.forEach(r => { r.visible = false; }); workshop.coolant.visible = false;
      workshop.shavingBag.visible = time > 122; workshop.spindle.position.y = mix(2.0, 2.65, between(time, 118, 123)); workshop.spindle.rotation.y = 0; workshop.cutter.visible = time < 123;
      const text = time < 123 ? "N 36 / 36\nRECOVER SWARF" : "TOOL\nREMOVED"; if (workshop.screen.current !== text) { workshop.screen.draw(text); workshop.screen.current = text; }
      poseHold(workshop.zhang, time, .4);
      workshop.zhang.joints.armL.rotation.x = -1.2 + Math.sin(time * 2) * .1; workshop.zhang.joints.armR.rotation.x = -1.0;
      setCamera(camera, time < 123 ? [1.4, 2.4, 1.75] : [-2.0, 1.4, 2.2], time < 123 ? [0, 1.7, -1.2] : [-2.5, .55, .45], 37);
    }),
    shot("basement-assembly", 128, 148, "basement", (time) => {
      const count = Math.min(36, Math.floor(between(time, 130, 147) * 37));
      basement.rounds.forEach((round, i) => { round.group.visible = true; round.original.visible = i >= count; round.meteor.visible = i < count; });
      basement.pistol.visible = false; basement.holes.forEach(h => { h.visible = false; }); basement.meat.visible = false; basement.fragments.visible = false; basement.knife.visible = false; basement.flash.visible = false; basement.flashLight.intensity = 0;
      basement.cloth.scale.x = 1; basement.cloth.position.x = 0;
      basement.zhang.root.position.set(0, 0, 1.55); poseHold(basement.zhang, time, .8); basement.zhang.joints.hips.rotation.x = .16;
      setCamera(camera, [mix(0, .6, between(time, 128, 148)), mix(4.2, 3.25, between(time, 128, 148)), mix(2.5, 1.7, between(time, 128, 148))], [0, 1.0, 0], 40);
    }),
    shot("basement-test", 148, 164, "basement", (time) => {
      basement.rounds.forEach(round => { round.original.visible = false; round.meteor.visible = true; }); basement.pistol.visible = time > 150.5;
      basement.fragments.visible = false; basement.knife.visible = false; basement.meat.visible = false;
      basement.cloth.scale.x = 1; basement.cloth.position.x = 0;
      basement.holes.forEach(h => { h.visible = time > 156.23; });
      applyPose(basement.zhang, { ...aim(0, 0), legR: [0, 0, 0], legL: [0, 0, 0] });
      const dt = time - 156.2; const pulse = dt >= 0 && dt < .15 ? Math.exp(-dt * 24) : 0;
      basement.flash.visible = dt >= 0 && dt < .065; basement.flash.scale.setScalar(1 + pulse * 1.8); basement.flashLight.intensity = pulse * 55;
      basement.zhang.joints.armR.rotation.x = -Math.PI / 2 - pulse * .16;
      const shake = pulse * .035;
      if (time < 156.2) setCamera(camera, [2.25 + Math.sin(time * 91) * shake, 1.67, .55], [0, 1.43, -1.15], 38);
      else setCamera(camera, [1.35 + Math.sin(time * 91) * shake, 1.58 + Math.cos(time * 73) * shake, -.65], [0, 1.35, -2.15], 36);
    }),
    shot("basement-fragments", 164, 178, "basement", (time) => {
      basement.pistol.visible = false; basement.flash.visible = false; basement.flashLight.intensity = 0; basement.holes.forEach(h => { h.visible = time < 165.5; });
      basement.meat.visible = time > 165.5; basement.knife.visible = time > 165.5; basement.fragments.visible = time > 168.5;
      basement.cloth.scale.x = time > 165.5 ? .18 : 1; basement.cloth.position.x = time > 165.5 ? -.65 : 0;
      poseHold(basement.zhang, time, .6);
      if (time < 168.5) setCamera(camera, [1.3, 1.65, -.75], [0, 1.32, -2.15], 35);
      else if (time < 173) setCamera(camera, [1.15, 1.42, .95], [.45, 1.14, .15], 32);
      else setCamera(camera, [-1.05, 1.66, .25], [0, 1.55, 1.5], 37);
    }),
    shot("orbital-vigil", 178, 198, "space", (time) => {
      space.zhang.root.visible = true; space.zhang.root.position.set(0, 0, 0); space.zhang.root.rotation.set(0, Math.PI, 0);
      space.attendees.forEach(a => { a.figure.root.visible = false; a.plume.visible = false; }); space.bullets.visible = false; space.puffs.forEach(p => { p.points.visible = false; });
      space.pistol.visible = false; space.scope.visible = true; space.floatingScope.visible = false; space.mountedScope.visible = false; space.flash.visible = false; space.flashLight.intensity = 0; space.thruster.visible = false;
      setSuit(space.zhang, worlds.cast.clothes.suitClear.texture, "clear"); applyPose(space.zhang, float(time));
      space.earth.rotation.y = time * .002;
      if (time < 186) setCamera(camera, [mix(4.5, 2.5, between(time, 178, 186)), 2.3, mix(8, 5.5, between(time, 178, 186))], [-2, .3, -23], 45);
      else setCamera(camera, [-2.1, 1.75, -2.8], [0, 1.4, 0], 42);
    }),
    shot("sunset-hatch", 198, 216, "space", (time) => {
      meetingFormation(space, time, true);
      space.hatch.position.x = between(time, 199, 201) * 1.15;
      const green = time > 199; space.signalMaterial.color.setHex(green ? 0x4a9a68 : 0x6e3029); space.signalMaterial.emissive.setHex(green ? 0x1c8a42 : 0x6e130d);
      space.sun.position.y = mix(1, -10, between(time, 198, 216)); space.sun.position.x = mix(-1, -5, between(time, 198, 216));
      const dusk = between(time, 198, 216); space.sunlight.position.set(mix(-25, -5, dusk), mix(16, -8, dusk), mix(12, -70, dusk));
      space.earth.rotation.y = time * .002;
      space.scope.visible = true; space.pistol.visible = false; applyPose(space.zhang, { ...float(time), armL: [-1.48, 0, -.08], armR: [-.4, 0, .2] });
      if (time < 202) setCamera(camera, [0, 2.0, 4], [-12, -5, -58], 43);
      else setCamera(camera, [0, 1.55, .2], time < 208 ? [12, 1.4, -32] : [8, .7, -20], mix(13, 8, between(time, 202, 216)));
    }),
    shot("group-scope", 216, 232, "space", (time) => {
      settledOrbit(time); meetingFormation(space, time, false); space.attendees.forEach(a => { a.plume.visible = false; });
      space.hatch.position.x = 1.15; space.pistol.visible = false; space.scope.visible = true;
      applyPose(space.zhang, { ...float(time), armL: [-1.5, 0, -.05], armR: [-.35, 0, .25] });
      setCamera(camera, [0, 1.55, .2], [8 + Math.sin(time * .4) * .025, .05, -20], mix(9, 6.2, between(time, 216, 228)));
    }),
    shot("gun-preparation", 232, 250, "space", (time) => {
      settledOrbit(time); meetingFormation(space, time, false); space.attendees.forEach(a => { a.plume.visible = false; });
      space.scope.visible = false; space.floatingScope.visible = time < 246; space.pistol.visible = time >= 239; space.mountedScope.visible = time >= 246;
      setSuit(space.zhang, time >= 235 ? worlds.cast.clothes.suitGloveOff.texture : worlds.cast.clothes.suitClear.texture, time >= 235 ? "glove-off" : "clear");
      space.floatingScope.position.set(-.35 + Math.sin(time * .8) * .025, 1.42 + Math.sin(time * .6) * .025, -.58);
      space.floatingScope.rotation.set(.1, .3, time * .03);
      applyPose(space.zhang, { hips: [-.1, 0, 0], neck: [.22, -.08, 0], armR: [time < 239 ? -.45 : -1.1, 0, .22], armL: [-1.25, 0, -.28], legR: [-.5, 0, .12], legL: [-.25, 0, -.12] });
      setCamera(camera, time < 246 ? [2.05, 1.7, -1.8] : [1.12, 1.55, -1.15], time < 246 ? [0, 1.32, -.15] : [0, 1.38, -.25], time < 246 ? 40 : 32);
    }),
    shot("thirty-shots", 250, 266, "space", (time) => {
      settledOrbit(time); meetingFormation(space, time, false); space.attendees.forEach(a => { a.plume.visible = false; });
      space.pistol.visible = true; space.mountedScope.visible = true; space.floatingScope.visible = false; space.scope.visible = false;
      setSuit(space.zhang, worlds.cast.clothes.suitGloveOff.texture, "glove-off"); space.zhang.root.rotation.y = Math.PI - .38;
      let latest = -100; for (const at of shotTimes) if (time >= at) latest = Math.max(latest, time - at);
      const pulse = latest < .3 ? Math.exp(-latest * 15) : 0;
      space.flash.visible = latest < .065; space.flash.scale.setScalar(1 + pulse * 1.5); space.flashLight.intensity = pulse * 18;
      applyPose(space.zhang, { ...aim(-pulse * .055, 0), legR: [-.48, 0, .1], legL: [-.25, 0, -.1], lift: Math.sin(time) * .08 });
      const shake = pulse * .018;
      if (time < 254.35 || (time >= 259.85 && time < 261)) setCamera(camera, [2.0 + Math.sin(time * 113) * shake, 1.65, -1.75], [0, 1.35, -.2], 38);
      else if (time >= 255.5 && time < 259.85) setCamera(camera, [Math.sin(time * 113) * shake, 1.55, .2], [8, .05, -20], 6.4);
      else setCamera(camera, [3.6 + Math.sin(time * 113) * shake, 2.1, 4.2], [4.5, 1.0, -15], 38);
    }),
    shot("ten-second-flight", 266, 276, "space", (time) => {
      settledOrbit(time); meetingFormation(space, time, false); space.attendees.forEach(a => { a.plume.visible = false; });
      space.flash.visible = false; space.flashLight.intensity = 0; space.bullets.visible = true;
      const start = new THREE.Vector3(0, 1.4, -.5);
      space.bulletMeshes.forEach((bullet, i) => {
        const a = space.attendees[2 + (i % 3)]; const end = a.form.clone().add(new THREE.Vector3((i % 5 - 2) * .035, 1.15 + (i % 2) * .05, 0));
        const p = clamp((time - shotTimes[i]) / 10); bullet.visible = p > 0 && p < 1;
        bullet.position.lerpVectors(start, end, p); bullet.position.x += (i % 3 - 1) * .025;
      });
      const lead = space.bulletMeshes[29]; const p = clamp((time - shotTimes[29]) / 10); const target = space.attendees[4].form.clone().add(new THREE.Vector3(0, 1.15, 0)); lead.position.lerpVectors(start, target, p);
      const forward = target.clone().sub(start).normalize(); const side = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
      const cam = lead.position.clone().addScaledVector(side, .48).add(new THREE.Vector3(0, .17, 0)).addScaledVector(forward, -.62);
      setCamera(camera, cam, lead.position.clone().addScaledVector(forward, .25), 34);
    }),
    shot("impact-and-return", 276, 292, "space", (time) => {
      settledOrbit(time); space.bullets.visible = false; space.flash.visible = false; space.flashLight.intensity = 0;
      for (const a of space.attendees) {
        a.figure.root.visible = true; const hitDelay = a.hit ? (a.target >= 0 ? a.target : 3) * .24 : 999;
        const hitTime = 276 + hitDelay; const hit = a.hit && time >= hitTime; const returnQ = between(time, 284 + a.index * .012, 291.5);
        const origin = a.form.clone(); if (hit) { origin.x += Math.sin(a.index) * (time - hitTime) * .04; origin.y -= (time - hitTime) * .035; }
        a.figure.root.position.lerpVectors(origin, a.start, returnQ); if (returnQ > .98) a.figure.root.visible = false;
        a.figure.root.rotation.set(hit ? (time - hitTime) * .15 : 0, returnQ > .05 ? Math.PI : 0, hit ? (time - hitTime) * .22 : 0);
        applyPose(a.figure, hit ? { hips: [.4, 0, .3], armR: [-.2, 0, .8], armL: [-.4, 0, -.9], legR: [-.8, 0, .2], legL: [.3, 0, -.2] } : { ...float(time + a.index), armR: [-.5, 0, .2], armL: [-.5, 0, -.2] });
        a.plume.visible = !a.hit && returnQ > .02 && returnQ < .96;
        setSuit(a.figure, space.suitTextures(a, true, hit && a.target === 1), hit && a.target === 1 ? "cracked" : "clear");
      }
      for (const p of space.puffs) {
        const delay = p.attendee.target >= 0 ? p.attendee.target : 3; const elapsed = time - 276 - delay * .24;
        p.points.visible = elapsed > 0 && time < 288; p.points.material.opacity = elapsed > 0 ? Math.max(0, .72 - elapsed * .065) : 0;
        const origin = p.attendee.form.clone().add(new THREE.Vector3(0, 1.15, 0)); const array = p.points.geometry.attributes.position.array;
        p.directions.forEach((direction, i) => { array[i * 3] = origin.x + direction.x * elapsed; array[i * 3 + 1] = origin.y + direction.y * elapsed; array[i * 3 + 2] = origin.z + direction.z * elapsed; });
        p.points.geometry.attributes.position.needsUpdate = true;
      }
      if (time < 284) setCamera(camera, [0, 1.55, .2], [8, .2, -20], 7.2);
      else setCamera(camera, [2.5, 3.1, 5.5], [10, 2, -26], 39);
    }),
    shot("cold-return", 292, 306, "space", (time) => {
      settledOrbit(time); space.attendees.forEach(a => { a.figure.root.visible = false; a.plume.visible = false; }); space.puffs.forEach(p => { p.points.visible = false; });
      space.pistol.visible = time < 294; space.mountedScope.visible = time < 294; space.flash.visible = false; space.flashLight.intensity = 0;
      const q = between(time, 294, 306); space.zhang.root.position.set(-q * 9, q * 4.2, -q * 19); space.zhang.root.rotation.y = -2.79;
      applyPose(space.zhang, float(time)); space.thruster.visible = time >= 294 && time <= 301;
      setCamera(camera, [mix(3.5, 4.5, q), mix(2.2, 3.0, q), 7], [-3, 1.8, -18], 43);
    }),
    shot("epilogue", 306, 336, "home", (time) => {
      home.zhang.root.visible = false; home.collector.root.visible = true; home.radio.visible = true; home.endMug.visible = true;
      setHomeProps(home); home.doorLight.intensity = .16; home.deskLight.intensity = mix(25, 10, between(time, 306, 336));
      home.collector.root.position.set(.35, 0, -2.75); poseHold(home.collector, time, .1);
      home.collector.joints.neck.rotation.y = time > 312 ? -.55 : .1; home.collector.joints.neck.rotation.x = time > 318 ? .12 : 0;
      home.motes.rotation.y = Math.sin(time * .04) * .03;
      setCamera(camera, [mix(-3.0, -.75, between(time, 306, 332)), mix(1.62, 1.35, between(time, 306, 332)), mix(2.6, .35, between(time, 306, 332))], time < 322 ? [.25, 1.25, -1.8] : [.2, 1.1, -1.25], mix(41, 34, between(time, 306, 332)));
    }),
  ];

  const locations = [
    [0, 12, "危机纪元 · 同步轨道"], [14, 20, "北京 · 胡同深处"], [76, 82, "太空军研究所 · 模型车间"],
    [128, 134, "隐蔽地下室"], [178, 185, "同步轨道 · 距黄河站 5 公里"], [306, 312, "北京 · 同日深夜"],
  ];
  const updateUI = (time) => {
    ui.title.style.opacity = String(envelope(time, .8, 13.4, 1.8));
    const location = locations.find(([start, end]) => time >= start && time < end);
    ui.location.textContent = location?.[2] ?? ""; ui.location.style.opacity = location ? String(envelope(time, location[0], location[1], .8) * .85) : "0";
    const scoped = (time >= 202 && time < 232) || (time >= 255.5 && time < 259.85) || (time >= 276 && time < 284);
    ui.scope.style.opacity = scoped ? String(time < 202.4 ? between(time, 202, 202.4) : 1) : "0";
    ui.hud.style.opacity = (time >= 178 && time < 198) || (time >= 232 && time < 266) ? ".72" : "0";
    const remaining = Math.max(0, 11 * 3600 + 47 * 60 + 32 - Math.floor(time - 178));
    const hh = Math.floor(remaining / 3600), mm = Math.floor(remaining % 3600 / 60), ss = remaining % 60;
    ui.hudTime.textContent = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    const flying = time >= 266 && time < 275; ui.flight.style.opacity = flying ? String(envelope(time, 266, 275, .35) * .85) : "0";
    ui.flight.querySelector("strong").textContent = Math.max(0, 274.8 - time).toFixed(1);
    ui.credits.style.opacity = String(envelope(time, 326, 336, 2.2));
    let fade = 1 - between(time, 0, 1.8);
    if (time > 305.4 && time < 306.6) fade = Math.max(fade, 1 - Math.abs(time - 306) / .6);
    if (time > 332) fade = Math.max(fade, between(time, 332, 335.8));
    ui.fade.style.opacity = String(clamp(fade));
  };
  return { shots, updateUI };
}
