(function(){"use strict";var va=document.createElement("style");va.textContent=`:root{--bar: 8.2vh;--ink: #e9e4d8;--ink-dim: #9aa6b4;--serif: "Songti SC", "STSong", "SimSun", "Noto Serif CJK SC", ui-serif, serif;--sans: "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", ui-sans-serif, system-ui, sans-serif}*{box-sizing:border-box}html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#000;color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased;user-select:none;cursor:default}#stage{position:fixed;inset:0;overflow:hidden;background:#000}#stage canvas{display:block}#frame{position:fixed;inset:0;pointer-events:none;z-index:5}#frame .bar{position:absolute;left:0;right:0;height:var(--bar);background:#000;box-shadow:0 0 18px 6px #000000e6}#frame .bar.top{top:0}#frame .bar.bottom{bottom:0}#vignette{position:absolute;inset:0;background:radial-gradient(ellipse 78% 72% at 50% 50%,#0000 42%,#00000057 78%,#000000a8);mix-blend-mode:multiply}#grain{position:absolute;inset:-50%;opacity:.045;background-image:repeating-conic-gradient(#fff 0% 25%,#000 0% 50%);background-size:3px 3px;animation:grain-shift .6s steps(2) infinite;mix-blend-mode:overlay}@keyframes grain-shift{0%{transform:translate(0)}50%{transform:translate(-2px,1px)}to{transform:translate(1px,-2px)}}#scan{position:absolute;inset:0;background:repeating-linear-gradient(180deg,#ffffff05 0px 1px,#0000 2px 3px);opacity:.55}#card{position:fixed;inset:0;z-index:8;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:0}.card-inner{text-align:center;transform:translateY(-2vh)}.card-main{font-family:var(--serif);font-weight:600;font-size:clamp(30px,6.4vw,96px);letter-spacing:.42em;text-indent:.42em;color:var(--ink);text-shadow:0 0 34px rgba(0,0,0,.95),0 0 90px rgba(90,150,220,.28);line-height:1.28}.card-sub{margin-top:1.15em;font-size:clamp(11px,1.5vw,19px);letter-spacing:.34em;text-indent:.34em;color:var(--ink-dim);line-height:1.9;text-shadow:0 0 20px rgba(0,0,0,.9)}#subtitle{position:fixed;left:50%;bottom:calc(var(--bar) + 4.6vh);transform:translate(-50%);z-index:9;width:min(86vw,1180px);text-align:center;pointer-events:none;opacity:0}#subtitle-text{display:inline;font-size:clamp(15px,2.05vw,27px);line-height:1.62;letter-spacing:.055em;color:#f2eee4;text-shadow:0 0 2px rgba(0,0,0,.95),0 2px 7px rgba(0,0,0,.98),0 0 26px rgba(0,0,0,.8);padding:.18em .5em;border-radius:2px}#curtain{position:fixed;inset:0;z-index:7;background:#000;opacity:0;pointer-events:none}#boot{position:fixed;inset:0;z-index:20;background:#05070a;display:flex;align-items:center;justify-content:center;transition:opacity .9s ease}.boot-inner{text-align:center;width:min(70vw,520px)}.boot-title{font-family:var(--serif);font-size:clamp(26px,4vw,54px);letter-spacing:.5em;text-indent:.5em;color:var(--ink);text-shadow:0 0 40px rgba(90,150,220,.35)}.boot-sub{margin-top:1.4em;font-size:clamp(10px,1.2vw,14px);letter-spacing:.42em;text-indent:.42em;color:var(--ink-dim)}.boot-bar{margin:2.4em auto 0;width:100%;height:2px;background:#ffffff1f;overflow:hidden}.boot-bar i{display:block;height:100%;width:0%;background:linear-gradient(90deg,#3d6ea8,#9fd0ff);box-shadow:0 0 14px #7fb8ff;transition:width .25s ease}.boot-status{margin-top:1.1em;font-size:12px;letter-spacing:.28em;color:#6c7a8c}#sound-hint{position:fixed;left:50%;bottom:calc(var(--bar) * .34);transform:translate(-50%);z-index:10;font-size:11px;letter-spacing:.22em;color:#becddeb8;text-shadow:0 0 12px #000;pointer-events:none;opacity:0;transition:opacity 1.1s ease;white-space:nowrap}#sound-hint.show{opacity:1}#hud{position:fixed;top:calc(var(--bar) * .28);right:18px;z-index:10;display:flex;gap:14px;font-size:11px;letter-spacing:.14em;color:#becdde9e;text-shadow:0 0 10px #000;opacity:0;transition:opacity .3s;pointer-events:none;font-variant-numeric:tabular-nums}#hud.show{opacity:1}#progress{position:fixed;top:0;left:0;right:0;height:2px;z-index:11;background:#ffffff0d;opacity:0;transition:opacity .3s}#progress.show{opacity:1}#progress i{display:block;height:100%;width:0%;background:linear-gradient(90deg,#2b4d73,#8fc3ff);box-shadow:0 0 10px #8cc3ffb3}#boot.fail .boot-title{color:#ff9a8a}
`,document.head.appendChild(va);const Hl=""+new URL("click1.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Gl=""+new URL("click2.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Vl=""+new URL("click3.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Wl=""+new URL("click4.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Xl=""+new URL("click5.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,ql=""+new URL("computerNoise_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Yl=""+new URL("computerNoise_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,$l=""+new URL("computerNoise_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Kl=""+new URL("doorClose_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,jl=""+new URL("doorClose_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Zl=""+new URL("doorClose_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Jl=""+new URL("doorOpen_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Ql=""+new URL("doorOpen_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,th=""+new URL("doorOpen_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,eh=""+new URL("engineCircular_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,nh=""+new URL("engineCircular_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,ih=""+new URL("engineCircular_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,sh=""+new URL("engineCircular_003.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,rh=""+new URL("explosionCrunch_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,oh=""+new URL("explosionCrunch_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,ah=""+new URL("explosionCrunch_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,ch=""+new URL("footstep_concrete_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,lh=""+new URL("footstep_concrete_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,hh=""+new URL("footstep_concrete_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,uh=""+new URL("footstep_concrete_003.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,dh=""+new URL("footstep_wood_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,fh=""+new URL("footstep_wood_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,ph=""+new URL("footstep_wood_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,mh=""+new URL("footstep_wood_003.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,gh=""+new URL("forceField_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,_h=""+new URL("forceField_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,vh=""+new URL("forceField_003.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,xh=""+new URL("impactBell_heavy_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Mh=""+new URL("impactGeneric_light_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Sh=""+new URL("impactGlass_heavy_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,yh=""+new URL("impactGlass_light_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,bh=""+new URL("impactGlass_light_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Eh=""+new URL("impactGlass_light_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Th=""+new URL("impactGlass_light_003.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,wh=""+new URL("impactGlass_medium_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Ah=""+new URL("impactMetal_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Rh=""+new URL("impactMetal_heavy_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Ch=""+new URL("impactMetal_heavy_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Ph=""+new URL("impactMetal_heavy_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Lh=""+new URL("impactMetal_light_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Uh=""+new URL("impactMetal_light_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Ih=""+new URL("impactMetal_light_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Dh=""+new URL("impactMetal_light_003.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Nh=""+new URL("impactMetal_medium_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Fh=""+new URL("impactMetal_medium_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Oh=""+new URL("impactMetal_medium_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,kh=""+new URL("impactMetal_medium_003.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Bh=""+new URL("impactMining_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,zh=""+new URL("impactMining_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Hh=""+new URL("impactMining_003.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Gh=""+new URL("impactPlate_heavy_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Vh=""+new URL("impactPlate_heavy_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Wh=""+new URL("impactPunch_heavy_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Xh=""+new URL("impactPunch_heavy_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,qh=""+new URL("impactSoft_heavy_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Yh=""+new URL("impactSoft_heavy_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,$h=""+new URL("impactSoft_medium_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Kh=""+new URL("impactSoft_medium_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,jh=""+new URL("impactTin_medium_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Zh=""+new URL("impactTin_medium_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Jh=""+new URL("impactTin_medium_003.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Qh=""+new URL("impactWood_light_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,tu=""+new URL("impactWood_medium_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,eu=""+new URL("impactWood_medium_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,nu=""+new URL("impactWood_medium_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,iu=""+new URL("laserSmall_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,su=""+new URL("lowFrequency_explosion_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,ru=""+new URL("lowFrequency_explosion_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,ou=""+new URL("mouseclick1.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,au=""+new URL("rollover2.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,cu=""+new URL("slime_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,lu=""+new URL("slime_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,hu=""+new URL("spaceEngineLow_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,uu=""+new URL("spaceEngineLow_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,du=""+new URL("spaceEngineLow_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,fu=""+new URL("spaceEngineSmall_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,pu=""+new URL("spaceEngineSmall_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,mu=""+new URL("switch1.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,gu=""+new URL("switch11.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,_u=""+new URL("switch12.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,vu=""+new URL("switch2.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,xu=""+new URL("switch20.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Mu=""+new URL("switch27.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Su=""+new URL("switch3.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,yu=""+new URL("switch4.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,bu=""+new URL("switch5.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Eu=""+new URL("switch7.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Tu=""+new URL("switch8.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,wu=""+new URL("thrusterFire_000.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Au=""+new URL("thrusterFire_001.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Ru=""+new URL("thrusterFire_002.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Cu=""+new URL("thrusterFire_003.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href,Pu=""+new URL("thrusterFire_004.ogg",document.currentScript&&document.currentScript.src||document.baseURI).href;/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const mr="169",Lu=0,xa=1,Uu=2,Ma=1,Sa=2,Sn=3,yn=0,ye=1,Ie=2,bn=0,Yn=1,De=2,ya=3,ba=4,Iu=5,$n=100,Du=101,Nu=102,Fu=103,Ou=104,ku=200,Bu=201,zu=202,Hu=203,gr=204,_r=205,Gu=206,Vu=207,Wu=208,Xu=209,qu=210,Yu=211,$u=212,Ku=213,ju=214,vr=0,xr=1,Mr=2,hi=3,Sr=4,yr=5,br=6,Er=7,Ea=0,Zu=1,Ju=2,Nn=0,Ta=1,wa=2,Aa=3,Tr=4,Qu=5,Ra=6,Ca=7,Pa=300,ui=301,di=302,wr=303,Ar=304,ps=306,Vi=1e3,Kn=1001,Rr=1002,Ce=1003,td=1004,ms=1005,en=1006,Cr=1007,Fn=1008,En=1009,La=1010,Ua=1011,Wi=1012,Pr=1013,jn=1014,pn=1015,Tn=1016,Lr=1017,Ur=1018,fi=1020,Ia=35902,Da=1021,Na=1022,Ke=1023,Fa=1024,Oa=1025,pi=1026,mi=1027,Ir=1028,Dr=1029,ka=1030,Nr=1031,Fr=1033,gs=33776,_s=33777,vs=33778,xs=33779,Or=35840,kr=35841,Br=35842,zr=35843,Hr=36196,Gr=37492,Vr=37496,Wr=37808,Xr=37809,qr=37810,Yr=37811,$r=37812,Kr=37813,jr=37814,Zr=37815,Jr=37816,Qr=37817,to=37818,eo=37819,no=37820,io=37821,Ms=36492,so=36494,ro=36495,Ba=36283,oo=36284,ao=36285,co=36286,ed=3200,nd=3201,za=0,id=1,wn="",je="srgb",On="srgb-linear",lo="display-p3",Ss="display-p3-linear",ys="linear",se="srgb",bs="rec709",Es="p3",gi=7680,Ha=519,sd=512,rd=513,od=514,Ga=515,ad=516,cd=517,ld=518,hd=519,Va=35044,ud=35048,Wa="300 es",An=2e3,Ts=2001;class _i{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const be=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ho=Math.PI/180,ws=180/Math.PI;function Xi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(be[i&255]+be[i>>8&255]+be[i>>16&255]+be[i>>24&255]+"-"+be[t&255]+be[t>>8&255]+"-"+be[t>>16&15|64]+be[t>>24&255]+"-"+be[e&63|128]+be[e>>8&255]+"-"+be[e>>16&255]+be[e>>24&255]+be[n&255]+be[n>>8&255]+be[n>>16&255]+be[n>>24&255]).toLowerCase()}function Ne(i,t,e){return Math.max(t,Math.min(e,i))}function dd(i,t){return(i%t+t)%t}function uo(i,t,e){return(1-e)*i+e*t}function qi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Fe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Ct{constructor(t=0,e=0){Ct.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ft{constructor(t,e,n,s,r,o,a,c,l){Ft.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=c,u[6]=n,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],u=n[4],d=n[7],p=n[2],m=n[5],g=n[8],v=s[0],h=s[3],f=s[6],b=s[1],S=s[4],E=s[7],N=s[2],A=s[5],w=s[8];return r[0]=o*v+a*b+c*N,r[3]=o*h+a*S+c*A,r[6]=o*f+a*E+c*w,r[1]=l*v+u*b+d*N,r[4]=l*h+u*S+d*A,r[7]=l*f+u*E+d*w,r[2]=p*v+m*b+g*N,r[5]=p*h+m*S+g*A,r[8]=p*f+m*E+g*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8];return e*o*u-e*a*l-n*r*u+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],d=u*o-a*l,p=a*c-u*r,m=l*r-o*c,g=e*d+n*p+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=d*v,t[1]=(s*l-u*n)*v,t[2]=(a*n-s*o)*v,t[3]=p*v,t[4]=(u*e-s*c)*v,t[5]=(s*r-a*e)*v,t[6]=m*v,t[7]=(n*c-l*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(fo.makeScale(t,e)),this}rotate(t){return this.premultiply(fo.makeRotation(-t)),this}translate(t,e){return this.premultiply(fo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const fo=new Ft;function Xa(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function As(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function fd(){const i=As("canvas");return i.style.display="block",i}const qa={};function Rs(i){i in qa||(qa[i]=!0,console.warn(i))}function pd(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function md(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function gd(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Ya=new Ft().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),$a=new Ft().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Yi={[On]:{transfer:ys,primaries:bs,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i,fromReference:i=>i},[je]:{transfer:se,primaries:bs,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Ss]:{transfer:ys,primaries:Es,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.applyMatrix3($a),fromReference:i=>i.applyMatrix3(Ya)},[lo]:{transfer:se,primaries:Es,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.convertSRGBToLinear().applyMatrix3($a),fromReference:i=>i.applyMatrix3(Ya).convertLinearToSRGB()}},_d=new Set([On,Ss]),Yt={enabled:!0,_workingColorSpace:On,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!_d.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Yi[t].toReference,s=Yi[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Yi[i].primaries},getTransfer:function(i){return i===wn?ys:Yi[i].transfer},getLuminanceCoefficients:function(i,t=this._workingColorSpace){return i.fromArray(Yi[t].luminanceCoefficients)}};function vi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function po(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let xi;class vd{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{xi===void 0&&(xi=As("canvas")),xi.width=t.width,xi.height=t.height;const n=xi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=xi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=As("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=vi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(vi(e[n]/255)*255):e[n]=vi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let xd=0;class Ka{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xd++}),this.uuid=Xi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(mo(s[o].image)):r.push(mo(s[o]))}else r=mo(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function mo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?vd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Md=0;class Pe extends _i{constructor(t=Pe.DEFAULT_IMAGE,e=Pe.DEFAULT_MAPPING,n=Kn,s=Kn,r=en,o=Fn,a=Ke,c=En,l=Pe.DEFAULT_ANISOTROPY,u=wn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Md++}),this.uuid=Xi(),this.name="",this.source=new Ka(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Ct(0,0),this.repeat=new Ct(1,1),this.center=new Ct(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ft,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Pa)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Vi:t.x=t.x-Math.floor(t.x);break;case Kn:t.x=t.x<0?0:1;break;case Rr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Vi:t.y=t.y-Math.floor(t.y);break;case Kn:t.y=t.y<0?0:1;break;case Rr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Pe.DEFAULT_IMAGE=null,Pe.DEFAULT_MAPPING=Pa,Pe.DEFAULT_ANISOTROPY=1;class te{constructor(t=0,e=0,n=0,s=1){te.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],u=c[4],d=c[8],p=c[1],m=c[5],g=c[9],v=c[2],h=c[6],f=c[10];if(Math.abs(u-p)<.01&&Math.abs(d-v)<.01&&Math.abs(g-h)<.01){if(Math.abs(u+p)<.1&&Math.abs(d+v)<.1&&Math.abs(g+h)<.1&&Math.abs(l+m+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(l+1)/2,E=(m+1)/2,N=(f+1)/2,A=(u+p)/4,w=(d+v)/4,D=(g+h)/4;return S>E&&S>N?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=A/n,r=w/n):E>N?E<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(E),n=A/s,r=D/s):N<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(N),n=w/r,s=D/r),this.set(n,s,r,e),this}let b=Math.sqrt((h-g)*(h-g)+(d-v)*(d-v)+(p-u)*(p-u));return Math.abs(b)<.001&&(b=1),this.x=(h-g)/b,this.y=(d-v)/b,this.z=(p-u)/b,this.w=Math.acos((l+m+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Sd extends _i{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new te(0,0,t,e),this.scissorTest=!1,this.viewport=new te(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:en,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Pe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Ka(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class nn extends Sd{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ja extends Pe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ce,this.minFilter=Ce,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class yd extends Pe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ce,this.minFilter=Ce,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Mi{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],u=n[s+2],d=n[s+3];const p=r[o+0],m=r[o+1],g=r[o+2],v=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=u,t[e+3]=d;return}if(a===1){t[e+0]=p,t[e+1]=m,t[e+2]=g,t[e+3]=v;return}if(d!==v||c!==p||l!==m||u!==g){let h=1-a;const f=c*p+l*m+u*g+d*v,b=f>=0?1:-1,S=1-f*f;if(S>Number.EPSILON){const N=Math.sqrt(S),A=Math.atan2(N,f*b);h=Math.sin(h*A)/N,a=Math.sin(a*A)/N}const E=a*b;if(c=c*h+p*E,l=l*h+m*E,u=u*h+g*E,d=d*h+v*E,h===1-a){const N=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=N,l*=N,u*=N,d*=N}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],u=n[s+3],d=r[o],p=r[o+1],m=r[o+2],g=r[o+3];return t[e]=a*g+u*d+c*m-l*p,t[e+1]=c*g+u*p+l*d-a*m,t[e+2]=l*g+u*m+a*p-c*d,t[e+3]=u*g-a*d-c*p-l*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(s/2),d=a(r/2),p=c(n/2),m=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=p*u*d+l*m*g,this._y=l*m*d-p*u*g,this._z=l*u*g+p*m*d,this._w=l*u*d-p*m*g;break;case"YXZ":this._x=p*u*d+l*m*g,this._y=l*m*d-p*u*g,this._z=l*u*g-p*m*d,this._w=l*u*d+p*m*g;break;case"ZXY":this._x=p*u*d-l*m*g,this._y=l*m*d+p*u*g,this._z=l*u*g+p*m*d,this._w=l*u*d-p*m*g;break;case"ZYX":this._x=p*u*d-l*m*g,this._y=l*m*d+p*u*g,this._z=l*u*g-p*m*d,this._w=l*u*d+p*m*g;break;case"YZX":this._x=p*u*d+l*m*g,this._y=l*m*d+p*u*g,this._z=l*u*g-p*m*d,this._w=l*u*d-p*m*g;break;case"XZY":this._x=p*u*d-l*m*g,this._y=l*m*d-p*u*g,this._z=l*u*g+p*m*d,this._w=l*u*d+p*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],u=e[6],d=e[10],p=n+a+d;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(u-c)*m,this._y=(r-l)*m,this._z=(o-s)*m}else if(n>a&&n>d){const m=2*Math.sqrt(1+n-a-d);this._w=(u-c)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+l)/m}else if(a>d){const m=2*Math.sqrt(1+a-n-d);this._w=(r-l)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(c+u)/m}else{const m=2*Math.sqrt(1+d-n-a);this._w=(o-s)/m,this._x=(r+l)/m,this._y=(c+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ne(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,u=e._w;return this._x=n*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-n*l,this._z=r*u+o*l+n*c-s*a,this._w=o*u-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const m=1-e;return this._w=m*o+e*this._w,this._x=m*n+e*this._x,this._y=m*s+e*this._y,this._z=m*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,a),d=Math.sin((1-e)*u)/l,p=Math.sin(e*u)/l;return this._w=o*d+this._w*p,this._x=n*d+this._x*p,this._y=s*d+this._y*p,this._z=r*d+this._z*p,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,n=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Za.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Za.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),u=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+c*l+o*d-a*u,this.y=n+c*u+a*l-r*d,this.z=s+c*d+r*u-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return go.copy(this).projectOnVector(t),this.sub(go)}reflect(t){return this.sub(go.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const go=new R,Za=new Mi;class Zn{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,sn):sn.fromBufferAttribute(r,o),sn.applyMatrix4(t.matrixWorld),this.expandByPoint(sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Cs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Cs.copy(n.boundingBox)),Cs.applyMatrix4(t.matrixWorld),this.union(Cs)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,sn),sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter($i),Ps.subVectors(this.max,$i),Si.subVectors(t.a,$i),yi.subVectors(t.b,$i),bi.subVectors(t.c,$i),kn.subVectors(yi,Si),Bn.subVectors(bi,yi),Jn.subVectors(Si,bi);let e=[0,-kn.z,kn.y,0,-Bn.z,Bn.y,0,-Jn.z,Jn.y,kn.z,0,-kn.x,Bn.z,0,-Bn.x,Jn.z,0,-Jn.x,-kn.y,kn.x,0,-Bn.y,Bn.x,0,-Jn.y,Jn.x,0];return!_o(e,Si,yi,bi,Ps)||(e=[1,0,0,0,1,0,0,0,1],!_o(e,Si,yi,bi,Ps))?!1:(Ls.crossVectors(kn,Bn),e=[Ls.x,Ls.y,Ls.z],_o(e,Si,yi,bi,Ps))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Rn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Rn=[new R,new R,new R,new R,new R,new R,new R,new R],sn=new R,Cs=new Zn,Si=new R,yi=new R,bi=new R,kn=new R,Bn=new R,Jn=new R,$i=new R,Ps=new R,Ls=new R,Qn=new R;function _o(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Qn.fromArray(i,r);const a=s.x*Math.abs(Qn.x)+s.y*Math.abs(Qn.y)+s.z*Math.abs(Qn.z),c=t.dot(Qn),l=e.dot(Qn),u=n.dot(Qn);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const bd=new Zn,Ki=new R,vo=new R;class Ei{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):bd.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ki.subVectors(t,this.center);const e=Ki.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ki,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(vo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ki.copy(t.center).add(vo)),this.expandByPoint(Ki.copy(t.center).sub(vo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Cn=new R,xo=new R,Us=new R,zn=new R,Mo=new R,Is=new R,So=new R;class Ja{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Cn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Cn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Cn.copy(this.origin).addScaledVector(this.direction,e),Cn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){xo.copy(t).add(e).multiplyScalar(.5),Us.copy(e).sub(t).normalize(),zn.copy(this.origin).sub(xo);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Us),a=zn.dot(this.direction),c=-zn.dot(Us),l=zn.lengthSq(),u=Math.abs(1-o*o);let d,p,m,g;if(u>0)if(d=o*c-a,p=o*a-c,g=r*u,d>=0)if(p>=-g)if(p<=g){const v=1/u;d*=v,p*=v,m=d*(d+o*p+2*a)+p*(o*d+p+2*c)+l}else p=r,d=Math.max(0,-(o*p+a)),m=-d*d+p*(p+2*c)+l;else p=-r,d=Math.max(0,-(o*p+a)),m=-d*d+p*(p+2*c)+l;else p<=-g?(d=Math.max(0,-(-o*r+a)),p=d>0?-r:Math.min(Math.max(-r,-c),r),m=-d*d+p*(p+2*c)+l):p<=g?(d=0,p=Math.min(Math.max(-r,-c),r),m=p*(p+2*c)+l):(d=Math.max(0,-(o*r+a)),p=d>0?r:Math.min(Math.max(-r,-c),r),m=-d*d+p*(p+2*c)+l);else p=o>0?-r:r,d=Math.max(0,-(o*p+a)),m=-d*d+p*(p+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(xo).addScaledVector(Us,p),m}intersectSphere(t,e){Cn.subVectors(t.center,this.origin);const n=Cn.dot(this.direction),s=Cn.dot(Cn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,p=this.origin;return l>=0?(n=(t.min.x-p.x)*l,s=(t.max.x-p.x)*l):(n=(t.max.x-p.x)*l,s=(t.min.x-p.x)*l),u>=0?(r=(t.min.y-p.y)*u,o=(t.max.y-p.y)*u):(r=(t.max.y-p.y)*u,o=(t.min.y-p.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-p.z)*d,c=(t.max.z-p.z)*d):(a=(t.max.z-p.z)*d,c=(t.min.z-p.z)*d),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Cn)!==null}intersectTriangle(t,e,n,s,r){Mo.subVectors(e,t),Is.subVectors(n,t),So.crossVectors(Mo,Is);let o=this.direction.dot(So),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;zn.subVectors(this.origin,t);const c=a*this.direction.dot(Is.crossVectors(zn,Is));if(c<0)return null;const l=a*this.direction.dot(Mo.cross(zn));if(l<0||c+l>o)return null;const u=-a*zn.dot(So);return u<0?null:this.at(u/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ee{constructor(t,e,n,s,r,o,a,c,l,u,d,p,m,g,v,h){ee.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,u,d,p,m,g,v,h)}set(t,e,n,s,r,o,a,c,l,u,d,p,m,g,v,h){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=u,f[10]=d,f[14]=p,f[3]=m,f[7]=g,f[11]=v,f[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ee().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ti.setFromMatrixColumn(t,0).length(),r=1/Ti.setFromMatrixColumn(t,1).length(),o=1/Ti.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const p=o*u,m=o*d,g=a*u,v=a*d;e[0]=c*u,e[4]=-c*d,e[8]=l,e[1]=m+g*l,e[5]=p-v*l,e[9]=-a*c,e[2]=v-p*l,e[6]=g+m*l,e[10]=o*c}else if(t.order==="YXZ"){const p=c*u,m=c*d,g=l*u,v=l*d;e[0]=p+v*a,e[4]=g*a-m,e[8]=o*l,e[1]=o*d,e[5]=o*u,e[9]=-a,e[2]=m*a-g,e[6]=v+p*a,e[10]=o*c}else if(t.order==="ZXY"){const p=c*u,m=c*d,g=l*u,v=l*d;e[0]=p-v*a,e[4]=-o*d,e[8]=g+m*a,e[1]=m+g*a,e[5]=o*u,e[9]=v-p*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const p=o*u,m=o*d,g=a*u,v=a*d;e[0]=c*u,e[4]=g*l-m,e[8]=p*l+v,e[1]=c*d,e[5]=v*l+p,e[9]=m*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const p=o*c,m=o*l,g=a*c,v=a*l;e[0]=c*u,e[4]=v-p*d,e[8]=g*d+m,e[1]=d,e[5]=o*u,e[9]=-a*u,e[2]=-l*u,e[6]=m*d+g,e[10]=p-v*d}else if(t.order==="XZY"){const p=o*c,m=o*l,g=a*c,v=a*l;e[0]=c*u,e[4]=-d,e[8]=l*u,e[1]=p*d+v,e[5]=o*u,e[9]=m*d-g,e[2]=g*d-m,e[6]=a*u,e[10]=v*d+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ed,t,Td)}lookAt(t,e,n){const s=this.elements;return Ge.subVectors(t,e),Ge.lengthSq()===0&&(Ge.z=1),Ge.normalize(),Hn.crossVectors(n,Ge),Hn.lengthSq()===0&&(Math.abs(n.z)===1?Ge.x+=1e-4:Ge.z+=1e-4,Ge.normalize(),Hn.crossVectors(n,Ge)),Hn.normalize(),Ds.crossVectors(Ge,Hn),s[0]=Hn.x,s[4]=Ds.x,s[8]=Ge.x,s[1]=Hn.y,s[5]=Ds.y,s[9]=Ge.y,s[2]=Hn.z,s[6]=Ds.z,s[10]=Ge.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],u=n[1],d=n[5],p=n[9],m=n[13],g=n[2],v=n[6],h=n[10],f=n[14],b=n[3],S=n[7],E=n[11],N=n[15],A=s[0],w=s[4],D=s[8],K=s[12],_=s[1],y=s[5],z=s[9],B=s[13],G=s[2],j=s[6],H=s[10],et=s[14],W=s[3],Q=s[7],st=s[11],lt=s[15];return r[0]=o*A+a*_+c*G+l*W,r[4]=o*w+a*y+c*j+l*Q,r[8]=o*D+a*z+c*H+l*st,r[12]=o*K+a*B+c*et+l*lt,r[1]=u*A+d*_+p*G+m*W,r[5]=u*w+d*y+p*j+m*Q,r[9]=u*D+d*z+p*H+m*st,r[13]=u*K+d*B+p*et+m*lt,r[2]=g*A+v*_+h*G+f*W,r[6]=g*w+v*y+h*j+f*Q,r[10]=g*D+v*z+h*H+f*st,r[14]=g*K+v*B+h*et+f*lt,r[3]=b*A+S*_+E*G+N*W,r[7]=b*w+S*y+E*j+N*Q,r[11]=b*D+S*z+E*H+N*st,r[15]=b*K+S*B+E*et+N*lt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],u=t[2],d=t[6],p=t[10],m=t[14],g=t[3],v=t[7],h=t[11],f=t[15];return g*(+r*c*d-s*l*d-r*a*p+n*l*p+s*a*m-n*c*m)+v*(+e*c*m-e*l*p+r*o*p-s*o*m+s*l*u-r*c*u)+h*(+e*l*d-e*a*m-r*o*d+n*o*m+r*a*u-n*l*u)+f*(-s*a*u-e*c*d+e*a*p+s*o*d-n*o*p+n*c*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],d=t[9],p=t[10],m=t[11],g=t[12],v=t[13],h=t[14],f=t[15],b=d*h*l-v*p*l+v*c*m-a*h*m-d*c*f+a*p*f,S=g*p*l-u*h*l-g*c*m+o*h*m+u*c*f-o*p*f,E=u*v*l-g*d*l+g*a*m-o*v*m-u*a*f+o*d*f,N=g*d*c-u*v*c-g*a*p+o*v*p+u*a*h-o*d*h,A=e*b+n*S+s*E+r*N;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/A;return t[0]=b*w,t[1]=(v*p*r-d*h*r-v*s*m+n*h*m+d*s*f-n*p*f)*w,t[2]=(a*h*r-v*c*r+v*s*l-n*h*l-a*s*f+n*c*f)*w,t[3]=(d*c*r-a*p*r-d*s*l+n*p*l+a*s*m-n*c*m)*w,t[4]=S*w,t[5]=(u*h*r-g*p*r+g*s*m-e*h*m-u*s*f+e*p*f)*w,t[6]=(g*c*r-o*h*r-g*s*l+e*h*l+o*s*f-e*c*f)*w,t[7]=(o*p*r-u*c*r+u*s*l-e*p*l-o*s*m+e*c*m)*w,t[8]=E*w,t[9]=(g*d*r-u*v*r-g*n*m+e*v*m+u*n*f-e*d*f)*w,t[10]=(o*v*r-g*a*r+g*n*l-e*v*l-o*n*f+e*a*f)*w,t[11]=(u*a*r-o*d*r-u*n*l+e*d*l+o*n*m-e*a*m)*w,t[12]=N*w,t[13]=(u*v*s-g*d*s+g*n*p-e*v*p-u*n*h+e*d*h)*w,t[14]=(g*a*s-o*v*s-g*n*c+e*v*c+o*n*h-e*a*h)*w,t[15]=(o*d*s-u*a*s+u*n*c-e*d*c-o*n*p+e*a*p)*w,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,u=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+n,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,u=o+o,d=a+a,p=r*l,m=r*u,g=r*d,v=o*u,h=o*d,f=a*d,b=c*l,S=c*u,E=c*d,N=n.x,A=n.y,w=n.z;return s[0]=(1-(v+f))*N,s[1]=(m+E)*N,s[2]=(g-S)*N,s[3]=0,s[4]=(m-E)*A,s[5]=(1-(p+f))*A,s[6]=(h+b)*A,s[7]=0,s[8]=(g+S)*w,s[9]=(h-b)*w,s[10]=(1-(p+v))*w,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ti.set(s[0],s[1],s[2]).length();const o=Ti.set(s[4],s[5],s[6]).length(),a=Ti.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],rn.copy(this);const l=1/r,u=1/o,d=1/a;return rn.elements[0]*=l,rn.elements[1]*=l,rn.elements[2]*=l,rn.elements[4]*=u,rn.elements[5]*=u,rn.elements[6]*=u,rn.elements[8]*=d,rn.elements[9]*=d,rn.elements[10]*=d,e.setFromRotationMatrix(rn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=An){const c=this.elements,l=2*r/(e-t),u=2*r/(n-s),d=(e+t)/(e-t),p=(n+s)/(n-s);let m,g;if(a===An)m=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Ts)m=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=An){const c=this.elements,l=1/(e-t),u=1/(n-s),d=1/(o-r),p=(e+t)*l,m=(n+s)*u;let g,v;if(a===An)g=(o+r)*d,v=-2*d;else if(a===Ts)g=r*d,v=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-p,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ti=new R,rn=new ee,Ed=new R(0,0,0),Td=new R(1,1,1),Hn=new R,Ds=new R,Ge=new R,Qa=new ee,tc=new Mi;class on{constructor(t=0,e=0,n=0,s=on.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],d=s[2],p=s[6],m=s[10];switch(e){case"XYZ":this._y=Math.asin(Ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(p,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ne(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ne(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ne(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Ne(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Qa.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Qa,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return tc.setFromEuler(this),this.setFromQuaternion(tc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}on.DEFAULT_ORDER="XYZ";class ec{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let wd=0;const nc=new R,wi=new Mi,Pn=new ee,Ns=new R,ji=new R,Ad=new R,Rd=new Mi,ic=new R(1,0,0),sc=new R(0,1,0),rc=new R(0,0,1),oc={type:"added"},Cd={type:"removed"},Ai={type:"childadded",child:null},yo={type:"childremoved",child:null};class de extends _i{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wd++}),this.uuid=Xi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=de.DEFAULT_UP.clone();const t=new R,e=new on,n=new Mi,s=new R(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ee},normalMatrix:{value:new Ft}}),this.matrix=new ee,this.matrixWorld=new ee,this.matrixAutoUpdate=de.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=de.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ec,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return wi.setFromAxisAngle(t,e),this.quaternion.multiply(wi),this}rotateOnWorldAxis(t,e){return wi.setFromAxisAngle(t,e),this.quaternion.premultiply(wi),this}rotateX(t){return this.rotateOnAxis(ic,t)}rotateY(t){return this.rotateOnAxis(sc,t)}rotateZ(t){return this.rotateOnAxis(rc,t)}translateOnAxis(t,e){return nc.copy(t).applyQuaternion(this.quaternion),this.position.add(nc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ic,t)}translateY(t){return this.translateOnAxis(sc,t)}translateZ(t){return this.translateOnAxis(rc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Pn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ns.copy(t):Ns.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ji.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Pn.lookAt(ji,Ns,this.up):Pn.lookAt(Ns,ji,this.up),this.quaternion.setFromRotationMatrix(Pn),s&&(Pn.extractRotation(s.matrixWorld),wi.setFromRotationMatrix(Pn),this.quaternion.premultiply(wi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(oc),Ai.child=t,this.dispatchEvent(Ai),Ai.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Cd),yo.child=t,this.dispatchEvent(yo),yo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Pn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Pn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Pn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(oc),Ai.child=t,this.dispatchEvent(Ai),Ai.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ji,t,Ad),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ji,Rd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const d=c[l];r(t.shapes,d)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),u=o(t.images),d=o(t.shapes),p=o(t.skeletons),m=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),p.length>0&&(n.skeletons=p),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}de.DEFAULT_UP=new R(0,1,0),de.DEFAULT_MATRIX_AUTO_UPDATE=!0,de.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const an=new R,Ln=new R,bo=new R,Un=new R,Ri=new R,Ci=new R,ac=new R,Eo=new R,To=new R,wo=new R,Ao=new te,Ro=new te,Co=new te;class cn{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),an.subVectors(t,e),s.cross(an);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){an.subVectors(s,e),Ln.subVectors(n,e),bo.subVectors(t,e);const o=an.dot(an),a=an.dot(Ln),c=an.dot(bo),l=Ln.dot(Ln),u=Ln.dot(bo),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;const p=1/d,m=(l*c-a*u)*p,g=(o*u-a*c)*p;return r.set(1-m-g,g,m)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Un)===null?!1:Un.x>=0&&Un.y>=0&&Un.x+Un.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,Un)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Un.x),c.addScaledVector(o,Un.y),c.addScaledVector(a,Un.z),c)}static getInterpolatedAttribute(t,e,n,s,r,o){return Ao.setScalar(0),Ro.setScalar(0),Co.setScalar(0),Ao.fromBufferAttribute(t,e),Ro.fromBufferAttribute(t,n),Co.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Ao,r.x),o.addScaledVector(Ro,r.y),o.addScaledVector(Co,r.z),o}static isFrontFacing(t,e,n,s){return an.subVectors(n,e),Ln.subVectors(t,e),an.cross(Ln).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return an.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),an.cross(Ln).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return cn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return cn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return cn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return cn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return cn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Ri.subVectors(s,n),Ci.subVectors(r,n),Eo.subVectors(t,n);const c=Ri.dot(Eo),l=Ci.dot(Eo);if(c<=0&&l<=0)return e.copy(n);To.subVectors(t,s);const u=Ri.dot(To),d=Ci.dot(To);if(u>=0&&d<=u)return e.copy(s);const p=c*d-u*l;if(p<=0&&c>=0&&u<=0)return o=c/(c-u),e.copy(n).addScaledVector(Ri,o);wo.subVectors(t,r);const m=Ri.dot(wo),g=Ci.dot(wo);if(g>=0&&m<=g)return e.copy(r);const v=m*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(Ci,a);const h=u*g-m*d;if(h<=0&&d-u>=0&&m-g>=0)return ac.subVectors(r,s),a=(d-u)/(d-u+(m-g)),e.copy(s).addScaledVector(ac,a);const f=1/(h+v+p);return o=v*f,a=p*f,e.copy(n).addScaledVector(Ri,o).addScaledVector(Ci,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const cc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gn={h:0,s:0,l:0},Fs={h:0,s:0,l:0};function Po(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class ht{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=je){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Yt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Yt.workingColorSpace){if(t=dd(t,1),e=Ne(e,0,1),n=Ne(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Po(o,r,t+1/3),this.g=Po(o,r,t),this.b=Po(o,r,t-1/3)}return Yt.toWorkingColorSpace(this,s),this}setStyle(t,e=je){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=je){const n=cc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=vi(t.r),this.g=vi(t.g),this.b=vi(t.b),this}copyLinearToSRGB(t){return this.r=po(t.r),this.g=po(t.g),this.b=po(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=je){return Yt.fromWorkingColorSpace(Ee.copy(this),t),Math.round(Ne(Ee.r*255,0,255))*65536+Math.round(Ne(Ee.g*255,0,255))*256+Math.round(Ne(Ee.b*255,0,255))}getHexString(t=je){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.fromWorkingColorSpace(Ee.copy(this),e);const n=Ee.r,s=Ee.g,r=Ee.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const d=o-a;switch(l=u<=.5?d/(o+a):d/(2-o-a),o){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=Yt.workingColorSpace){return Yt.fromWorkingColorSpace(Ee.copy(this),e),t.r=Ee.r,t.g=Ee.g,t.b=Ee.b,t}getStyle(t=je){Yt.fromWorkingColorSpace(Ee.copy(this),t);const e=Ee.r,n=Ee.g,s=Ee.b;return t!==je?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Gn),this.setHSL(Gn.h+t,Gn.s+e,Gn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Gn),t.getHSL(Fs);const n=uo(Gn.h,Fs.h,e),s=uo(Gn.s,Fs.s,e),r=uo(Gn.l,Fs.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ee=new ht;ht.NAMES=cc;let Pd=0;class Pi extends _i{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Pd++}),this.uuid=Xi(),this.name="",this.type="Material",this.blending=Yn,this.side=yn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=gr,this.blendDst=_r,this.blendEquation=$n,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ht(0,0,0),this.blendAlpha=0,this.depthFunc=hi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ha,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gi,this.stencilZFail=gi,this.stencilZPass=gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Yn&&(n.blending=this.blending),this.side!==yn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==gr&&(n.blendSrc=this.blendSrc),this.blendDst!==_r&&(n.blendDst=this.blendDst),this.blendEquation!==$n&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==hi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ha&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==gi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==gi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Te extends Pi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=Ea,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const fe=new R,Os=new Ct;class we{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Va,this.updateRanges=[],this.gpuType=pn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Os.fromBufferAttribute(this,e),Os.applyMatrix3(t),this.setXY(e,Os.x,Os.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyMatrix3(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyMatrix4(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyNormalMatrix(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.transformDirection(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=qi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Fe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=qi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=qi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=qi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=qi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Fe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),n=Fe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),n=Fe(n,this.array),s=Fe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Fe(e,this.array),n=Fe(n,this.array),s=Fe(s,this.array),r=Fe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Va&&(t.usage=this.usage),t}}class lc extends we{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class hc extends we{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ve extends we{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Ld=0;const Ze=new ee,Lo=new de,Li=new R,Ve=new Zn,Zi=new Zn,xe=new R;class Oe extends _i{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ld++}),this.uuid=Xi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Xa(t)?hc:lc)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ft().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ze.makeRotationFromQuaternion(t),this.applyMatrix4(Ze),this}rotateX(t){return Ze.makeRotationX(t),this.applyMatrix4(Ze),this}rotateY(t){return Ze.makeRotationY(t),this.applyMatrix4(Ze),this}rotateZ(t){return Ze.makeRotationZ(t),this.applyMatrix4(Ze),this}translate(t,e,n){return Ze.makeTranslation(t,e,n),this.applyMatrix4(Ze),this}scale(t,e,n){return Ze.makeScale(t,e,n),this.applyMatrix4(Ze),this}lookAt(t){return Lo.lookAt(t),Lo.updateMatrix(),this.applyMatrix4(Lo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Li).negate(),this.translate(Li.x,Li.y,Li.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ve(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Ve.setFromBufferAttribute(r),this.morphTargetsRelative?(xe.addVectors(this.boundingBox.min,Ve.min),this.boundingBox.expandByPoint(xe),xe.addVectors(this.boundingBox.max,Ve.max),this.boundingBox.expandByPoint(xe)):(this.boundingBox.expandByPoint(Ve.min),this.boundingBox.expandByPoint(Ve.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ei);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){const n=this.boundingSphere.center;if(Ve.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Zi.setFromBufferAttribute(a),this.morphTargetsRelative?(xe.addVectors(Ve.min,Zi.min),Ve.expandByPoint(xe),xe.addVectors(Ve.max,Zi.max),Ve.expandByPoint(xe)):(Ve.expandByPoint(Zi.min),Ve.expandByPoint(Zi.max))}Ve.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)xe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(xe));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)xe.fromBufferAttribute(a,l),c&&(Li.fromBufferAttribute(t,l),xe.add(Li)),s=Math.max(s,n.distanceToSquared(xe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new we(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let D=0;D<n.count;D++)a[D]=new R,c[D]=new R;const l=new R,u=new R,d=new R,p=new Ct,m=new Ct,g=new Ct,v=new R,h=new R;function f(D,K,_){l.fromBufferAttribute(n,D),u.fromBufferAttribute(n,K),d.fromBufferAttribute(n,_),p.fromBufferAttribute(r,D),m.fromBufferAttribute(r,K),g.fromBufferAttribute(r,_),u.sub(l),d.sub(l),m.sub(p),g.sub(p);const y=1/(m.x*g.y-g.x*m.y);isFinite(y)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(d,-m.y).multiplyScalar(y),h.copy(d).multiplyScalar(m.x).addScaledVector(u,-g.x).multiplyScalar(y),a[D].add(v),a[K].add(v),a[_].add(v),c[D].add(h),c[K].add(h),c[_].add(h))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let D=0,K=b.length;D<K;++D){const _=b[D],y=_.start,z=_.count;for(let B=y,G=y+z;B<G;B+=3)f(t.getX(B+0),t.getX(B+1),t.getX(B+2))}const S=new R,E=new R,N=new R,A=new R;function w(D){N.fromBufferAttribute(s,D),A.copy(N);const K=a[D];S.copy(K),S.sub(N.multiplyScalar(N.dot(K))).normalize(),E.crossVectors(A,K);const y=E.dot(c[D])<0?-1:1;o.setXYZW(D,S.x,S.y,S.z,y)}for(let D=0,K=b.length;D<K;++D){const _=b[D],y=_.start,z=_.count;for(let B=y,G=y+z;B<G;B+=3)w(t.getX(B+0)),w(t.getX(B+1)),w(t.getX(B+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new we(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,m=n.count;p<m;p++)n.setXYZ(p,0,0,0);const s=new R,r=new R,o=new R,a=new R,c=new R,l=new R,u=new R,d=new R;if(t)for(let p=0,m=t.count;p<m;p+=3){const g=t.getX(p+0),v=t.getX(p+1),h=t.getX(p+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,h),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,h),a.add(u),c.add(u),l.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(h,l.x,l.y,l.z)}else for(let p=0,m=e.count;p<m;p+=3)s.fromBufferAttribute(e,p+0),r.fromBufferAttribute(e,p+1),o.fromBufferAttribute(e,p+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),n.setXYZ(p+0,u.x,u.y,u.z),n.setXYZ(p+1,u.x,u.y,u.z),n.setXYZ(p+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)xe.fromBufferAttribute(t,e),xe.normalize(),t.setXYZ(e,xe.x,xe.y,xe.z)}toNonIndexed(){function t(a,c){const l=a.array,u=a.itemSize,d=a.normalized,p=new l.constructor(c.length*u);let m=0,g=0;for(let v=0,h=c.length;v<h;v++){a.isInterleavedBufferAttribute?m=c[v]*a.data.stride+a.offset:m=c[v]*u;for(let f=0;f<u;f++)p[g++]=l[m++]}return new we(p,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Oe,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let u=0,d=l.length;u<d;u++){const p=l[u],m=t(p,n);c.push(m)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let d=0,p=l.length;d<p;d++){const m=l[d];u.push(m.toJSON(t.data))}u.length>0&&(s[c]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const u=s[l];this.setAttribute(l,u.clone(e))}const r=t.morphAttributes;for(const l in r){const u=[],d=r[l];for(let p=0,m=d.length;p<m;p++)u.push(d[p].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,u=o.length;l<u;l++){const d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const uc=new ee,ti=new Ja,ks=new Ei,dc=new R,Bs=new R,zs=new R,Hs=new R,Uo=new R,Gs=new R,fc=new R,Vs=new R;class oe extends de{constructor(t=new Oe,e=new Te){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Gs.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const u=a[c],d=r[c];u!==0&&(Uo.fromBufferAttribute(d,t),o?Gs.addScaledVector(Uo,u):Gs.addScaledVector(Uo.sub(e),u))}e.add(Gs)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ks.copy(n.boundingSphere),ks.applyMatrix4(r),ti.copy(t.ray).recast(t.near),!(ks.containsPoint(ti.origin)===!1&&(ti.intersectSphere(ks,dc)===null||ti.origin.distanceToSquared(dc)>(t.far-t.near)**2))&&(uc.copy(r).invert(),ti.copy(t.ray).applyMatrix4(uc),!(n.boundingBox!==null&&ti.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ti)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,p=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=p.length;g<v;g++){const h=p[g],f=o[h.materialIndex],b=Math.max(h.start,m.start),S=Math.min(a.count,Math.min(h.start+h.count,m.start+m.count));for(let E=b,N=S;E<N;E+=3){const A=a.getX(E),w=a.getX(E+1),D=a.getX(E+2);s=Ws(this,f,t,n,l,u,d,A,w,D),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=h.materialIndex,e.push(s))}}else{const g=Math.max(0,m.start),v=Math.min(a.count,m.start+m.count);for(let h=g,f=v;h<f;h+=3){const b=a.getX(h),S=a.getX(h+1),E=a.getX(h+2);s=Ws(this,o,t,n,l,u,d,b,S,E),s&&(s.faceIndex=Math.floor(h/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=p.length;g<v;g++){const h=p[g],f=o[h.materialIndex],b=Math.max(h.start,m.start),S=Math.min(c.count,Math.min(h.start+h.count,m.start+m.count));for(let E=b,N=S;E<N;E+=3){const A=E,w=E+1,D=E+2;s=Ws(this,f,t,n,l,u,d,A,w,D),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=h.materialIndex,e.push(s))}}else{const g=Math.max(0,m.start),v=Math.min(c.count,m.start+m.count);for(let h=g,f=v;h<f;h+=3){const b=h,S=h+1,E=h+2;s=Ws(this,o,t,n,l,u,d,b,S,E),s&&(s.faceIndex=Math.floor(h/3),e.push(s))}}}}function Ud(i,t,e,n,s,r,o,a){let c;if(t.side===ye?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===yn,a),c===null)return null;Vs.copy(a),Vs.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Vs);return l<e.near||l>e.far?null:{distance:l,point:Vs.clone(),object:i}}function Ws(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,Bs),i.getVertexPosition(c,zs),i.getVertexPosition(l,Hs);const u=Ud(i,t,e,n,Bs,zs,Hs,fc);if(u){const d=new R;cn.getBarycoord(fc,Bs,zs,Hs,d),s&&(u.uv=cn.getInterpolatedAttribute(s,a,c,l,d,new Ct)),r&&(u.uv1=cn.getInterpolatedAttribute(r,a,c,l,d,new Ct)),o&&(u.normal=cn.getInterpolatedAttribute(o,a,c,l,d,new R),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const p={a,b:c,c:l,normal:new R,materialIndex:0};cn.getNormal(Bs,zs,Hs,p.normal),u.face=p,u.barycoord=d}return u}class ei extends Oe{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],u=[],d=[];let p=0,m=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ve(l,3)),this.setAttribute("normal",new ve(u,3)),this.setAttribute("uv",new ve(d,2));function g(v,h,f,b,S,E,N,A,w,D,K){const _=E/w,y=N/D,z=E/2,B=N/2,G=A/2,j=w+1,H=D+1;let et=0,W=0;const Q=new R;for(let st=0;st<H;st++){const lt=st*y-B;for(let kt=0;kt<j;kt++){const Jt=kt*_-z;Q[v]=Jt*b,Q[h]=lt*S,Q[f]=G,l.push(Q.x,Q.y,Q.z),Q[v]=0,Q[h]=0,Q[f]=A>0?1:-1,u.push(Q.x,Q.y,Q.z),d.push(kt/w),d.push(1-st/D),et+=1}}for(let st=0;st<D;st++)for(let lt=0;lt<w;lt++){const kt=p+lt+j*st,Jt=p+lt+j*(st+1),X=p+(lt+1)+j*(st+1),tt=p+(lt+1)+j*st;c.push(kt,Jt,tt),c.push(Jt,X,tt),W+=6}a.addGroup(m,W,K),m+=W,p+=et}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ei(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ui(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Le(i){const t={};for(let e=0;e<i.length;e++){const n=Ui(i[e]);for(const s in n)t[s]=n[s]}return t}function Id(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function pc(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Yt.workingColorSpace}const Ji={clone:Ui,merge:Le};var Dd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Nd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ae extends Pi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Dd,this.fragmentShader=Nd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ui(t.uniforms),this.uniformsGroups=Id(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class mc extends de{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ee,this.projectionMatrix=new ee,this.projectionMatrixInverse=new ee,this.coordinateSystem=An}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Vn=new R,gc=new Ct,_c=new Ct;class ke extends mc{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ws*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ho*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ws*2*Math.atan(Math.tan(ho*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Vn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Vn.x,Vn.y).multiplyScalar(-t/Vn.z),Vn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Vn.x,Vn.y).multiplyScalar(-t/Vn.z)}getViewSize(t,e){return this.getViewBounds(t,gc,_c),e.subVectors(_c,gc)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ho*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ii=-90,Di=1;class Fd extends de{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ke(Ii,Di,t,e);s.layers=this.layers,this.add(s);const r=new ke(Ii,Di,t,e);r.layers=this.layers,this.add(r);const o=new ke(Ii,Di,t,e);o.layers=this.layers,this.add(o);const a=new ke(Ii,Di,t,e);a.layers=this.layers,this.add(a);const c=new ke(Ii,Di,t,e);c.layers=this.layers,this.add(c);const l=new ke(Ii,Di,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===An)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ts)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,u]=this.children,d=t.getRenderTarget(),p=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(d,p,m),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class vc extends Pe{constructor(t,e,n,s,r,o,a,c,l,u){t=t!==void 0?t:[],e=e!==void 0?e:ui,super(t,e,n,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Od extends nn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new vc(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:en}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ei(5,5,5),r=new Ae({name:"CubemapFromEquirect",uniforms:Ui(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ye,blending:bn});r.uniforms.tEquirect.value=e;const o=new oe(s,r),a=e.minFilter;return e.minFilter===Fn&&(e.minFilter=en),new Fd(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const Io=new R,kd=new R,Bd=new Ft;class ni{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Io.subVectors(n,e).cross(kd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Io),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Bd.getNormalMatrix(t),s=this.coplanarPoint(Io).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ii=new Ei,Xs=new R;class Do{constructor(t=new ni,e=new ni,n=new ni,s=new ni,r=new ni,o=new ni){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=An){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],u=s[5],d=s[6],p=s[7],m=s[8],g=s[9],v=s[10],h=s[11],f=s[12],b=s[13],S=s[14],E=s[15];if(n[0].setComponents(c-r,p-l,h-m,E-f).normalize(),n[1].setComponents(c+r,p+l,h+m,E+f).normalize(),n[2].setComponents(c+o,p+u,h+g,E+b).normalize(),n[3].setComponents(c-o,p-u,h-g,E-b).normalize(),n[4].setComponents(c-a,p-d,h-v,E-S).normalize(),e===An)n[5].setComponents(c+a,p+d,h+v,E+S).normalize();else if(e===Ts)n[5].setComponents(a,d,v,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ii.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ii.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ii)}intersectsSprite(t){return ii.center.set(0,0,0),ii.radius=.7071067811865476,ii.applyMatrix4(t.matrixWorld),this.intersectsSphere(ii)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Xs.x=s.normal.x>0?t.max.x:t.min.x,Xs.y=s.normal.y>0?t.max.y:t.min.y,Xs.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Xs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function xc(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function zd(i){const t=new WeakMap;function e(a,c){const l=a.array,u=a.usage,d=l.byteLength,p=i.createBuffer();i.bindBuffer(c,p),i.bufferData(c,l,u),a.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:p,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,c,l){const u=c.array,d=c.updateRanges;if(i.bindBuffer(l,a),d.length===0)i.bufferSubData(l,0,u);else{d.sort((m,g)=>m.start-g.start);let p=0;for(let m=1;m<d.length;m++){const g=d[p],v=d[m];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++p,d[p]=v)}d.length=p+1;for(let m=0,g=d.length;m<g;m++){const v=d[m];i.bufferSubData(l,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}class si extends Oe{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,u=c+1,d=t/a,p=e/c,m=[],g=[],v=[],h=[];for(let f=0;f<u;f++){const b=f*p-o;for(let S=0;S<l;S++){const E=S*d-r;g.push(E,-b,0),v.push(0,0,1),h.push(S/a),h.push(1-f/c)}}for(let f=0;f<c;f++)for(let b=0;b<a;b++){const S=b+l*f,E=b+l*(f+1),N=b+1+l*(f+1),A=b+1+l*f;m.push(S,E,A),m.push(E,N,A)}this.setIndex(m),this.setAttribute("position",new ve(g,3)),this.setAttribute("normal",new ve(v,3)),this.setAttribute("uv",new ve(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new si(t.width,t.height,t.widthSegments,t.heightSegments)}}var Hd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Gd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Vd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Wd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Xd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,qd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Yd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,$d=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Kd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,jd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Zd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Jd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Qd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,tf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ef=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,nf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,sf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,rf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,of=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,af=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,cf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,lf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,hf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,uf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,df=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ff=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,pf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,mf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,gf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_f=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vf="gl_FragColor = linearToOutputTexel( gl_FragColor );",xf=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Mf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Sf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,yf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,bf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ef=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Tf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,wf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Af=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Rf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Cf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Pf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Lf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Uf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,If=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Df=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Nf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ff=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Of=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,kf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Bf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,zf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Hf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Gf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Vf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Wf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,$f=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Kf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,jf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Zf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Qf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,tp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ep=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,np=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ip=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,sp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,op=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ap=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,hp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,up=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,dp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,fp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,pp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,mp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,gp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,_p=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,xp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,yp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,bp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Ep=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Tp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,wp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ap=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Cp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Pp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Lp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Up=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ip=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Dp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Np=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Op=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,kp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Bp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,zp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ot={alphahash_fragment:Hd,alphahash_pars_fragment:Gd,alphamap_fragment:Vd,alphamap_pars_fragment:Wd,alphatest_fragment:Xd,alphatest_pars_fragment:qd,aomap_fragment:Yd,aomap_pars_fragment:$d,batching_pars_vertex:Kd,batching_vertex:jd,begin_vertex:Zd,beginnormal_vertex:Jd,bsdfs:Qd,iridescence_fragment:tf,bumpmap_pars_fragment:ef,clipping_planes_fragment:nf,clipping_planes_pars_fragment:sf,clipping_planes_pars_vertex:rf,clipping_planes_vertex:of,color_fragment:af,color_pars_fragment:cf,color_pars_vertex:lf,color_vertex:hf,common:uf,cube_uv_reflection_fragment:df,defaultnormal_vertex:ff,displacementmap_pars_vertex:pf,displacementmap_vertex:mf,emissivemap_fragment:gf,emissivemap_pars_fragment:_f,colorspace_fragment:vf,colorspace_pars_fragment:xf,envmap_fragment:Mf,envmap_common_pars_fragment:Sf,envmap_pars_fragment:yf,envmap_pars_vertex:bf,envmap_physical_pars_fragment:Df,envmap_vertex:Ef,fog_vertex:Tf,fog_pars_vertex:wf,fog_fragment:Af,fog_pars_fragment:Rf,gradientmap_pars_fragment:Cf,lightmap_pars_fragment:Pf,lights_lambert_fragment:Lf,lights_lambert_pars_fragment:Uf,lights_pars_begin:If,lights_toon_fragment:Nf,lights_toon_pars_fragment:Ff,lights_phong_fragment:Of,lights_phong_pars_fragment:kf,lights_physical_fragment:Bf,lights_physical_pars_fragment:zf,lights_fragment_begin:Hf,lights_fragment_maps:Gf,lights_fragment_end:Vf,logdepthbuf_fragment:Wf,logdepthbuf_pars_fragment:Xf,logdepthbuf_pars_vertex:qf,logdepthbuf_vertex:Yf,map_fragment:$f,map_pars_fragment:Kf,map_particle_fragment:jf,map_particle_pars_fragment:Zf,metalnessmap_fragment:Jf,metalnessmap_pars_fragment:Qf,morphinstance_vertex:tp,morphcolor_vertex:ep,morphnormal_vertex:np,morphtarget_pars_vertex:ip,morphtarget_vertex:sp,normal_fragment_begin:rp,normal_fragment_maps:op,normal_pars_fragment:ap,normal_pars_vertex:cp,normal_vertex:lp,normalmap_pars_fragment:hp,clearcoat_normal_fragment_begin:up,clearcoat_normal_fragment_maps:dp,clearcoat_pars_fragment:fp,iridescence_pars_fragment:pp,opaque_fragment:mp,packing:gp,premultiplied_alpha_fragment:_p,project_vertex:vp,dithering_fragment:xp,dithering_pars_fragment:Mp,roughnessmap_fragment:Sp,roughnessmap_pars_fragment:yp,shadowmap_pars_fragment:bp,shadowmap_pars_vertex:Ep,shadowmap_vertex:Tp,shadowmask_pars_fragment:wp,skinbase_vertex:Ap,skinning_pars_vertex:Rp,skinning_vertex:Cp,skinnormal_vertex:Pp,specularmap_fragment:Lp,specularmap_pars_fragment:Up,tonemapping_fragment:Ip,tonemapping_pars_fragment:Dp,transmission_fragment:Np,transmission_pars_fragment:Fp,uv_pars_fragment:Op,uv_pars_vertex:kp,uv_vertex:Bp,worldpos_vertex:zp,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},rt={common:{diffuse:{value:new ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ft},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ft}},envmap:{envMap:{value:null},envMapRotation:{value:new Ft},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ft}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ft}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ft},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ft},normalScale:{value:new Ct(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ft},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ft}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ft}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ft}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0},uvTransform:{value:new Ft}},sprite:{diffuse:{value:new ht(16777215)},opacity:{value:1},center:{value:new Ct(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ft},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0}}},mn={basic:{uniforms:Le([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.fog]),vertexShader:Ot.meshbasic_vert,fragmentShader:Ot.meshbasic_frag},lambert:{uniforms:Le([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new ht(0)}}]),vertexShader:Ot.meshlambert_vert,fragmentShader:Ot.meshlambert_frag},phong:{uniforms:Le([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new ht(0)},specular:{value:new ht(1118481)},shininess:{value:30}}]),vertexShader:Ot.meshphong_vert,fragmentShader:Ot.meshphong_frag},standard:{uniforms:Le([rt.common,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.roughnessmap,rt.metalnessmap,rt.fog,rt.lights,{emissive:{value:new ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ot.meshphysical_vert,fragmentShader:Ot.meshphysical_frag},toon:{uniforms:Le([rt.common,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.gradientmap,rt.fog,rt.lights,{emissive:{value:new ht(0)}}]),vertexShader:Ot.meshtoon_vert,fragmentShader:Ot.meshtoon_frag},matcap:{uniforms:Le([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,{matcap:{value:null}}]),vertexShader:Ot.meshmatcap_vert,fragmentShader:Ot.meshmatcap_frag},points:{uniforms:Le([rt.points,rt.fog]),vertexShader:Ot.points_vert,fragmentShader:Ot.points_frag},dashed:{uniforms:Le([rt.common,rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ot.linedashed_vert,fragmentShader:Ot.linedashed_frag},depth:{uniforms:Le([rt.common,rt.displacementmap]),vertexShader:Ot.depth_vert,fragmentShader:Ot.depth_frag},normal:{uniforms:Le([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,{opacity:{value:1}}]),vertexShader:Ot.meshnormal_vert,fragmentShader:Ot.meshnormal_frag},sprite:{uniforms:Le([rt.sprite,rt.fog]),vertexShader:Ot.sprite_vert,fragmentShader:Ot.sprite_frag},background:{uniforms:{uvTransform:{value:new Ft},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ot.background_vert,fragmentShader:Ot.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ft}},vertexShader:Ot.backgroundCube_vert,fragmentShader:Ot.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ot.cube_vert,fragmentShader:Ot.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ot.equirect_vert,fragmentShader:Ot.equirect_frag},distanceRGBA:{uniforms:Le([rt.common,rt.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ot.distanceRGBA_vert,fragmentShader:Ot.distanceRGBA_frag},shadow:{uniforms:Le([rt.lights,rt.fog,{color:{value:new ht(0)},opacity:{value:1}}]),vertexShader:Ot.shadow_vert,fragmentShader:Ot.shadow_frag}};mn.physical={uniforms:Le([mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ft},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ft},clearcoatNormalScale:{value:new Ct(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ft},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ft},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ft},sheen:{value:0},sheenColor:{value:new ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ft},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ft},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ft},transmissionSamplerSize:{value:new Ct},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ft},attenuationDistance:{value:0},attenuationColor:{value:new ht(0)},specularColor:{value:new ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ft},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ft},anisotropyVector:{value:new Ct},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ft}}]),vertexShader:Ot.meshphysical_vert,fragmentShader:Ot.meshphysical_frag};const qs={r:0,b:0,g:0},ri=new on,Hp=new ee;function Gp(i,t,e,n,s,r,o){const a=new ht(0);let c=r===!0?0:1,l,u,d=null,p=0,m=null;function g(b){let S=b.isScene===!0?b.background:null;return S&&S.isTexture&&(S=(b.backgroundBlurriness>0?e:t).get(S)),S}function v(b){let S=!1;const E=g(b);E===null?f(a,c):E&&E.isColor&&(f(E,1),S=!0);const N=i.xr.getEnvironmentBlendMode();N==="additive"?n.buffers.color.setClear(0,0,0,1,o):N==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function h(b,S){const E=g(S);E&&(E.isCubeTexture||E.mapping===ps)?(u===void 0&&(u=new oe(new ei(1,1,1),new Ae({name:"BackgroundCubeMaterial",uniforms:Ui(mn.backgroundCube.uniforms),vertexShader:mn.backgroundCube.vertexShader,fragmentShader:mn.backgroundCube.fragmentShader,side:ye,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(N,A,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),ri.copy(S.backgroundRotation),ri.x*=-1,ri.y*=-1,ri.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(ri.y*=-1,ri.z*=-1),u.material.uniforms.envMap.value=E,u.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Hp.makeRotationFromEuler(ri)),u.material.toneMapped=Yt.getTransfer(E.colorSpace)!==se,(d!==E||p!==E.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,d=E,p=E.version,m=i.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new oe(new si(2,2),new Ae({name:"BackgroundMaterial",uniforms:Ui(mn.background.uniforms),vertexShader:mn.background.vertexShader,fragmentShader:mn.background.fragmentShader,side:yn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=Yt.getTransfer(E.colorSpace)!==se,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(d!==E||p!==E.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,d=E,p=E.version,m=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function f(b,S){b.getRGB(qs,pc(i)),n.buffers.color.setClear(qs.r,qs.g,qs.b,S,o)}return{getClearColor:function(){return a},setClearColor:function(b,S=1){a.set(b),c=S,f(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(b){c=b,f(a,c)},render:v,addToRenderList:h}}function Vp(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null);let r=s,o=!1;function a(_,y,z,B,G){let j=!1;const H=d(B,z,y);r!==H&&(r=H,l(r.object)),j=m(_,B,z,G),j&&g(_,B,z,G),G!==null&&t.update(G,i.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,E(_,y,z,B),G!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function c(){return i.createVertexArray()}function l(_){return i.bindVertexArray(_)}function u(_){return i.deleteVertexArray(_)}function d(_,y,z){const B=z.wireframe===!0;let G=n[_.id];G===void 0&&(G={},n[_.id]=G);let j=G[y.id];j===void 0&&(j={},G[y.id]=j);let H=j[B];return H===void 0&&(H=p(c()),j[B]=H),H}function p(_){const y=[],z=[],B=[];for(let G=0;G<e;G++)y[G]=0,z[G]=0,B[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:y,enabledAttributes:z,attributeDivisors:B,object:_,attributes:{},index:null}}function m(_,y,z,B){const G=r.attributes,j=y.attributes;let H=0;const et=z.getAttributes();for(const W in et)if(et[W].location>=0){const st=G[W];let lt=j[W];if(lt===void 0&&(W==="instanceMatrix"&&_.instanceMatrix&&(lt=_.instanceMatrix),W==="instanceColor"&&_.instanceColor&&(lt=_.instanceColor)),st===void 0||st.attribute!==lt||lt&&st.data!==lt.data)return!0;H++}return r.attributesNum!==H||r.index!==B}function g(_,y,z,B){const G={},j=y.attributes;let H=0;const et=z.getAttributes();for(const W in et)if(et[W].location>=0){let st=j[W];st===void 0&&(W==="instanceMatrix"&&_.instanceMatrix&&(st=_.instanceMatrix),W==="instanceColor"&&_.instanceColor&&(st=_.instanceColor));const lt={};lt.attribute=st,st&&st.data&&(lt.data=st.data),G[W]=lt,H++}r.attributes=G,r.attributesNum=H,r.index=B}function v(){const _=r.newAttributes;for(let y=0,z=_.length;y<z;y++)_[y]=0}function h(_){f(_,0)}function f(_,y){const z=r.newAttributes,B=r.enabledAttributes,G=r.attributeDivisors;z[_]=1,B[_]===0&&(i.enableVertexAttribArray(_),B[_]=1),G[_]!==y&&(i.vertexAttribDivisor(_,y),G[_]=y)}function b(){const _=r.newAttributes,y=r.enabledAttributes;for(let z=0,B=y.length;z<B;z++)y[z]!==_[z]&&(i.disableVertexAttribArray(z),y[z]=0)}function S(_,y,z,B,G,j,H){H===!0?i.vertexAttribIPointer(_,y,z,G,j):i.vertexAttribPointer(_,y,z,B,G,j)}function E(_,y,z,B){v();const G=B.attributes,j=z.getAttributes(),H=y.defaultAttributeValues;for(const et in j){const W=j[et];if(W.location>=0){let Q=G[et];if(Q===void 0&&(et==="instanceMatrix"&&_.instanceMatrix&&(Q=_.instanceMatrix),et==="instanceColor"&&_.instanceColor&&(Q=_.instanceColor)),Q!==void 0){const st=Q.normalized,lt=Q.itemSize,kt=t.get(Q);if(kt===void 0)continue;const Jt=kt.buffer,X=kt.type,tt=kt.bytesPerElement,vt=X===i.INT||X===i.UNSIGNED_INT||Q.gpuType===Pr;if(Q.isInterleavedBufferAttribute){const ft=Q.data,Dt=ft.stride,At=Q.offset;if(ft.isInstancedInterleavedBuffer){for(let Ht=0;Ht<W.locationSize;Ht++)f(W.location+Ht,ft.meshPerAttribute);_.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ft.meshPerAttribute*ft.count)}else for(let Ht=0;Ht<W.locationSize;Ht++)h(W.location+Ht);i.bindBuffer(i.ARRAY_BUFFER,Jt);for(let Ht=0;Ht<W.locationSize;Ht++)S(W.location+Ht,lt/W.locationSize,X,st,Dt*tt,(At+lt/W.locationSize*Ht)*tt,vt)}else{if(Q.isInstancedBufferAttribute){for(let ft=0;ft<W.locationSize;ft++)f(W.location+ft,Q.meshPerAttribute);_.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ft=0;ft<W.locationSize;ft++)h(W.location+ft);i.bindBuffer(i.ARRAY_BUFFER,Jt);for(let ft=0;ft<W.locationSize;ft++)S(W.location+ft,lt/W.locationSize,X,st,lt*tt,lt/W.locationSize*ft*tt,vt)}}else if(H!==void 0){const st=H[et];if(st!==void 0)switch(st.length){case 2:i.vertexAttrib2fv(W.location,st);break;case 3:i.vertexAttrib3fv(W.location,st);break;case 4:i.vertexAttrib4fv(W.location,st);break;default:i.vertexAttrib1fv(W.location,st)}}}}b()}function N(){D();for(const _ in n){const y=n[_];for(const z in y){const B=y[z];for(const G in B)u(B[G].object),delete B[G];delete y[z]}delete n[_]}}function A(_){if(n[_.id]===void 0)return;const y=n[_.id];for(const z in y){const B=y[z];for(const G in B)u(B[G].object),delete B[G];delete y[z]}delete n[_.id]}function w(_){for(const y in n){const z=n[y];if(z[_.id]===void 0)continue;const B=z[_.id];for(const G in B)u(B[G].object),delete B[G];delete z[_.id]}}function D(){K(),o=!0,r!==s&&(r=s,l(r.object))}function K(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:D,resetDefaultState:K,dispose:N,releaseStatesOfGeometry:A,releaseStatesOfProgram:w,initAttributes:v,enableAttribute:h,disableUnusedAttributes:b}}function Wp(i,t,e){let n;function s(l){n=l}function r(l,u){i.drawArrays(n,l,u),e.update(u,n,1)}function o(l,u,d){d!==0&&(i.drawArraysInstanced(n,l,u,d),e.update(u,n,d))}function a(l,u,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,u,0,d);let m=0;for(let g=0;g<d;g++)m+=u[g];e.update(m,n,1)}function c(l,u,d,p){if(d===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<l.length;g++)o(l[g],u[g],p[g]);else{m.multiDrawArraysInstancedWEBGL(n,l,0,u,0,p,0,d);let g=0;for(let v=0;v<d;v++)g+=u[v];for(let v=0;v<p.length;v++)e.update(g,n,p[v])}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Xp(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(w){return!(w!==Ke&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const D=w===Tn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==En&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==pn&&!D)}function c(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const d=e.logarithmicDepthBuffer===!0,p=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control");if(p===!0){const w=t.get("EXT_clip_control");w.clipControlEXT(w.LOWER_LEFT_EXT,w.ZERO_TO_ONE_EXT)}const m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),h=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),E=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),N=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:d,reverseDepthBuffer:p,maxTextures:m,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:h,maxAttributes:f,maxVertexUniforms:b,maxVaryings:S,maxFragmentUniforms:E,vertexTextures:N,maxSamples:A}}function qp(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new ni,a=new Ft,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,p){const m=d.length!==0||p||n!==0||s;return s=p,n=d.length,m},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,p){e=u(d,p,0)},this.setState=function(d,p,m){const g=d.clippingPlanes,v=d.clipIntersection,h=d.clipShadows,f=i.get(d);if(!s||g===null||g.length===0||r&&!h)r?u(null):l();else{const b=r?0:n,S=b*4;let E=f.clippingState||null;c.value=E,E=u(g,p,S,m);for(let N=0;N!==S;++N)E[N]=e[N];f.clippingState=E,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(d,p,m,g){const v=d!==null?d.length:0;let h=null;if(v!==0){if(h=c.value,g!==!0||h===null){const f=m+v*4,b=p.matrixWorldInverse;a.getNormalMatrix(b),(h===null||h.length<f)&&(h=new Float32Array(f));for(let S=0,E=m;S!==v;++S,E+=4)o.copy(d[S]).applyMatrix4(b,a),o.normal.toArray(h,E),h[E+3]=o.constant}c.value=h,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,h}}function Yp(i){let t=new WeakMap;function e(o,a){return a===wr?o.mapping=ui:a===Ar&&(o.mapping=di),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===wr||a===Ar)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Od(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class No extends mc{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ni=4,Mc=[.125,.215,.35,.446,.526,.582],oi=20,Fo=new No,Sc=new ht;let Oo=null,ko=0,Bo=0,zo=!1;const ai=(1+Math.sqrt(5))/2,Fi=1/ai,yc=[new R(-ai,Fi,0),new R(ai,Fi,0),new R(-Fi,0,ai),new R(Fi,0,ai),new R(0,ai,-Fi),new R(0,ai,Fi),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)];class bc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Oo=this._renderer.getRenderTarget(),ko=this._renderer.getActiveCubeFace(),Bo=this._renderer.getActiveMipmapLevel(),zo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Tc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Oo,ko,Bo),this._renderer.xr.enabled=zo,t.scissorTest=!1,Ys(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ui||t.mapping===di?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Oo=this._renderer.getRenderTarget(),ko=this._renderer.getActiveCubeFace(),Bo=this._renderer.getActiveMipmapLevel(),zo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:en,minFilter:en,generateMipmaps:!1,type:Tn,format:Ke,colorSpace:On,depthBuffer:!1},s=Ec(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ec(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=$p(r)),this._blurMaterial=Kp(r,t,e)}return s}_compileMaterial(t){const e=new oe(this._lodPlanes[0],t);this._renderer.compile(e,Fo)}_sceneToCubeUV(t,e,n,s){const a=new ke(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(Sc),u.toneMapping=Nn,u.autoClear=!1;const m=new Te({name:"PMREM.Background",side:ye,depthWrite:!1,depthTest:!1}),g=new oe(new ei,m);let v=!1;const h=t.background;h?h.isColor&&(m.color.copy(h),t.background=null,v=!0):(m.color.copy(Sc),v=!0);for(let f=0;f<6;f++){const b=f%3;b===0?(a.up.set(0,c[f],0),a.lookAt(l[f],0,0)):b===1?(a.up.set(0,0,c[f]),a.lookAt(0,l[f],0)):(a.up.set(0,c[f],0),a.lookAt(0,0,l[f]));const S=this._cubeSize;Ys(s,b*S,f>2?S:0,S,S),u.setRenderTarget(s),v&&u.render(g,a),u.render(t,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=p,u.autoClear=d,t.background=h}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===ui||t.mapping===di;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=wc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Tc());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new oe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;Ys(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Fo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=yc[(s-r-1)%yc.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new oe(this._lodPlanes[s],l),p=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*oi-1),v=r/g,h=isFinite(r)?1+Math.floor(u*v):oi;h>oi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${h} samples when the maximum is set to ${oi}`);const f=[];let b=0;for(let w=0;w<oi;++w){const D=w/v,K=Math.exp(-D*D/2);f.push(K),w===0?b+=K:w<h&&(b+=2*K)}for(let w=0;w<f.length;w++)f[w]=f[w]/b;p.envMap.value=t.texture,p.samples.value=h,p.weights.value=f,p.latitudinal.value=o==="latitudinal",a&&(p.poleAxis.value=a);const{_lodMax:S}=this;p.dTheta.value=g,p.mipInt.value=S-n;const E=this._sizeLods[s],N=3*E*(s>S-Ni?s-S+Ni:0),A=4*(this._cubeSize-E);Ys(e,N,A,3*E,2*E),c.setRenderTarget(e),c.render(d,Fo)}}function $p(i){const t=[],e=[],n=[];let s=i;const r=i-Ni+1+Mc.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-Ni?c=Mc[o-i+Ni-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),u=-l,d=1+l,p=[u,u,d,u,d,d,u,u,d,d,u,d],m=6,g=6,v=3,h=2,f=1,b=new Float32Array(v*g*m),S=new Float32Array(h*g*m),E=new Float32Array(f*g*m);for(let A=0;A<m;A++){const w=A%3*2/3-1,D=A>2?0:-1,K=[w,D,0,w+2/3,D,0,w+2/3,D+1,0,w,D,0,w+2/3,D+1,0,w,D+1,0];b.set(K,v*g*A),S.set(p,h*g*A);const _=[A,A,A,A,A,A];E.set(_,f*g*A)}const N=new Oe;N.setAttribute("position",new we(b,v)),N.setAttribute("uv",new we(S,h)),N.setAttribute("faceIndex",new we(E,f)),t.push(N),s>Ni&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Ec(i,t,e){const n=new nn(i,t,e);return n.texture.mapping=ps,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ys(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Kp(i,t,e){const n=new Float32Array(oi),s=new R(0,1,0);return new Ae({name:"SphericalGaussianBlur",defines:{n:oi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ho(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function Tc(){return new Ae({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ho(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function wc(){return new Ae({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ho(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function Ho(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function jp(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===wr||c===Ar,u=c===ui||c===di;if(l||u){let d=t.get(a);const p=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==p)return e===null&&(e=new bc(i)),d=l?e.fromEquirectangular(a,d):e.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),d.texture;if(d!==void 0)return d.texture;{const m=a.image;return l&&m&&m.height>0||u&&m&&s(m)?(e===null&&(e=new bc(i)),d=l?e.fromEquirectangular(a):e.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Zp(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Rs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Jp(i,t,e,n){const s={},r=new WeakMap;function o(d){const p=d.target;p.index!==null&&t.remove(p.index);for(const g in p.attributes)t.remove(p.attributes[g]);for(const g in p.morphAttributes){const v=p.morphAttributes[g];for(let h=0,f=v.length;h<f;h++)t.remove(v[h])}p.removeEventListener("dispose",o),delete s[p.id];const m=r.get(p);m&&(t.remove(m),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function a(d,p){return s[p.id]===!0||(p.addEventListener("dispose",o),s[p.id]=!0,e.memory.geometries++),p}function c(d){const p=d.attributes;for(const g in p)t.update(p[g],i.ARRAY_BUFFER);const m=d.morphAttributes;for(const g in m){const v=m[g];for(let h=0,f=v.length;h<f;h++)t.update(v[h],i.ARRAY_BUFFER)}}function l(d){const p=[],m=d.index,g=d.attributes.position;let v=0;if(m!==null){const b=m.array;v=m.version;for(let S=0,E=b.length;S<E;S+=3){const N=b[S+0],A=b[S+1],w=b[S+2];p.push(N,A,A,w,w,N)}}else if(g!==void 0){const b=g.array;v=g.version;for(let S=0,E=b.length/3-1;S<E;S+=3){const N=S+0,A=S+1,w=S+2;p.push(N,A,A,w,w,N)}}else return;const h=new(Xa(p)?hc:lc)(p,1);h.version=v;const f=r.get(d);f&&t.remove(f),r.set(d,h)}function u(d){const p=r.get(d);if(p){const m=d.index;m!==null&&p.version<m.version&&l(d)}else l(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:u}}function Qp(i,t,e){let n;function s(p){n=p}let r,o;function a(p){r=p.type,o=p.bytesPerElement}function c(p,m){i.drawElements(n,m,r,p*o),e.update(m,n,1)}function l(p,m,g){g!==0&&(i.drawElementsInstanced(n,m,r,p*o,g),e.update(m,n,g))}function u(p,m,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,p,0,g);let h=0;for(let f=0;f<g;f++)h+=m[f];e.update(h,n,1)}function d(p,m,g,v){if(g===0)return;const h=t.get("WEBGL_multi_draw");if(h===null)for(let f=0;f<p.length;f++)l(p[f]/o,m[f],v[f]);else{h.multiDrawElementsInstancedWEBGL(n,m,0,r,p,0,v,0,g);let f=0;for(let b=0;b<g;b++)f+=m[b];for(let b=0;b<v.length;b++)e.update(f,n,v[b])}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function t0(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function e0(i,t,e){const n=new WeakMap,s=new te;function r(o,a,c){const l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0;let p=n.get(a);if(p===void 0||p.count!==d){let K=function(){w.dispose(),n.delete(a),a.removeEventListener("dispose",K)};p!==void 0&&p.texture.dispose();const m=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,h=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],b=a.morphAttributes.color||[];let S=0;m===!0&&(S=1),g===!0&&(S=2),v===!0&&(S=3);let E=a.attributes.position.count*S,N=1;E>t.maxTextureSize&&(N=Math.ceil(E/t.maxTextureSize),E=t.maxTextureSize);const A=new Float32Array(E*N*4*d),w=new ja(A,E,N,d);w.type=pn,w.needsUpdate=!0;const D=S*4;for(let _=0;_<d;_++){const y=h[_],z=f[_],B=b[_],G=E*N*4*_;for(let j=0;j<y.count;j++){const H=j*D;m===!0&&(s.fromBufferAttribute(y,j),A[G+H+0]=s.x,A[G+H+1]=s.y,A[G+H+2]=s.z,A[G+H+3]=0),g===!0&&(s.fromBufferAttribute(z,j),A[G+H+4]=s.x,A[G+H+5]=s.y,A[G+H+6]=s.z,A[G+H+7]=0),v===!0&&(s.fromBufferAttribute(B,j),A[G+H+8]=s.x,A[G+H+9]=s.y,A[G+H+10]=s.z,A[G+H+11]=B.itemSize===4?s.w:1)}}p={count:d,texture:w,size:new Ct(E,N)},n.set(a,p),a.addEventListener("dispose",K)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let m=0;for(let v=0;v<l.length;v++)m+=l[v];const g=a.morphTargetsRelative?1:1-m;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:r}}function n0(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,u=c.geometry,d=t.get(c,u);if(s.get(d)!==l&&(t.update(d),s.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==l&&(p.update(),s.set(p,l))}return d}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}class Ac extends Pe{constructor(t,e,n,s,r,o,a,c,l,u=pi){if(u!==pi&&u!==mi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===pi&&(n=jn),n===void 0&&u===mi&&(n=fi),super(null,s,r,o,a,c,u,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ce,this.minFilter=c!==void 0?c:Ce,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Rc=new Pe,Cc=new Ac(1,1),Pc=new ja,Lc=new yd,Uc=new vc,Ic=[],Dc=[],Nc=new Float32Array(16),Fc=new Float32Array(9),Oc=new Float32Array(4);function Oi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Ic[s];if(r===void 0&&(r=new Float32Array(s),Ic[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function me(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function ge(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function $s(i,t){let e=Dc[t];e===void 0&&(e=new Int32Array(t),Dc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function i0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function s0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2fv(this.addr,t),ge(e,t)}}function r0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(me(e,t))return;i.uniform3fv(this.addr,t),ge(e,t)}}function o0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4fv(this.addr,t),ge(e,t)}}function a0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;Oc.set(n),i.uniformMatrix2fv(this.addr,!1,Oc),ge(e,n)}}function c0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;Fc.set(n),i.uniformMatrix3fv(this.addr,!1,Fc),ge(e,n)}}function l0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(me(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),ge(e,t)}else{if(me(e,n))return;Nc.set(n),i.uniformMatrix4fv(this.addr,!1,Nc),ge(e,n)}}function h0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function u0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2iv(this.addr,t),ge(e,t)}}function d0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;i.uniform3iv(this.addr,t),ge(e,t)}}function f0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4iv(this.addr,t),ge(e,t)}}function p0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function m0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(me(e,t))return;i.uniform2uiv(this.addr,t),ge(e,t)}}function g0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(me(e,t))return;i.uniform3uiv(this.addr,t),ge(e,t)}}function _0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(me(e,t))return;i.uniform4uiv(this.addr,t),ge(e,t)}}function v0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Cc.compareFunction=Ga,r=Cc):r=Rc,e.setTexture2D(t||r,s)}function x0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Lc,s)}function M0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Uc,s)}function S0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Pc,s)}function y0(i){switch(i){case 5126:return i0;case 35664:return s0;case 35665:return r0;case 35666:return o0;case 35674:return a0;case 35675:return c0;case 35676:return l0;case 5124:case 35670:return h0;case 35667:case 35671:return u0;case 35668:case 35672:return d0;case 35669:case 35673:return f0;case 5125:return p0;case 36294:return m0;case 36295:return g0;case 36296:return _0;case 35678:case 36198:case 36298:case 36306:case 35682:return v0;case 35679:case 36299:case 36307:return x0;case 35680:case 36300:case 36308:case 36293:return M0;case 36289:case 36303:case 36311:case 36292:return S0}}function b0(i,t){i.uniform1fv(this.addr,t)}function E0(i,t){const e=Oi(t,this.size,2);i.uniform2fv(this.addr,e)}function T0(i,t){const e=Oi(t,this.size,3);i.uniform3fv(this.addr,e)}function w0(i,t){const e=Oi(t,this.size,4);i.uniform4fv(this.addr,e)}function A0(i,t){const e=Oi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function R0(i,t){const e=Oi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function C0(i,t){const e=Oi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function P0(i,t){i.uniform1iv(this.addr,t)}function L0(i,t){i.uniform2iv(this.addr,t)}function U0(i,t){i.uniform3iv(this.addr,t)}function I0(i,t){i.uniform4iv(this.addr,t)}function D0(i,t){i.uniform1uiv(this.addr,t)}function N0(i,t){i.uniform2uiv(this.addr,t)}function F0(i,t){i.uniform3uiv(this.addr,t)}function O0(i,t){i.uniform4uiv(this.addr,t)}function k0(i,t,e){const n=this.cache,s=t.length,r=$s(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Rc,r[o])}function B0(i,t,e){const n=this.cache,s=t.length,r=$s(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Lc,r[o])}function z0(i,t,e){const n=this.cache,s=t.length,r=$s(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Uc,r[o])}function H0(i,t,e){const n=this.cache,s=t.length,r=$s(e,s);me(n,r)||(i.uniform1iv(this.addr,r),ge(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Pc,r[o])}function G0(i){switch(i){case 5126:return b0;case 35664:return E0;case 35665:return T0;case 35666:return w0;case 35674:return A0;case 35675:return R0;case 35676:return C0;case 5124:case 35670:return P0;case 35667:case 35671:return L0;case 35668:case 35672:return U0;case 35669:case 35673:return I0;case 5125:return D0;case 36294:return N0;case 36295:return F0;case 36296:return O0;case 35678:case 36198:case 36298:case 36306:case 35682:return k0;case 35679:case 36299:case 36307:return B0;case 35680:case 36300:case 36308:case 36293:return z0;case 36289:case 36303:case 36311:case 36292:return H0}}class V0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=y0(e.type)}}class W0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=G0(e.type)}}class X0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Go=/(\w+)(\])?(\[|\.)?/g;function kc(i,t){i.seq.push(t),i.map[t.id]=t}function q0(i,t,e){const n=i.name,s=n.length;for(Go.lastIndex=0;;){const r=Go.exec(n),o=Go.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){kc(e,l===void 0?new V0(a,i,t):new W0(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new X0(a),kc(e,d)),e=d}}}class Ks{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);q0(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Bc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Y0=37297;let $0=0;function K0(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function j0(i){const t=Yt.getPrimaries(Yt.workingColorSpace),e=Yt.getPrimaries(i);let n;switch(t===e?n="":t===Es&&e===bs?n="LinearDisplayP3ToLinearSRGB":t===bs&&e===Es&&(n="LinearSRGBToLinearDisplayP3"),i){case On:case Ss:return[n,"LinearTransferOETF"];case je:case lo:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function zc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+K0(i.getShaderSource(t),o)}else return s}function Z0(i,t){const e=j0(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function J0(i,t){let e;switch(t){case Ta:e="Linear";break;case wa:e="Reinhard";break;case Aa:e="Cineon";break;case Tr:e="ACESFilmic";break;case Ra:e="AgX";break;case Ca:e="Neutral";break;case Qu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const js=new R;function Q0(){Yt.getLuminanceCoefficients(js);const i=js.x.toFixed(4),t=js.y.toFixed(4),e=js.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function tm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qi).join(`
`)}function em(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function nm(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Qi(i){return i!==""}function Hc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Gc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const im=/^[ \t]*#include +<([\w\d./]+)>/gm;function Vo(i){return i.replace(im,rm)}const sm=new Map;function rm(i,t){let e=Ot[t];if(e===void 0){const n=sm.get(t);if(n!==void 0)e=Ot[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Vo(e)}const om=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vc(i){return i.replace(om,am)}function am(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Wc(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function cm(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ma?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Sa?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Sn&&(t="SHADOWMAP_TYPE_VSM"),t}function lm(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ui:case di:t="ENVMAP_TYPE_CUBE";break;case ps:t="ENVMAP_TYPE_CUBE_UV";break}return t}function hm(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case di:t="ENVMAP_MODE_REFRACTION";break}return t}function um(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ea:t="ENVMAP_BLENDING_MULTIPLY";break;case Zu:t="ENVMAP_BLENDING_MIX";break;case Ju:t="ENVMAP_BLENDING_ADD";break}return t}function dm(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function fm(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=cm(e),l=lm(e),u=hm(e),d=um(e),p=dm(e),m=tm(e),g=em(r),v=s.createProgram();let h,f,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(h=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Qi).join(`
`),h.length>0&&(h+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Qi).join(`
`),f.length>0&&(f+=`
`)):(h=[Wc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qi).join(`
`),f=[Wc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+d:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Nn?"#define TONE_MAPPING":"",e.toneMapping!==Nn?Ot.tonemapping_pars_fragment:"",e.toneMapping!==Nn?J0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ot.colorspace_pars_fragment,Z0("linearToOutputTexel",e.outputColorSpace),Q0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Qi).join(`
`)),o=Vo(o),o=Hc(o,e),o=Gc(o,e),a=Vo(a),a=Hc(a,e),a=Gc(a,e),o=Vc(o),a=Vc(a),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,h=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+h,f=["#define varying in",e.glslVersion===Wa?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Wa?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const S=b+h+o,E=b+f+a,N=Bc(s,s.VERTEX_SHADER,S),A=Bc(s,s.FRAGMENT_SHADER,E);s.attachShader(v,N),s.attachShader(v,A),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function w(y){if(i.debug.checkShaderErrors){const z=s.getProgramInfoLog(v).trim(),B=s.getShaderInfoLog(N).trim(),G=s.getShaderInfoLog(A).trim();let j=!0,H=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(j=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,N,A);else{const et=zc(s,N,"vertex"),W=zc(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+y.name+`
Material Type: `+y.type+`

Program Info Log: `+z+`
`+et+`
`+W)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(B===""||G==="")&&(H=!1);H&&(y.diagnostics={runnable:j,programLog:z,vertexShader:{log:B,prefix:h},fragmentShader:{log:G,prefix:f}})}s.deleteShader(N),s.deleteShader(A),D=new Ks(s,v),K=nm(s,v)}let D;this.getUniforms=function(){return D===void 0&&w(this),D};let K;this.getAttributes=function(){return K===void 0&&w(this),K};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(v,Y0)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=$0++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=N,this.fragmentShader=A,this}let pm=0;class mm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new gm(t),e.set(t,n)),n}}class gm{constructor(t){this.id=pm++,this.code=t,this.usedTimes=0}}function _m(i,t,e,n,s,r,o){const a=new ec,c=new mm,l=new Set,u=[],d=s.logarithmicDepthBuffer,p=s.reverseDepthBuffer,m=s.vertexTextures;let g=s.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function h(_){return l.add(_),_===0?"uv":`uv${_}`}function f(_,y,z,B,G){const j=B.fog,H=G.geometry,et=_.isMeshStandardMaterial?B.environment:null,W=(_.isMeshStandardMaterial?e:t).get(_.envMap||et),Q=W&&W.mapping===ps?W.image.height:null,st=v[_.type];_.precision!==null&&(g=s.getMaxPrecision(_.precision),g!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",g,"instead."));const lt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,kt=lt!==void 0?lt.length:0;let Jt=0;H.morphAttributes.position!==void 0&&(Jt=1),H.morphAttributes.normal!==void 0&&(Jt=2),H.morphAttributes.color!==void 0&&(Jt=3);let X,tt,vt,ft;if(st){const He=mn[st];X=He.vertexShader,tt=He.fragmentShader}else X=_.vertexShader,tt=_.fragmentShader,c.update(_),vt=c.getVertexShaderID(_),ft=c.getFragmentShaderID(_);const Dt=i.getRenderTarget(),At=G.isInstancedMesh===!0,Ht=G.isBatchedMesh===!0,ne=!!_.map,Gt=!!_.matcap,C=!!W,qe=!!_.aoMap,Bt=!!_.lightMap,Xt=!!_.bumpMap,Pt=!!_.normalMap,ae=!!_.displacementMap,It=!!_.emissiveMap,T=!!_.metalnessMap,x=!!_.roughnessMap,F=_.anisotropy>0,Y=_.clearcoat>0,J=_.dispersion>0,q=_.iridescence>0,yt=_.sheen>0,ot=_.transmission>0,pt=F&&!!_.anisotropyMap,qt=Y&&!!_.clearcoatMap,nt=Y&&!!_.clearcoatNormalMap,mt=Y&&!!_.clearcoatRoughnessMap,Lt=q&&!!_.iridescenceMap,Ut=q&&!!_.iridescenceThicknessMap,gt=yt&&!!_.sheenColorMap,zt=yt&&!!_.sheenRoughnessMap,Nt=!!_.specularMap,re=!!_.specularColorMap,P=!!_.specularIntensityMap,ut=ot&&!!_.transmissionMap,V=ot&&!!_.thicknessMap,$=!!_.gradientMap,at=!!_.alphaMap,dt=_.alphaTest>0,Vt=!!_.alphaHash,pe=!!_.extensions;let ze=Nn;_.toneMapped&&(Dt===null||Dt.isXRRenderTarget===!0)&&(ze=i.toneMapping);const Kt={shaderID:st,shaderType:_.type,shaderName:_.name,vertexShader:X,fragmentShader:tt,defines:_.defines,customVertexShaderID:vt,customFragmentShaderID:ft,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:g,batching:Ht,batchingColor:Ht&&G._colorsTexture!==null,instancing:At,instancingColor:At&&G.instanceColor!==null,instancingMorph:At&&G.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:Dt===null?i.outputColorSpace:Dt.isXRRenderTarget===!0?Dt.texture.colorSpace:On,alphaToCoverage:!!_.alphaToCoverage,map:ne,matcap:Gt,envMap:C,envMapMode:C&&W.mapping,envMapCubeUVHeight:Q,aoMap:qe,lightMap:Bt,bumpMap:Xt,normalMap:Pt,displacementMap:m&&ae,emissiveMap:It,normalMapObjectSpace:Pt&&_.normalMapType===id,normalMapTangentSpace:Pt&&_.normalMapType===za,metalnessMap:T,roughnessMap:x,anisotropy:F,anisotropyMap:pt,clearcoat:Y,clearcoatMap:qt,clearcoatNormalMap:nt,clearcoatRoughnessMap:mt,dispersion:J,iridescence:q,iridescenceMap:Lt,iridescenceThicknessMap:Ut,sheen:yt,sheenColorMap:gt,sheenRoughnessMap:zt,specularMap:Nt,specularColorMap:re,specularIntensityMap:P,transmission:ot,transmissionMap:ut,thicknessMap:V,gradientMap:$,opaque:_.transparent===!1&&_.blending===Yn&&_.alphaToCoverage===!1,alphaMap:at,alphaTest:dt,alphaHash:Vt,combine:_.combine,mapUv:ne&&h(_.map.channel),aoMapUv:qe&&h(_.aoMap.channel),lightMapUv:Bt&&h(_.lightMap.channel),bumpMapUv:Xt&&h(_.bumpMap.channel),normalMapUv:Pt&&h(_.normalMap.channel),displacementMapUv:ae&&h(_.displacementMap.channel),emissiveMapUv:It&&h(_.emissiveMap.channel),metalnessMapUv:T&&h(_.metalnessMap.channel),roughnessMapUv:x&&h(_.roughnessMap.channel),anisotropyMapUv:pt&&h(_.anisotropyMap.channel),clearcoatMapUv:qt&&h(_.clearcoatMap.channel),clearcoatNormalMapUv:nt&&h(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:mt&&h(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Lt&&h(_.iridescenceMap.channel),iridescenceThicknessMapUv:Ut&&h(_.iridescenceThicknessMap.channel),sheenColorMapUv:gt&&h(_.sheenColorMap.channel),sheenRoughnessMapUv:zt&&h(_.sheenRoughnessMap.channel),specularMapUv:Nt&&h(_.specularMap.channel),specularColorMapUv:re&&h(_.specularColorMap.channel),specularIntensityMapUv:P&&h(_.specularIntensityMap.channel),transmissionMapUv:ut&&h(_.transmissionMap.channel),thicknessMapUv:V&&h(_.thicknessMap.channel),alphaMapUv:at&&h(_.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(Pt||F),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!H.attributes.uv&&(ne||at),fog:!!j,useFog:_.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:p,skinning:G.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:kt,morphTextureStride:Jt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&z.length>0,shadowMapType:i.shadowMap.type,toneMapping:ze,decodeVideoTexture:ne&&_.map.isVideoTexture===!0&&Yt.getTransfer(_.map.colorSpace)===se,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ie,flipSided:_.side===ye,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:pe&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pe&&_.extensions.multiDraw===!0||Ht)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Kt.vertexUv1s=l.has(1),Kt.vertexUv2s=l.has(2),Kt.vertexUv3s=l.has(3),l.clear(),Kt}function b(_){const y=[];if(_.shaderID?y.push(_.shaderID):(y.push(_.customVertexShaderID),y.push(_.customFragmentShaderID)),_.defines!==void 0)for(const z in _.defines)y.push(z),y.push(_.defines[z]);return _.isRawShaderMaterial===!1&&(S(y,_),E(y,_),y.push(i.outputColorSpace)),y.push(_.customProgramCacheKey),y.join()}function S(_,y){_.push(y.precision),_.push(y.outputColorSpace),_.push(y.envMapMode),_.push(y.envMapCubeUVHeight),_.push(y.mapUv),_.push(y.alphaMapUv),_.push(y.lightMapUv),_.push(y.aoMapUv),_.push(y.bumpMapUv),_.push(y.normalMapUv),_.push(y.displacementMapUv),_.push(y.emissiveMapUv),_.push(y.metalnessMapUv),_.push(y.roughnessMapUv),_.push(y.anisotropyMapUv),_.push(y.clearcoatMapUv),_.push(y.clearcoatNormalMapUv),_.push(y.clearcoatRoughnessMapUv),_.push(y.iridescenceMapUv),_.push(y.iridescenceThicknessMapUv),_.push(y.sheenColorMapUv),_.push(y.sheenRoughnessMapUv),_.push(y.specularMapUv),_.push(y.specularColorMapUv),_.push(y.specularIntensityMapUv),_.push(y.transmissionMapUv),_.push(y.thicknessMapUv),_.push(y.combine),_.push(y.fogExp2),_.push(y.sizeAttenuation),_.push(y.morphTargetsCount),_.push(y.morphAttributeCount),_.push(y.numDirLights),_.push(y.numPointLights),_.push(y.numSpotLights),_.push(y.numSpotLightMaps),_.push(y.numHemiLights),_.push(y.numRectAreaLights),_.push(y.numDirLightShadows),_.push(y.numPointLightShadows),_.push(y.numSpotLightShadows),_.push(y.numSpotLightShadowsWithMaps),_.push(y.numLightProbes),_.push(y.shadowMapType),_.push(y.toneMapping),_.push(y.numClippingPlanes),_.push(y.numClipIntersection),_.push(y.depthPacking)}function E(_,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),_.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reverseDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.alphaToCoverage&&a.enable(20),_.push(a.mask)}function N(_){const y=v[_.type];let z;if(y){const B=mn[y];z=Ji.clone(B.uniforms)}else z=_.uniforms;return z}function A(_,y){let z;for(let B=0,G=u.length;B<G;B++){const j=u[B];if(j.cacheKey===y){z=j,++z.usedTimes;break}}return z===void 0&&(z=new fm(i,y,_,r),u.push(z)),z}function w(_){if(--_.usedTimes===0){const y=u.indexOf(_);u[y]=u[u.length-1],u.pop(),_.destroy()}}function D(_){c.remove(_)}function K(){c.dispose()}return{getParameters:f,getProgramCacheKey:b,getUniforms:N,acquireProgram:A,releaseProgram:w,releaseShaderCache:D,programs:u,dispose:K}}function vm(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function xm(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Xc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function qc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,p,m,g,v,h){let f=i[t];return f===void 0?(f={id:d.id,object:d,geometry:p,material:m,groupOrder:g,renderOrder:d.renderOrder,z:v,group:h},i[t]=f):(f.id=d.id,f.object=d,f.geometry=p,f.material=m,f.groupOrder=g,f.renderOrder=d.renderOrder,f.z=v,f.group=h),t++,f}function a(d,p,m,g,v,h){const f=o(d,p,m,g,v,h);m.transmission>0?n.push(f):m.transparent===!0?s.push(f):e.push(f)}function c(d,p,m,g,v,h){const f=o(d,p,m,g,v,h);m.transmission>0?n.unshift(f):m.transparent===!0?s.unshift(f):e.unshift(f)}function l(d,p){e.length>1&&e.sort(d||xm),n.length>1&&n.sort(p||Xc),s.length>1&&s.sort(p||Xc)}function u(){for(let d=t,p=i.length;d<p;d++){const m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:u,sort:l}}function Mm(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new qc,i.set(n,[o])):s>=r.length?(o=new qc,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Sm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new ht};break;case"SpotLight":e={position:new R,direction:new R,color:new ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new ht,groundColor:new ht};break;case"RectAreaLight":e={color:new ht,position:new R,halfWidth:new R,halfHeight:new R};break}return i[t.id]=e,e}}}function ym(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let bm=0;function Em(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Tm(i){const t=new Sm,e=ym(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new R);const s=new R,r=new ee,o=new ee;function a(l){let u=0,d=0,p=0;for(let K=0;K<9;K++)n.probe[K].set(0,0,0);let m=0,g=0,v=0,h=0,f=0,b=0,S=0,E=0,N=0,A=0,w=0;l.sort(Em);for(let K=0,_=l.length;K<_;K++){const y=l[K],z=y.color,B=y.intensity,G=y.distance,j=y.shadow&&y.shadow.map?y.shadow.map.texture:null;if(y.isAmbientLight)u+=z.r*B,d+=z.g*B,p+=z.b*B;else if(y.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(y.sh.coefficients[H],B);w++}else if(y.isDirectionalLight){const H=t.get(y);if(H.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){const et=y.shadow,W=e.get(y);W.shadowIntensity=et.intensity,W.shadowBias=et.bias,W.shadowNormalBias=et.normalBias,W.shadowRadius=et.radius,W.shadowMapSize=et.mapSize,n.directionalShadow[m]=W,n.directionalShadowMap[m]=j,n.directionalShadowMatrix[m]=y.shadow.matrix,b++}n.directional[m]=H,m++}else if(y.isSpotLight){const H=t.get(y);H.position.setFromMatrixPosition(y.matrixWorld),H.color.copy(z).multiplyScalar(B),H.distance=G,H.coneCos=Math.cos(y.angle),H.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),H.decay=y.decay,n.spot[v]=H;const et=y.shadow;if(y.map&&(n.spotLightMap[N]=y.map,N++,et.updateMatrices(y),y.castShadow&&A++),n.spotLightMatrix[v]=et.matrix,y.castShadow){const W=e.get(y);W.shadowIntensity=et.intensity,W.shadowBias=et.bias,W.shadowNormalBias=et.normalBias,W.shadowRadius=et.radius,W.shadowMapSize=et.mapSize,n.spotShadow[v]=W,n.spotShadowMap[v]=j,E++}v++}else if(y.isRectAreaLight){const H=t.get(y);H.color.copy(z).multiplyScalar(B),H.halfWidth.set(y.width*.5,0,0),H.halfHeight.set(0,y.height*.5,0),n.rectArea[h]=H,h++}else if(y.isPointLight){const H=t.get(y);if(H.color.copy(y.color).multiplyScalar(y.intensity),H.distance=y.distance,H.decay=y.decay,y.castShadow){const et=y.shadow,W=e.get(y);W.shadowIntensity=et.intensity,W.shadowBias=et.bias,W.shadowNormalBias=et.normalBias,W.shadowRadius=et.radius,W.shadowMapSize=et.mapSize,W.shadowCameraNear=et.camera.near,W.shadowCameraFar=et.camera.far,n.pointShadow[g]=W,n.pointShadowMap[g]=j,n.pointShadowMatrix[g]=y.shadow.matrix,S++}n.point[g]=H,g++}else if(y.isHemisphereLight){const H=t.get(y);H.skyColor.copy(y.color).multiplyScalar(B),H.groundColor.copy(y.groundColor).multiplyScalar(B),n.hemi[f]=H,f++}}h>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=rt.LTC_FLOAT_1,n.rectAreaLTC2=rt.LTC_FLOAT_2):(n.rectAreaLTC1=rt.LTC_HALF_1,n.rectAreaLTC2=rt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=p;const D=n.hash;(D.directionalLength!==m||D.pointLength!==g||D.spotLength!==v||D.rectAreaLength!==h||D.hemiLength!==f||D.numDirectionalShadows!==b||D.numPointShadows!==S||D.numSpotShadows!==E||D.numSpotMaps!==N||D.numLightProbes!==w)&&(n.directional.length=m,n.spot.length=v,n.rectArea.length=h,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=E,n.spotShadowMap.length=E,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=E+N-A,n.spotLightMap.length=N,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=w,D.directionalLength=m,D.pointLength=g,D.spotLength=v,D.rectAreaLength=h,D.hemiLength=f,D.numDirectionalShadows=b,D.numPointShadows=S,D.numSpotShadows=E,D.numSpotMaps=N,D.numLightProbes=w,n.version=bm++)}function c(l,u){let d=0,p=0,m=0,g=0,v=0;const h=u.matrixWorldInverse;for(let f=0,b=l.length;f<b;f++){const S=l[f];if(S.isDirectionalLight){const E=n.directional[d];E.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(h),d++}else if(S.isSpotLight){const E=n.spot[m];E.position.setFromMatrixPosition(S.matrixWorld),E.position.applyMatrix4(h),E.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(h),m++}else if(S.isRectAreaLight){const E=n.rectArea[g];E.position.setFromMatrixPosition(S.matrixWorld),E.position.applyMatrix4(h),o.identity(),r.copy(S.matrixWorld),r.premultiply(h),o.extractRotation(r),E.halfWidth.set(S.width*.5,0,0),E.halfHeight.set(0,S.height*.5,0),E.halfWidth.applyMatrix4(o),E.halfHeight.applyMatrix4(o),g++}else if(S.isPointLight){const E=n.point[p];E.position.setFromMatrixPosition(S.matrixWorld),E.position.applyMatrix4(h),p++}else if(S.isHemisphereLight){const E=n.hemi[v];E.direction.setFromMatrixPosition(S.matrixWorld),E.direction.transformDirection(h),v++}}}return{setup:a,setupView:c,state:n}}function Yc(i){const t=new Tm(i),e=[],n=[];function s(u){l.camera=u,e.length=0,n.length=0}function r(u){e.push(u)}function o(u){n.push(u)}function a(){t.setup(e)}function c(u){t.setupView(e,u)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function wm(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new Yc(i),t.set(s,[a])):r>=o.length?(a=new Yc(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class Am extends Pi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ed,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Rm extends Pi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Cm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Pm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Lm(i,t,e){let n=new Do;const s=new Ct,r=new Ct,o=new te,a=new Am({depthPacking:nd}),c=new Rm,l={},u=e.maxTextureSize,d={[yn]:ye,[ye]:yn,[Ie]:Ie},p=new Ae({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ct},radius:{value:4}},vertexShader:Cm,fragmentShader:Pm}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const g=new Oe;g.setAttribute("position",new we(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new oe(g,p),h=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ma;let f=this.type;this.render=function(A,w,D){if(h.enabled===!1||h.autoUpdate===!1&&h.needsUpdate===!1||A.length===0)return;const K=i.getRenderTarget(),_=i.getActiveCubeFace(),y=i.getActiveMipmapLevel(),z=i.state;z.setBlending(bn),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const B=f!==Sn&&this.type===Sn,G=f===Sn&&this.type!==Sn;for(let j=0,H=A.length;j<H;j++){const et=A[j],W=et.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",et,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const Q=W.getFrameExtents();if(s.multiply(Q),r.copy(W.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/Q.x),s.x=r.x*Q.x,W.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/Q.y),s.y=r.y*Q.y,W.mapSize.y=r.y)),W.map===null||B===!0||G===!0){const lt=this.type!==Sn?{minFilter:Ce,magFilter:Ce}:{};W.map!==null&&W.map.dispose(),W.map=new nn(s.x,s.y,lt),W.map.texture.name=et.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const st=W.getViewportCount();for(let lt=0;lt<st;lt++){const kt=W.getViewport(lt);o.set(r.x*kt.x,r.y*kt.y,r.x*kt.z,r.y*kt.w),z.viewport(o),W.updateMatrices(et,lt),n=W.getFrustum(),E(w,D,W.camera,et,this.type)}W.isPointLightShadow!==!0&&this.type===Sn&&b(W,D),W.needsUpdate=!1}f=this.type,h.needsUpdate=!1,i.setRenderTarget(K,_,y)};function b(A,w){const D=t.update(v);p.defines.VSM_SAMPLES!==A.blurSamples&&(p.defines.VSM_SAMPLES=A.blurSamples,m.defines.VSM_SAMPLES=A.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new nn(s.x,s.y)),p.uniforms.shadow_pass.value=A.map.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(w,null,D,p,v,null),m.uniforms.shadow_pass.value=A.mapPass.texture,m.uniforms.resolution.value=A.mapSize,m.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(w,null,D,m,v,null)}function S(A,w,D,K){let _=null;const y=D.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(y!==void 0)_=y;else if(_=D.isPointLight===!0?c:a,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const z=_.uuid,B=w.uuid;let G=l[z];G===void 0&&(G={},l[z]=G);let j=G[B];j===void 0&&(j=_.clone(),G[B]=j,w.addEventListener("dispose",N)),_=j}if(_.visible=w.visible,_.wireframe=w.wireframe,K===Sn?_.side=w.shadowSide!==null?w.shadowSide:w.side:_.side=w.shadowSide!==null?w.shadowSide:d[w.side],_.alphaMap=w.alphaMap,_.alphaTest=w.alphaTest,_.map=w.map,_.clipShadows=w.clipShadows,_.clippingPlanes=w.clippingPlanes,_.clipIntersection=w.clipIntersection,_.displacementMap=w.displacementMap,_.displacementScale=w.displacementScale,_.displacementBias=w.displacementBias,_.wireframeLinewidth=w.wireframeLinewidth,_.linewidth=w.linewidth,D.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const z=i.properties.get(_);z.light=D}return _}function E(A,w,D,K,_){if(A.visible===!1)return;if(A.layers.test(w.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&_===Sn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,A.matrixWorld);const B=t.update(A),G=A.material;if(Array.isArray(G)){const j=B.groups;for(let H=0,et=j.length;H<et;H++){const W=j[H],Q=G[W.materialIndex];if(Q&&Q.visible){const st=S(A,Q,K,_);A.onBeforeShadow(i,A,w,D,B,st,W),i.renderBufferDirect(D,null,B,st,A,W),A.onAfterShadow(i,A,w,D,B,st,W)}}}else if(G.visible){const j=S(A,G,K,_);A.onBeforeShadow(i,A,w,D,B,j,null),i.renderBufferDirect(D,null,B,j,A,null),A.onAfterShadow(i,A,w,D,B,j,null)}}const z=A.children;for(let B=0,G=z.length;B<G;B++)E(z[B],w,D,K,_)}function N(A){A.target.removeEventListener("dispose",N);for(const D in l){const K=l[D],_=A.target.uuid;_ in K&&(K[_].dispose(),delete K[_])}}}const Um={[vr]:xr,[Mr]:br,[Sr]:Er,[hi]:yr,[xr]:vr,[br]:Mr,[Er]:Sr,[yr]:hi};function Im(i){function t(){let P=!1;const ut=new te;let V=null;const $=new te(0,0,0,0);return{setMask:function(at){V!==at&&!P&&(i.colorMask(at,at,at,at),V=at)},setLocked:function(at){P=at},setClear:function(at,dt,Vt,pe,ze){ze===!0&&(at*=pe,dt*=pe,Vt*=pe),ut.set(at,dt,Vt,pe),$.equals(ut)===!1&&(i.clearColor(at,dt,Vt,pe),$.copy(ut))},reset:function(){P=!1,V=null,$.set(-1,0,0,0)}}}function e(){let P=!1,ut=!1,V=null,$=null,at=null;return{setReversed:function(dt){ut=dt},setTest:function(dt){dt?vt(i.DEPTH_TEST):ft(i.DEPTH_TEST)},setMask:function(dt){V!==dt&&!P&&(i.depthMask(dt),V=dt)},setFunc:function(dt){if(ut&&(dt=Um[dt]),$!==dt){switch(dt){case vr:i.depthFunc(i.NEVER);break;case xr:i.depthFunc(i.ALWAYS);break;case Mr:i.depthFunc(i.LESS);break;case hi:i.depthFunc(i.LEQUAL);break;case Sr:i.depthFunc(i.EQUAL);break;case yr:i.depthFunc(i.GEQUAL);break;case br:i.depthFunc(i.GREATER);break;case Er:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}$=dt}},setLocked:function(dt){P=dt},setClear:function(dt){at!==dt&&(i.clearDepth(dt),at=dt)},reset:function(){P=!1,V=null,$=null,at=null}}}function n(){let P=!1,ut=null,V=null,$=null,at=null,dt=null,Vt=null,pe=null,ze=null;return{setTest:function(Kt){P||(Kt?vt(i.STENCIL_TEST):ft(i.STENCIL_TEST))},setMask:function(Kt){ut!==Kt&&!P&&(i.stencilMask(Kt),ut=Kt)},setFunc:function(Kt,He,Dn){(V!==Kt||$!==He||at!==Dn)&&(i.stencilFunc(Kt,He,Dn),V=Kt,$=He,at=Dn)},setOp:function(Kt,He,Dn){(dt!==Kt||Vt!==He||pe!==Dn)&&(i.stencilOp(Kt,He,Dn),dt=Kt,Vt=He,pe=Dn)},setLocked:function(Kt){P=Kt},setClear:function(Kt){ze!==Kt&&(i.clearStencil(Kt),ze=Kt)},reset:function(){P=!1,ut=null,V=null,$=null,at=null,dt=null,Vt=null,pe=null,ze=null}}}const s=new t,r=new e,o=new n,a=new WeakMap,c=new WeakMap;let l={},u={},d=new WeakMap,p=[],m=null,g=!1,v=null,h=null,f=null,b=null,S=null,E=null,N=null,A=new ht(0,0,0),w=0,D=!1,K=null,_=null,y=null,z=null,B=null;const G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,H=0;const et=i.getParameter(i.VERSION);et.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(et)[1]),j=H>=1):et.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(et)[1]),j=H>=2);let W=null,Q={};const st=i.getParameter(i.SCISSOR_BOX),lt=i.getParameter(i.VIEWPORT),kt=new te().fromArray(st),Jt=new te().fromArray(lt);function X(P,ut,V,$){const at=new Uint8Array(4),dt=i.createTexture();i.bindTexture(P,dt),i.texParameteri(P,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(P,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Vt=0;Vt<V;Vt++)P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY?i.texImage3D(ut,0,i.RGBA,1,1,$,0,i.RGBA,i.UNSIGNED_BYTE,at):i.texImage2D(ut+Vt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,at);return dt}const tt={};tt[i.TEXTURE_2D]=X(i.TEXTURE_2D,i.TEXTURE_2D,1),tt[i.TEXTURE_CUBE_MAP]=X(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),tt[i.TEXTURE_2D_ARRAY]=X(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),tt[i.TEXTURE_3D]=X(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),vt(i.DEPTH_TEST),r.setFunc(hi),Bt(!1),Xt(xa),vt(i.CULL_FACE),C(bn);function vt(P){l[P]!==!0&&(i.enable(P),l[P]=!0)}function ft(P){l[P]!==!1&&(i.disable(P),l[P]=!1)}function Dt(P,ut){return u[P]!==ut?(i.bindFramebuffer(P,ut),u[P]=ut,P===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ut),P===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ut),!0):!1}function At(P,ut){let V=p,$=!1;if(P){V=d.get(ut),V===void 0&&(V=[],d.set(ut,V));const at=P.textures;if(V.length!==at.length||V[0]!==i.COLOR_ATTACHMENT0){for(let dt=0,Vt=at.length;dt<Vt;dt++)V[dt]=i.COLOR_ATTACHMENT0+dt;V.length=at.length,$=!0}}else V[0]!==i.BACK&&(V[0]=i.BACK,$=!0);$&&i.drawBuffers(V)}function Ht(P){return m!==P?(i.useProgram(P),m=P,!0):!1}const ne={[$n]:i.FUNC_ADD,[Du]:i.FUNC_SUBTRACT,[Nu]:i.FUNC_REVERSE_SUBTRACT};ne[Fu]=i.MIN,ne[Ou]=i.MAX;const Gt={[ku]:i.ZERO,[Bu]:i.ONE,[zu]:i.SRC_COLOR,[gr]:i.SRC_ALPHA,[qu]:i.SRC_ALPHA_SATURATE,[Wu]:i.DST_COLOR,[Gu]:i.DST_ALPHA,[Hu]:i.ONE_MINUS_SRC_COLOR,[_r]:i.ONE_MINUS_SRC_ALPHA,[Xu]:i.ONE_MINUS_DST_COLOR,[Vu]:i.ONE_MINUS_DST_ALPHA,[Yu]:i.CONSTANT_COLOR,[$u]:i.ONE_MINUS_CONSTANT_COLOR,[Ku]:i.CONSTANT_ALPHA,[ju]:i.ONE_MINUS_CONSTANT_ALPHA};function C(P,ut,V,$,at,dt,Vt,pe,ze,Kt){if(P===bn){g===!0&&(ft(i.BLEND),g=!1);return}if(g===!1&&(vt(i.BLEND),g=!0),P!==Iu){if(P!==v||Kt!==D){if((h!==$n||S!==$n)&&(i.blendEquation(i.FUNC_ADD),h=$n,S=$n),Kt)switch(P){case Yn:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case De:i.blendFunc(i.ONE,i.ONE);break;case ya:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ba:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}else switch(P){case Yn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case De:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ya:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ba:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}f=null,b=null,E=null,N=null,A.set(0,0,0),w=0,v=P,D=Kt}return}at=at||ut,dt=dt||V,Vt=Vt||$,(ut!==h||at!==S)&&(i.blendEquationSeparate(ne[ut],ne[at]),h=ut,S=at),(V!==f||$!==b||dt!==E||Vt!==N)&&(i.blendFuncSeparate(Gt[V],Gt[$],Gt[dt],Gt[Vt]),f=V,b=$,E=dt,N=Vt),(pe.equals(A)===!1||ze!==w)&&(i.blendColor(pe.r,pe.g,pe.b,ze),A.copy(pe),w=ze),v=P,D=!1}function qe(P,ut){P.side===Ie?ft(i.CULL_FACE):vt(i.CULL_FACE);let V=P.side===ye;ut&&(V=!V),Bt(V),P.blending===Yn&&P.transparent===!1?C(bn):C(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),r.setFunc(P.depthFunc),r.setTest(P.depthTest),r.setMask(P.depthWrite),s.setMask(P.colorWrite);const $=P.stencilWrite;o.setTest($),$&&(o.setMask(P.stencilWriteMask),o.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),o.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),ae(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?vt(i.SAMPLE_ALPHA_TO_COVERAGE):ft(i.SAMPLE_ALPHA_TO_COVERAGE)}function Bt(P){K!==P&&(P?i.frontFace(i.CW):i.frontFace(i.CCW),K=P)}function Xt(P){P!==Lu?(vt(i.CULL_FACE),P!==_&&(P===xa?i.cullFace(i.BACK):P===Uu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ft(i.CULL_FACE),_=P}function Pt(P){P!==y&&(j&&i.lineWidth(P),y=P)}function ae(P,ut,V){P?(vt(i.POLYGON_OFFSET_FILL),(z!==ut||B!==V)&&(i.polygonOffset(ut,V),z=ut,B=V)):ft(i.POLYGON_OFFSET_FILL)}function It(P){P?vt(i.SCISSOR_TEST):ft(i.SCISSOR_TEST)}function T(P){P===void 0&&(P=i.TEXTURE0+G-1),W!==P&&(i.activeTexture(P),W=P)}function x(P,ut,V){V===void 0&&(W===null?V=i.TEXTURE0+G-1:V=W);let $=Q[V];$===void 0&&($={type:void 0,texture:void 0},Q[V]=$),($.type!==P||$.texture!==ut)&&(W!==V&&(i.activeTexture(V),W=V),i.bindTexture(P,ut||tt[P]),$.type=P,$.texture=ut)}function F(){const P=Q[W];P!==void 0&&P.type!==void 0&&(i.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function Y(){try{i.compressedTexImage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function J(){try{i.compressedTexImage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function q(){try{i.texSubImage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function yt(){try{i.texSubImage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ot(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function pt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function qt(){try{i.texStorage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function nt(){try{i.texStorage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function mt(){try{i.texImage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Lt(){try{i.texImage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Ut(P){kt.equals(P)===!1&&(i.scissor(P.x,P.y,P.z,P.w),kt.copy(P))}function gt(P){Jt.equals(P)===!1&&(i.viewport(P.x,P.y,P.z,P.w),Jt.copy(P))}function zt(P,ut){let V=c.get(ut);V===void 0&&(V=new WeakMap,c.set(ut,V));let $=V.get(P);$===void 0&&($=i.getUniformBlockIndex(ut,P.name),V.set(P,$))}function Nt(P,ut){const $=c.get(ut).get(P);a.get(ut)!==$&&(i.uniformBlockBinding(ut,$,P.__bindingPointIndex),a.set(ut,$))}function re(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),l={},W=null,Q={},u={},d=new WeakMap,p=[],m=null,g=!1,v=null,h=null,f=null,b=null,S=null,E=null,N=null,A=new ht(0,0,0),w=0,D=!1,K=null,_=null,y=null,z=null,B=null,kt.set(0,0,i.canvas.width,i.canvas.height),Jt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:vt,disable:ft,bindFramebuffer:Dt,drawBuffers:At,useProgram:Ht,setBlending:C,setMaterial:qe,setFlipSided:Bt,setCullFace:Xt,setLineWidth:Pt,setPolygonOffset:ae,setScissorTest:It,activeTexture:T,bindTexture:x,unbindTexture:F,compressedTexImage2D:Y,compressedTexImage3D:J,texImage2D:mt,texImage3D:Lt,updateUBOMapping:zt,uniformBlockBinding:Nt,texStorage2D:qt,texStorage3D:nt,texSubImage2D:q,texSubImage3D:yt,compressedTexSubImage2D:ot,compressedTexSubImage3D:pt,scissor:Ut,viewport:gt,reset:re}}function $c(i,t,e,n){const s=Dm(n);switch(e){case Da:return i*t;case Fa:return i*t;case Oa:return i*t*2;case Ir:return i*t/s.components*s.byteLength;case Dr:return i*t/s.components*s.byteLength;case ka:return i*t*2/s.components*s.byteLength;case Nr:return i*t*2/s.components*s.byteLength;case Na:return i*t*3/s.components*s.byteLength;case Ke:return i*t*4/s.components*s.byteLength;case Fr:return i*t*4/s.components*s.byteLength;case gs:case _s:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case vs:case xs:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case kr:case zr:return Math.max(i,16)*Math.max(t,8)/4;case Or:case Br:return Math.max(i,8)*Math.max(t,8)/2;case Hr:case Gr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Vr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Wr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Xr:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case qr:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Yr:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case $r:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Kr:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case jr:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Zr:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Jr:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Qr:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case to:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case eo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case no:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case io:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Ms:case so:case ro:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Ba:case oo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ao:case co:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Dm(i){switch(i){case En:case La:return{byteLength:1,components:1};case Wi:case Ua:case Tn:return{byteLength:2,components:1};case Lr:case Ur:return{byteLength:2,components:4};case jn:case Pr:case pn:return{byteLength:4,components:1};case Ia:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Nm(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ct,u=new WeakMap;let d;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,x){return m?new OffscreenCanvas(T,x):As("canvas")}function v(T,x,F){let Y=1;const J=It(T);if((J.width>F||J.height>F)&&(Y=F/Math.max(J.width,J.height)),Y<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const q=Math.floor(Y*J.width),yt=Math.floor(Y*J.height);d===void 0&&(d=g(q,yt));const ot=x?g(q,yt):d;return ot.width=q,ot.height=yt,ot.getContext("2d").drawImage(T,0,0,q,yt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+q+"x"+yt+")."),ot}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),T;return T}function h(T){return T.generateMipmaps&&T.minFilter!==Ce&&T.minFilter!==en}function f(T){i.generateMipmap(T)}function b(T,x,F,Y,J=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let q=x;if(x===i.RED&&(F===i.FLOAT&&(q=i.R32F),F===i.HALF_FLOAT&&(q=i.R16F),F===i.UNSIGNED_BYTE&&(q=i.R8)),x===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(q=i.R8UI),F===i.UNSIGNED_SHORT&&(q=i.R16UI),F===i.UNSIGNED_INT&&(q=i.R32UI),F===i.BYTE&&(q=i.R8I),F===i.SHORT&&(q=i.R16I),F===i.INT&&(q=i.R32I)),x===i.RG&&(F===i.FLOAT&&(q=i.RG32F),F===i.HALF_FLOAT&&(q=i.RG16F),F===i.UNSIGNED_BYTE&&(q=i.RG8)),x===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(q=i.RG8UI),F===i.UNSIGNED_SHORT&&(q=i.RG16UI),F===i.UNSIGNED_INT&&(q=i.RG32UI),F===i.BYTE&&(q=i.RG8I),F===i.SHORT&&(q=i.RG16I),F===i.INT&&(q=i.RG32I)),x===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(q=i.RGB8UI),F===i.UNSIGNED_SHORT&&(q=i.RGB16UI),F===i.UNSIGNED_INT&&(q=i.RGB32UI),F===i.BYTE&&(q=i.RGB8I),F===i.SHORT&&(q=i.RGB16I),F===i.INT&&(q=i.RGB32I)),x===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),F===i.UNSIGNED_INT&&(q=i.RGBA32UI),F===i.BYTE&&(q=i.RGBA8I),F===i.SHORT&&(q=i.RGBA16I),F===i.INT&&(q=i.RGBA32I)),x===i.RGB&&F===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),x===i.RGBA){const yt=J?ys:Yt.getTransfer(Y);F===i.FLOAT&&(q=i.RGBA32F),F===i.HALF_FLOAT&&(q=i.RGBA16F),F===i.UNSIGNED_BYTE&&(q=yt===se?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function S(T,x){let F;return T?x===null||x===jn||x===fi?F=i.DEPTH24_STENCIL8:x===pn?F=i.DEPTH32F_STENCIL8:x===Wi&&(F=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===jn||x===fi?F=i.DEPTH_COMPONENT24:x===pn?F=i.DEPTH_COMPONENT32F:x===Wi&&(F=i.DEPTH_COMPONENT16),F}function E(T,x){return h(T)===!0||T.isFramebufferTexture&&T.minFilter!==Ce&&T.minFilter!==en?Math.log2(Math.max(x.width,x.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?x.mipmaps.length:1}function N(T){const x=T.target;x.removeEventListener("dispose",N),w(x),x.isVideoTexture&&u.delete(x)}function A(T){const x=T.target;x.removeEventListener("dispose",A),K(x)}function w(T){const x=n.get(T);if(x.__webglInit===void 0)return;const F=T.source,Y=p.get(F);if(Y){const J=Y[x.__cacheKey];J.usedTimes--,J.usedTimes===0&&D(T),Object.keys(Y).length===0&&p.delete(F)}n.remove(T)}function D(T){const x=n.get(T);i.deleteTexture(x.__webglTexture);const F=T.source,Y=p.get(F);delete Y[x.__cacheKey],o.memory.textures--}function K(T){const x=n.get(T);if(T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(x.__webglFramebuffer[Y]))for(let J=0;J<x.__webglFramebuffer[Y].length;J++)i.deleteFramebuffer(x.__webglFramebuffer[Y][J]);else i.deleteFramebuffer(x.__webglFramebuffer[Y]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[Y])}else{if(Array.isArray(x.__webglFramebuffer))for(let Y=0;Y<x.__webglFramebuffer.length;Y++)i.deleteFramebuffer(x.__webglFramebuffer[Y]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let Y=0;Y<x.__webglColorRenderbuffer.length;Y++)x.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[Y]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const F=T.textures;for(let Y=0,J=F.length;Y<J;Y++){const q=n.get(F[Y]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),o.memory.textures--),n.remove(F[Y])}n.remove(T)}let _=0;function y(){_=0}function z(){const T=_;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),_+=1,T}function B(T){const x=[];return x.push(T.wrapS),x.push(T.wrapT),x.push(T.wrapR||0),x.push(T.magFilter),x.push(T.minFilter),x.push(T.anisotropy),x.push(T.internalFormat),x.push(T.format),x.push(T.type),x.push(T.generateMipmaps),x.push(T.premultiplyAlpha),x.push(T.flipY),x.push(T.unpackAlignment),x.push(T.colorSpace),x.join()}function G(T,x){const F=n.get(T);if(T.isVideoTexture&&Pt(T),T.isRenderTargetTexture===!1&&T.version>0&&F.__version!==T.version){const Y=T.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Jt(F,T,x);return}}e.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+x)}function j(T,x){const F=n.get(T);if(T.version>0&&F.__version!==T.version){Jt(F,T,x);return}e.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+x)}function H(T,x){const F=n.get(T);if(T.version>0&&F.__version!==T.version){Jt(F,T,x);return}e.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+x)}function et(T,x){const F=n.get(T);if(T.version>0&&F.__version!==T.version){X(F,T,x);return}e.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+x)}const W={[Vi]:i.REPEAT,[Kn]:i.CLAMP_TO_EDGE,[Rr]:i.MIRRORED_REPEAT},Q={[Ce]:i.NEAREST,[td]:i.NEAREST_MIPMAP_NEAREST,[ms]:i.NEAREST_MIPMAP_LINEAR,[en]:i.LINEAR,[Cr]:i.LINEAR_MIPMAP_NEAREST,[Fn]:i.LINEAR_MIPMAP_LINEAR},st={[sd]:i.NEVER,[hd]:i.ALWAYS,[rd]:i.LESS,[Ga]:i.LEQUAL,[od]:i.EQUAL,[ld]:i.GEQUAL,[ad]:i.GREATER,[cd]:i.NOTEQUAL};function lt(T,x){if(x.type===pn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===en||x.magFilter===Cr||x.magFilter===ms||x.magFilter===Fn||x.minFilter===en||x.minFilter===Cr||x.minFilter===ms||x.minFilter===Fn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,W[x.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,W[x.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,W[x.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,Q[x.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,Q[x.minFilter]),x.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,st[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Ce||x.minFilter!==ms&&x.minFilter!==Fn||x.type===pn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const F=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function kt(T,x){let F=!1;T.__webglInit===void 0&&(T.__webglInit=!0,x.addEventListener("dispose",N));const Y=x.source;let J=p.get(Y);J===void 0&&(J={},p.set(Y,J));const q=B(x);if(q!==T.__cacheKey){J[q]===void 0&&(J[q]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,F=!0),J[q].usedTimes++;const yt=J[T.__cacheKey];yt!==void 0&&(J[T.__cacheKey].usedTimes--,yt.usedTimes===0&&D(x)),T.__cacheKey=q,T.__webglTexture=J[q].texture}return F}function Jt(T,x,F){let Y=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(Y=i.TEXTURE_3D);const J=kt(T,x),q=x.source;e.bindTexture(Y,T.__webglTexture,i.TEXTURE0+F);const yt=n.get(q);if(q.version!==yt.__version||J===!0){e.activeTexture(i.TEXTURE0+F);const ot=Yt.getPrimaries(Yt.workingColorSpace),pt=x.colorSpace===wn?null:Yt.getPrimaries(x.colorSpace),qt=x.colorSpace===wn||ot===pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,qt);let nt=v(x.image,!1,s.maxTextureSize);nt=ae(x,nt);const mt=r.convert(x.format,x.colorSpace),Lt=r.convert(x.type);let Ut=b(x.internalFormat,mt,Lt,x.colorSpace,x.isVideoTexture);lt(Y,x);let gt;const zt=x.mipmaps,Nt=x.isVideoTexture!==!0,re=yt.__version===void 0||J===!0,P=q.dataReady,ut=E(x,nt);if(x.isDepthTexture)Ut=S(x.format===mi,x.type),re&&(Nt?e.texStorage2D(i.TEXTURE_2D,1,Ut,nt.width,nt.height):e.texImage2D(i.TEXTURE_2D,0,Ut,nt.width,nt.height,0,mt,Lt,null));else if(x.isDataTexture)if(zt.length>0){Nt&&re&&e.texStorage2D(i.TEXTURE_2D,ut,Ut,zt[0].width,zt[0].height);for(let V=0,$=zt.length;V<$;V++)gt=zt[V],Nt?P&&e.texSubImage2D(i.TEXTURE_2D,V,0,0,gt.width,gt.height,mt,Lt,gt.data):e.texImage2D(i.TEXTURE_2D,V,Ut,gt.width,gt.height,0,mt,Lt,gt.data);x.generateMipmaps=!1}else Nt?(re&&e.texStorage2D(i.TEXTURE_2D,ut,Ut,nt.width,nt.height),P&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,nt.width,nt.height,mt,Lt,nt.data)):e.texImage2D(i.TEXTURE_2D,0,Ut,nt.width,nt.height,0,mt,Lt,nt.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Nt&&re&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ut,Ut,zt[0].width,zt[0].height,nt.depth);for(let V=0,$=zt.length;V<$;V++)if(gt=zt[V],x.format!==Ke)if(mt!==null)if(Nt){if(P)if(x.layerUpdates.size>0){const at=$c(gt.width,gt.height,x.format,x.type);for(const dt of x.layerUpdates){const Vt=gt.data.subarray(dt*at/gt.data.BYTES_PER_ELEMENT,(dt+1)*at/gt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,dt,gt.width,gt.height,1,mt,Vt,0,0)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,0,gt.width,gt.height,nt.depth,mt,gt.data,0,0)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,V,Ut,gt.width,gt.height,nt.depth,0,gt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Nt?P&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,V,0,0,0,gt.width,gt.height,nt.depth,mt,Lt,gt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,V,Ut,gt.width,gt.height,nt.depth,0,mt,Lt,gt.data)}else{Nt&&re&&e.texStorage2D(i.TEXTURE_2D,ut,Ut,zt[0].width,zt[0].height);for(let V=0,$=zt.length;V<$;V++)gt=zt[V],x.format!==Ke?mt!==null?Nt?P&&e.compressedTexSubImage2D(i.TEXTURE_2D,V,0,0,gt.width,gt.height,mt,gt.data):e.compressedTexImage2D(i.TEXTURE_2D,V,Ut,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Nt?P&&e.texSubImage2D(i.TEXTURE_2D,V,0,0,gt.width,gt.height,mt,Lt,gt.data):e.texImage2D(i.TEXTURE_2D,V,Ut,gt.width,gt.height,0,mt,Lt,gt.data)}else if(x.isDataArrayTexture)if(Nt){if(re&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ut,Ut,nt.width,nt.height,nt.depth),P)if(x.layerUpdates.size>0){const V=$c(nt.width,nt.height,x.format,x.type);for(const $ of x.layerUpdates){const at=nt.data.subarray($*V/nt.data.BYTES_PER_ELEMENT,($+1)*V/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,$,nt.width,nt.height,1,mt,Lt,at)}x.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,mt,Lt,nt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ut,nt.width,nt.height,nt.depth,0,mt,Lt,nt.data);else if(x.isData3DTexture)Nt?(re&&e.texStorage3D(i.TEXTURE_3D,ut,Ut,nt.width,nt.height,nt.depth),P&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,mt,Lt,nt.data)):e.texImage3D(i.TEXTURE_3D,0,Ut,nt.width,nt.height,nt.depth,0,mt,Lt,nt.data);else if(x.isFramebufferTexture){if(re)if(Nt)e.texStorage2D(i.TEXTURE_2D,ut,Ut,nt.width,nt.height);else{let V=nt.width,$=nt.height;for(let at=0;at<ut;at++)e.texImage2D(i.TEXTURE_2D,at,Ut,V,$,0,mt,Lt,null),V>>=1,$>>=1}}else if(zt.length>0){if(Nt&&re){const V=It(zt[0]);e.texStorage2D(i.TEXTURE_2D,ut,Ut,V.width,V.height)}for(let V=0,$=zt.length;V<$;V++)gt=zt[V],Nt?P&&e.texSubImage2D(i.TEXTURE_2D,V,0,0,mt,Lt,gt):e.texImage2D(i.TEXTURE_2D,V,Ut,mt,Lt,gt);x.generateMipmaps=!1}else if(Nt){if(re){const V=It(nt);e.texStorage2D(i.TEXTURE_2D,ut,Ut,V.width,V.height)}P&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,mt,Lt,nt)}else e.texImage2D(i.TEXTURE_2D,0,Ut,mt,Lt,nt);h(x)&&f(Y),yt.__version=q.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function X(T,x,F){if(x.image.length!==6)return;const Y=kt(T,x),J=x.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+F);const q=n.get(J);if(J.version!==q.__version||Y===!0){e.activeTexture(i.TEXTURE0+F);const yt=Yt.getPrimaries(Yt.workingColorSpace),ot=x.colorSpace===wn?null:Yt.getPrimaries(x.colorSpace),pt=x.colorSpace===wn||yt===ot?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt);const qt=x.isCompressedTexture||x.image[0].isCompressedTexture,nt=x.image[0]&&x.image[0].isDataTexture,mt=[];for(let $=0;$<6;$++)!qt&&!nt?mt[$]=v(x.image[$],!0,s.maxCubemapSize):mt[$]=nt?x.image[$].image:x.image[$],mt[$]=ae(x,mt[$]);const Lt=mt[0],Ut=r.convert(x.format,x.colorSpace),gt=r.convert(x.type),zt=b(x.internalFormat,Ut,gt,x.colorSpace),Nt=x.isVideoTexture!==!0,re=q.__version===void 0||Y===!0,P=J.dataReady;let ut=E(x,Lt);lt(i.TEXTURE_CUBE_MAP,x);let V;if(qt){Nt&&re&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ut,zt,Lt.width,Lt.height);for(let $=0;$<6;$++){V=mt[$].mipmaps;for(let at=0;at<V.length;at++){const dt=V[at];x.format!==Ke?Ut!==null?Nt?P&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,at,0,0,dt.width,dt.height,Ut,dt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,at,zt,dt.width,dt.height,0,dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Nt?P&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,at,0,0,dt.width,dt.height,Ut,gt,dt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,at,zt,dt.width,dt.height,0,Ut,gt,dt.data)}}}else{if(V=x.mipmaps,Nt&&re){V.length>0&&ut++;const $=It(mt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ut,zt,$.width,$.height)}for(let $=0;$<6;$++)if(nt){Nt?P&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,mt[$].width,mt[$].height,Ut,gt,mt[$].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,zt,mt[$].width,mt[$].height,0,Ut,gt,mt[$].data);for(let at=0;at<V.length;at++){const Vt=V[at].image[$].image;Nt?P&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,at+1,0,0,Vt.width,Vt.height,Ut,gt,Vt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,at+1,zt,Vt.width,Vt.height,0,Ut,gt,Vt.data)}}else{Nt?P&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Ut,gt,mt[$]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,zt,Ut,gt,mt[$]);for(let at=0;at<V.length;at++){const dt=V[at];Nt?P&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,at+1,0,0,Ut,gt,dt.image[$]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,at+1,zt,Ut,gt,dt.image[$])}}}h(x)&&f(i.TEXTURE_CUBE_MAP),q.__version=J.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function tt(T,x,F,Y,J,q){const yt=r.convert(F.format,F.colorSpace),ot=r.convert(F.type),pt=b(F.internalFormat,yt,ot,F.colorSpace);if(!n.get(x).__hasExternalTextures){const nt=Math.max(1,x.width>>q),mt=Math.max(1,x.height>>q);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?e.texImage3D(J,q,pt,nt,mt,x.depth,0,yt,ot,null):e.texImage2D(J,q,pt,nt,mt,0,yt,ot,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),Xt(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,J,n.get(F).__webglTexture,0,Bt(x)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,J,n.get(F).__webglTexture,q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function vt(T,x,F){if(i.bindRenderbuffer(i.RENDERBUFFER,T),x.depthBuffer){const Y=x.depthTexture,J=Y&&Y.isDepthTexture?Y.type:null,q=S(x.stencilBuffer,J),yt=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ot=Bt(x);Xt(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ot,q,x.width,x.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,ot,q,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,q,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,yt,i.RENDERBUFFER,T)}else{const Y=x.textures;for(let J=0;J<Y.length;J++){const q=Y[J],yt=r.convert(q.format,q.colorSpace),ot=r.convert(q.type),pt=b(q.internalFormat,yt,ot,q.colorSpace),qt=Bt(x);F&&Xt(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,qt,pt,x.width,x.height):Xt(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,qt,pt,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,pt,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ft(T,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(x.depthTexture).__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),G(x.depthTexture,0);const Y=n.get(x.depthTexture).__webglTexture,J=Bt(x);if(x.depthTexture.format===pi)Xt(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Y,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Y,0);else if(x.depthTexture.format===mi)Xt(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Y,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Y,0);else throw new Error("Unknown depthTexture format")}function Dt(T){const x=n.get(T),F=T.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==T.depthTexture){const Y=T.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),Y){const J=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,Y.removeEventListener("dispose",J)};Y.addEventListener("dispose",J),x.__depthDisposeCallback=J}x.__boundDepthTexture=Y}if(T.depthTexture&&!x.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");ft(x.__webglFramebuffer,T)}else if(F){x.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[Y]),x.__webglDepthbuffer[Y]===void 0)x.__webglDepthbuffer[Y]=i.createRenderbuffer(),vt(x.__webglDepthbuffer[Y],T,!1);else{const J=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=x.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,q)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),vt(x.__webglDepthbuffer,T,!1);else{const Y=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,Y,i.RENDERBUFFER,J)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function At(T,x,F){const Y=n.get(T);x!==void 0&&tt(Y.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&Dt(T)}function Ht(T){const x=T.texture,F=n.get(T),Y=n.get(x);T.addEventListener("dispose",A);const J=T.textures,q=T.isWebGLCubeRenderTarget===!0,yt=J.length>1;if(yt||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=x.version,o.memory.textures++),q){F.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer[ot]=[];for(let pt=0;pt<x.mipmaps.length;pt++)F.__webglFramebuffer[ot][pt]=i.createFramebuffer()}else F.__webglFramebuffer[ot]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer=[];for(let ot=0;ot<x.mipmaps.length;ot++)F.__webglFramebuffer[ot]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(yt)for(let ot=0,pt=J.length;ot<pt;ot++){const qt=n.get(J[ot]);qt.__webglTexture===void 0&&(qt.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&Xt(T)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let ot=0;ot<J.length;ot++){const pt=J[ot];F.__webglColorRenderbuffer[ot]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[ot]);const qt=r.convert(pt.format,pt.colorSpace),nt=r.convert(pt.type),mt=b(pt.internalFormat,qt,nt,pt.colorSpace,T.isXRRenderTarget===!0),Lt=Bt(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Lt,mt,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.RENDERBUFFER,F.__webglColorRenderbuffer[ot])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),vt(F.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){e.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),lt(i.TEXTURE_CUBE_MAP,x);for(let ot=0;ot<6;ot++)if(x.mipmaps&&x.mipmaps.length>0)for(let pt=0;pt<x.mipmaps.length;pt++)tt(F.__webglFramebuffer[ot][pt],T,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,pt);else tt(F.__webglFramebuffer[ot],T,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);h(x)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(yt){for(let ot=0,pt=J.length;ot<pt;ot++){const qt=J[ot],nt=n.get(qt);e.bindTexture(i.TEXTURE_2D,nt.__webglTexture),lt(i.TEXTURE_2D,qt),tt(F.__webglFramebuffer,T,qt,i.COLOR_ATTACHMENT0+ot,i.TEXTURE_2D,0),h(qt)&&f(i.TEXTURE_2D)}e.unbindTexture()}else{let ot=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ot=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ot,Y.__webglTexture),lt(ot,x),x.mipmaps&&x.mipmaps.length>0)for(let pt=0;pt<x.mipmaps.length;pt++)tt(F.__webglFramebuffer[pt],T,x,i.COLOR_ATTACHMENT0,ot,pt);else tt(F.__webglFramebuffer,T,x,i.COLOR_ATTACHMENT0,ot,0);h(x)&&f(ot),e.unbindTexture()}T.depthBuffer&&Dt(T)}function ne(T){const x=T.textures;for(let F=0,Y=x.length;F<Y;F++){const J=x[F];if(h(J)){const q=T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,yt=n.get(J).__webglTexture;e.bindTexture(q,yt),f(q),e.unbindTexture()}}}const Gt=[],C=[];function qe(T){if(T.samples>0){if(Xt(T)===!1){const x=T.textures,F=T.width,Y=T.height;let J=i.COLOR_BUFFER_BIT;const q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,yt=n.get(T),ot=x.length>1;if(ot)for(let pt=0;pt<x.length;pt++)e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,yt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let pt=0;pt<x.length;pt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),ot){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,yt.__webglColorRenderbuffer[pt]);const qt=n.get(x[pt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,qt,0)}i.blitFramebuffer(0,0,F,Y,0,0,F,Y,J,i.NEAREST),c===!0&&(Gt.length=0,C.length=0,Gt.push(i.COLOR_ATTACHMENT0+pt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Gt.push(q),C.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,C)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Gt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ot)for(let pt=0;pt<x.length;pt++){e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.RENDERBUFFER,yt.__webglColorRenderbuffer[pt]);const qt=n.get(x[pt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pt,i.TEXTURE_2D,qt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){const x=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function Bt(T){return Math.min(s.maxSamples,T.samples)}function Xt(T){const x=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Pt(T){const x=o.render.frame;u.get(T)!==x&&(u.set(T,x),T.update())}function ae(T,x){const F=T.colorSpace,Y=T.format,J=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||F!==On&&F!==wn&&(Yt.getTransfer(F)===se?(Y!==Ke||J!==En)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),x}function It(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=y,this.setTexture2D=G,this.setTexture2DArray=j,this.setTexture3D=H,this.setTextureCube=et,this.rebindTextures=At,this.setupRenderTarget=Ht,this.updateRenderTargetMipmap=ne,this.updateMultisampleRenderTarget=qe,this.setupDepthRenderbuffer=Dt,this.setupFrameBufferTexture=tt,this.useMultisampledRTT=Xt}function Fm(i,t){function e(n,s=wn){let r;const o=Yt.getTransfer(s);if(n===En)return i.UNSIGNED_BYTE;if(n===Lr)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ur)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ia)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===La)return i.BYTE;if(n===Ua)return i.SHORT;if(n===Wi)return i.UNSIGNED_SHORT;if(n===Pr)return i.INT;if(n===jn)return i.UNSIGNED_INT;if(n===pn)return i.FLOAT;if(n===Tn)return i.HALF_FLOAT;if(n===Da)return i.ALPHA;if(n===Na)return i.RGB;if(n===Ke)return i.RGBA;if(n===Fa)return i.LUMINANCE;if(n===Oa)return i.LUMINANCE_ALPHA;if(n===pi)return i.DEPTH_COMPONENT;if(n===mi)return i.DEPTH_STENCIL;if(n===Ir)return i.RED;if(n===Dr)return i.RED_INTEGER;if(n===ka)return i.RG;if(n===Nr)return i.RG_INTEGER;if(n===Fr)return i.RGBA_INTEGER;if(n===gs||n===_s||n===vs||n===xs)if(o===se)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===gs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===_s)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===vs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===xs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===gs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===_s)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===vs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===xs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Or||n===kr||n===Br||n===zr)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Or)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===kr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Br)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===zr)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Hr||n===Gr||n===Vr)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Hr||n===Gr)return o===se?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Vr)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Wr||n===Xr||n===qr||n===Yr||n===$r||n===Kr||n===jr||n===Zr||n===Jr||n===Qr||n===to||n===eo||n===no||n===io)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Wr)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Xr)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===qr)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Yr)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===$r)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Kr)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===jr)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Zr)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Jr)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Qr)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===to)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===eo)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===no)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===io)return o===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ms||n===so||n===ro)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Ms)return o===se?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===so)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ro)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ba||n===oo||n===ao||n===co)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ms)return r.COMPRESSED_RED_RGTC1_EXT;if(n===oo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ao)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===co)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===fi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class Om extends ke{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class gn extends de{constructor(){super(),this.isGroup=!0,this.type="Group"}}const km={type:"move"};class Wo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new gn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new gn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new gn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const h=e.getJointPose(v,n),f=this._getHandJoint(l,v);h!==null&&(f.matrix.fromArray(h.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=h.radius),f.visible=h!==null}const u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],p=u.position.distanceTo(d.position),m=.02,g=.005;l.inputState.pinching&&p>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&p<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(km)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new gn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Bm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zm=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Hm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Pe,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Ae({vertexShader:Bm,fragmentShader:zm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new oe(new si(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Gm extends _i{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,d=null,p=null,m=null,g=null;const v=new Hm,h=e.getContextAttributes();let f=null,b=null;const S=[],E=[],N=new Ct;let A=null;const w=new ke;w.layers.enable(1),w.viewport=new te;const D=new ke;D.layers.enable(2),D.viewport=new te;const K=[w,D],_=new Om;_.layers.enable(1),_.layers.enable(2);let y=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let tt=S[X];return tt===void 0&&(tt=new Wo,S[X]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(X){let tt=S[X];return tt===void 0&&(tt=new Wo,S[X]=tt),tt.getGripSpace()},this.getHand=function(X){let tt=S[X];return tt===void 0&&(tt=new Wo,S[X]=tt),tt.getHandSpace()};function B(X){const tt=E.indexOf(X.inputSource);if(tt===-1)return;const vt=S[tt];vt!==void 0&&(vt.update(X.inputSource,X.frame,l||o),vt.dispatchEvent({type:X.type,data:X.inputSource}))}function G(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",j);for(let X=0;X<S.length;X++){const tt=E[X];tt!==null&&(E[X]=null,S[X].disconnect(tt))}y=null,z=null,v.reset(),t.setRenderTarget(f),m=null,p=null,d=null,s=null,b=null,Jt.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(N.width,N.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(X){l=X},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(f=t.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",G),s.addEventListener("inputsourceschange",j),h.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(N),s.renderState.layers===void 0){const tt={antialias:h.antialias,alpha:!0,depth:h.depth,stencil:h.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,e,tt),s.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),b=new nn(m.framebufferWidth,m.framebufferHeight,{format:Ke,type:En,colorSpace:t.outputColorSpace,stencilBuffer:h.stencil})}else{let tt=null,vt=null,ft=null;h.depth&&(ft=h.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=h.stencil?mi:pi,vt=h.stencil?fi:jn);const Dt={colorFormat:e.RGBA8,depthFormat:ft,scaleFactor:r};d=new XRWebGLBinding(s,e),p=d.createProjectionLayer(Dt),s.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),b=new nn(p.textureWidth,p.textureHeight,{format:Ke,type:En,depthTexture:new Ac(p.textureWidth,p.textureHeight,vt,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:h.stencil,colorSpace:t.outputColorSpace,samples:h.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Jt.setContext(s),Jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function j(X){for(let tt=0;tt<X.removed.length;tt++){const vt=X.removed[tt],ft=E.indexOf(vt);ft>=0&&(E[ft]=null,S[ft].disconnect(vt))}for(let tt=0;tt<X.added.length;tt++){const vt=X.added[tt];let ft=E.indexOf(vt);if(ft===-1){for(let At=0;At<S.length;At++)if(At>=E.length){E.push(vt),ft=At;break}else if(E[At]===null){E[At]=vt,ft=At;break}if(ft===-1)break}const Dt=S[ft];Dt&&Dt.connect(vt)}}const H=new R,et=new R;function W(X,tt,vt){H.setFromMatrixPosition(tt.matrixWorld),et.setFromMatrixPosition(vt.matrixWorld);const ft=H.distanceTo(et),Dt=tt.projectionMatrix.elements,At=vt.projectionMatrix.elements,Ht=Dt[14]/(Dt[10]-1),ne=Dt[14]/(Dt[10]+1),Gt=(Dt[9]+1)/Dt[5],C=(Dt[9]-1)/Dt[5],qe=(Dt[8]-1)/Dt[0],Bt=(At[8]+1)/At[0],Xt=Ht*qe,Pt=Ht*Bt,ae=ft/(-qe+Bt),It=ae*-qe;if(tt.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(It),X.translateZ(ae),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Dt[10]===-1)X.projectionMatrix.copy(tt.projectionMatrix),X.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const T=Ht+ae,x=ne+ae,F=Xt-It,Y=Pt+(ft-It),J=Gt*ne/x*T,q=C*ne/x*T;X.projectionMatrix.makePerspective(F,Y,J,q,T,x),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function Q(X,tt){tt===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(tt.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let tt=X.near,vt=X.far;v.texture!==null&&(v.depthNear>0&&(tt=v.depthNear),v.depthFar>0&&(vt=v.depthFar)),_.near=D.near=w.near=tt,_.far=D.far=w.far=vt,(y!==_.near||z!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),y=_.near,z=_.far);const ft=X.parent,Dt=_.cameras;Q(_,ft);for(let At=0;At<Dt.length;At++)Q(Dt[At],ft);Dt.length===2?W(_,w,D):_.projectionMatrix.copy(w.projectionMatrix),st(X,_,ft)};function st(X,tt,vt){vt===null?X.matrix.copy(tt.matrixWorld):(X.matrix.copy(vt.matrixWorld),X.matrix.invert(),X.matrix.multiply(tt.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(tt.projectionMatrix),X.projectionMatrixInverse.copy(tt.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=ws*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(p===null&&m===null))return c},this.setFoveation=function(X){c=X,p!==null&&(p.fixedFoveation=X),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=X)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(_)};let lt=null;function kt(X,tt){if(u=tt.getViewerPose(l||o),g=tt,u!==null){const vt=u.views;m!==null&&(t.setRenderTargetFramebuffer(b,m.framebuffer),t.setRenderTarget(b));let ft=!1;vt.length!==_.cameras.length&&(_.cameras.length=0,ft=!0);for(let At=0;At<vt.length;At++){const Ht=vt[At];let ne=null;if(m!==null)ne=m.getViewport(Ht);else{const C=d.getViewSubImage(p,Ht);ne=C.viewport,At===0&&(t.setRenderTargetTextures(b,C.colorTexture,p.ignoreDepthValues?void 0:C.depthStencilTexture),t.setRenderTarget(b))}let Gt=K[At];Gt===void 0&&(Gt=new ke,Gt.layers.enable(At),Gt.viewport=new te,K[At]=Gt),Gt.matrix.fromArray(Ht.transform.matrix),Gt.matrix.decompose(Gt.position,Gt.quaternion,Gt.scale),Gt.projectionMatrix.fromArray(Ht.projectionMatrix),Gt.projectionMatrixInverse.copy(Gt.projectionMatrix).invert(),Gt.viewport.set(ne.x,ne.y,ne.width,ne.height),At===0&&(_.matrix.copy(Gt.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),ft===!0&&_.cameras.push(Gt)}const Dt=s.enabledFeatures;if(Dt&&Dt.includes("depth-sensing")){const At=d.getDepthInformation(vt[0]);At&&At.isValid&&At.texture&&v.init(t,At,s.renderState)}}for(let vt=0;vt<S.length;vt++){const ft=E[vt],Dt=S[vt];ft!==null&&Dt!==void 0&&Dt.update(ft,tt,l||o)}lt&&lt(X,tt),tt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:tt}),g=null}const Jt=new xc;Jt.setAnimationLoop(kt),this.setAnimationLoop=function(X){lt=X},this.dispose=function(){}}}const ci=new on,Vm=new ee;function Wm(i,t){function e(h,f){h.matrixAutoUpdate===!0&&h.updateMatrix(),f.value.copy(h.matrix)}function n(h,f){f.color.getRGB(h.fogColor.value,pc(i)),f.isFog?(h.fogNear.value=f.near,h.fogFar.value=f.far):f.isFogExp2&&(h.fogDensity.value=f.density)}function s(h,f,b,S,E){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(h,f):f.isMeshToonMaterial?(r(h,f),d(h,f)):f.isMeshPhongMaterial?(r(h,f),u(h,f)):f.isMeshStandardMaterial?(r(h,f),p(h,f),f.isMeshPhysicalMaterial&&m(h,f,E)):f.isMeshMatcapMaterial?(r(h,f),g(h,f)):f.isMeshDepthMaterial?r(h,f):f.isMeshDistanceMaterial?(r(h,f),v(h,f)):f.isMeshNormalMaterial?r(h,f):f.isLineBasicMaterial?(o(h,f),f.isLineDashedMaterial&&a(h,f)):f.isPointsMaterial?c(h,f,b,S):f.isSpriteMaterial?l(h,f):f.isShadowMaterial?(h.color.value.copy(f.color),h.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(h,f){h.opacity.value=f.opacity,f.color&&h.diffuse.value.copy(f.color),f.emissive&&h.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(h.map.value=f.map,e(f.map,h.mapTransform)),f.alphaMap&&(h.alphaMap.value=f.alphaMap,e(f.alphaMap,h.alphaMapTransform)),f.bumpMap&&(h.bumpMap.value=f.bumpMap,e(f.bumpMap,h.bumpMapTransform),h.bumpScale.value=f.bumpScale,f.side===ye&&(h.bumpScale.value*=-1)),f.normalMap&&(h.normalMap.value=f.normalMap,e(f.normalMap,h.normalMapTransform),h.normalScale.value.copy(f.normalScale),f.side===ye&&h.normalScale.value.negate()),f.displacementMap&&(h.displacementMap.value=f.displacementMap,e(f.displacementMap,h.displacementMapTransform),h.displacementScale.value=f.displacementScale,h.displacementBias.value=f.displacementBias),f.emissiveMap&&(h.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,h.emissiveMapTransform)),f.specularMap&&(h.specularMap.value=f.specularMap,e(f.specularMap,h.specularMapTransform)),f.alphaTest>0&&(h.alphaTest.value=f.alphaTest);const b=t.get(f),S=b.envMap,E=b.envMapRotation;S&&(h.envMap.value=S,ci.copy(E),ci.x*=-1,ci.y*=-1,ci.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(ci.y*=-1,ci.z*=-1),h.envMapRotation.value.setFromMatrix4(Vm.makeRotationFromEuler(ci)),h.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,h.reflectivity.value=f.reflectivity,h.ior.value=f.ior,h.refractionRatio.value=f.refractionRatio),f.lightMap&&(h.lightMap.value=f.lightMap,h.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,h.lightMapTransform)),f.aoMap&&(h.aoMap.value=f.aoMap,h.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,h.aoMapTransform))}function o(h,f){h.diffuse.value.copy(f.color),h.opacity.value=f.opacity,f.map&&(h.map.value=f.map,e(f.map,h.mapTransform))}function a(h,f){h.dashSize.value=f.dashSize,h.totalSize.value=f.dashSize+f.gapSize,h.scale.value=f.scale}function c(h,f,b,S){h.diffuse.value.copy(f.color),h.opacity.value=f.opacity,h.size.value=f.size*b,h.scale.value=S*.5,f.map&&(h.map.value=f.map,e(f.map,h.uvTransform)),f.alphaMap&&(h.alphaMap.value=f.alphaMap,e(f.alphaMap,h.alphaMapTransform)),f.alphaTest>0&&(h.alphaTest.value=f.alphaTest)}function l(h,f){h.diffuse.value.copy(f.color),h.opacity.value=f.opacity,h.rotation.value=f.rotation,f.map&&(h.map.value=f.map,e(f.map,h.mapTransform)),f.alphaMap&&(h.alphaMap.value=f.alphaMap,e(f.alphaMap,h.alphaMapTransform)),f.alphaTest>0&&(h.alphaTest.value=f.alphaTest)}function u(h,f){h.specular.value.copy(f.specular),h.shininess.value=Math.max(f.shininess,1e-4)}function d(h,f){f.gradientMap&&(h.gradientMap.value=f.gradientMap)}function p(h,f){h.metalness.value=f.metalness,f.metalnessMap&&(h.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,h.metalnessMapTransform)),h.roughness.value=f.roughness,f.roughnessMap&&(h.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,h.roughnessMapTransform)),f.envMap&&(h.envMapIntensity.value=f.envMapIntensity)}function m(h,f,b){h.ior.value=f.ior,f.sheen>0&&(h.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),h.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(h.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,h.sheenColorMapTransform)),f.sheenRoughnessMap&&(h.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,h.sheenRoughnessMapTransform))),f.clearcoat>0&&(h.clearcoat.value=f.clearcoat,h.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(h.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,h.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(h.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,h.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(h.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,h.clearcoatNormalMapTransform),h.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===ye&&h.clearcoatNormalScale.value.negate())),f.dispersion>0&&(h.dispersion.value=f.dispersion),f.iridescence>0&&(h.iridescence.value=f.iridescence,h.iridescenceIOR.value=f.iridescenceIOR,h.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],h.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(h.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,h.iridescenceMapTransform)),f.iridescenceThicknessMap&&(h.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,h.iridescenceThicknessMapTransform))),f.transmission>0&&(h.transmission.value=f.transmission,h.transmissionSamplerMap.value=b.texture,h.transmissionSamplerSize.value.set(b.width,b.height),f.transmissionMap&&(h.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,h.transmissionMapTransform)),h.thickness.value=f.thickness,f.thicknessMap&&(h.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,h.thicknessMapTransform)),h.attenuationDistance.value=f.attenuationDistance,h.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(h.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(h.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,h.anisotropyMapTransform))),h.specularIntensity.value=f.specularIntensity,h.specularColor.value.copy(f.specularColor),f.specularColorMap&&(h.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,h.specularColorMapTransform)),f.specularIntensityMap&&(h.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,h.specularIntensityMapTransform))}function g(h,f){f.matcap&&(h.matcap.value=f.matcap)}function v(h,f){const b=t.get(f).light;h.referencePosition.value.setFromMatrixPosition(b.matrixWorld),h.nearDistance.value=b.shadow.camera.near,h.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Xm(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(b,S){const E=S.program;n.uniformBlockBinding(b,E)}function l(b,S){let E=s[b.id];E===void 0&&(g(b),E=u(b),s[b.id]=E,b.addEventListener("dispose",h));const N=S.program;n.updateUBOMapping(b,N);const A=t.render.frame;r[b.id]!==A&&(p(b),r[b.id]=A)}function u(b){const S=d();b.__bindingPointIndex=S;const E=i.createBuffer(),N=b.__size,A=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,N,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,E),E}function d(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(b){const S=s[b.id],E=b.uniforms,N=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let A=0,w=E.length;A<w;A++){const D=Array.isArray(E[A])?E[A]:[E[A]];for(let K=0,_=D.length;K<_;K++){const y=D[K];if(m(y,A,K,N)===!0){const z=y.__offset,B=Array.isArray(y.value)?y.value:[y.value];let G=0;for(let j=0;j<B.length;j++){const H=B[j],et=v(H);typeof H=="number"||typeof H=="boolean"?(y.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,z+G,y.__data)):H.isMatrix3?(y.__data[0]=H.elements[0],y.__data[1]=H.elements[1],y.__data[2]=H.elements[2],y.__data[3]=0,y.__data[4]=H.elements[3],y.__data[5]=H.elements[4],y.__data[6]=H.elements[5],y.__data[7]=0,y.__data[8]=H.elements[6],y.__data[9]=H.elements[7],y.__data[10]=H.elements[8],y.__data[11]=0):(H.toArray(y.__data,G),G+=et.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,y.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(b,S,E,N){const A=b.value,w=S+"_"+E;if(N[w]===void 0)return typeof A=="number"||typeof A=="boolean"?N[w]=A:N[w]=A.clone(),!0;{const D=N[w];if(typeof A=="number"||typeof A=="boolean"){if(D!==A)return N[w]=A,!0}else if(D.equals(A)===!1)return D.copy(A),!0}return!1}function g(b){const S=b.uniforms;let E=0;const N=16;for(let w=0,D=S.length;w<D;w++){const K=Array.isArray(S[w])?S[w]:[S[w]];for(let _=0,y=K.length;_<y;_++){const z=K[_],B=Array.isArray(z.value)?z.value:[z.value];for(let G=0,j=B.length;G<j;G++){const H=B[G],et=v(H),W=E%N,Q=W%et.boundary,st=W+Q;E+=Q,st!==0&&N-st<et.storage&&(E+=N-st),z.__data=new Float32Array(et.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=E,E+=et.storage}}}const A=E%N;return A>0&&(E+=N-A),b.__size=E,b.__cache={},this}function v(b){const S={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(S.boundary=4,S.storage=4):b.isVector2?(S.boundary=8,S.storage=8):b.isVector3||b.isColor?(S.boundary=16,S.storage=12):b.isVector4?(S.boundary=16,S.storage=16):b.isMatrix3?(S.boundary=48,S.storage=48):b.isMatrix4?(S.boundary=64,S.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),S}function h(b){const S=b.target;S.removeEventListener("dispose",h);const E=o.indexOf(S.__bindingPointIndex);o.splice(E,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function f(){for(const b in s)i.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:c,update:l,dispose:f}}class qm{constructor(t={}){const{canvas:e=fd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const m=new Uint32Array(4),g=new Int32Array(4);let v=null,h=null;const f=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=je,this.toneMapping=Nn,this.toneMappingExposure=1;const S=this;let E=!1,N=0,A=0,w=null,D=-1,K=null;const _=new te,y=new te;let z=null;const B=new ht(0);let G=0,j=e.width,H=e.height,et=1,W=null,Q=null;const st=new te(0,0,j,H),lt=new te(0,0,j,H);let kt=!1;const Jt=new Do;let X=!1,tt=!1;const vt=new ee,ft=new ee,Dt=new R,At=new te,Ht={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ne=!1;function Gt(){return w===null?et:1}let C=n;function qe(M,L){return e.getContext(M,L)}try{const M={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${mr}`),e.addEventListener("webglcontextlost",$,!1),e.addEventListener("webglcontextrestored",at,!1),e.addEventListener("webglcontextcreationerror",dt,!1),C===null){const L="webgl2";if(C=qe(L,M),C===null)throw qe(L)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let Bt,Xt,Pt,ae,It,T,x,F,Y,J,q,yt,ot,pt,qt,nt,mt,Lt,Ut,gt,zt,Nt,re,P;function ut(){Bt=new Zp(C),Bt.init(),Nt=new Fm(C,Bt),Xt=new Xp(C,Bt,t,Nt),Pt=new Im(C),Xt.reverseDepthBuffer&&Pt.buffers.depth.setReversed(!0),ae=new t0(C),It=new vm,T=new Nm(C,Bt,Pt,It,Xt,Nt,ae),x=new Yp(S),F=new jp(S),Y=new zd(C),re=new Vp(C,Y),J=new Jp(C,Y,ae,re),q=new n0(C,J,Y,ae),Ut=new e0(C,Xt,T),nt=new qp(It),yt=new _m(S,x,F,Bt,Xt,re,nt),ot=new Wm(S,It),pt=new Mm,qt=new wm(Bt),Lt=new Gp(S,x,F,Pt,q,p,c),mt=new Lm(S,q,Xt),P=new Xm(C,ae,Xt,Pt),gt=new Wp(C,Bt,ae),zt=new Qp(C,Bt,ae),ae.programs=yt.programs,S.capabilities=Xt,S.extensions=Bt,S.properties=It,S.renderLists=pt,S.shadowMap=mt,S.state=Pt,S.info=ae}ut();const V=new Gm(S,C);this.xr=V,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const M=Bt.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=Bt.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return et},this.setPixelRatio=function(M){M!==void 0&&(et=M,this.setSize(j,H,!1))},this.getSize=function(M){return M.set(j,H)},this.setSize=function(M,L,O=!0){if(V.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=M,H=L,e.width=Math.floor(M*et),e.height=Math.floor(L*et),O===!0&&(e.style.width=M+"px",e.style.height=L+"px"),this.setViewport(0,0,M,L)},this.getDrawingBufferSize=function(M){return M.set(j*et,H*et).floor()},this.setDrawingBufferSize=function(M,L,O){j=M,H=L,et=O,e.width=Math.floor(M*O),e.height=Math.floor(L*O),this.setViewport(0,0,M,L)},this.getCurrentViewport=function(M){return M.copy(_)},this.getViewport=function(M){return M.copy(st)},this.setViewport=function(M,L,O,k){M.isVector4?st.set(M.x,M.y,M.z,M.w):st.set(M,L,O,k),Pt.viewport(_.copy(st).multiplyScalar(et).round())},this.getScissor=function(M){return M.copy(lt)},this.setScissor=function(M,L,O,k){M.isVector4?lt.set(M.x,M.y,M.z,M.w):lt.set(M,L,O,k),Pt.scissor(y.copy(lt).multiplyScalar(et).round())},this.getScissorTest=function(){return kt},this.setScissorTest=function(M){Pt.setScissorTest(kt=M)},this.setOpaqueSort=function(M){W=M},this.setTransparentSort=function(M){Q=M},this.getClearColor=function(M){return M.copy(Lt.getClearColor())},this.setClearColor=function(){Lt.setClearColor.apply(Lt,arguments)},this.getClearAlpha=function(){return Lt.getClearAlpha()},this.setClearAlpha=function(){Lt.setClearAlpha.apply(Lt,arguments)},this.clear=function(M=!0,L=!0,O=!0){let k=0;if(M){let U=!1;if(w!==null){const it=w.texture.format;U=it===Fr||it===Nr||it===Dr}if(U){const it=w.texture.type,ct=it===En||it===jn||it===Wi||it===fi||it===Lr||it===Ur,_t=Lt.getClearColor(),xt=Lt.getClearAlpha(),wt=_t.r,Rt=_t.g,bt=_t.b;ct?(m[0]=wt,m[1]=Rt,m[2]=bt,m[3]=xt,C.clearBufferuiv(C.COLOR,0,m)):(g[0]=wt,g[1]=Rt,g[2]=bt,g[3]=xt,C.clearBufferiv(C.COLOR,0,g))}else k|=C.COLOR_BUFFER_BIT}L&&(k|=C.DEPTH_BUFFER_BIT,C.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),O&&(k|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",$,!1),e.removeEventListener("webglcontextrestored",at,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),pt.dispose(),qt.dispose(),It.dispose(),x.dispose(),F.dispose(),q.dispose(),re.dispose(),P.dispose(),yt.dispose(),V.dispose(),V.removeEventListener("sessionstart",Il),V.removeEventListener("sessionend",Dl),li.stop()};function $(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function at(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const M=ae.autoReset,L=mt.enabled,O=mt.autoUpdate,k=mt.needsUpdate,U=mt.type;ut(),ae.autoReset=M,mt.enabled=L,mt.autoUpdate=O,mt.needsUpdate=k,mt.type=U}function dt(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Vt(M){const L=M.target;L.removeEventListener("dispose",Vt),pe(L)}function pe(M){ze(M),It.remove(M)}function ze(M){const L=It.get(M).programs;L!==void 0&&(L.forEach(function(O){yt.releaseProgram(O)}),M.isShaderMaterial&&yt.releaseShaderCache(M))}this.renderBufferDirect=function(M,L,O,k,U,it){L===null&&(L=Ht);const ct=U.isMesh&&U.matrixWorld.determinant()<0,_t=l_(M,L,O,k,U);Pt.setMaterial(k,ct);let xt=O.index,wt=1;if(k.wireframe===!0){if(xt=J.getWireframeAttribute(O),xt===void 0)return;wt=2}const Rt=O.drawRange,bt=O.attributes.position;let Qt=Rt.start*wt,ce=(Rt.start+Rt.count)*wt;it!==null&&(Qt=Math.max(Qt,it.start*wt),ce=Math.min(ce,(it.start+it.count)*wt)),xt!==null?(Qt=Math.max(Qt,0),ce=Math.min(ce,xt.count)):bt!=null&&(Qt=Math.max(Qt,0),ce=Math.min(ce,bt.count));const he=ce-Qt;if(he<0||he===1/0)return;re.setup(U,k,_t,O,xt);let Ye,jt=gt;if(xt!==null&&(Ye=Y.get(xt),jt=zt,jt.setIndex(Ye)),U.isMesh)k.wireframe===!0?(Pt.setLineWidth(k.wireframeLinewidth*Gt()),jt.setMode(C.LINES)):jt.setMode(C.TRIANGLES);else if(U.isLine){let Et=k.linewidth;Et===void 0&&(Et=1),Pt.setLineWidth(Et*Gt()),U.isLineSegments?jt.setMode(C.LINES):U.isLineLoop?jt.setMode(C.LINE_LOOP):jt.setMode(C.LINE_STRIP)}else U.isPoints?jt.setMode(C.POINTS):U.isSprite&&jt.setMode(C.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)jt.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Bt.get("WEBGL_multi_draw"))jt.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Et=U._multiDrawStarts,Se=U._multiDrawCounts,Zt=U._multiDrawCount,fn=xt?Y.get(xt).bytesPerElement:1,Gi=It.get(k).currentProgram.getUniforms();for(let $e=0;$e<Zt;$e++)Gi.setValue(C,"_gl_DrawID",$e),jt.render(Et[$e]/fn,Se[$e])}else if(U.isInstancedMesh)jt.renderInstances(Qt,he,U.count);else if(O.isInstancedBufferGeometry){const Et=O._maxInstanceCount!==void 0?O._maxInstanceCount:1/0,Se=Math.min(O.instanceCount,Et);jt.renderInstances(Qt,he,Se)}else jt.render(Qt,he)};function Kt(M,L,O){M.transparent===!0&&M.side===Ie&&M.forceSinglePass===!1?(M.side=ye,M.needsUpdate=!0,pr(M,L,O),M.side=yn,M.needsUpdate=!0,pr(M,L,O),M.side=Ie):pr(M,L,O)}this.compile=function(M,L,O=null){O===null&&(O=M),h=qt.get(O),h.init(L),b.push(h),O.traverseVisible(function(U){U.isLight&&U.layers.test(L.layers)&&(h.pushLight(U),U.castShadow&&h.pushShadow(U))}),M!==O&&M.traverseVisible(function(U){U.isLight&&U.layers.test(L.layers)&&(h.pushLight(U),U.castShadow&&h.pushShadow(U))}),h.setupLights();const k=new Set;return M.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const it=U.material;if(it)if(Array.isArray(it))for(let ct=0;ct<it.length;ct++){const _t=it[ct];Kt(_t,O,U),k.add(_t)}else Kt(it,O,U),k.add(it)}),b.pop(),h=null,k},this.compileAsync=function(M,L,O=null){const k=this.compile(M,L,O);return new Promise(U=>{function it(){if(k.forEach(function(ct){It.get(ct).currentProgram.isReady()&&k.delete(ct)}),k.size===0){U(M);return}setTimeout(it,10)}Bt.get("KHR_parallel_shader_compile")!==null?it():setTimeout(it,10)})};let He=null;function Dn(M){He&&He(M)}function Il(){li.stop()}function Dl(){li.start()}const li=new xc;li.setAnimationLoop(Dn),typeof self<"u"&&li.setContext(self),this.setAnimationLoop=function(M){He=M,V.setAnimationLoop(M),M===null?li.stop():li.start()},V.addEventListener("sessionstart",Il),V.addEventListener("sessionend",Dl),this.render=function(M,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),V.enabled===!0&&V.isPresenting===!0&&(V.cameraAutoUpdate===!0&&V.updateCamera(L),L=V.getCamera()),M.isScene===!0&&M.onBeforeRender(S,M,L,w),h=qt.get(M,b.length),h.init(L),b.push(h),ft.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),Jt.setFromProjectionMatrix(ft),tt=this.localClippingEnabled,X=nt.init(this.clippingPlanes,tt),v=pt.get(M,f.length),v.init(),f.push(v),V.enabled===!0&&V.isPresenting===!0){const it=S.xr.getDepthSensingMesh();it!==null&&pa(it,L,-1/0,S.sortObjects)}pa(M,L,0,S.sortObjects),v.finish(),S.sortObjects===!0&&v.sort(W,Q),ne=V.enabled===!1||V.isPresenting===!1||V.hasDepthSensing()===!1,ne&&Lt.addToRenderList(v,M),this.info.render.frame++,X===!0&&nt.beginShadows();const O=h.state.shadowsArray;mt.render(O,M,L),X===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=v.opaque,U=v.transmissive;if(h.setupLights(),L.isArrayCamera){const it=L.cameras;if(U.length>0)for(let ct=0,_t=it.length;ct<_t;ct++){const xt=it[ct];Fl(k,U,M,xt)}ne&&Lt.render(M);for(let ct=0,_t=it.length;ct<_t;ct++){const xt=it[ct];Nl(v,M,xt,xt.viewport)}}else U.length>0&&Fl(k,U,M,L),ne&&Lt.render(M),Nl(v,M,L);w!==null&&(T.updateMultisampleRenderTarget(w),T.updateRenderTargetMipmap(w)),M.isScene===!0&&M.onAfterRender(S,M,L),re.resetDefaultState(),D=-1,K=null,b.pop(),b.length>0?(h=b[b.length-1],X===!0&&nt.setGlobalState(S.clippingPlanes,h.state.camera)):h=null,f.pop(),f.length>0?v=f[f.length-1]:v=null};function pa(M,L,O,k){if(M.visible===!1)return;if(M.layers.test(L.layers)){if(M.isGroup)O=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(L);else if(M.isLight)h.pushLight(M),M.castShadow&&h.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||Jt.intersectsSprite(M)){k&&At.setFromMatrixPosition(M.matrixWorld).applyMatrix4(ft);const ct=q.update(M),_t=M.material;_t.visible&&v.push(M,ct,_t,O,At.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||Jt.intersectsObject(M))){const ct=q.update(M),_t=M.material;if(k&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),At.copy(M.boundingSphere.center)):(ct.boundingSphere===null&&ct.computeBoundingSphere(),At.copy(ct.boundingSphere.center)),At.applyMatrix4(M.matrixWorld).applyMatrix4(ft)),Array.isArray(_t)){const xt=ct.groups;for(let wt=0,Rt=xt.length;wt<Rt;wt++){const bt=xt[wt],Qt=_t[bt.materialIndex];Qt&&Qt.visible&&v.push(M,ct,Qt,O,At.z,bt)}}else _t.visible&&v.push(M,ct,_t,O,At.z,null)}}const it=M.children;for(let ct=0,_t=it.length;ct<_t;ct++)pa(it[ct],L,O,k)}function Nl(M,L,O,k){const U=M.opaque,it=M.transmissive,ct=M.transparent;h.setupLightsView(O),X===!0&&nt.setGlobalState(S.clippingPlanes,O),k&&Pt.viewport(_.copy(k)),U.length>0&&fr(U,L,O),it.length>0&&fr(it,L,O),ct.length>0&&fr(ct,L,O),Pt.buffers.depth.setTest(!0),Pt.buffers.depth.setMask(!0),Pt.buffers.color.setMask(!0),Pt.setPolygonOffset(!1)}function Fl(M,L,O,k){if((O.isScene===!0?O.overrideMaterial:null)!==null)return;h.state.transmissionRenderTarget[k.id]===void 0&&(h.state.transmissionRenderTarget[k.id]=new nn(1,1,{generateMipmaps:!0,type:Bt.has("EXT_color_buffer_half_float")||Bt.has("EXT_color_buffer_float")?Tn:En,minFilter:Fn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Yt.workingColorSpace}));const it=h.state.transmissionRenderTarget[k.id],ct=k.viewport||_;it.setSize(ct.z,ct.w);const _t=S.getRenderTarget();S.setRenderTarget(it),S.getClearColor(B),G=S.getClearAlpha(),G<1&&S.setClearColor(16777215,.5),S.clear(),ne&&Lt.render(O);const xt=S.toneMapping;S.toneMapping=Nn;const wt=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),h.setupLightsView(k),X===!0&&nt.setGlobalState(S.clippingPlanes,k),fr(M,O,k),T.updateMultisampleRenderTarget(it),T.updateRenderTargetMipmap(it),Bt.has("WEBGL_multisampled_render_to_texture")===!1){let Rt=!1;for(let bt=0,Qt=L.length;bt<Qt;bt++){const ce=L[bt],he=ce.object,Ye=ce.geometry,jt=ce.material,Et=ce.group;if(jt.side===Ie&&he.layers.test(k.layers)){const Se=jt.side;jt.side=ye,jt.needsUpdate=!0,Ol(he,O,k,Ye,jt,Et),jt.side=Se,jt.needsUpdate=!0,Rt=!0}}Rt===!0&&(T.updateMultisampleRenderTarget(it),T.updateRenderTargetMipmap(it))}S.setRenderTarget(_t),S.setClearColor(B,G),wt!==void 0&&(k.viewport=wt),S.toneMapping=xt}function fr(M,L,O){const k=L.isScene===!0?L.overrideMaterial:null;for(let U=0,it=M.length;U<it;U++){const ct=M[U],_t=ct.object,xt=ct.geometry,wt=k===null?ct.material:k,Rt=ct.group;_t.layers.test(O.layers)&&Ol(_t,L,O,xt,wt,Rt)}}function Ol(M,L,O,k,U,it){M.onBeforeRender(S,L,O,k,U,it),M.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),U.onBeforeRender(S,L,O,k,M,it),U.transparent===!0&&U.side===Ie&&U.forceSinglePass===!1?(U.side=ye,U.needsUpdate=!0,S.renderBufferDirect(O,L,k,U,M,it),U.side=yn,U.needsUpdate=!0,S.renderBufferDirect(O,L,k,U,M,it),U.side=Ie):S.renderBufferDirect(O,L,k,U,M,it),M.onAfterRender(S,L,O,k,U,it)}function pr(M,L,O){L.isScene!==!0&&(L=Ht);const k=It.get(M),U=h.state.lights,it=h.state.shadowsArray,ct=U.state.version,_t=yt.getParameters(M,U.state,it,L,O),xt=yt.getProgramCacheKey(_t);let wt=k.programs;k.environment=M.isMeshStandardMaterial?L.environment:null,k.fog=L.fog,k.envMap=(M.isMeshStandardMaterial?F:x).get(M.envMap||k.environment),k.envMapRotation=k.environment!==null&&M.envMap===null?L.environmentRotation:M.envMapRotation,wt===void 0&&(M.addEventListener("dispose",Vt),wt=new Map,k.programs=wt);let Rt=wt.get(xt);if(Rt!==void 0){if(k.currentProgram===Rt&&k.lightsStateVersion===ct)return Bl(M,_t),Rt}else _t.uniforms=yt.getUniforms(M),M.onBeforeCompile(_t,S),Rt=yt.acquireProgram(_t,xt),wt.set(xt,Rt),k.uniforms=_t.uniforms;const bt=k.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(bt.clippingPlanes=nt.uniform),Bl(M,_t),k.needsLights=u_(M),k.lightsStateVersion=ct,k.needsLights&&(bt.ambientLightColor.value=U.state.ambient,bt.lightProbe.value=U.state.probe,bt.directionalLights.value=U.state.directional,bt.directionalLightShadows.value=U.state.directionalShadow,bt.spotLights.value=U.state.spot,bt.spotLightShadows.value=U.state.spotShadow,bt.rectAreaLights.value=U.state.rectArea,bt.ltc_1.value=U.state.rectAreaLTC1,bt.ltc_2.value=U.state.rectAreaLTC2,bt.pointLights.value=U.state.point,bt.pointLightShadows.value=U.state.pointShadow,bt.hemisphereLights.value=U.state.hemi,bt.directionalShadowMap.value=U.state.directionalShadowMap,bt.directionalShadowMatrix.value=U.state.directionalShadowMatrix,bt.spotShadowMap.value=U.state.spotShadowMap,bt.spotLightMatrix.value=U.state.spotLightMatrix,bt.spotLightMap.value=U.state.spotLightMap,bt.pointShadowMap.value=U.state.pointShadowMap,bt.pointShadowMatrix.value=U.state.pointShadowMatrix),k.currentProgram=Rt,k.uniformsList=null,Rt}function kl(M){if(M.uniformsList===null){const L=M.currentProgram.getUniforms();M.uniformsList=Ks.seqWithValue(L.seq,M.uniforms)}return M.uniformsList}function Bl(M,L){const O=It.get(M);O.outputColorSpace=L.outputColorSpace,O.batching=L.batching,O.batchingColor=L.batchingColor,O.instancing=L.instancing,O.instancingColor=L.instancingColor,O.instancingMorph=L.instancingMorph,O.skinning=L.skinning,O.morphTargets=L.morphTargets,O.morphNormals=L.morphNormals,O.morphColors=L.morphColors,O.morphTargetsCount=L.morphTargetsCount,O.numClippingPlanes=L.numClippingPlanes,O.numIntersection=L.numClipIntersection,O.vertexAlphas=L.vertexAlphas,O.vertexTangents=L.vertexTangents,O.toneMapping=L.toneMapping}function l_(M,L,O,k,U){L.isScene!==!0&&(L=Ht),T.resetTextureUnits();const it=L.fog,ct=k.isMeshStandardMaterial?L.environment:null,_t=w===null?S.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:On,xt=(k.isMeshStandardMaterial?F:x).get(k.envMap||ct),wt=k.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,Rt=!!O.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),bt=!!O.morphAttributes.position,Qt=!!O.morphAttributes.normal,ce=!!O.morphAttributes.color;let he=Nn;k.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(he=S.toneMapping);const Ye=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,jt=Ye!==void 0?Ye.length:0,Et=It.get(k),Se=h.state.lights;if(X===!0&&(tt===!0||M!==K)){const tn=M===K&&k.id===D;nt.setState(k,M,tn)}let Zt=!1;k.version===Et.__version?(Et.needsLights&&Et.lightsStateVersion!==Se.state.version||Et.outputColorSpace!==_t||U.isBatchedMesh&&Et.batching===!1||!U.isBatchedMesh&&Et.batching===!0||U.isBatchedMesh&&Et.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Et.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Et.instancing===!1||!U.isInstancedMesh&&Et.instancing===!0||U.isSkinnedMesh&&Et.skinning===!1||!U.isSkinnedMesh&&Et.skinning===!0||U.isInstancedMesh&&Et.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Et.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Et.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Et.instancingMorph===!1&&U.morphTexture!==null||Et.envMap!==xt||k.fog===!0&&Et.fog!==it||Et.numClippingPlanes!==void 0&&(Et.numClippingPlanes!==nt.numPlanes||Et.numIntersection!==nt.numIntersection)||Et.vertexAlphas!==wt||Et.vertexTangents!==Rt||Et.morphTargets!==bt||Et.morphNormals!==Qt||Et.morphColors!==ce||Et.toneMapping!==he||Et.morphTargetsCount!==jt)&&(Zt=!0):(Zt=!0,Et.__version=k.version);let fn=Et.currentProgram;Zt===!0&&(fn=pr(k,L,U));let Gi=!1,$e=!1,ma=!1;const ue=fn.getUniforms(),qn=Et.uniforms;if(Pt.useProgram(fn.program)&&(Gi=!0,$e=!0,ma=!0),k.id!==D&&(D=k.id,$e=!0),Gi||K!==M){Xt.reverseDepthBuffer?(vt.copy(M.projectionMatrix),md(vt),gd(vt),ue.setValue(C,"projectionMatrix",vt)):ue.setValue(C,"projectionMatrix",M.projectionMatrix),ue.setValue(C,"viewMatrix",M.matrixWorldInverse);const tn=ue.map.cameraPosition;tn!==void 0&&tn.setValue(C,Dt.setFromMatrixPosition(M.matrixWorld)),Xt.logarithmicDepthBuffer&&ue.setValue(C,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&ue.setValue(C,"isOrthographic",M.isOrthographicCamera===!0),K!==M&&(K=M,$e=!0,ma=!0)}if(U.isSkinnedMesh){ue.setOptional(C,U,"bindMatrix"),ue.setOptional(C,U,"bindMatrixInverse");const tn=U.skeleton;tn&&(tn.boneTexture===null&&tn.computeBoneTexture(),ue.setValue(C,"boneTexture",tn.boneTexture,T))}U.isBatchedMesh&&(ue.setOptional(C,U,"batchingTexture"),ue.setValue(C,"batchingTexture",U._matricesTexture,T),ue.setOptional(C,U,"batchingIdTexture"),ue.setValue(C,"batchingIdTexture",U._indirectTexture,T),ue.setOptional(C,U,"batchingColorTexture"),U._colorsTexture!==null&&ue.setValue(C,"batchingColorTexture",U._colorsTexture,T));const ga=O.morphAttributes;if((ga.position!==void 0||ga.normal!==void 0||ga.color!==void 0)&&Ut.update(U,O,fn),($e||Et.receiveShadow!==U.receiveShadow)&&(Et.receiveShadow=U.receiveShadow,ue.setValue(C,"receiveShadow",U.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(qn.envMap.value=xt,qn.flipEnvMap.value=xt.isCubeTexture&&xt.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&L.environment!==null&&(qn.envMapIntensity.value=L.environmentIntensity),$e&&(ue.setValue(C,"toneMappingExposure",S.toneMappingExposure),Et.needsLights&&h_(qn,ma),it&&k.fog===!0&&ot.refreshFogUniforms(qn,it),ot.refreshMaterialUniforms(qn,k,et,H,h.state.transmissionRenderTarget[M.id]),Ks.upload(C,kl(Et),qn,T)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Ks.upload(C,kl(Et),qn,T),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&ue.setValue(C,"center",U.center),ue.setValue(C,"modelViewMatrix",U.modelViewMatrix),ue.setValue(C,"normalMatrix",U.normalMatrix),ue.setValue(C,"modelMatrix",U.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const tn=k.uniformsGroups;for(let _a=0,d_=tn.length;_a<d_;_a++){const zl=tn[_a];P.update(zl,fn),P.bind(zl,fn)}}return fn}function h_(M,L){M.ambientLightColor.needsUpdate=L,M.lightProbe.needsUpdate=L,M.directionalLights.needsUpdate=L,M.directionalLightShadows.needsUpdate=L,M.pointLights.needsUpdate=L,M.pointLightShadows.needsUpdate=L,M.spotLights.needsUpdate=L,M.spotLightShadows.needsUpdate=L,M.rectAreaLights.needsUpdate=L,M.hemisphereLights.needsUpdate=L}function u_(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return N},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(M,L,O){It.get(M.texture).__webglTexture=L,It.get(M.depthTexture).__webglTexture=O;const k=It.get(M);k.__hasExternalTextures=!0,k.__autoAllocateDepthBuffer=O===void 0,k.__autoAllocateDepthBuffer||Bt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(M,L){const O=It.get(M);O.__webglFramebuffer=L,O.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(M,L=0,O=0){w=M,N=L,A=O;let k=!0,U=null,it=!1,ct=!1;if(M){const xt=It.get(M);if(xt.__useDefaultFramebuffer!==void 0)Pt.bindFramebuffer(C.FRAMEBUFFER,null),k=!1;else if(xt.__webglFramebuffer===void 0)T.setupRenderTarget(M);else if(xt.__hasExternalTextures)T.rebindTextures(M,It.get(M.texture).__webglTexture,It.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const bt=M.depthTexture;if(xt.__boundDepthTexture!==bt){if(bt!==null&&It.has(bt)&&(M.width!==bt.image.width||M.height!==bt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(M)}}const wt=M.texture;(wt.isData3DTexture||wt.isDataArrayTexture||wt.isCompressedArrayTexture)&&(ct=!0);const Rt=It.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Rt[L])?U=Rt[L][O]:U=Rt[L],it=!0):M.samples>0&&T.useMultisampledRTT(M)===!1?U=It.get(M).__webglMultisampledFramebuffer:Array.isArray(Rt)?U=Rt[O]:U=Rt,_.copy(M.viewport),y.copy(M.scissor),z=M.scissorTest}else _.copy(st).multiplyScalar(et).floor(),y.copy(lt).multiplyScalar(et).floor(),z=kt;if(Pt.bindFramebuffer(C.FRAMEBUFFER,U)&&k&&Pt.drawBuffers(M,U),Pt.viewport(_),Pt.scissor(y),Pt.setScissorTest(z),it){const xt=It.get(M.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+L,xt.__webglTexture,O)}else if(ct){const xt=It.get(M.texture),wt=L||0;C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,xt.__webglTexture,O||0,wt)}D=-1},this.readRenderTargetPixels=function(M,L,O,k,U,it,ct){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _t=It.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ct!==void 0&&(_t=_t[ct]),_t){Pt.bindFramebuffer(C.FRAMEBUFFER,_t);try{const xt=M.texture,wt=xt.format,Rt=xt.type;if(!Xt.textureFormatReadable(wt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Xt.textureTypeReadable(Rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=M.width-k&&O>=0&&O<=M.height-U&&C.readPixels(L,O,k,U,Nt.convert(wt),Nt.convert(Rt),it)}finally{const xt=w!==null?It.get(w).__webglFramebuffer:null;Pt.bindFramebuffer(C.FRAMEBUFFER,xt)}}},this.readRenderTargetPixelsAsync=async function(M,L,O,k,U,it,ct){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _t=It.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ct!==void 0&&(_t=_t[ct]),_t){const xt=M.texture,wt=xt.format,Rt=xt.type;if(!Xt.textureFormatReadable(wt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Xt.textureTypeReadable(Rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(L>=0&&L<=M.width-k&&O>=0&&O<=M.height-U){Pt.bindFramebuffer(C.FRAMEBUFFER,_t);const bt=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,bt),C.bufferData(C.PIXEL_PACK_BUFFER,it.byteLength,C.STREAM_READ),C.readPixels(L,O,k,U,Nt.convert(wt),Nt.convert(Rt),0);const Qt=w!==null?It.get(w).__webglFramebuffer:null;Pt.bindFramebuffer(C.FRAMEBUFFER,Qt);const ce=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await pd(C,ce,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,bt),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,it),C.deleteBuffer(bt),C.deleteSync(ce),it}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(M,L=null,O=0){M.isTexture!==!0&&(Rs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),L=arguments[0]||null,M=arguments[1]);const k=Math.pow(2,-O),U=Math.floor(M.image.width*k),it=Math.floor(M.image.height*k),ct=L!==null?L.x:0,_t=L!==null?L.y:0;T.setTexture2D(M,0),C.copyTexSubImage2D(C.TEXTURE_2D,O,0,0,ct,_t,U,it),Pt.unbindTexture()},this.copyTextureToTexture=function(M,L,O=null,k=null,U=0){M.isTexture!==!0&&(Rs("WebGLRenderer: copyTextureToTexture function signature has changed."),k=arguments[0]||null,M=arguments[1],L=arguments[2],U=arguments[3]||0,O=null);let it,ct,_t,xt,wt,Rt;O!==null?(it=O.max.x-O.min.x,ct=O.max.y-O.min.y,_t=O.min.x,xt=O.min.y):(it=M.image.width,ct=M.image.height,_t=0,xt=0),k!==null?(wt=k.x,Rt=k.y):(wt=0,Rt=0);const bt=Nt.convert(L.format),Qt=Nt.convert(L.type);T.setTexture2D(L,0),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,L.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,L.unpackAlignment);const ce=C.getParameter(C.UNPACK_ROW_LENGTH),he=C.getParameter(C.UNPACK_IMAGE_HEIGHT),Ye=C.getParameter(C.UNPACK_SKIP_PIXELS),jt=C.getParameter(C.UNPACK_SKIP_ROWS),Et=C.getParameter(C.UNPACK_SKIP_IMAGES),Se=M.isCompressedTexture?M.mipmaps[U]:M.image;C.pixelStorei(C.UNPACK_ROW_LENGTH,Se.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Se.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,_t),C.pixelStorei(C.UNPACK_SKIP_ROWS,xt),M.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,U,wt,Rt,it,ct,bt,Qt,Se.data):M.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,U,wt,Rt,Se.width,Se.height,bt,Se.data):C.texSubImage2D(C.TEXTURE_2D,U,wt,Rt,it,ct,bt,Qt,Se),C.pixelStorei(C.UNPACK_ROW_LENGTH,ce),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,he),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Ye),C.pixelStorei(C.UNPACK_SKIP_ROWS,jt),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Et),U===0&&L.generateMipmaps&&C.generateMipmap(C.TEXTURE_2D),Pt.unbindTexture()},this.copyTextureToTexture3D=function(M,L,O=null,k=null,U=0){M.isTexture!==!0&&(Rs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),O=arguments[0]||null,k=arguments[1]||null,M=arguments[2],L=arguments[3],U=arguments[4]||0);let it,ct,_t,xt,wt,Rt,bt,Qt,ce;const he=M.isCompressedTexture?M.mipmaps[U]:M.image;O!==null?(it=O.max.x-O.min.x,ct=O.max.y-O.min.y,_t=O.max.z-O.min.z,xt=O.min.x,wt=O.min.y,Rt=O.min.z):(it=he.width,ct=he.height,_t=he.depth,xt=0,wt=0,Rt=0),k!==null?(bt=k.x,Qt=k.y,ce=k.z):(bt=0,Qt=0,ce=0);const Ye=Nt.convert(L.format),jt=Nt.convert(L.type);let Et;if(L.isData3DTexture)T.setTexture3D(L,0),Et=C.TEXTURE_3D;else if(L.isDataArrayTexture||L.isCompressedArrayTexture)T.setTexture2DArray(L,0),Et=C.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,L.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,L.unpackAlignment);const Se=C.getParameter(C.UNPACK_ROW_LENGTH),Zt=C.getParameter(C.UNPACK_IMAGE_HEIGHT),fn=C.getParameter(C.UNPACK_SKIP_PIXELS),Gi=C.getParameter(C.UNPACK_SKIP_ROWS),$e=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,he.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,he.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,xt),C.pixelStorei(C.UNPACK_SKIP_ROWS,wt),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Rt),M.isDataTexture||M.isData3DTexture?C.texSubImage3D(Et,U,bt,Qt,ce,it,ct,_t,Ye,jt,he.data):L.isCompressedArrayTexture?C.compressedTexSubImage3D(Et,U,bt,Qt,ce,it,ct,_t,Ye,he.data):C.texSubImage3D(Et,U,bt,Qt,ce,it,ct,_t,Ye,jt,he),C.pixelStorei(C.UNPACK_ROW_LENGTH,Se),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Zt),C.pixelStorei(C.UNPACK_SKIP_PIXELS,fn),C.pixelStorei(C.UNPACK_SKIP_ROWS,Gi),C.pixelStorei(C.UNPACK_SKIP_IMAGES,$e),U===0&&L.generateMipmaps&&C.generateMipmap(Et),Pt.unbindTexture()},this.initRenderTarget=function(M){It.get(M).__webglFramebuffer===void 0&&T.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?T.setTextureCube(M,0):M.isData3DTexture?T.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?T.setTexture2DArray(M,0):T.setTexture2D(M,0),Pt.unbindTexture()},this.resetState=function(){N=0,A=0,w=null,Pt.reset(),re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return An}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===lo?"display-p3":"srgb",e.unpackColorSpace=Yt.workingColorSpace===Ss?"display-p3":"srgb"}}class Zs{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new ht(t),this.density=e}clone(){return new Zs(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Ym extends de{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new on,this.environmentIntensity=1,this.environmentRotation=new on,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Kc extends Pe{constructor(t=null,e=1,n=1,s,r,o,a,c,l=Ce,u=Ce,d,p){super(null,o,a,c,l,u,s,r,d,p),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class jc extends we{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ki=new ee,Zc=new ee,Js=[],Jc=new Zn,$m=new ee,ts=new oe,es=new Ei;class Km extends oe{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new jc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,$m)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Zn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ki),Jc.copy(t.boundingBox).applyMatrix4(ki),this.boundingBox.union(Jc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ei),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ki),es.copy(t.boundingSphere).applyMatrix4(ki),this.boundingSphere.union(es)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(ts.geometry=this.geometry,ts.material=this.material,ts.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),es.copy(this.boundingSphere),es.applyMatrix4(n),t.ray.intersectsSphere(es)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ki),Zc.multiplyMatrices(n,ki),ts.matrixWorld=Zc,ts.raycast(t,Js);for(let o=0,a=Js.length;o<a;o++){const c=Js[o];c.instanceId=r,c.object=this,e.push(c)}Js.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new jc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Kc(new Float32Array(s*this.count),s,this.count,Ir,pn));const r=this.morphTexture.source.data.data;let o=0;for(let l=0;l<n.length;l++)o+=n[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=s*t;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Qc extends Pi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ht(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const tl=new ee,Xo=new Ja,Qs=new Ei,tr=new R;class el extends de{constructor(t=new Oe,e=new Qc){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Qs.copy(n.boundingSphere),Qs.applyMatrix4(s),Qs.radius+=r,t.ray.intersectsSphere(Qs)===!1)return;tl.copy(s).invert(),Xo.copy(t.ray).applyMatrix4(tl);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,d=n.attributes.position;if(l!==null){const p=Math.max(0,o.start),m=Math.min(l.count,o.start+o.count);for(let g=p,v=m;g<v;g++){const h=l.getX(g);tr.fromBufferAttribute(d,h),nl(tr,h,c,s,t,e,this)}}else{const p=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let g=p,v=m;g<v;g++)tr.fromBufferAttribute(d,g),nl(tr,g,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function nl(i,t,e,n,s,r,o){const a=Xo.distanceSqToPoint(i);if(a<e){const c=new R;Xo.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class er extends Oe{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],c=[],l=new R,u=new Ct;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let d=0,p=3;d<=e;d++,p+=3){const m=n+d/e*s;l.x=t*Math.cos(m),l.y=t*Math.sin(m),o.push(l.x,l.y,l.z),a.push(0,0,1),u.x=(o[p]/t+1)/2,u.y=(o[p+1]/t+1)/2,c.push(u.x,u.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new ve(o,3)),this.setAttribute("normal",new ve(a,3)),this.setAttribute("uv",new ve(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new er(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class nr extends Oe{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const u=[],d=[],p=[],m=[];let g=0;const v=[],h=n/2;let f=0;b(),o===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(u),this.setAttribute("position",new ve(d,3)),this.setAttribute("normal",new ve(p,3)),this.setAttribute("uv",new ve(m,2));function b(){const E=new R,N=new R;let A=0;const w=(e-t)/n;for(let D=0;D<=r;D++){const K=[],_=D/r,y=_*(e-t)+t;for(let z=0;z<=s;z++){const B=z/s,G=B*c+a,j=Math.sin(G),H=Math.cos(G);N.x=y*j,N.y=-_*n+h,N.z=y*H,d.push(N.x,N.y,N.z),E.set(j,w,H).normalize(),p.push(E.x,E.y,E.z),m.push(B,1-_),K.push(g++)}v.push(K)}for(let D=0;D<s;D++)for(let K=0;K<r;K++){const _=v[K][D],y=v[K+1][D],z=v[K+1][D+1],B=v[K][D+1];t>0&&(u.push(_,y,B),A+=3),e>0&&(u.push(y,z,B),A+=3)}l.addGroup(f,A,0),f+=A}function S(E){const N=g,A=new Ct,w=new R;let D=0;const K=E===!0?t:e,_=E===!0?1:-1;for(let z=1;z<=s;z++)d.push(0,h*_,0),p.push(0,_,0),m.push(.5,.5),g++;const y=g;for(let z=0;z<=s;z++){const G=z/s*c+a,j=Math.cos(G),H=Math.sin(G);w.x=K*H,w.y=h*_,w.z=K*j,d.push(w.x,w.y,w.z),p.push(0,_,0),A.x=j*.5+.5,A.y=H*.5*_+.5,m.push(A.x,A.y),g++}for(let z=0;z<s;z++){const B=N+z,G=y+z;E===!0?u.push(G,G+1,B):u.push(G+1,G,B),D+=3}l.addGroup(f,D,E===!0?1:2),f+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nr(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ns extends nr{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new ns(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class is extends Oe{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const u=[],d=new R,p=new R,m=[],g=[],v=[],h=[];for(let f=0;f<=n;f++){const b=[],S=f/n;let E=0;f===0&&o===0?E=.5/e:f===n&&c===Math.PI&&(E=-.5/e);for(let N=0;N<=e;N++){const A=N/e;d.x=-t*Math.cos(s+A*r)*Math.sin(o+S*a),d.y=t*Math.cos(o+S*a),d.z=t*Math.sin(s+A*r)*Math.sin(o+S*a),g.push(d.x,d.y,d.z),p.copy(d).normalize(),v.push(p.x,p.y,p.z),h.push(A+E,1-S),b.push(l++)}u.push(b)}for(let f=0;f<n;f++)for(let b=0;b<e;b++){const S=u[f][b+1],E=u[f][b],N=u[f+1][b],A=u[f+1][b+1];(f!==0||o>0)&&m.push(S,E,A),(f!==n-1||c<Math.PI)&&m.push(E,N,A)}this.setIndex(m),this.setAttribute("position",new ve(g,3)),this.setAttribute("normal",new ve(v,3)),this.setAttribute("uv",new ve(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new is(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class jm extends Ae{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ss extends Pi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new ht(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=za,this.normalScale=new Ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class rs extends de{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ht(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class _n extends rs{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(de.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ht(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const qo=new ee,il=new R,sl=new R;class Yo{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ct(512,512),this.map=null,this.mapPass=null,this.matrix=new ee,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Do,this._frameExtents=new Ct(1,1),this._viewportCount=1,this._viewports=[new te(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;il.setFromMatrixPosition(t.matrixWorld),e.position.copy(il),sl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(sl),e.updateMatrixWorld(),qo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(qo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Zm extends Yo{constructor(){super(new ke(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,n=ws*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class $o extends rs{constructor(t,e,n=0,s=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(de.DEFAULT_UP),this.updateMatrix(),this.target=new de,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Zm}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const rl=new ee,os=new R,Ko=new R;class Jm extends Yo{constructor(){super(new ke(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ct(4,2),this._viewportCount=6,this._viewports=[new te(2,1,1,1),new te(0,1,1,1),new te(3,1,1,1),new te(1,1,1,1),new te(3,0,1,1),new te(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),os.setFromMatrixPosition(t.matrixWorld),n.position.copy(os),Ko.copy(n.position),Ko.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Ko),n.updateMatrixWorld(),s.makeTranslation(-os.x,-os.y,-os.z),rl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(rl)}}class Be extends rs{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Jm}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Qm extends Yo{constructor(){super(new No(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class jo extends rs{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(de.DEFAULT_UP),this.updateMatrix(),this.target=new de,this.shadow=new Qm}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class tg extends rs{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class eg{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=ol(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=ol();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function ol(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:mr}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=mr);class ng{constructor(){this.samples=new Map,this.loops=new Map,this.ready=!1,this.muted=!1,this.env="room";const t=globalThis.AudioContext??globalThis.webkitAudioContext;this.ctx=new t,this.master=this.ctx.createGain(),this.master.gain.value=.9,this.comp=this.ctx.createDynamicsCompressor(),this.comp.threshold.value=-14,this.comp.knee.value=24,this.comp.ratio.value=6,this.comp.attack.value=.004,this.comp.release.value=.25,this.master.connect(this.comp).connect(this.ctx.destination),this.reverb=this.ctx.createConvolver(),this.reverb.buffer=this.makeImpulse(2.6,2.4),this.wet=this.ctx.createGain(),this.wet.gain.value=.35,this.dry=this.ctx.createGain(),this.dry.gain.value=1,this.reverb.connect(this.wet).connect(this.master),this.dry.connect(this.master);const e=this.ctx.sampleRate*2;this.noiseBuf=this.ctx.createBuffer(1,e,this.ctx.sampleRate);const n=this.noiseBuf.getChannelData(0);for(let s=0;s<e;s++)n[s]=Math.random()*2-1}makeImpulse(t,e){const n=this.ctx.sampleRate,s=Math.floor(n*t),r=this.ctx.createBuffer(2,s,n);for(let o=0;o<2;o++){const a=r.getChannelData(o);for(let c=0;c<s;c++){const l=c/s,u=c<n*.05&&Math.random()<.02?1:0;a[c]=((Math.random()*2-1)*Math.pow(1-l,e)+u*.6)*(o?.94:1)}}return r}async load(t){const e=Object.entries(t);await Promise.all(e.map(async([n,s])=>{try{const o=await(await fetch(s)).arrayBuffer(),a=await this.ctx.decodeAudioData(o);this.samples.set(n,a)}catch{}})),this.ready=!0}has(t){return this.samples.has(t)}resume(){this.ctx.state==="suspended"&&this.ctx.resume()}setMuted(t){this.muted=t,this.master.gain.setTargetAtTime(t?0:.9,this.ctx.currentTime,.05)}setEnvironment(t){if(t===this.env)return;this.env=t;const e=t==="basement"?.62:t==="room"?.3:t==="outdoor"?.16:t==="vacuum"?.02:.12;this.wet.gain.setTargetAtTime(e,this.ctx.currentTime,.4)}setMaster(t,e=.2){this.master.gain.setTargetAtTime(t,this.ctx.currentTime,e)}bus(t){return{input:this.ctx.createGain(),output:this.master}}route(t,e){const n=this.ctx.createGain();if(n.gain.value=1,t.connect(n),n.connect(this.dry),e>.001){const s=this.ctx.createGain();s.gain.value=e,n.connect(s).connect(this.reverb)}}playSample(t,e={}){const n=this.samples.get(t);if(!n||this.muted)return;const s=this.ctx.currentTime+(e.offset,0),r=this.ctx.createBufferSource();r.buffer=n,r.playbackRate.value=e.rate??1,r.loop=!!e.loop;const o=this.ctx.createGain(),a=e.gain??1,c=e.attack??.004,l=e.release??Math.min(1.4,n.duration/Math.max(.5,e.rate??1));o.gain.setValueAtTime(1e-4,s),o.gain.exponentialRampToValueAtTime(Math.max(2e-4,a),s+c),e.loop||(o.gain.setValueAtTime(Math.max(2e-4,a),s+Math.max(c,l-.08)),o.gain.exponentialRampToValueAtTime(1e-4,s+l));let u=o;if(e.pan){const d=this.ctx.createStereoPanner();d.pan.value=e.pan,o.connect(d),u=d}r.connect(o),this.route(u,e.reverb??(this.env==="basement"?.5:.12)),r.start(s,e.offset??0,e.duration),e.loop||r.stop(s+(e.duration??n.duration)+.05)}noiseSource(t=!1){const e=this.ctx.createBufferSource();return e.buffer=this.noiseBuf,e.loop=t,e}burst(t={}){if(this.muted)return;const e=this.ctx.currentTime,n=t.dur??.2,s=this.noiseSource(),r=this.ctx.createBiquadFilter();r.type=t.type??"lowpass",r.frequency.value=t.freq??800,r.Q.value=t.q??1;const o=this.ctx.createGain(),a=t.gain??.6;o.gain.setValueAtTime(a,e),o.gain.exponentialRampToValueAtTime(1e-4,e+n);let c=o;if(s.connect(r).connect(o),t.pan){const l=this.ctx.createStereoPanner();l.pan.value=t.pan,o.connect(l),c=l}this.route(c,t.reverb??(this.env==="basement"?.6:.14)),s.start(e),s.stop(e+n+.05)}tone(t){if(this.muted)return;const e=this.ctx.currentTime,n=t.dur??.3,s=this.ctx.createOscillator();s.type=t.type??"sine",s.frequency.setValueAtTime(t.freq,e),t.glide&&s.frequency.exponentialRampToValueAtTime(Math.max(20,t.glide),e+n);const r=this.ctx.createGain(),o=t.gain??.2,a=t.attack??.01;r.gain.setValueAtTime(1e-4,e),r.gain.exponentialRampToValueAtTime(o,e+a),r.gain.exponentialRampToValueAtTime(1e-4,e+n),s.connect(r),this.route(r,t.reverb??(this.env==="basement"?.5:.12)),s.start(e),s.stop(e+n+.05)}gunshot(t=1){if(!this.muted&&(this.ctx.currentTime,this.has("explosionCrunch_000")&&this.playSample("explosionCrunch_000",{gain:.9*t,rate:1.25,reverb:.7,release:.6}),this.has("impactMetal_heavy_002")&&this.playSample("impactMetal_heavy_002",{gain:.5*t,rate:1.4,reverb:.8,release:.4}),this.burst({dur:.09,freq:5200,q:.8,gain:1*t,type:"highpass",reverb:.7}),this.burst({dur:.32,freq:480,q:.9,gain:.9*t,type:"lowpass",reverb:.8}),this.tone({freq:96,glide:42,dur:.42,gain:.55*t,type:"sine",reverb:.5}),this.env==="basement")){const e=this.ctx.createGain();e.gain.value=0,this.route(e,.9);for(let n=1;n<=3;n++){const s=n*.085;setTimeout(()=>this.burst({dur:.05,freq:1800,q:1.2,gain:.18/n,reverb:.9}),s*1e3)}}}footstep(t=!1,e=.28){const s=`${t?"footstep_wood":"footstep_concrete"}_00${Math.floor(Math.random()*3)}`;this.has(s)?this.playSample(s,{gain:e,rate:.95+Math.random()*.1,reverb:this.env==="basement"?.55:.18}):this.burst({dur:.08,freq:320,q:1.4,gain:e*.5,reverb:.3})}click(t=.3,e=!1){const n=e?"impactMetal_light_001":"click3";this.has(n)?this.playSample(n,{gain:t,rate:e?1.6:1,reverb:this.env==="basement"?.7:.2}):this.burst({dur:.04,freq:2600,q:2,gain:t*.5})}ring(t=4200,e=4.5,n=.09){this.tone({freq:t,dur:e,gain:n,type:"sine",attack:.05,reverb:.25}),this.tone({freq:t*1.5,dur:e*.7,gain:n*.4,type:"sine",reverb:.2})}beep(t=880,e=.12,n=.18){this.tone({freq:t,dur:e,gain:n,type:"square",reverb:.25})}riser(t=3,e=.25){if(this.muted)return;const n=this.ctx.currentTime,s=this.noiseSource(!0),r=this.ctx.createBiquadFilter();r.type="bandpass",r.frequency.setValueAtTime(180,n),r.frequency.exponentialRampToValueAtTime(5200,n+t),r.Q.value=3;const o=this.ctx.createGain();o.gain.setValueAtTime(1e-4,n),o.gain.exponentialRampToValueAtTime(e,n+t*.8),o.gain.exponentialRampToValueAtTime(1e-4,n+t),s.connect(r).connect(o),this.route(o,.3),s.start(n),s.stop(n+t+.1)}rumble(t=.5,e=8){if(this.muted)return;const n=this.ctx.currentTime,s=this.noiseSource(!0),r=this.ctx.createBiquadFilter();r.type="lowpass",r.frequency.value=110,r.Q.value=.7;const o=this.ctx.createGain();o.gain.setValueAtTime(1e-4,n),o.gain.exponentialRampToValueAtTime(t,n+1.2),o.gain.setValueAtTime(t,n+e-1.5),o.gain.exponentialRampToValueAtTime(1e-4,n+e),s.connect(r).connect(o),this.route(o,.4),s.start(n),s.stop(n+e+.1)}static_(t=.5,e=.12){this.burst({dur:t,freq:2200,q:.5,gain:e,type:"bandpass",reverb:.15})}breath(t=6,e=.16){if(this.muted)return;const n=this.ctx.currentTime,s=this.noiseSource(!0),r=this.ctx.createBiquadFilter();r.type="bandpass",r.frequency.value=700,r.Q.value=1.2;const o=this.ctx.createGain();o.gain.value=0;for(let a=0;a<t*.5;a++){const c=n+a*2;o.gain.setValueAtTime(1e-4,c),o.gain.linearRampToValueAtTime(e,c+.5),o.gain.linearRampToValueAtTime(1e-4,c+1.4)}s.connect(r).connect(o),this.route(o,.1),s.start(n),s.stop(n+t+.2)}loopSample(t,e,n=.3,s=1,r=.8){if(this.loops.has(e))return;const o=this.samples.get(t);if(!o)return;const a=this.ctx.createBufferSource();a.buffer=o,a.loop=!0,a.playbackRate.value=s;const c=this.ctx.createGain();c.gain.setValueAtTime(1e-4,this.ctx.currentTime),c.gain.exponentialRampToValueAtTime(Math.max(2e-4,n),this.ctx.currentTime+r),a.connect(c),this.route(c,this.env==="basement"?.5:.2),a.start(),this.loops.set(e,{src:a,gain:c})}stopLoop(t,e=1){const n=this.loops.get(t);if(!n)return;const s=this.ctx.currentTime;n.gain.gain.cancelScheduledValues(s),n.gain.gain.setValueAtTime(Math.max(2e-4,n.gain.gain.value),s),n.gain.gain.exponentialRampToValueAtTime(1e-4,s+e);try{n.src.stop(s+e+.1)}catch{}this.loops.delete(t)}stopAll(){for(const t of Array.from(this.loops.keys()))this.stopLoop(t,.3)}}const al={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Bi{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ig=new No(-1,1,1,-1,0,1);class sg extends Oe{constructor(){super(),this.setAttribute("position",new ve([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ve([0,2,0,0,2,0],2))}}const rg=new sg;class Zo{constructor(t){this._mesh=new oe(rg,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,ig)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class cl extends Bi{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof Ae?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Ji.clone(t.uniforms),this.material=new Ae({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new Zo(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class ll extends Bi{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class og extends Bi{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class ag{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new Ct);this._width=n.width,this._height=n.height,e=new nn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Tn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new cl(al),this.copyPass.material.blending=bn,this.clock=new eg}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){const a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}ll!==void 0&&(o instanceof ll?n=!0:o instanceof og&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new Ct);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class cg extends Bi{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new ht}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=s}}const lg={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ht(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class zi extends Bi{constructor(t,e,n,s){super(),this.strength=e!==void 0?e:1,this.radius=n,this.threshold=s,this.resolution=t!==void 0?new Ct(t.x,t.y):new Ct(256,256),this.clearColor=new ht(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new nn(r,o,{type:Tn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const p=new nn(r,o,{type:Tn});p.texture.name="UnrealBloomPass.h"+d,p.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(p);const m=new nn(r,o,{type:Tn});m.texture.name="UnrealBloomPass.v"+d,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),r=Math.round(r/2),o=Math.round(o/2)}const a=lg;this.highPassUniforms=Ji.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ae({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Ct(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1),new R(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const u=al;this.copyUniforms=Ji.clone(u.uniforms),this.blendMaterial=new Ae({uniforms:this.copyUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:De,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new ht,this.oldClearAlpha=1,this.basic=new Te,this.fsQuad=new Zo(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Ct(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(t,e,n,s,r){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let a=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[c].uniforms.direction.value=zi.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=zi.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this.fsQuad.render(t),a=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(n),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=o}getSeperableBlurMaterial(t){const e=[];for(let n=0;n<t;n++)e.push(.39894*Math.exp(-.5*n*n/(t*t))/t);return new Ae({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new Ct(.5,.5)},direction:{value:new Ct(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new Ae({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}zi.BlurDirectionX=new Ct(1,0),zi.BlurDirectionY=new Ct(0,1);const hg={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class ug extends Bi{constructor(){super();const t=hg;this.uniforms=Ji.clone(t.uniforms),this.material=new jm({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new Zo(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Yt.getTransfer(this._outputColorSpace)===se&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ta?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===wa?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Aa?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Tr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ra?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ca&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const dg={uniforms:{tDiffuse:{value:null},uTime:{value:0},uGrain:{value:.055},uVignette:{value:.9},uAberration:{value:.0016},uFade:{value:0}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGrain;
    uniform float uVignette;
    uniform float uAberration;
    uniform float uFade;
    varying vec2 vUv;

    float hash(vec2 p) {
      p = fract(p * vec2(443.897, 441.423));
      p += dot(p, p + 19.19);
      return fract(p.x * p.y);
    }

    void main() {
      vec2 uv = vUv;
      vec2 c = uv - 0.5;
      float r2 = dot(c, c);
      // chromatic aberration grows toward the frame edge
      vec2 off = c * uAberration * (0.35 + r2 * 3.0);
      vec4 col;
      col.r = texture2D(tDiffuse, uv + off).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - off).b;
      col.a = 1.0;

      // gentle contrast / lift
      col.rgb = (col.rgb - 0.5) * 1.035 + 0.5;

      // vignette
      float v = smoothstep(0.95, 0.28, r2 * 2.0);
      col.rgb *= mix(1.0, v, uVignette * 0.55);

      // grain (animated)
      float g = hash(uv * vec2(1920.0, 1080.0) + uTime * 60.0) - 0.5;
      col.rgb += g * uGrain * (1.0 - r2);

      // fade to black
      col.rgb *= (1.0 - uFade);

      gl_FragColor = col;
    }
  `};class fg{constructor(t,e,n){this.renderer=t;const s=t.getSize(new Ct);this.composer=new ag(t),this.composer.addPass(new cg(e,n)),this.bloom=new zi(new Ct(s.x,s.y),.55,.75,.82),this.bloom.threshold=.72,this.bloom.radius=.72,this.bloom.strength=.55,this.composer.addPass(this.bloom),this.grade=new cl(dg),this.composer.addPass(this.grade),this.composer.addPass(new ug)}setSize(t,e){this.composer.setSize(t,e),this.bloom.setSize(t,e)}render(t,e,n,s){this.grade.uniforms.uTime.value=e,this.grade.uniforms.uFade.value=s,this.bloom.strength=n,this.composer.render(t)}}function pg(i){let t=i>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}class Me{constructor(t=20240101){this.next=pg(t)}unit(){return this.next()}range(t,e){return t+(e-t)*this.next()}int(t,e){return Math.floor(this.range(t,e+1))}sym(t){return this.range(-t,t)}chance(t){return this.next()<t}pick(t){return t[Math.floor(this.next()*t.length)%t.length]}gauss(){return(this.next()+this.next()+this.next()-1.5)*1.1547}}function Je(i,t,e){return i<t?t:i>e?e:i}function vn(i){return Je(i,0,1)}function $t(i,t,e){return i+(t-i)*e}function ln(i,t,e){const n=vn((e-i)/(t-i));return n*n*(3-2*n)}function hl(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}function Jo(i){return 1-Math.pow(1-i,3)}function Tt(i){return-(Math.cos(Math.PI*i)-1)/2}function mg(i,t,e,n,s){return{t:i,v:new R(t,e,n),ease:s}}function gg(i,t,e){return{t:i,v:t,ease:e}}function ul(i,t,e=new R){if(!i.length)return e.set(0,0,0);if(t<=i[0].t)return e.copy(i[0].v);const n=i[i.length-1];if(t>=n.t)return e.copy(n.v);for(let s=0;s<i.length-1;s++){const r=i[s],o=i[s+1];if(t>=r.t&&t<=o.t){const a=Math.max(1e-6,o.t-r.t);let c=(t-r.t)/a;return c=(o.ease??hl)(Je(c,0,1)),e.lerpVectors(r.v,o.v,c)}}return e.copy(n.v)}function _g(i,t){if(!i.length)return 0;if(t<=i[0].t)return i[0].v;const e=i[i.length-1];if(t>=e.t)return e.v;for(let n=0;n<i.length-1;n++){const s=i[n],r=i[n+1];if(t>=s.t&&t<=r.t){const o=Math.max(1e-6,r.t-s.t);let a=(t-s.t)/o;return a=(r.ease??hl)(Je(a,0,1)),$t(s.v,r.v,a)}}return e.v}class vg{constructor(){this.pos=new R,this.target=new R,this.fov=34,this.roll=0,this.handheld=0,this.shake=0,this.shakeSeed=Math.random()*1e3,this.tmp=new R,this.tmp2=new R,this.up=new R(0,1,0)}set(t,e,n=this.fov,s=this.roll){return this.pos.copy(t),this.target.copy(e),this.fov=n,this.roll=s,this}punch(t){this.shake=Math.max(this.shake,t)}update(t,e,n){const s=this.tmp.copy(this.pos),r=this.tmp2.copy(this.target);if(this.handheld>0){const o=this.handheld;s.x+=Math.sin(e*.63+this.shakeSeed)*o*.5+Math.sin(e*1.71+2.1)*o*.22,s.y+=Math.cos(e*.71+this.shakeSeed*.7)*o*.42+Math.sin(e*1.33)*o*.18,s.z+=Math.sin(e*.47+1.7)*o*.4,r.x+=Math.sin(e*.41+3.3)*o*.5,r.y+=Math.cos(e*.53+1.1)*o*.4}if(this.shake>1e-4){const o=this.shake,a=43;s.x+=Math.sin(e*a+1)*o*.14,s.y+=Math.sin(e*a*1.31+2)*o*.12,s.z+=Math.sin(e*a*.77+3)*o*.1,r.x+=Math.sin(e*a*.9)*o*.2,r.y+=Math.cos(e*a*1.1)*o*.18,this.shake*=Math.exp(-n*5.5),this.shake<.001&&(this.shake=0)}t.position.copy(s),t.up.copy(this.up),t.lookAt(r),this.roll&&t.rotateZ(this.roll),Math.abs(t.fov-this.fov)>.01&&(t.fov=this.fov,t.updateProjectionMatrix())}}function hn(i){return[i>>16&255,i>>8&255,i&255]}function ir(i,t){return[Je(i[0]*t,0,255),Je(i[1]*t,0,255),Je(i[2]*t,0,255)]}class xn{constructor(t,e=[128,128,128]){this.size=t,this.data=new Uint8ClampedArray(t*t*4),this.fill(e)}fill(t){const e=this.data;for(let n=0;n<e.length;n+=4)e[n]=t[0],e[n+1]=t[1],e[n+2]=t[2],e[n+3]=255}set(t,e,n,s=1){const r=this.size,o=(t%r+r)%r,c=((e%r+r)%r*r+o)*4,l=this.data;l[c]=l[c]+(n[0]-l[c])*s,l[c+1]=l[c+1]+(n[1]-l[c+1])*s,l[c+2]=l[c+2]+(n[2]-l[c+2])*s,l[c+3]=255}get(t,e){const n=this.size,s=(t%n+n)%n,o=((e%n+n)%n*n+s)*4;return[this.data[o],this.data[o+1],this.data[o+2]]}rect(t,e,n,s,r,o=1){for(let a=0;a<s;a++)for(let c=0;c<n;c++)this.set(t+c,e+a,r,o)}mul(t,e,n){const s=this.size,r=(t%s+s)%s,a=((e%s+s)%s*s+r)*4;this.data[a]=Je(this.data[a]*n,0,255),this.data[a+1]=Je(this.data[a+1]*n,0,255),this.data[a+2]=Je(this.data[a+2]*n,0,255)}toTexture(t=1,e=!0){const n=new Kc(this.data,this.size,this.size,Ke);return n.wrapS=Vi,n.wrapT=Vi,n.magFilter=Ce,n.minFilter=Fn,n.generateMipmaps=!0,n.anisotropy=4,n.colorSpace=e?je:wn,n.repeat.set(t,t),n.needsUpdate=!0,n}}function sr(i,t,e){let n=i*374761393+t*668265263+e*144665;return n=(n^n>>>13)*1274126177,((n^n>>>16)>>>0)/4294967296}function dl(i){return i*i*(3-2*i)}function as(i,t,e){const n=Math.floor(i),s=Math.floor(t),r=i-n,o=t-s,a=dl(r),c=dl(o),l=sr(n,s,e),u=sr(n+1,s,e),d=sr(n,s+1,e),p=sr(n+1,s+1,e);return l+(u-l)*a+(d-l)*c+(l-u-d+p)*a*c}function Wn(i,t,e,n=4){let s=0,r=.5,o=0,a=i,c=t;for(let l=0;l<n;l++)s+=as(a,c,e+l*131)*r,o+=r,r*=.5,a*=2.03,c*=2.01;return s/o}function Qo(i=7172472,t={}){const e=t.size??64,n=t.seed??7,s=new Me(n*7919+3),r=hn(i),o=new xn(e,r);for(let c=0;c<e;c++)for(let l=0;l<e;l++){const u=Wn(l*.12,c*.12,n,4),d=Wn(l*.5+11,c*.5+3,n+9,2);let p=.82+u*.34+(d-.5)*.16;s.chance(.012)&&(p*=.62),s.chance(.008)&&(p*=1.16),o.mul(l,c,p)}const a=Math.floor(s.range(0,e));for(let c=0;c<e;c++)o.mul(c,a,.8);return o.toTexture(t.repeat??1)}function ta(i=9147292,t={}){const e=t.size??64,n=t.seed??21,s=new Me(n*104729+17),r=new xn(e,hn(i));for(let a=0;a<e;a++)for(let c=0;c<e;c++){const l=as(c*.02,a*3.3,n)-.5,u=Wn(c*.1,a*.1,n+5,3);let d=.9+l*.16+(u-.5)*.14;s.chance(.01)&&(d*=.8),r.mul(c,a,d)}const o=Math.floor(e*.5);for(let a=0;a<e;a++)r.mul(a,o,.72);for(let a=0;a<8;a++)r.mul(s.int(0,e-1),o,.5);return r.toTexture(t.repeat??1)}function fl(i={},t=2366744){const e=i.size??96,n=i.seed??99,s=new xn(e,hn(t));for(let r=0;r<e;r++)for(let o=0;o<e;o++){let c=.7+Wn(o*.14,r*.14,n,5)*.55;const l=Math.sin(o*.16+as(o*.08,r*.08,n+4)*5)*e*.14,u=Math.abs((r+l)%e-e*.5);u<2.4?c*=1.55:u<5&&(c*=1.12),s.mul(o,r,c),as(o*.9,r*.9,n+30)>.93&&s.set(o,r,[190,180,165],.7)}return s.toTexture(i.repeat??1)}function xg(i=7031339,t={}){const e=t.size??64,n=t.seed??42,s=new xn(e,hn(i));for(let r=0;r<e;r++)for(let o=0;o<e;o++){const a=Math.sin(o*.55+as(o*.05,r*.4,n)*5)*.5+.5,c=Wn(o*.2,r*.06,n+3,3);s.mul(o,r,.82+a*.22+(c-.5)*.2)}for(let r=0;r<e;r+=Math.floor(e/4))for(let o=0;o<e;o++)s.mul(o,r,.7);return s.toTexture(t.repeat??1)}function Mg(i=3882822,t={}){const e=t.size??48,n=t.seed??5,s=new xn(e,hn(i));for(let r=0;r<e;r++)for(let o=0;o<e;o++){const a=(o>>1)+(r>>1)&1?.94:1.06,c=Wn(o*.25,r*.25,n,3);s.mul(o,r,a*(.86+c*.28))}return s.toTexture(t.repeat??1)}function Sg(i=5790818,t={}){const e=t.size??96,n=t.seed??13,s=new xn(e,hn(i));for(let o=0;o<e;o++)for(let a=0;a<e;a++){const c=Wn(a*.08,o*.08,n,4),l=Wn(a*.45,o*.45,n+8,2);s.mul(a,o,.8+c*.32+(l-.5)*.14)}const r=Math.floor(e/2);for(let o=0;o<e;o++)s.mul(o,r,.72),s.mul(o,0,.72),s.mul(o,r+1,.85);for(let o=0;o<e;o++)s.mul(r,o,.72),s.mul(0,o,.72);return s.toTexture(t.repeat??1)}function yg(i={}){const t=i.size??32,e=new xn(t,hn(1710620));for(let n=0;n<t;n++)for(let s=0;s<t;s++)(s+n)%16<8&&e.set(s,n,hn(13214247));return e.toTexture(i.repeat??1)}function pl(i=7324927,t={}){const e=t.size??64,n=t.seed??77,s=new Me(n),r=new xn(e,hn(329740)),o=hn(i);for(let a=0;a<e;a++)for(let c=0;c<e;c++)s.chance(.28)&&c>3&&c<e-3&&s.chance(.55)&&r.set(c,a,ir(o,.55+s.range(0,.7)),.85);for(let a=0;a<e;a++)r.set(a,0,o,.9),r.set(a,e-1,o,.9),r.set(0,a,o,.9),r.set(e-1,a,o,.9);return r.toTexture(t.repeat??1)}function bg(i={}){const t=i.size??256,e=i.seed??1234,n=new Me(e),s=new xn(t,hn(197898));for(let r=0;r<t*t*.03;r++){const o=n.int(0,t-1),a=n.int(0,t-1),c=n.range(.35,1),u=n.chance(.15)?[255,224,190]:[214,230,255];s.set(o,a,ir(u,c)),c>.9&&(s.set(o+1,a,ir(u,c*.5)),s.set(o,a+1,ir(u,c*.5)))}return s.toTexture(i.repeat??1)}function Eg(i={}){const t=i.size??32,e=new xn(t,[0,0,0]),n=t/2-.5;for(let r=0;r<t;r++)for(let o=0;o<t;o++){const a=Math.hypot(o-n,r-n)/(t/2),c=vn(1-a),l=c*c,u=(r*t+o)*4;e.data[u]=255,e.data[u+1]=255,e.data[u+2]=255,e.data[u+3]=Math.round(l*255)}return e.toTexture(1,!1)}const ml={concrete:{color:16777215,rough:.96,metal:.02,tex:i=>Qo(7172472,i)},concreteDark:{color:10133672,rough:.98,metal:.02,tex:i=>Qo(5001560,i)},concretePale:{color:16777215,rough:.96,metal:.02,tex:i=>Qo(10133672,i)},ceilDark:{color:2764340,rough:.95,metal:.02},floor:{color:16777215,rough:.9,metal:.04,tex:i=>Sg(5790818,i)},metal:{color:16777215,rough:.42,metal:.85,tex:i=>ta(9147292,i)},metalDark:{color:8160140,rough:.5,metal:.8,tex:i=>ta(5923435,i)},steel:{color:13620957,rough:.3,metal:.95,tex:i=>ta(11450304,i)},wood:{color:16777215,rough:.82,metal:0,tex:i=>xg(7031339,i)},fabric:{color:16777215,rough:1,metal:0,tex:i=>Mg(3882822,i)},meteorite:{color:16777215,rough:.62,metal:.72,tex:i=>fl(i)},hazard:{color:16777215,rough:.7,metal:.2,tex:i=>yg(i)},screen:{color:659480,rough:.22,metal:.1,tex:i=>pl(7324927,i),emissive:5879551,emissiveIntensity:1.35},screenWarm:{color:1051654,rough:.22,metal:.1,tex:i=>pl(16757847,i),emissive:16754250,emissiveIntensity:1.15},stars:{color:16777215,rough:1,metal:0,tex:i=>bg(i),emissive:16777215,emissiveIntensity:.9},glass:{color:1779507,rough:.05,metal:.1,opacity:.22},water:{color:859174,rough:.08,metal:.2}},gl=new Map;function cs(i){const t=gl.get(i);if(t)return t;const e=ml[i]??ml.concrete,n=new ss({color:e.color,roughness:e.rough,metalness:e.metal,emissive:e.emissive??0,emissiveIntensity:e.emissiveIntensity??1,flatShading:e.flat??!1,transparent:e.opacity!==void 0,opacity:e.opacity??1,side:e.side??yn,envMapIntensity:.5});return e.tex&&(n.map=e.tex(),e.emissive&&(n.emissiveMap=n.map)),n.name=`surface:${i}`,gl.set(i,n),n}const _l=new Map;function Z(i,t=.8,e=0,n=0,s=1){const r=`${i}|${t}|${e}|${n}|${s}`,o=_l.get(r);if(o)return o;const a=new ss({color:i,roughness:t,metalness:e,emissive:n,emissiveIntensity:s});return a.name=`flat:${i.toString(16)}`,_l.set(r,a),a}function Ue(i,t=2.2){return Z(i,.4,0,i,t)}function Tg(i=2767434,t=.24){return new ss({color:i,roughness:.06,metalness:.15,transparent:!0,opacity:t,depthWrite:!1})}const Mn={navy:1845043,navyLight:2832972,slate:3752267,woodDark:4008472},Qe={light:14725258,mid:13209446,tan:11565650,pale:15255206};function ea(i){return typeof i=="string"?cs(i):i}function wg(i,t,e,n,s=1){const r=i.attributes.uv,o=[n/s,n/s,t/s,t/s,t/s,t/s],a=[e/s,e/s,n/s,n/s,e/s,e/s];for(let c=0;c<6;c++)for(let l=0;l<4;l++){const u=c*4+l;r.setXY(u,r.getX(u)*o[c],r.getY(u)*a[c])}r.needsUpdate=!0}function I(i,t,e,n,s=0,r=0,o=0,a={}){const c=new ei(i,t,e);wg(c,i,t,e,a.scale??1);const l=new oe(c,ea(n));return l.position.set(s,r,o),a.rot&&l.rotation.set(a.rot[0],a.rot[1],a.rot[2]),l.castShadow=a.cast??!0,l.receiveShadow=a.receive??!0,a.renderOrder!==void 0&&(l.renderOrder=a.renderOrder),a.name&&(l.name=a.name),l}function _e(i,t,e,n,s=0,r=0,o=0,a=10,c={}){const l=new nr(i,t,e,a,1,!1),u=l.attributes.uv,d=Math.PI*(i+t);for(let m=0;m<u.count;m++)u.setXY(m,u.getX(m)*(d/(c.scale??1)),u.getY(m)*(e/(c.scale??1)));u.needsUpdate=!0;const p=new oe(l,ea(n));return p.position.set(s,r,o),c.rot&&p.rotation.set(c.rot[0],c.rot[1],c.rot[2]),p.castShadow=c.cast??!0,p.receiveShadow=c.receive??!0,c.name&&(p.name=c.name),p}function un(i,t,e,n=0,s=0,r=0,o={}){const a=new si(i,t),c=a.attributes.uv;for(let u=0;u<c.count;u++)c.setXY(u,c.getX(u)*(i/(o.scale??1)),c.getY(u)*(t/(o.scale??1)));c.needsUpdate=!0;const l=new oe(a,ea(e));return l.position.set(n,s,r),o.rot&&l.rotation.set(o.rot[0],o.rot[1],o.rot[2]),l.castShadow=o.cast??!1,l.receiveShadow=o.receive??!0,l}function Mt(i=0,t=0,e=0,n){const s=new gn;return s.position.set(i,t,e),n&&(s.name=n),s}const na={hipX:0,hipY:0,torsoX:0,torsoY:0,neckX:0,neckY:0,shoulderLX:0,shoulderLZ:0,elbowLX:0,shoulderRX:0,shoulderRZ:0,elbowRX:0,hipLX:0,kneeLX:0,hipRX:0,kneeRX:0,rootYaw:0,rootLift:0};function rr(i,t,e,n,s){const r=Mt(0,0,0,s),o=I(t,i,e,n,0,-i/2,0,{scale:.5});return r.add(o),r}class Ag{constructor(t={}){this.root=Mt(0,0,0,"actor"),this.hips=Mt(0,0,0,"hips"),this.torso=Mt(0,0,0,"torso"),this.neck=Mt(0,0,0,"neck"),this.head=Mt(0,0,0,"head"),this.shoulderL=Mt(0,0,0,"shoulderL"),this.shoulderR=Mt(0,0,0,"shoulderR"),this.elbowL=Mt(0,0,0,"elbowL"),this.elbowR=Mt(0,0,0,"elbowR"),this.hipL=Mt(0,0,0,"hipL"),this.hipR=Mt(0,0,0,"hipR"),this.kneeL=Mt(0,0,0,"kneeL"),this.kneeR=Mt(0,0,0,"kneeR"),this.handR=Mt(0,0,0,"handR"),this.handL=Mt(0,0,0,"handL"),this.parts={},this.target={...na},this.current={...na},this.breathPhase=Math.random()*Math.PI*2,this.baseY=0,this.walkPhase=0,this.walkSpeed=0,this.mode="idle",this.fallAngle=0,this.fallSpin=0,this.fallDrop=0,this.cfg={height:t.height??1.78,build:t.build??1,skin:t.skin??Qe.mid,hair:t.hair??1314829,...t},this.height=this.cfg.height;const e=this.height,n=this.cfg.build;this.baseStoop=t.stoop??0;const s=Z(this.cfg.skin,.85,0),r=Z(this.cfg.hair,.95,0),o=Z(t.coat??Mn.navy,.82,.02),a=Z(t.coatAccent??Mn.navyLight,.8,.05),c=Z(t.trousers??2304047,.9,0),l=Z(t.shoes??1053204,.7,.05),u=Z(t.shirt??14212578,.85,0),d=Z(t.tie??2765632,.8,0),p=e*.48,m=p*.52,g=p-m,v=e*.3,h=e*.145,f=p,b=e*.035,S=e*.235*n,E=e*.135*n,N=e*.155,A=e*.15,w=e*.062*n,D=e*.07*n;this.hips.position.y=f,this.hips.rotation.x=this.baseStoop*.3,this.root.add(this.hips),this.torso.position.y=0,this.hips.add(this.torso);const K=I(S,v,E,o,0,v/2,0,{scale:.5});this.torso.add(K),this.parts.chest=K;const _=I(S*1.02,v*.34,E*1.04,o,0,v*.12,0,{scale:.5});this.torso.add(_);const y=I(S*.72,v*.16,E*.9,u,0,v*.86,E*.08,{scale:.4});this.torso.add(y),t.tie&&this.torso.add(I(S*.14,v*.42,E*.12,d,0,v*.68,E*.52,{scale:.3})),t.epaulettes&&(this.torso.add(I(S*.5,v*.07,E*.96,a,S*.32,v*.95,0,{scale:.4})),this.torso.add(I(S*.5,v*.07,E*.96,a,-S*.32,v*.95,0,{scale:.4})));for(let Q=0;Q<3;Q++)this.torso.add(I(.022,.022,.02,a,S*.16,v*(.28+Q*.2),E*.52,{scale:.2,cast:!1}));this.neck.position.set(0,v,0),this.torso.add(this.neck),this.neck.add(I(h*.42,b,h*.42,s,0,b/2,0,{scale:.3})),this.head.position.y=b,this.neck.add(this.head);const z=I(h,h,h,s,0,h/2,0,{scale:.5});this.head.add(z),this.parts.face=z;const B=t.hairStyle??"short";if(B!=="none"&&B!=="bald"){const Q=h*(B==="grey"?.34:.4),st=I(h*1.04,Q,h*1.04,r,0,h-Q/2+.002,-h*.03,{scale:.5});this.head.add(st),this.head.add(I(h*1.02,h*.62,h*.16,r,0,h*.62,-h*.52,{scale:.5})),B==="bun"&&this.head.add(I(h*.36,h*.36,h*.36,r,0,h*.78,-h*.62,{scale:.4}))}t.beard&&this.head.add(I(h*.86,h*.3,h*.16,r,0,h*.22,h*.5,{scale:.4}));const G=h*.56,j=h*.51,H=Z(1709072,.6,0);if(this.head.add(I(h*.13,h*.1,h*.03,H,-h*.2,G,j,{scale:.2,cast:!1})),this.head.add(I(h*.13,h*.1,h*.03,H,h*.2,G,j,{scale:.2,cast:!1})),this.parts.eyeL=this.head.children[this.head.children.length-2],this.parts.eyeR=this.head.children[this.head.children.length-1],this.head.add(I(h*.11,h*.16,h*.1,Z(this.cfg.skin,.9,0),0,h*.42,h*.54,{scale:.2})),t.glasses){const Q=Z(10466500,.3,.6);this.head.add(I(h*.34,h*.2,h*.02,Q,-h*.2,G,j+.006,{scale:.2,cast:!1})),this.head.add(I(h*.34,h*.2,h*.02,Q,h*.2,G,j+.006,{scale:.2,cast:!1})),this.head.add(I(h*.14,h*.04,h*.02,Q,0,G,j+.006,{scale:.2,cast:!1}))}if(t.hat){const Q=Z(1843238,.9,0);this.head.add(I(h*1.2,h*.2,h*1.2,Q,0,h*1.04,0,{scale:.5})),this.head.add(I(h*1.1,h*.06,h*1.6,Q,0,h*.96,h*.2,{scale:.5}))}const et=S*.58;for(const Q of[-1,1]){const st=Q<0?this.shoulderL:this.shoulderR,lt=Q<0?this.elbowL:this.elbowR,kt=Q<0?this.handL:this.handR;st.position.set(Q*et,v*.93,0),this.torso.add(st),st.add(rr(N,w,D,o,"upperArm")),lt.position.y=-N,st.add(lt),lt.add(rr(A,w*.88,D*.9,o,"foreArm")),kt.position.y=-A,lt.add(kt),kt.add(I(w*1.05,w*1.15,D*1.05,s,0,-w*.5,0,{scale:.3}))}const W=S*.27;for(const Q of[-1,1]){const st=Q<0?this.hipL:this.hipR,lt=Q<0?this.kneeL:this.kneeR;st.position.set(Q*W,0,0),this.hips.add(st),st.add(rr(g,w*1.15,D*1.1,c,"thigh")),lt.position.y=-g,st.add(lt),lt.add(rr(m,w*1.02,D*1,c,"shin"));const kt=I(w*1.15,e*.035,e*.075,l,0,-m-e*.017,e*.022,{scale:.4});lt.add(kt)}this.parts.head=this.head,this.parts.torso=this.torso,this.parts.hips=this.hips}setPose(t){Object.assign(this.target,t)}reset(){this.target={...na},this.mode="idle",this.walkSpeed=0}setPosition(t,e,n){this.root.position.set(t,e,n),this.baseY=e}setYaw(t){this.root.rotation.y=t,this.target.rootYaw=t,this.current.rootYaw=t}lookAtWorld(t,e=1){const n=new R;this.head.getWorldPosition(n);const s=t.x-n.x,r=t.z-n.z,o=Math.atan2(s,r)-this.root.rotation.y,a=Je(Math.atan2(Math.sin(o),Math.cos(o)),-.9,.9),c=Math.hypot(s,r),l=t.y-n.y,u=Je(-Math.atan2(l,Math.max(.2,c)),-.5,.5);this.target.neckY=a*e,this.target.neckX=u*e}aim(t,e=0){this.target.shoulderRX=$t(this.target.shoulderRX,-Math.PI/2+e,t),this.target.shoulderRZ=$t(this.target.shoulderRZ,-.12,t),this.target.elbowRX=$t(this.target.elbowRX,.08,t),this.target.shoulderLX=$t(this.target.shoulderLX,-.22,t),this.target.elbowLX=$t(this.target.elbowLX,.35,t)}salute(t){this.target.shoulderRX=$t(this.target.shoulderRX,-2.32,t),this.target.shoulderRZ=$t(this.target.shoulderRZ,-.42,t),this.target.elbowRX=$t(this.target.elbowRX,1.5,t)}startWalk(t=1){this.mode="walk",this.walkSpeed=t}stopWalk(){this.mode="idle",this.walkSpeed=0}update(t,e){const n=Math.sin(t*1.05+this.breathPhase)*.012;if(Math.sin(t*.37+this.breathPhase)*.008,this.mode==="walk"){this.walkPhase+=e*this.walkSpeed*4.4;const a=this.walkPhase,c=Math.sin(a),l=Math.cos(a);this.target.hipLX=c*.55,this.target.hipRX=-c*.55,this.target.kneeLX=Math.max(0,-c)*.7,this.target.kneeRX=Math.max(0,c)*.7,this.target.shoulderLX=-c*.4,this.target.shoulderRX=c*.4,this.target.elbowLX=.18+Math.max(0,c)*.2,this.target.elbowRX=.18+Math.max(0,-c)*.2,this.target.hipY=c*.06,this.target.rootLift=Math.abs(l)*.012,this.target.torsoX=this.baseStoop*.3+.04}else this.target.rootLift=0;const s=1-Math.exp(-e*7.5),r=this.current,o=this.target;r.hipX=$t(r.hipX,o.hipX,s),r.hipY=$t(r.hipY,o.hipY,s),r.torsoX=$t(r.torsoX,o.torsoX,s),r.torsoY=$t(r.torsoY,o.torsoY,s),r.neckX=$t(r.neckX,o.neckX,s),r.neckY=$t(r.neckY,o.neckY,s),r.shoulderLX=$t(r.shoulderLX,o.shoulderLX,s),r.shoulderLZ=$t(r.shoulderLZ,o.shoulderLZ,s),r.elbowLX=$t(r.elbowLX,o.elbowLX,s),r.shoulderRX=$t(r.shoulderRX,o.shoulderRX,s),r.shoulderRZ=$t(r.shoulderRZ,o.shoulderRZ,s),r.elbowRX=$t(r.elbowRX,o.elbowRX,s),r.hipLX=$t(r.hipLX,o.hipLX,s),r.kneeLX=$t(r.kneeLX,o.kneeLX,s),r.hipRX=$t(r.hipRX,o.hipRX,s),r.kneeRX=$t(r.kneeRX,o.kneeRX,s),r.rootYaw=$t(r.rootYaw,o.rootYaw,s),this.hips.rotation.x=this.baseStoop*.25+r.hipX*.18,this.hips.rotation.y=r.hipY,this.torso.rotation.x=this.baseStoop*.5+r.torsoX+n,this.torso.rotation.y=r.torsoY,this.torso.position.y=r.rootLift,this.neck.rotation.x=r.neckX+this.baseStoop*.4,this.neck.rotation.y=r.neckY,this.shoulderL.rotation.set(r.shoulderLX,0,r.shoulderLZ),this.shoulderR.rotation.set(r.shoulderRX,0,r.shoulderRZ),this.elbowL.rotation.x=r.elbowLX,this.elbowR.rotation.x=r.elbowRX,this.hipL.rotation.x=r.hipLX,this.hipR.rotation.x=r.hipRX,this.kneeL.rotation.x=-r.kneeLX,this.kneeR.rotation.x=-r.kneeRX,this.root.rotation.y=r.rootYaw,this.root.rotation.x=this.fallAngle,this.root.rotation.z=this.fallSpin,this.root.position.y=this.baseY+r.rootLift*.5+this.fallDrop}}function Rg(){const i=Mt(0,0,0,"pistol"),t=Z(2237995,.45,.85),e=Z(1316378,.85,.05),n=Z(10134445,.28,.95);i.add(I(.05,.062,.2,t,0,0,.05,{scale:.2})),i.add(I(.052,.02,.2,n,0,.032,.05,{scale:.2})),i.add(I(.028,.028,.03,n,0,0,.16,{scale:.1}));const s=I(.046,.13,.07,e,0,-.085,-.03,{scale:.2,rot:[.32,0,0]});return i.add(s),i.add(I(.05,.012,.06,t,0,-.045,.015,{scale:.1})),i.add(I(.012,.05,.012,t,0,-.022,.04,{scale:.1})),i}const Cg=`
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vAlpha = aAlpha;
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (260.0 / max(0.001, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`,Pg=`
  uniform sampler2D uMap;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec4 t = texture2D(uMap, gl_PointCoord);
    if (t.a * vAlpha < 0.01) discard;
    gl_FragColor = vec4(vColor, t.a * vAlpha);
  }
`;class vl{constructor(t,e,n){this.list=[],this.capacity=t,this.blend=e,this.pos=new Float32Array(t*3),this.size=new Float32Array(t),this.alpha=new Float32Array(t),this.col=new Float32Array(t*3),this.geo=new Oe,this.geo.setAttribute("position",new we(this.pos,3)),this.geo.setAttribute("aSize",new we(this.size,1)),this.geo.setAttribute("aAlpha",new we(this.alpha,1)),this.geo.setAttribute("aColor",new we(this.col,3)),this.mat=new Ae({uniforms:{uMap:{value:n}},vertexShader:Cg,fragmentShader:Pg,transparent:!0,depthWrite:!1,blending:e}),this.points=new el(this.geo,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=12;for(let s=0;s<t;s++)this.alpha[s]=0,this.pos[s*3+1]=-9999}spawn(t){this.list.length>=this.capacity&&this.list.shift(),this.list.push(t)}update(t){const e=this.list;let n=0;for(let s=0;s<e.length;s++){const r=e[s];if(r.life+=t,r.life>=r.max)continue;r.vy+=r.grav*t;const o=Math.exp(-r.drag*t);r.vx*=o,r.vy*=o,r.vz*=o,r.x+=r.vx*t,r.y+=r.vy*t,r.z+=r.vz*t;const a=r.life/r.max,c=1-a,l=n;this.pos[l*3]=r.x,this.pos[l*3+1]=r.y,this.pos[l*3+2]=r.z,this.size[l]=r.size*(.6+.4*(1-a)),this.alpha[l]=c*c,this.col[l*3]=r.r,this.col[l*3+1]=r.g,this.col[l*3+2]=r.b,e[n]=r,n++}e.length=n;for(let s=n;s<this.capacity;s++)this.alpha[s]=0,this.pos[s*3+1]=-9999;this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.aSize.needsUpdate=!0,this.geo.attributes.aAlpha.needsUpdate=!0,this.geo.attributes.aColor.needsUpdate=!0}}class Lg{constructor(t,e=2761760){this.list=[],this.m=new ee,this.q=new Mi,this.e=new on,this.v=new R,this.sc=new R,this.cap=t;const n=new ei(.06,.06,.06),s=new ss({color:e,roughness:.7,metalness:.6});this.color=new ht(e),this.mesh=new Km(n,s,t),this.mesh.instanceMatrix.setUsage(ud),this.mesh.frustumCulled=!1,this.mesh.castShadow=!1;for(let r=0;r<t;r++)this.m.makeScale(0,0,0),this.mesh.setMatrixAt(r,this.m)}spawn(t){this.list.length>=this.cap&&this.list.shift(),this.list.push(t)}update(t){const e=this.list;let n=0;for(let s=0;s<e.length;s++){const r=e[s];if(r.life+=t,r.life>=r.max)continue;r.vy-=9.8*t,r.vx*=1-.6*t,r.vz*=1-.6*t,r.x+=r.vx*t,r.y+=r.vy*t,r.z+=r.vz*t,r.y<.02&&(r.y=.02,r.vy*=-.32,r.vx*=.7,r.vz*=.7,r.wx*=.5,r.wy*=.5,r.wz*=.5),r.rx+=r.wx*t,r.ry+=r.wy*t,r.rz+=r.wz*t,this.e.set(r.rx,r.ry,r.rz),this.q.setFromEuler(this.e),this.v.set(r.x,r.y,r.z);const o=r.s*(1-Math.max(0,(r.life-r.max*.8)/(r.max*.2))*.9);this.sc.set(o,o,o),this.m.compose(this.v,this.q,this.sc),this.mesh.setMatrixAt(n,this.m),e[n]=r,n++}e.length=n;for(let s=n;s<this.cap;s++)this.m.makeScale(0,0,0),this.mesh.setMatrixAt(s,this.m);this.mesh.instanceMatrix.needsUpdate=!0}}class Ug{constructor(){this.root=new gn,this.lights=[],this.lightLife=[],this.lightMax=[],this.lightBase=[],this.rng=Math.random,this.root.name="fx";const t=Eg();this.sparks=new vl(900,De,t),this.smokePool=new vl(500,Yn,t),this.debrisPool=new Lg(220,2827553),this.root.add(this.sparks.points,this.smokePool.points,this.debrisPool.mesh);for(let e=0;e<6;e++){const n=new Be(16777215,0,14,2);n.visible=!1,this.lights.push(n),this.lightLife.push(0),this.lightMax.push(1),this.lightBase.push(0),this.root.add(n)}}freeLight(){let t=0,e=1/0;for(let n=0;n<this.lights.length;n++){const s=this.lights[n].intensity;s<e&&(e=s,t=n)}return t}sparkBurst(t,e=40,n=16761466,s=2.2){const r=new ht(n);for(let o=0;o<e;o++){const a=this.rng()*Math.PI*2,c=this.rng()*.9,l=s*(.35+this.rng()*.9);this.sparks.spawn({x:t.x,y:t.y,z:t.z,vx:Math.cos(a)*Math.cos(c)*l,vy:Math.sin(c)*l+.6,vz:Math.sin(a)*Math.cos(c)*l,life:0,max:.5+this.rng()*.8,size:.04+this.rng()*.05,r:r.r,g:r.g,b:r.b,drag:1.1,grav:-6})}}smoke(t,e=14,n=9146261,s=.5){const r=new ht(n);for(let o=0;o<e;o++){const a=this.rng()*Math.PI*2,c=s*this.rng();this.smokePool.spawn({x:t.x+(this.rng()-.5)*.2,y:t.y+(this.rng()-.5)*.2,z:t.z+(this.rng()-.5)*.2,vx:Math.cos(a)*c,vy:.18+this.rng()*.25,vz:Math.sin(a)*c,life:0,max:2.4+this.rng()*2.2,size:.5+this.rng()*.9,r:r.r,g:r.g,b:r.b,drag:.55,grav:.04})}}flash(t,e=16777215,n=40,s=6){const r=this.freeLight(),o=this.lights[r];o.position.copy(t),o.color.set(e),o.intensity=n,o.visible=!0,this.lightLife[r]=0,this.lightMax[r]=1/s,this.lightBase[r]=n}debris(t,e=14,n=2827553,s=2){for(let r=0;r<e;r++){const o=this.rng()*Math.PI*2,a=this.rng()*1.2,c=s*(.4+this.rng());this.debrisPool.spawn({x:t.x,y:t.y,z:t.z,vx:Math.cos(o)*Math.cos(a)*c,vy:Math.sin(a)*c+1,vz:Math.sin(o)*Math.cos(a)*c,rx:this.rng()*3,ry:this.rng()*3,rz:this.rng()*3,wx:(this.rng()-.5)*18,wy:(this.rng()-.5)*18,wz:(this.rng()-.5)*18,life:0,max:1.6+this.rng()*1.6,s:.5+this.rng()*1.3})}}update(t,e){this.sparks.update(e),this.smokePool.update(e),this.debrisPool.update(e);for(let n=0;n<this.lights.length;n++){const s=this.lights[n];if(!s.visible)continue;this.lightLife[n]+=e;const r=this.lightLife[n]/this.lightMax[n];if(r>=1){s.visible=!1,s.intensity=0;continue}s.intensity=this.lightBase[n]*Math.pow(1-r,2.2)}}}class xl extends gn{constructor(t=9,e=1.6){super(),this.plumeLayers=[],this.seed=Math.random()*10,this.power=0;const n=[{r:e*1.05,h:t,c:3112928,o:.32},{r:e*.72,h:t*.86,c:6732031,o:.4},{r:e*.42,h:t*.66,c:12576511,o:.55}];for(const r of n){const o=new ns(r.r,r.h,12,1,!0),a=new Te({color:r.c,transparent:!0,opacity:r.o,blending:De,depthWrite:!1,side:Ie}),c=new oe(o,a);c.position.y=-r.h/2,c.renderOrder=10,this.add(c),this.plumeLayers.push(c)}const s=new ns(e*.2,t*.42,10,1,!0);this.inner=new oe(s,new Te({color:16777215,transparent:!0,opacity:.85,blending:De,depthWrite:!1})),this.inner.position.y=-t*.21,this.inner.renderOrder=11,this.add(this.inner),this.light=new Be(5941503,0,e*14,2),this.add(this.light)}setPower(t){this.power=t,this.visible=t>.001,this.light.intensity=t*1400}tick(t){for(let n=0;n<this.plumeLayers.length;n++){const s=this.plumeLayers[n],r=1+Math.sin(t*(7+n*2.3)+this.seed)*.06+Math.sin(t*19+n)*.02;s.scale.set(r,1+Math.sin(t*(5+n)+this.seed)*.05,r),s.material.opacity=(.32-n*.06)*(.85+Math.sin(t*13+n*2)*.15)}const e=1+Math.sin(t*31)*.08;this.inner.scale.set(e,1+Math.sin(t*23)*.1,e)}}function ls(i){const t=Mt(0,0,0,"room"),e=i.wallT??.35,n=i.tile??2;return t.add(un(i.w,i.d,i.floor??"floor",0,0,0,{rot:[-Math.PI/2,0,0],scale:n,receive:!0})),t.add(I(i.w+e*2,i.h,e,i.wall??"concrete",0,i.h/2,-i.d/2-e/2,{scale:n,cast:!1})),t.add(I(i.w+e*2,i.h,e,i.wall??"concrete",0,i.h/2,i.d/2+e/2,{scale:n,cast:!1})),t.add(I(e,i.h,i.d+e*2,i.wall??"concrete",-i.w/2-e/2,i.h/2,0,{scale:n,cast:!1})),t.add(I(e,i.h,i.d+e*2,i.wall??"concrete",i.w/2+e/2,i.h/2,0,{scale:n,cast:!1})),i.ceiling!==!1&&t.add(un(i.w,i.d,i.ceil??"concrete",0,i.h,0,{rot:[Math.PI/2,0,0],scale:n,receive:!1})),t}function ia(i,t,e={}){const n=Mt(i,e.y??2.7,t,"tubeLight"),s=e.length??1.4,r=e.glowColor??14676712,o=Z(2764597,.6,.3);n.add(I(.12,.06,s,o,0,.05,0,{scale:.3,cast:!1}));const a=I(.09,.045,s*.94,Ue(r,2.6),0,-.01,0,{scale:.3,cast:!1});n.add(a);const c=new Be(e.color??14086370,e.intensity??30,12,2);return c.position.set(0,-.25,0),n.add(c),n}function sa(i,t,e={}){const n=Mt(i,0,t,"pendant"),s=e.y??2.5,r=Z(2829102,.6,.4);n.add(I(.02,.9,.02,Z(1053204,.8,.2),0,s+.55,0,{scale:.2,cast:!1}));const o=I(.46,.16,.46,r,0,s,0,{scale:.3,cast:!1});n.add(o);const a=I(.22,.06,.22,Ue(e.glowColor??16756823,3.2),0,s-.1,0,{scale:.2,cast:!1});n.add(a);const c=new Be(e.color??16756823,e.intensity??45,11,2);return c.position.set(0,s-.35,0),n.add(c),n}function Hi(i,t,e=13621478,n=.03,s=1){const r=new Me(s),o=new Float32Array(i*3);for(let l=0;l<i;l++)o[l*3]=r.sym(t.x/2),o[l*3+1]=r.range(.05,t.y),o[l*3+2]=r.sym(t.z/2);const a=new Oe;a.setAttribute("position",new we(o,3));const c=new Qc({color:e,size:n,transparent:!0,opacity:.55,depthWrite:!1,blending:De,sizeAttenuation:!0});return new el(a,c)}function Ml(i,t,e=7324927){const n=Mt();n.add(I(i+.08,t+.08,.06,Z(1316894,.7,.3),0,0,0,{scale:.4,cast:!1}));const s=I(i,t,.02,cs(e===7324927?"screen":"screenWarm"),0,0,.04,{scale:.5,cast:!1});n.add(s);const r=new Be(e,1.6,5,2);return r.position.set(0,0,.5),n.add(r),n}function hs(i,t,e=0,n=Mn.slate){const s=Mt(i,0,t,"chair");s.rotation.y=e;const r=Z(n,.85,.02);s.add(I(.44,.06,.44,r,0,.46,0,{scale:.3})),s.add(I(.44,.5,.06,r,0,.72,-.19,{scale:.3}));for(const o of[-1,1])for(const a of[-1,1])s.add(I(.05,.46,.05,Z(2237995,.7,.3),o*.18,.23,a*.18,{scale:.2}));return s}function ra(i,t,e=1.8,n=.8,s=.76,r=Mn.woodDark){const o=Mt(i,0,t,"desk"),a=Z(r,.8,.02);return o.add(I(e,.06,n,a,0,s,0,{scale:.4})),o.add(I(.08,s,n*.9,a,-e/2+.1,s/2,0,{scale:.4})),o.add(I(.08,s,n*.9,a,e/2-.1,s/2,0,{scale:.4})),o.add(I(e*.9,.05,n*.9,a,0,s*.5,0,{scale:.4})),o}function or(i,t,e,n,s=1){const r=Mt(t,0,e,"crates"),o=[5917234,4867128,4015158];for(let a=0;a<n;a++){const c=i.range(.5,.8),l=I(c,c*.72,c,Z(i.pick(o),.9,.02),i.sym(.6),c*.36+a%3*.02,i.sym(.6),{scale:.3});l.rotation.y=i.sym(.5),r.add(l)}return r}new R(0,0,0);function Ig(){const i=Mt(0,0,0,"set:council");i.add(ls({w:17,d:11,h:4.3,floor:"floor",wall:"concrete",ceil:"ceilDark",tile:2.4}));const t=Z(1975340,.35,.1),e=9.2;i.add(I(e,.1,2.6,t,0,.78,0,{scale:.6})),i.add(I(e*.98,.62,.18,t,0,.42,0,{scale:.6})),i.add(I(e*.5,.02,1.1,Ue(3043240,.7),0,.84,0,{scale:.5,cast:!1}));for(const l of[-2.6,0,2.6])i.add(hs(l,-2,Math.PI,Mn.slate));for(const l of[-3.2,-.8,1.2,3.4])i.add(hs(l,2,0,Mn.slate));for(let l=0;l<5;l++){const u=-3.6+l*1.8;i.add(I(.34,.02,.24,Z(856600,.4,.1),u,.85,.55,{scale:.3,cast:!1})),i.add(I(.3,.012,.2,Ue(l%2?7324927:16757847,1.4),u,.865,.55,{scale:.3,cast:!1}))}const n=Ml(6.4,3,7324927);n.position.set(0,2.3,-5.28),i.add(n);const s=Mt(0,2.05,0,"holo"),r=new Te({color:6275327,transparent:!0,opacity:.32,blending:De,depthWrite:!1}),o=new Te({color:16757847,transparent:!0,opacity:.28,blending:De,depthWrite:!1}),a=new Me(4242);for(let l=0;l<90;l++){const u=a.range(0,Math.PI*2),d=a.range(.2,1.5),p=a.sym(.55),m=I(.035,.035,.035,l%5===0?o:r,Math.cos(u)*d,p,Math.sin(u)*d*.6,{scale:.1,cast:!1});m.material=l%5===0?o:r,s.add(m)}s.add(I(2.4,.02,.02,o,-1.3,0,0,{scale:.1,cast:!1})),s.add(I(3.6,.03,.03,r,.4,.06,0,{scale:.1,cast:!1})),i.add(s);for(const l of[-5,0,5])for(const u of[-3.4,0,3.4]){const d=ia(l,u,{y:3.2,length:1.7,color:13625054,intensity:14,glowColor:15136494});i.add(d)}const c=new $o(4878234,45,26,.7,.6,1.6);return c.position.set(-8,3.4,4.6),c.target.position.set(0,.8,-1),i.add(c,c.target),i.add(new _n(8425636,2764340,1.3)),i.add(Hi(90,new R(14,4,9),12570848,.02,11)),{id:"council",root:i,update(l){s.rotation.y=l*.09,s.position.y=2.05+Math.sin(l*.8)*.02}}}function Dg(){const i=Mt(0,0,0,"set:corridor"),t=46,e=3.4,n=3.1;i.add(ls({w:e,d:t,h:n,floor:"floor",wall:"concreteDark",ceil:"ceilDark",tile:2})),Z(3949646,.5,.3);const s=Z(2106925,.4,.4);for(let r=-t/2+3;r<t/2-2;r+=5.2){i.add(I(e,.12,.3,s,0,n-.35,r,{scale:.4,cast:!1})),i.add(I(.16,n-.5,.3,s,-e/2+.1,(n-.5)/2,r,{scale:.4,cast:!1})),i.add(I(.16,n-.5,.3,s,e/2-.1,(n-.5)/2,r,{scale:.4,cast:!1})),i.add(I(e*.5,.05,.12,Ue(14216946,1.6),0,n-.02,r,{scale:.3,cast:!1}));const o=new Be(12375773,22,7,2);o.position.set(0,n-.4,r),i.add(o)}return i.add(I(e*.9,n*.6,.06,Ue(10470632,.5),0,n*.5,-t/2+.2,{scale:.5,cast:!1})),i.add(or(new Me(3),-e/2+.7,12,3,3)),i.add(new _n(6978186,1711652,1)),{id:"corridor",root:i,update(r){const o=.85+Math.sin(r*37)*.05+(Math.sin(r*7.3)>.97?-.5:0);i.traverse(a=>{const c=a;c.isPointLight&&(c.intensity=22*o)})}}}function Ng(){const i=Mt(0,0,0,"set:market"),t=new Me(808),e=un(60,60,"floor",0,0,0,{rot:[-Math.PI/2,0,0],scale:6});e.material.color.setHex(6969924),i.add(e),i.add(I(34,3.2,.5,"concreteDark",0,1.6,-6,{scale:2.4,cast:!1}));const n=[8011562,7033392,5456428,8011562];for(let l=0;l<5;l++){const u=-8+l*4,d=Mt(u,0,-2.6,"stall"),p=n[l%n.length];for(const g of[-1.5,1.5])d.add(I(.12,2.5,.12,Z(2760470,.9,0),g,1.25,-.7,{scale:.3})),d.add(I(.12,2.5,.12,Z(2760470,.9,0),g,1.25,.7,{scale:.3}));const m=I(3.4,.1,2,Z(p,.95,0),0,2.5,0,{scale:.8,rot:[.08,0,0]});d.add(m);for(let g=0;g<7;g++)d.add(I(.42,.3,.04,Z(p,.95,0),-1.4+g*.47,2.33,.98,{scale:.3,cast:!1}));d.add(I(3,.1,1.3,"wood",0,.9,.1,{scale:.8})),d.add(I(.1,.9,.1,Z(3811866,.9,0),-1.3,.45,.6,{scale:.3})),d.add(I(.1,.9,.1,Z(3811866,.9,0),1.3,.45,.6,{scale:.3}));for(let g=0;g<6;g++){const v=t.range(.12,.28);d.add(I(v,v*t.range(.7,1.6),v,Z(t.pick([9071162,6965802,4872778,9079418]),.9,0),t.sym(1.1),.95+v/2,t.range(-.2,.4),{scale:.2}))}i.add(d)}for(let l=0;l<5;l++){const u=-8+l*4;i.add(sa(u,-.6,{y:2.85,color:16756823,intensity:42,glowColor:16761466}))}i.add(or(t,6.5,-1.5,4,21)),i.add(or(t,-7.5,1,3,22));const s=Mt(3,0,1.6,"cart");s.add(I(2.2,.12,1.1,"wood",0,.7,0,{scale:.8}));for(const l of[-.9,.9])for(const u of[-.4,.4])s.add(_e(.26,.26,.1,Z(1842206,.8,0),l,.28,u,10,{rot:[Math.PI/2,0,0],scale:.4}));i.add(s);const r=Mt(0,.95,-2.1,"meteorSample"),o=new Me(515);for(let l=0;l<9;l++){const u=o.range(.16,.34),d=I(u,u*o.range(.7,1.1),u*o.range(.7,1.1),"meteorite",o.sym(.22),u/2+o.range(0,.06),o.sym(.18),{scale:.2});d.rotation.set(o.sym(.6),o.sym(3),o.sym(.6)),r.add(d)}i.add(r);const a=new jo(16756838,4.6);a.position.set(14,12,10),a.castShadow=!0,a.shadow.mapSize.set(1024,1024),a.shadow.camera.left=-16,a.shadow.camera.right=16,a.shadow.camera.top=16,a.shadow.camera.bottom=-16,a.shadow.camera.far=60,a.shadow.bias=-.0015,i.add(a);const c=new _n(16767392,5916208,1.9);return i.add(c),i.add(Hi(140,new R(24,5,14),16767392,.025,31)),{id:"market",root:i,update(l){i.traverse(u=>{const d=u;d.isPointLight&&(d.intensity=42*(.94+Math.sin(l*9.3+d.position.x)*.06))})}}}function Fg(){const i=Mt(0,0,0,"set:workshop"),t=new Me(1907),e=10,n=8.5,s=3.3;i.add(un(e,n,"wood",0,0,0,{rot:[-Math.PI/2,0,0],scale:1.2})),i.add(I(e,s,.4,"concreteDark",0,s/2,-n/2-.2,{scale:1.6,cast:!1})),i.add(I(e,s,.4,"concreteDark",0,s/2,n/2+.2,{scale:1.6,cast:!1})),i.add(I(.4,s,n,"concreteDark",-e/2-.2,s/2,0,{scale:1.6,cast:!1})),i.add(I(.4,s,n,"concreteDark",e/2+.2,s/2,0,{scale:1.6,cast:!1})),i.add(un(e,n,"ceilDark",0,s,0,{rot:[Math.PI/2,0,0],scale:1.6,receive:!1}));const r=Z(4864038,.9,0);i.add(I(6.4,1.9,.08,r,0,1.9,-n/2+.25,{scale:.8,cast:!1}));for(let f=0;f<14;f++){const b=-3+f%7*1,S=1.35+Math.floor(f/7)*.75,E=t.range(.05,.1),N=t.range(.3,.55);i.add(I(E,N,.06,Z(t.pick([9080726,6969914,10134445]),.5,.6),b+t.sym(.1),S,-n/2+.33,{scale:.3,cast:!1}))}const o=ra(-3.4,0,2.6,1.1,.9,Mn.woodDark);o.rotation.y=Math.PI/2,i.add(o),i.add(I(.5,.35,.7,Z(2763310,.6,.5),-3.4,1.08,.4,{scale:.4}));const a=Mt(-3.4,0,-1.6,"lathe");a.rotation.y=Math.PI/2;const c=Z(3817800,.5,.8);a.add(I(2.4,.35,.7,c,0,.75,0,{scale:.6})),a.add(I(.7,.9,.7,c,-1,1.25,0,{scale:.6})),a.add(I(1.4,.12,.5,Z(2237995,.7,.4),.2,.97,0,{scale:.5})),a.add(I(.5,.7,.5,c,1.05,1.2,0,{scale:.5}));const l=_e(.22,.22,.18,Z(10134445,.3,.95),-.6,1.25,0,12,{rot:[0,0,Math.PI/2],scale:.3}),u=_e(.045,.045,.9,Z(12169378,.35,.9),0,1.25,0,8,{rot:[0,0,Math.PI/2],scale:.2}),d=_e(.03,.03,.5,Z(6974058,.5,.8),1.15,1.25,0,8,{rot:[0,0,Math.PI/2],scale:.2});a.add(l,u,d),i.add(a);const p=Mt(-3.4,.92,.9,"oilcloth");p.rotation.y=Math.PI/2,p.add(I(.9,.02,.5,Z(5917230,.95,0),0,0,0,{scale:.3,cast:!1}));for(let f=0;f<6;f++)p.add(_e(.018,.018,.075,Z(13081162,.25,.95),-.3+f%3*.3,.045,-.1+Math.floor(f/3)*.2,8,{scale:.1,cast:!1}));i.add(p);const m=Mt(-3.4,.95,-.4,"meteorBlock"),g=new Me(616);for(let f=0;f<7;f++){const b=g.range(.14,.26),S=I(b,b*g.range(.7,1.1),b,"meteorite",g.sym(.14),b/2,g.sym(.12),{scale:.2});S.rotation.set(g.sym(.5),g.sym(3),g.sym(.5)),m.add(S)}i.add(m),i.add(sa(-2.6,.2,{y:2.55,color:16756823,intensity:62,glowColor:16765088})),i.add(sa(-3.4,-1.6,{y:2.45,color:16754250,intensity:48,glowColor:16761466}));const v=new Be(5933744,22,11,2);v.position.set(-3.8,2.4,2.6),i.add(v);const h=new _n(3812898,1314828,.55);return i.add(h),{id:"workshop",root:i,update(f){l.rotation.x=f*22,u.rotation.x=f*22,d.rotation.x=f*22,i.traverse(b=>{b.name==="pendant"&&(b.rotation.z=Math.sin(f*.7+b.position.x)*.02)})}}}function Og(){const i=Mt(0,0,0,"set:basement"),t=new Me(3311),e=13,n=19,s=3.25;i.add(ls({w:e,d:n,h:s,floor:"floor",wall:"concreteDark",ceil:"ceilDark",tile:2}));const r=[3882822,4865846,3356734,4537396];for(let h=-n/2+2;h<n/2-1.5;h+=2.4)for(const f of[-1,1]){const b=I(.06,2.2,2.1,Z(r[t.int(0,3)],1,0),f*(e/2-.2),1.5,h,{scale:.8,cast:!1});b.rotation.z=t.sym(.02),i.add(b)}for(let h=0;h<5;h++)i.add(I(2.3,2.2,.06,Z(r[t.int(0,3)],1,0),-e/2+1.6+h*2.45,1.5,-n/2+.2,{scale:.8,cast:!1}));const o=Z(2764597,.8,.2);for(const h of[-3.4,0,3.4]){i.add(I(.12,1,2,o,h,.5,3,{scale:.5})),i.add(I(2.6,.1,.7,o,h,1.02,3.6,{scale:.6}));const f=Mt(h,0,-6.4,"target");f.add(I(.12,1.7,.12,Z(4868682,.7,.3),0,.85,0,{scale:.3})),f.add(I(.9,1.1,.08,Z(13617592,.9,0),0,1.45,.05,{scale:.5,cast:!1})),f.add(I(.42,.42,.03,Z(2763306,.9,0),0,1.55,.1,{scale:.3,cast:!1})),i.add(f)}for(const h of[-3.4,3.4])i.add(I(.7,.12,.34,Z(1711136,.5,.4),h,1.12,3.6,{scale:.4})),i.add(I(.5,.06,.2,Z(6974058,.4,.8),h,1.2,3.6,{scale:.3,cast:!1}));i.add(or(t,5,7.5,2,44));const a=[];for(const h of[-6,-2,2,6]){const f=ia(0,h,{y:s-.1,length:2.2,color:14085343,intensity:28,glowColor:15268080});i.add(f),a.push(f)}for(const h of[-6.5,-1.5,3.5])for(const f of[-1,1]){const b=Mt(f*(e/2-.35),2.35,h,"wallLamp");b.add(I(.22,.3,.3,Z(2237995,.6,.4),-f*.12,0,0,{scale:.3,cast:!1})),b.add(I(.1,.2,.2,Ue(16767392,2.6),-f*.2,0,0,{scale:.2,cast:!1}));const S=new Be(16764810,22,9,2);S.position.set(-f*.4,-.05,0),b.add(S),i.add(b)}const c=Mt(0,0,n/2-1.2,"alcove");c.add(I(1,s,1,"concreteDark",-4.6,s/2,0,{scale:.8,cast:!1})),c.add(I(1,s,1,"concreteDark",4.6,s/2,0,{scale:.8,cast:!1})),c.add(I(1.6,s,.3,Z(1513756,.9,0),0,s/2,-.4,{scale:.8,cast:!1})),i.add(c),i.add(new _n(6977672,2764340,2.1)),i.add(_e(.18,.18,.02,Z(2763822,.8,.4),0,.012,-1,8,{scale:.2,cast:!1}));const l=Mt(0,0,0,"exterior"),u=un(80,60,"floor",0,.005,16,{rot:[-Math.PI/2,0,0],scale:8});u.material.color.setHex(3816770),l.add(u),l.add(I(18,5.2,.6,"concreteDark",0,2.6,12,{scale:1.6,cast:!1})),l.add(I(18,.5,4,"concreteDark",0,5,10.4,{scale:1.6,cast:!1})),l.add(I(1.7,2.5,.3,Z(1053204,.9,0),0,1.25,11.75,{scale:.6,cast:!1})),l.add(I(.12,2.5,.12,Z(2764339,.7,.2),-.9,1.25,11.7,{scale:.3,cast:!1})),l.add(I(.12,2.5,.12,Z(2764339,.7,.2),.9,1.25,11.7,{scale:.3,cast:!1})),l.add(I(.5,.2,.4,Z(2237995,.6,.4),0,3.05,11.7,{scale:.3,cast:!1})),l.add(I(.34,.1,.3,Ue(16767392,2.4),0,2.94,11.66,{scale:.2,cast:!1}));const d=new Be(16764810,40,10,2);d.position.set(0,2.8,11.4),l.add(d),l.add(I(2.2,.7,.08,Z(1711650,.8,0),0,3.9,11.7,{scale:.5,cast:!1}));const p=Mt(7.5,0,15.5,"car"),m=Z(2830648,.5,.4);p.add(I(4.4,.9,1.9,m,0,.75,0,{scale:1})),p.add(I(2.4,.7,1.8,m,-.2,1.45,0,{scale:1})),p.add(I(2.2,.55,.06,Z(1119772,.2,.2),-.2,1.5,.93,{scale:.4,cast:!1}));for(const h of[-1.4,1.4])for(const f of[-.85,.85]){const b=_e(.42,.42,.24,Z(1118740,.8,0),h,.42,f,10,{rot:[Math.PI/2,0,0],scale:.4});p.add(b)}l.add(p);for(let h=0;h<8;h++)l.add(I(.12,1.8,.12,Z(4869714,.6,.4),-14+h*4,.9,22,{scale:.3,cast:!1}));l.add(un(6,3,"water",2,.012,16,{rot:[-Math.PI/2,0,0],scale:3,receive:!1})),i.add(l);const g=new _n(2766160,658448,.55);i.add(g),i.add(Hi(70,new R(10,3,16),10135732,.018,55));let v=1;return{id:"basement",root:i,update(h,f){const b=h*.5;let S=.82+Math.sin(b*3.1)*.06+Math.sin(b*11.7)*.03;(Math.sin(h*1.7)>.995||Math.sin(h*.31+2)>.997)&&(S*=.35),v+=(S-v)*Math.min(1,f*30);for(const N of a)N.traverse(A=>{const w=A;w.isPointLight&&(w.intensity=28*v);const D=A;if(D.isMesh){const K=D.material;K&&K.emissive&&K.emissiveIntensity>1&&(K.emissiveIntensity=2.6*v)}})}}}function kg(){const i=Mt(0,0,0,"set:lab"),t=new Me(5150);i.add(ls({w:12,d:10,h:3.4,floor:"concrete",wall:"concretePale",ceil:"concretePale",tile:2.2}));const e=new _n(16777215,9082012,1.4);i.add(e);for(let o=0;o<3;o++){const a=-3.6+o*3.6,c=ra(a,.6,2.4,1.1,.9,13226712);i.add(c);for(let l=0;l<3;l++){const u=a-.7+l*.7;i.add(I(.55,.04,.38,Z(14673642,.35,.6),u,.97,.4,{scale:.3,cast:!1}));for(let d=0;d<5;d++){const p=t.range(.02,.05);i.add(I(p,p*.7,p,"meteorite",u+t.sym(.18),1+p/2,.4+t.sym(.12),{scale:.1,cast:!1}))}}}i.add(I(4.2,2.4,.08,"concretePale",0,1.6,-4.9,{scale:1.2,cast:!1}));for(let o=0;o<7;o++){const a=I(.06,.06,.05,Z(4869714,.9,.2),t.sym(1.6),1.2+t.range(0,1),-4.84,{scale:.1,cast:!1});i.add(a)}const n=Mt(.8,0,-3.4,"scope");n.add(_e(.05,.05,1.2,Z(10134445,.3,.9),0,.6,0,8,{scale:.2})),n.add(I(.34,.18,.5,Z(2764339,.5,.5),0,1.25,0,{scale:.3})),n.add(_e(.09,.09,.06,Ue(12576511,1.2),0,1.25,.28,10,{rot:[Math.PI/2,0,0],scale:.2,cast:!1})),i.add(n);const s=Mt(-3.6,.97,.5,"report");s.add(I(.52,.012,.72,Z(15262936,.95,0),0,0,0,{scale:.3,cast:!1}));for(let o=0;o<11;o++){const a=t.range(.2,.42);s.add(I(a,.006,.02,Z(3815994,.9,0),-.26+a/2,.01,-.3+o*.055,{scale:.1,cast:!1}))}const r=Z(10099226,.8,0);for(let o=0;o<8;o++){const a=o/8*Math.PI*2;s.add(I(.05,.006,.05,r,.15+Math.cos(a)*.09,.012,.22+Math.sin(a)*.09,{scale:.1,cast:!1}))}s.add(I(.12,.006,.12,r,.15,.012,.22,{scale:.1,cast:!1})),i.add(s);for(const o of[-3,3]){const a=Mt(o,0,1.6,"surg");a.add(I(.05,1.1,.05,Z(10134445,.4,.6),0,2.8,0,{scale:.3,cast:!1})),a.add(_e(.45,.55,.12,Z(14673642,.4,.3),0,2.2,0,12,{scale:.4,cast:!1})),a.add(_e(.4,.4,.03,Ue(16777215,2.4),0,2.13,0,12,{scale:.3,cast:!1}));const c=new $o(16777215,240,12,.8,.5,1.5);c.position.set(0,2.15,0),c.target.position.set(0,0,.5),a.add(c,c.target),i.add(a)}return i.add(Hi(40,new R(9,3,8),16777215,.015,77)),{id:"lab",root:i,update(){}}}function Bg(){const i=Mt(0,0,0,"set:review");i.add(ls({w:16,d:11,h:4,floor:"floor",wall:"concreteDark",ceil:"ceilDark",tile:2.4}));const t=Z(2304562,.35,.1);i.add(I(9.6,.1,2.8,t,0,.78,0,{scale:.6})),i.add(I(9.4,.6,.2,t,0,.42,0,{scale:.6})),i.add(I(4.6,.02,1.2,Ue(3043240,.8),0,.84,0,{scale:.5,cast:!1}));for(const o of[-3.4,-1.4,.6,2.6,4.2])i.add(hs(o,-2.1,Math.PI,Mn.slate));for(const o of[-3.4,-1.4,.6,2.6,4.2])i.add(hs(o,2.1,0,Mn.slate));const e=Ml(7.4,3,7324927);e.position.set(0,2.35,-5.28),i.add(e);const n=Mt(0,2.35,-5.16,"bars"),s=new Te({color:10473727,transparent:!0,opacity:.75}),r=new Te({color:4153210,transparent:!0,opacity:.6});for(let o=0;o<5;o++)n.add(I(.5,.2+o*.34,.04,o>=2?s:r,-1.8+o*.9,-1+(.2+o*.34)/2,0,{scale:.3,cast:!1}));i.add(n);for(const o of[-5,0,5])i.add(ia(o,0,{y:3.8,length:1.8,color:13625054,intensity:30,glowColor:15136494}));return i.add(new _n(7373984,2106410,1.2)),i.add(Hi(60,new R(13,3.6,9),12570848,.018,88)),{id:"review",root:i,update(){}}}function zg(){const i=Mt(0,0,0,"set:modelshop"),t=new Me(6100),e=13,n=10,s=3.6;i.add(un(e,n,"floor",0,0,0,{rot:[-Math.PI/2,0,0],scale:2})),i.add(I(e,s,.4,"concreteDark",0,s/2,-n/2-.2,{scale:1.6,cast:!1})),i.add(I(.4,s,n,"concreteDark",-e/2-.2,s/2,0,{scale:1.6,cast:!1})),i.add(I(.4,s,n,"concreteDark",e/2+.2,s/2,0,{scale:1.6,cast:!1})),i.add(un(e,n,"ceilDark",0,s,0,{rot:[Math.PI/2,0,0],scale:1.6,receive:!1}));const r=9.2,o=3,a=1.75,c=Z(1711652,.6,.4),l=.2;i.add(I(r+l*2,l,.2,c,0,a+o/2+l/2,n/2-.05,{scale:.6,cast:!1})),i.add(I(r+l*2,l,.2,c,0,a-o/2-l/2,n/2-.05,{scale:.6,cast:!1})),i.add(I(l,o,.2,c,-r/2-l/2,a,n/2-.05,{scale:.6,cast:!1})),i.add(I(l,o,.2,c,r/2+l/2,a,n/2-.05,{scale:.6,cast:!1})),i.add(I(r,o,.04,Tg(660512,.16),0,a,n/2-.12,{scale:.5,cast:!1}));for(const S of[-r/4,r/4])i.add(I(.1,o,.12,Z(1711652,.6,.4),S,a,n/2-.1,{scale:.4,cast:!1}));i.add(I(r,.12,.14,Z(1711652,.6,.4),0,a,n/2-.1,{scale:.4,cast:!1}));const u=un(70,40,"stars",0,a+2.5,n/2+7,{rot:[0,Math.PI,0],scale:60,receive:!1});u.material.emissiveIntensity=.5,i.add(u);const d=new oe(new si(70,26),new Te({color:1850992,transparent:!0,opacity:.14,blending:De,depthWrite:!1,side:Ie}));d.position.set(0,9.5,n/2+6.9),d.rotation.y=Math.PI,i.add(d);const p=new oe(new si(70,9),new Te({color:2779816,transparent:!0,opacity:.12,blending:De,depthWrite:!1,side:Ie}));p.position.set(0,1.6,n/2+6.95),p.rotation.y=Math.PI,i.add(p),i.add(I(80,1.2,.5,Z(659222,1,0),0,.3,n/2+6.8,{scale:4,cast:!1}));const m=Mt(0,0,n/2+6.4,"distantFlame"),g=new xl(3.6,.45);g.position.y=2.2,g.setPower(0),m.add(g),i.add(m);for(let S=0;S<3;S++){const E=-4.2+S*3.2,N=ra(E,-1,2.2,1.2,.92,2830648);i.add(N),i.add(hs(E,.4,Math.PI,2764339));const A=I(1.2,.04,.9,Z(1975338,.8,0),E,1.12,-1,{scale:.4,rot:[.5,0,0],cast:!1});i.add(A)}const v=Z(2764598,.8,.1);for(let S=0;S<2;S++){const E=1.5+S*.85;i.add(I(9,.06,.5,v,0,E,-n/2+.6,{scale:.6,cast:!1}));for(let N=0;N<8;N++){const A=-4+N*1.15,w=t.range(.3,.62),D=Z(t.pick([9081498,12107976,6976122]),.4,.7);i.add(_e(.05,.05,w,D,A,E+w/2+.03,-n/2+.6,8,{scale:.2,cast:!1})),i.add(I(.16,.02,.16,Z(4870746,.6,.5),A,E+w*.25,-n/2+.6,{scale:.1,cast:!1}))}}const h=new Be(16756823,14,6,2);h.position.set(-4.2,1.4,-.6),i.add(h);const f=new Be(4886752,90,20,2);f.position.set(0,2.4,n/2-.6),i.add(f);const b=new _n(2771568,658706,.7);return i.add(b),i.add(Hi(50,new R(11,3.2,8),10469600,.015,99)),{id:"modelshop",root:i,update(S,E){g.tick(S)}}}function Hg(){const i=Mt(0,0,0,"set:teststand"),t=new Me(7777),e=un(220,220,"floor",0,0,0,{rot:[-Math.PI/2,0,0],scale:14});e.material.color.setHex(4869714),i.add(e),i.add(I(60,.6,60,"concreteDark",0,.3,0,{scale:4,cast:!1}));const n=Mt(0,0,0,"mount");n.add(I(9,1,9,Z(3817544,.7,.3),0,.5,0,{scale:1})),n.add(I(7.5,1.4,7.5,Z(3028026,.6,.4),0,13.2,0,{scale:1}));for(const v of[-1,1])for(const h of[-1,1])n.add(I(.8,13,.8,Z(4870488,.6,.5),v*3,6.5,h*3,{scale:.8}));n.add(_e(3.4,3.9,1.2,Z(3028026,.6,.4),0,14.4,0,16,{scale:1})),i.add(n);const s=Mt(0,13,0,"ship"),r=Z(12174026,.35,.75),o=Z(6976638,.45,.7),a=Z(2776986,.4,.5);s.add(_e(2.4,2.8,7,r,0,6.5,0,14,{scale:1.2})),s.add(_e(2,2.4,6,o,0,13,0,14,{scale:1.2})),s.add(_e(1.5,2,4.5,r,0,18.2,0,12,{scale:1.2})),s.add(_e(.7,1.5,3,a,0,21.9,0,10,{scale:1})),s.add(_e(.15,.7,1.8,r,0,24.3,0,8,{scale:.6}));for(let v=0;v<4;v++){const h=v/4*Math.PI*2,f=I(.5,6,3.2,a,Math.cos(h)*3.2,6,Math.sin(h)*3.2,{scale:1});f.rotation.y=-h,s.add(f)}for(let v=0;v<6;v++){const h=v/6*Math.PI*2,f=v===0?0:1.5;s.add(_e(.55,.85,1.6,Z(3817284,.5,.8),Math.cos(h)*f,2.1,Math.sin(h)*f,10,{scale:.6}))}i.add(s);const c=Mt(8.5,0,0,"gantry"),l=Z(5923692,.6,.6);for(const v of[-1,1])for(const h of[-1,1])c.add(I(.4,44,.4,l,v*1.6,22,h*1.6,{scale:1}));for(let v=2;v<44;v+=2.2)c.add(I(3.6,.18,.18,l,0,v,-1.6,{scale:.6,cast:!1})),c.add(I(3.6,.18,.18,l,0,v,1.6,{scale:.6,cast:!1})),c.add(I(.18,.18,3.6,l,-1.6,v,0,{scale:.6,cast:!1})),c.add(I(.18,.18,3.6,l,1.6,v,0,{scale:.6,cast:!1}));c.add(I(5.5,.5,1.2,l,-3.2,28,0,{scale:.8})),i.add(c);for(const[v,h]of[[-14,-10],[14,-10],[-14,12],[14,12]]){const f=Mt(v,0,h,"mast");f.add(I(.3,9,.3,l,0,4.5,0,{scale:.8})),f.add(I(1.6,.5,.4,Z(2764339,.6,.4),0,9,0,{scale:.5,cast:!1}));for(let S=0;S<3;S++)f.add(I(.34,.34,.06,Ue(16773328,2.2),-.5+S*.5,9,.24,{scale:.2,cast:!1}));const b=new $o(16773328,900,90,.85,.35,1.4);b.position.set(0,9,0),b.target.position.set(-v,16,-h),f.add(b,b.target),i.add(f)}for(let v=-6;v<=6;v++)Math.abs(v)<3||i.add(I(2,.7,.16,"hazard",v*3,.6,13,{scale:.6}));for(let v=0;v<26;v++){const h=t.range(0,Math.PI*2),f=t.range(90,150),b=t.range(14,40);i.add(I(b,t.range(3,10),t.range(10,24),Z(658964,1,0),Math.cos(h)*f,1,Math.sin(h)*f,{scale:8,cast:!1}))}const u=new oe(new is(400,24,16),new Te({map:cs("stars").map,side:ye,color:8952251}));u.material.map=cs("stars").map,i.add(u);const d=new xl(30,4.8);d.position.set(0,15.4,0),d.setPower(0),i.add(d);const p=new Te({color:5941503,transparent:!0,opacity:0,blending:De,depthWrite:!1,side:Ie}),m=new oe(new er(11,28),p);m.rotation.x=-Math.PI/2,m.position.y=.72,m.renderOrder=9,i.add(m);const g=new oe(new er(11,28),p);return g.rotation.x=-Math.PI/2,g.position.y=.74,g.renderOrder=9,i.add(g),i.add(new _n(2767445,658706,.5)),{id:"teststand",root:i,plume:d,update(v){d.tick(v),p.opacity=d.power*.5*(.8+Math.sin(v*9)*.2);const h=1+d.power*(.6+Math.sin(v*5)*.08);g.scale.set(h,h,h)}}}function Gg(){const i=Mt(0,0,0,"set:space"),t=new Me(31415),e=new oe(new is(600,32,20),new Te({map:cs("stars").map,side:ye,color:10465488}));i.add(e);const n=new oe(new is(40,16,12),new Te({color:2771584,transparent:!0,opacity:.3,blending:De,depthWrite:!1}));n.position.set(-260,120,-420),i.add(n);const s=Mt(0,0,0,"fleet");for(let p=0;p<9;p++){const m=1-p*.02,g=Mt(t.sym(7),t.sym(4)-2,-52-p*34,`ship${p}`);g.scale.setScalar(m*1.7);const v=Z(8029326,.5,.7);g.add(I(2.4,1.8,12,v,0,0,0,{scale:1,cast:!1})),g.add(I(1.5,1.3,4,Z(9082014,.5,.7),0,0,7,{scale:.8,cast:!1})),g.add(I(4,.3,5,Z(3817544,.6,.6),0,0,-2,{scale:1,cast:!1}));for(let S=0;S<5;S++)g.add(I(.14,.22,.5,Ue(10475775,2.2),1.2,.35,-3.6+S*2,{scale:.2,cast:!1})),g.add(I(.14,.22,.5,Ue(10475775,2.2),-1.2,.35,-3.6+S*2,{scale:.2,cast:!1}));const h=I(1.8,1.2,.5,Ue(8376575,3.2),0,0,-6.3,{scale:.6,cast:!1});g.add(h);const f=new oe(new ns(.5,7,8,1,!0),new Te({color:5945599,transparent:!0,opacity:.35,blending:De,depthWrite:!1,side:Ie}));f.rotation.x=Math.PI/2,f.position.set(0,0,-10.2),g.add(f);const b=new Be(8376575,6,34,2);b.position.set(0,0,-7),g.add(b),s.add(g)}i.add(s);const r=Mt(0,0,0,"rock");r.scale.setScalar(1.05);const o=new ss({map:fl({size:96,seed:99},5917244),color:16777215,roughness:.6,metalness:.7}),a=new Me(99);for(let p=0;p<14;p++){const m=a.range(.5,1.6),g=I(m,m*a.range(.6,1.2),m*a.range(.6,1.2),o,a.sym(1.2),a.sym(1.2),a.sym(1.2),{scale:.5,cast:!1});g.rotation.set(a.sym(1),a.sym(1),a.sym(1)),r.add(g)}i.add(r);const c=new jo(10467552,4);c.position.set(6,8,10),i.add(c);const l=new jo(4886752,5);l.position.set(-8,-4,-10),i.add(l);const u=new Be(9419007,130,24,2);u.position.set(3.5,3.5,5),i.add(u);const d=new Be(16756838,20,18,2);return d.position.set(-5,-2,-4),i.add(d),i.add(new tg(2240580,1.2)),{id:"space",root:i,update(p,m){r.rotation.y=p*.18,r.rotation.x=Math.sin(p*.23)*.4,r.position.y=Math.sin(p*.4)*.3,s.position.z+=m*.6,s.position.z>46&&(s.position.z-=46)}}}const ar={space:new R(0,0,0),council:new R(320,0,0),corridor:new R(640,0,0),market:new R(960,0,0),workshop:new R(1280,0,0),basement:new R(1600,0,0),lab:new R(1920,0,0),review:new R(2240,0,0),modelshop:new R(2560,0,0),teststand:new R(2880,0,0)};function Wt(i,t,e,n,s=new R){const r=ar[i]??ar.council;return s.set(r.x+t,e,r.z+n)}function Vg(i){const t=(s,r)=>{const o=new Ag(s);return o.root.name=`actor:${r}`,i.add(o.root),o},n={zhang:t({name:"zhang",height:1.83,build:.92,skin:Qe.light,hair:1183758,hairStyle:"short",coat:Mn.navy,coatAccent:3493998,trousers:1711910,shirt:13489885,tie:2240575,epaulettes:!0},"zhang"),old1:t({name:"old1",height:1.74,build:1.12,skin:Qe.tan,hair:13619924,hairStyle:"grey",coat:4871782,coatAccent:5594986,trousers:2764339,shirt:13489885,tie:3818576,glasses:!0,stoop:.14,epaulettes:!0},"old1"),old2:t({name:"old2",height:1.7,build:1.06,skin:Qe.mid,hair:14343648,hairStyle:"grey",coat:4344404,coatAccent:5923950,trousers:2764339,shirt:13489885,tie:3094594,glasses:!0,stoop:.18,epaulettes:!0},"old2"),old3:t({name:"old3",height:1.68,build:1,skin:Qe.pale,hair:13685718,hairStyle:"grey",coat:3489095,coatAccent:5068642,trousers:2764339,shirt:13489885,tie:3818576,glasses:!1,stoop:.1,beard:!0,epaulettes:!0},"old3"),vendor:t({name:"vendor",height:1.7,build:1.15,skin:Qe.tan,hair:2760470,hairStyle:"short",coat:6969914,coatAccent:9075290,trousers:3814442,shirt:10129274},"vendor"),smith:t({name:"smith",height:1.71,build:1.18,skin:Qe.tan,hair:10132122,hairStyle:"grey",coat:4864552,coatAccent:6969914,trousers:3025444,shirt:9077362,stoop:.12,beard:!0},"smith"),investigator:t({name:"investigator",height:1.76,build:.98,skin:Qe.light,hair:1710618,hairStyle:"short",coat:14476520,coatAccent:12898004,trousers:2764854,shirt:16777215,tie:3828362},"investigator"),delegateA:t({name:"delegateA",height:1.72,build:1.1,skin:Qe.mid,hair:2763306,hairStyle:"short",coat:2765632,coatAccent:3820122,trousers:2237995,shirt:13489885,tie:3818576},"delegateA"),delegateB:t({name:"delegateB",height:1.68,build:1.04,skin:Qe.pale,hair:3811866,hairStyle:"bun",coat:3814720,coatAccent:4867408,trousers:2237995,shirt:14212578},"delegateB"),chair:t({name:"chair",height:1.78,build:1,skin:Qe.light,hair:13619924,hairStyle:"grey",coat:2765632,coatAccent:4876938,trousers:2237995,shirt:13489885,tie:3818576,glasses:!0},"chair"),guard:t({name:"guard",height:1.8,build:1.08,skin:Qe.mid,hair:1314829,hairStyle:"short",coat:2041390,coatAccent:3095110,trousers:1711910,shirt:9081498,hat:!0},"guard")};for(const s of Object.keys(n))n[s].root.visible=!1;return n}function Wg(){const i=new Ym,t=new ke(34,16/9,.05,2600),e=new vg,n=new Ug;i.add(n.root);const s={space:Gg(),council:Ig(),corridor:Dg(),market:Ng(),workshop:Fg(),basement:Og(),lab:kg(),review:Bg(),modelshop:zg(),teststand:Hg()};for(const d of Object.keys(s)){const p=s[d];p.root.position.copy(ar[d]),p.root.visible=!1,i.add(p.root)}const r=Vg(i),o=Rg();o.position.set(0,-.055,.03),o.rotation.x=Math.PI/2,o.visible=!1,r.zhang.handR.add(o),i.fog=new Zs(329482,.02),i.background=new ht(329482);const a={bg:new ht(329482),fog:new ht(329482),fogDensity:.02,exposure:1,bloom:.55},c={...a,bg:a.bg.clone(),fog:a.fog.clone()};let l=null;const u={scene:i,camera:t,rig:e,sets:s,actors:r,cast:r,effects:n,fx:n,pistol:o,env:a,time:0,dt:0,activeSet:null,showSet(d){if(l!==d){for(const p of Object.keys(s))s[p].root.visible=p===d;l=d,u.activeSet=d}},plume(){return s.teststand.plume??null},applyEnv(d,p=!1){d.bg!==void 0&&c.bg.copy(d.bg),d.fog!==void 0&&c.fog.copy(d.fog),d.fogDensity!==void 0&&(c.fogDensity=d.fogDensity),d.exposure!==void 0&&(c.exposure=d.exposure),d.bloom!==void 0&&(c.bloom=d.bloom),p&&(a.bg.copy(c.bg),a.fog.copy(c.fog),a.fogDensity=c.fogDensity,a.exposure=c.exposure,a.bloom=c.bloom)},tick(d,p){const m=1-Math.exp(-p*2.2);a.bg.lerp(c.bg,m),a.fog.lerp(c.fog,m),a.fogDensity+=(c.fogDensity-a.fogDensity)*m,a.exposure+=(c.exposure-a.exposure)*m,a.bloom+=(c.bloom-a.bloom)*m,i.background instanceof ht&&i.background.copy(a.bg),i.fog instanceof Zs&&(i.fog.color.copy(a.fog),i.fog.density=a.fogDensity);for(const g of Object.keys(s))s[g].root.visible&&s[g].update?.(d,p);for(const g of Object.keys(r))r[g].update(d,p);n.update(d,p),e.update(t,d,p)}};return u}const oa=[{id:"v01",kind:"dialogue",speaker:"老航天甲",text:"工质驱动是唯一现实的路。它成熟、稳妥，明天就能上马。",delivery:"沉稳、不容置疑，像在宣读一份早已写好的结论",start:21.5,end:28.6},{id:"v02",kind:"dialogue",speaker:"老航天乙",text:"把工质驱动做到极致，人类就有机会。",delivery:"恳切，带着长者的耐心",start:29.6,end:36.4},{id:"v03",kind:"narration",speaker:"旁白",text:"太空军内部的争论，持续了三年。",delivery:"冷静、克制，几乎是档案的语气",start:38,end:44.4},{id:"v04",kind:"voiceover",speaker:"章北海（内心）",text:"工质驱动的舰队，在黑暗森林里，连一次真正的加速都撑不过去。",delivery:"极轻，几乎不动嘴唇；每个字都想清楚了才落下",start:46.6,end:55.4},{id:"v05",kind:"voiceover",speaker:"章北海（内心）",text:"要改变路线，就必须改变决定路线的人。",delivery:"平静得可怕，没有一丝犹豫",start:58.6,end:66},{id:"v06",kind:"dialogue",speaker:"古董商",text:"这块阿勒泰陨铁，压手。您要是喜欢，就当标本带走。",delivery:"市井、随意，完全不知道自己在卖什么",start:72.6,end:80.2},{id:"v07",kind:"voiceover",speaker:"章北海（内心）",text:"陨铁软、脆，密度高。",delivery:"像在核对参数，不带情绪",start:86,end:91.6},{id:"v08",kind:"dialogue",speaker:"章北海",text:"要一副子弹。",delivery:"简短，礼数周全，不容追问",start:99,end:104.4},{id:"v09",kind:"dialogue",speaker:"老工匠",text:"打什么？",delivery:"手上不停，只抬眼看了他一秒",start:105.6,end:109.8},{id:"v10",kind:"dialogue",speaker:"章北海",text:"人。",delivery:"一个字，像把刀收回鞘里",start:110.6,end:114.4},{id:"v11",kind:"dialogue",speaker:"老工匠",text:"谁？",delivery:"声音更低，带着一点了然",start:115.6,end:120.4},{id:"v12",kind:"dialogue",speaker:"章北海",text:"……您不必知道。",delivery:"温和，甚至带着歉意",start:121.6,end:127.2},{id:"v13",kind:"narration",speaker:"旁白",text:"弹芯包一层薄铜被甲，出膛即剥落，不带膛线；碎在人体里，和陨石雨的残片无法区分。",delivery:"技术档案般的平稳，最后半句稍作停顿",start:128.6,end:136.2},{id:"v14",kind:"dialogue",speaker:"老航天丙",text:"下一次评审，我把模型再算一遍。",delivery:"闲聊，边走边说",start:138.6,end:145},{id:"v15",kind:"dialogue",speaker:"老航天甲",text:"灯又坏了。这地方，越来越像坟墓。",delivery:"笑了一下，自己也不信这句玩笑",start:146,end:152.6},{id:"v16",kind:"dialogue",speaker:"老航天乙",text:"老章最近话很少。",delivery:"随口提起，没有别的意思",start:154,end:159.8},{id:"v17",kind:"dialogue",speaker:"老航天甲",text:"他一向如此。",delivery:"漫不经心，替同伴把话说完",start:160.8,end:165.4},{id:"v18",kind:"voiceover",speaker:"章北海（内心）",text:"三声。够了。",delivery:"事后才浮上来的念头，极轻，带着耳鸣",start:190,end:196},{id:"v19",kind:"dialogue",speaker:"调查员",text:"没有膛线，没有可追溯的弹头。体内是铁镍碎片——成分与陨石完全一致。一起罕见的陨石雨坠落事故。",delivery:"照本宣科，越读越像结论",start:200.6,end:212},{id:"v20",kind:"narration",speaker:"旁白",text:"报告很短。没有人怀疑太空军内部，也没有人怀疑章北海。",delivery:"平直，不带评判",start:214,end:220},{id:"v21",kind:"dialogue",speaker:"评审主持",text:"无工质聚变辐射驱动方案——通过。",delivery:"会议主持人的标准腔调",start:230,end:235.8},{id:"v22",kind:"dialogue",speaker:"评审席",text:"没有人知道，该感谢谁。",delivery:"压低的声音，不是问题，是叹息",start:238,end:244},{id:"v23",kind:"voiceover",speaker:"章北海（内心）",text:"我知道，我成了一个杀人的人。",delivery:"独自面对玻璃时，才允许自己承认",start:248.6,end:256},{id:"v24",kind:"voiceover",speaker:"章北海（内心）",text:"我忘不掉他们谈笑的样子，也忘不掉枪声在墙上的回响。",delivery:"记忆闪回时的低语",start:262,end:270.2},{id:"v25",kind:"voiceover",speaker:"章北海（内心）",text:"可如果人类还能在黑暗森林里活下去——",delivery:"第一次出现一点温度，随即收住",start:278,end:286},{id:"v28",kind:"broadcast",speaker:"试验场广播",text:"各系统注意，聚变辐射驱动一号机，点火倒计时三十秒。",delivery:"经过公共广播的压缩与回声，机械、克制",start:292,end:298.4},{id:"v29",kind:"radio",speaker:"通讯",text:"遥测正常。磁场约束稳定。",delivery:"无线电里的短促确认，带一点电流噪声",start:300,end:305},{id:"v26",kind:"voiceover",speaker:"章北海（内心）",text:"也许，就是因为这个夜晚。",delivery:"几乎是耳语，被推进器的轰鸣吞掉一半",start:314,end:322},{id:"v27",kind:"narration",speaker:"旁白",text:"危机纪元第四年，人类选择了更快的飞船。",delivery:"收束全片的旁白，平静，留白",start:330,end:338.4}];function Xg(i){return oa.find(t=>i>=t.start&&i<t.end)}function qg(i){return`【${i.speaker}】${i.text}`}function Yg(){const i=[],t=new Set;for(const n of oa)t.has(n.id)&&i.push(`duplicate cue id ${n.id}`),t.add(n.id),n.end>n.start||i.push(`${n.id}: end must be after start`),n.start<0&&i.push(`${n.id}: negative start`),n.text.trim()||i.push(`${n.id}: empty text`),n.speaker.trim()||i.push(`${n.id}: empty speaker`);const e=[...oa].sort((n,s)=>n.start-s.start);for(let n=1;n<e.length;n++)e[n].start<e[n-1].end-.001&&i.push(`overlap: ${e[n-1].id} (${e[n-1].end}) -> ${e[n].id} (${e[n].start})`);return i}const ie={space:{bg:new ht(131850),fog:new ht(131850),fogDensity:.0011,exposure:.95,bloom:.8},council:{bg:new ht(593171),fog:new ht(856859),fogDensity:.02,exposure:1.08,bloom:.5},corridor:{bg:new ht(527120),fog:new ht(725015),fogDensity:.03,exposure:1,bloom:.5},market:{bg:new ht(3811864),fog:new ht(4863264),fogDensity:.016,exposure:1.06,bloom:.62},workshop:{bg:new ht(854277),fog:new ht(1708554),fogDensity:.032,exposure:1.14,bloom:.72},rangeExt:{bg:new ht(527380),fog:new ht(988704),fogDensity:.015,exposure:.96,bloom:.5},rangeIn:{bg:new ht(329482),fog:new ht(658705),fogDensity:.034,exposure:1,bloom:.5},lab:{bg:new ht(1119772),fog:new ht(1778216),fogDensity:.022,exposure:1.06,bloom:.45},review:{bg:new ht(593171),fog:new ht(856859),fogDensity:.02,exposure:1.05,bloom:.5},modelshop:{bg:new ht(263949),fog:new ht(593688),fogDensity:.02,exposure:1,bloom:.62},teststand:{bg:new ht(263692),fog:new ht(660512),fogDensity:.005,exposure:1,bloom:1.15}};function Sl(i,t){const e=ar[i];return t.map(([n,s,r,o,a])=>mg(n,e.x+s,r,e.z+o,a))}function St(i,t,e,n,s,r){const o=Wt(t,e,n,s);i.setPosition(o.x,o.y,o.z),i.setYaw(r),i.root.visible=!0}function le(i){const t=i.cast;for(const e of Object.keys(t)){const n=t[e];n.root.visible=!1,n.reset(),n.fallAngle=0,n.fallSpin=0,n.fallDrop=0}i.pistol.visible=!1}function us(i){i.setPose({hipLX:-1.28,kneeLX:1.5,hipRX:-1.28,kneeRX:1.5,torsoX:.09})}function cr(i,t,e=1){const n=vn(t);i.fallAngle=-n*Math.PI*.47,i.fallDrop=-n*.14,i.fallSpin=e*n*.45}function lr(i){i.setPose({shoulderLX:-.42,elbowLX:1.3,shoulderRX:-.42,elbowRX:1.3,torsoX:.05})}const $g=new R;function Kg(i,t,e,n,s){return Wt(t,e,n,s,$g)}const aa=[{id:"p1",start:0,end:6,set:"space",note:"陨石在星海里缓缓翻滚 / the stone turns in the dark",env:ie.space,pos:[[0,2,.8,8,Jo],[6,.7,.1,5.4,Tt]],look:[[0,0,0,0],[6,0,0,0]],fov:[[0,34],[6,36]],handheld:0},{id:"p2",start:6,end:13,set:"space",note:"片名 / main title",env:ie.space,pos:[[6,.9,.1,6.2,Tt],[13,1.4,.5,7,Tt]],look:[[6,0,0,0],[13,0,0,0]],fov:[[6,36],[13,38]],handheld:0},{id:"p3",start:13,end:20,set:"space",note:"三体舰队爬过群星 / the fleet crawls across the stars",env:ie.space,pos:[[13,2.2,1.2,-24,Tt],[20,.4,-.6,-50,Jo]],look:[[13,0,0,-150],[20,0,2,-190]],fov:[[13,40],[20,44]],handheld:.02},{id:"a1",start:20,end:34,set:"council",note:"评审会 · 全景 / the review, wide",env:ie.council,pos:[[20,2.6,1.05,3.9,Tt],[34,1.6,1.25,3,Tt]],look:[[20,-.3,1.3,-.9],[34,-.2,1.3,-.9]],fov:[[20,36],[34,33]],handheld:.045,act(i,t){le(i);const{old1:e,old2:n,old3:s,zhang:r}=i.cast;St(e,"council",-2.6,-.42,-1.15,.06),St(n,"council",0,-.42,-1.15,-.03),St(s,"council",2.6,-.42,-1.15,.03),St(r,"council",.15,-.42,1.2,Math.PI);for(const a of[e,n,s])us(a);lr(r);const o=Math.sin(i.time*2.2);e.setPose({shoulderRX:-.55+o*.15,elbowRX:.9+o*.25,neckY:-.12,torsoY:-.08}),n.setPose({neckY:.12,neckX:.05}),s.setPose({neckY:-.06}),r.lookAtWorld(Wt("council",t>.8?-.2:-.5,1.4,-1.1))}},{id:"a2",start:34,end:46,set:"council",note:"老航天乙 / the second old man",env:ie.council,pos:[[34,1.8,1.35,1.7,Tt],[46,.9,1.3,1,Tt]],look:[[34,.2,1.32,-1.1],[46,.6,1.3,-1.1]],fov:[[34,31],[46,28]],handheld:.05,act(i,t){le(i);const{old1:e,old2:n,old3:s,zhang:r}=i.cast;St(e,"council",-2.6,-.42,-1.15,.08),St(n,"council",0,-.42,-1.15,-.02),St(s,"council",2.6,-.42,-1.15,.05),St(r,"council",.15,-.42,1.2,Math.PI);for(const a of[e,n,s])us(a);lr(r);const o=Math.sin(i.time*2.6);n.setPose({shoulderRX:-.5+o*.12,elbowRX:1+o*.2,neckY:.1}),e.setPose({neckY:-.1,neckX:.04}),s.setPose({neckY:-.05}),r.lookAtWorld(Wt("council",0,1.4,-1.1))}},{id:"a3",start:46,end:58,set:"council",note:"章北海 · 沉默 / Zhang, silent",env:ie.council,pos:[[46,1.15,1.52,2.7,Tt],[58,.5,1.46,2.15,Tt]],look:[[46,.12,1.5,1.15],[58,.08,1.44,1.15]],fov:[[46,28],[58,26]],handheld:.035,act(i,t){le(i);const{zhang:e,old1:n,old2:s,old3:r}=i.cast;St(e,"council",.15,-.42,1.2,Math.PI),us(e),lr(e),St(n,"council",-2.6,-.42,-1.15,.06),St(s,"council",0,-.42,-1.15,0),St(r,"council",2.6,-.42,-1.15,0);for(const o of[n,s,r])us(o);e.lookAtWorld(Wt("council",-.3+t*.5,1.42,-1.1)),e.setPose({neckX:.02})}},{id:"a4",start:58,end:70,set:"corridor",note:"走廊 · 敬礼 / the salute",env:ie.corridor,pos:[[58,0,1.62,11,Tt],[70,-.35,1.58,14.2,Tt]],look:[[58,0,1.5,2],[70,0,1.5,4.5]],fov:[[58,36],[70,34]],handheld:.055,act(i,t){le(i);const{old1:e,old2:n,old3:s,zhang:r}=i.cast,a=-8.5+(i.time-58)*1.02;St(e,"corridor",-.55,0,a,0),St(n,"corridor",.05,0,a-1.1,0),St(s,"corridor",.6,0,a-2.2,0);for(const l of[e,n,s])l.startWalk(1);St(r,"corridor",-1.15,0,1.4,Math.PI);const c=t>.12&&t<.86;r.salute(c?1:0),r.lookAtWorld(Wt("corridor",.05,1.45,a-1.1),.85),t>.9&&r.setPose({neckY:.55,torsoY:.12})}},{id:"b1",start:70,end:82,set:"market",note:"古玩市场 · 阿勒泰陨铁 / the market",env:ie.market,pos:[[70,2.6,1.55,-.1,Tt],[82,1.55,1.35,-.95,Tt]],look:[[70,-.1,1.2,-2.2],[82,-.1,1.1,-2.7]],fov:[[70,34],[82,30]],handheld:.06,act(i,t){le(i);const{vendor:e,zhang:n}=i.cast;St(e,"market",0,0,-3.5,0),St(n,"market",.3,0,-1.3,Math.PI),e.setPose({shoulderRX:-.5+Math.sin(i.time*2.4)*.15,elbowRX:.9,neckX:.1,neckY:-.05}),n.lookAtWorld(Wt("market",0,1,-2.3),.9),n.setPose({shoulderRX:-.7,elbowRX:.8,torsoX:.08}),t>.55&&n.setPose({shoulderRX:-.9,elbowRX:1})}},{id:"b2",start:82,end:94,set:"market",note:"称重 / weighing the iron",env:ie.market,pos:[[82,.75,1.28,-1.45,Tt],[94,.5,1.02,-1.7,Tt]],look:[[82,0,.98,-2.1],[94,0,1.06,-2.1]],fov:[[82,27],[94,24]],handheld:.035,act(i,t){le(i);const{zhang:e}=i.cast;St(e,"market",.3,0,-1.3,Math.PI),e.setPose({shoulderRX:-1,elbowRX:.9,torsoX:.14}),e.lookAtWorld(Wt("market",0,1,-2.1),1);const n=i.sets.market.root.getObjectByName("meteorSample");if(n){const s=ln(.42,.62,t)*.34;n.position.y=.95+s,n.rotation.y=i.time*.5}}},{id:"b3",start:94,end:110,set:"workshop",note:"老工匠 · 车床 / the gunsmith",env:ie.workshop,pos:[[94,-1,1.55,2.7,Tt],[110,-1.5,1.45,2,Tt]],look:[[94,-2.6,1.3,-1.3],[110,-2.7,1.25,-1.3]],fov:[[94,33],[110,29]],handheld:.05,act(i,t){le(i);const{smith:e,zhang:n}=i.cast;St(e,"workshop",-2.35,0,-1.6,-1.9),St(n,"workshop",-3,0,.95,-.35),e.setPose({shoulderRX:-1.15,elbowRX:.75,neckX:.2,neckY:-.2,torsoX:.1}),n.setPose({shoulderLX:-.15,shoulderRX:-.15,torsoX:.02}),n.lookAtWorld(Wt("workshop",-2.35,1.3,-1.6),.9),t>.42&&e.setPose({neckY:-.05,neckX:.28}),t>.6&&e.setPose({neckY:.1,neckX:.24}),t>.06&&t<.9&&Math.floor(i.time*14)!==Math.floor((i.time-i.dt)*14)&&i.fx.sparkBurst(Wt("workshop",-3.4,1.25,-1),14,16761466,2.6)}},{id:"b4",start:110,end:124,set:"workshop",note:"弹芯 / the cores",env:ie.workshop,pos:[[110,-2.9,1.22,1.55,Tt],[124,-3.25,1.02,1.15,Tt]],look:[[110,-3.4,.98,.9],[124,-3.4,.97,.9]],fov:[[110,26],[124,23]],handheld:.03,act(i){le(i);const{smith:t,zhang:e}=i.cast;St(t,"workshop",-2.35,0,-1.6,-1.9),St(e,"workshop",-3,0,.95,-.35),t.setPose({shoulderRX:-1.1,elbowRX:.8,neckX:.24,neckY:-.1}),e.setPose({shoulderLX:-.12,shoulderRX:-.12,torsoX:.02}),e.lookAtWorld(Wt("workshop",-3.4,.98,.9),.8);const n=i.sets.workshop.root.getObjectByName("meteorBlock");n&&(n.rotation.y=i.time*.2),Math.floor(i.time*8)!==Math.floor((i.time-i.dt)*8)&&i.fx.sparkBurst(Wt("workshop",-3.4,1.25,-1),8,16761466,2)}},{id:"b5",start:124,end:136,set:"workshop",note:"交易完成 / done",env:ie.workshop,pos:[[124,-.8,1.65,2.4,Tt],[136,.6,1.55,3.2,Tt]],look:[[124,-2.8,1.2,-1.2],[136,-2.6,1.15,-1.4]],fov:[[124,32],[136,36]],handheld:.045,act(i,t){le(i);const{smith:e,zhang:n}=i.cast;St(e,"workshop",-2.35,0,-1.6,-1.9),St(n,"workshop",-3,0,.95,-.35),e.setPose({shoulderRX:-1.15,elbowRX:.7,neckX:.3,neckY:-.05}),n.setPose({shoulderLX:-.1,shoulderRX:-.1}),n.lookAtWorld(Wt("workshop",-2.35,1.3,-1.6),.7),t>.7&&(n.setPose({neckY:-.5}),n.lookAtWorld(Wt("workshop",-1,1.4,3),.8))}},{id:"c1",start:136,end:150,set:"basement",note:"城郊 · 地下室靶场 / the range, outside",env:ie.rangeExt,pos:[[136,3.2,1.6,25,Tt],[150,1,1.5,19.5,Tt]],look:[[136,0,2.1,11.5],[150,0,1.85,11.8]],fov:[[136,34],[150,32]],handheld:.06,act(i,t){le(i);const{old1:e,old2:n,old3:s}=i.cast,r=ln(.05,.62,t),o=$t(7.5,.8,r),a=$t(15.5,12.3,r);St(e,"basement",o,0,a,-Math.PI*.75),St(n,"basement",o-.8,0,a+.6,-Math.PI*.75),St(s,"basement",o-1.6,0,a+1.2,-Math.PI*.75);for(const c of[e,n,s])r<.98&&c.startWalk(1);if(r>=.98){for(const c of[e,n,s])c.stopWalk();e.setPose({neckY:.1})}}},{id:"c2",start:150,end:164,set:"basement",note:"靶场 · 每周一次 / their weekly practice",env:ie.rangeIn,pos:[[150,1.6,1.5,6.8,Tt],[164,-1.6,1.4,6,Tt]],look:[[150,0,1.3,3.4],[164,0,1.25,3.6]],fov:[[150,36],[164,33]],handheld:.065,act(i,t){le(i);const{old1:e,old2:n,old3:s}=i.cast,r=$t(8.5,3.6,ln(0,.55,t));St(e,"basement",-3.4,0,r,Math.PI),St(n,"basement",0,0,r,Math.PI),St(s,"basement",3.4,0,r,Math.PI);for(const a of[e,n,s])t<.55?a.startWalk(1):a.stopWalk();t>.55&&(e.setPose({shoulderRX:-.9,elbowRX:.7,neckX:.15}),n.setPose({shoulderRX:-.8,elbowRX:.8,neckX:.12}),s.setPose({neckY:-.1,neckX:.1}));const{zhang:o}=i.cast;St(o,"basement",-4.7,0,8,Math.PI*.92),o.setPose({shoulderLX:-.1,shoulderRX:-.1,torsoX:.05}),o.lookAtWorld(Wt("basement",0,1.35,3.6),.9)}},{id:"c3",start:164,end:176,set:"basement",note:"阴影里 / out of the shadow",env:ie.rangeIn,pos:[[164,-4.05,1.55,7.6,Tt],[170,-3.5,1.45,7.15,Tt],[176,-1.9,1.65,7.6,Tt]],look:[[164,-3.2,1.55,7.2],[170,-3.2,1.5,7.2],[176,0,1.35,3.6]],fov:[[164,27],[170,25],[176,30]],handheld:.04,act(i,t){le(i);const{old1:e,old2:n,old3:s,zhang:r}=i.cast;St(e,"basement",-3.4,0,3.6,Math.PI),St(n,"basement",0,0,3.6,Math.PI),St(s,"basement",3.4,0,3.6,Math.PI),e.setPose({shoulderRX:-.85,elbowRX:.75,neckX:.15}),n.setPose({shoulderRX:-.8,elbowRX:.8,neckX:.12}),s.setPose({neckY:-.1,neckX:.1}),St(r,"basement",-3.2,0,6.6,Math.PI),i.pistol.visible=!0;const o=ln(.45,.92,t);r.aim(o),r.lookAtWorld(Wt("basement",0,1.3,3.6),.8),t<.42&&r.setPose({shoulderRX:-.2,elbowRX:.3,neckY:.1})}},{id:"c4",start:176,end:186,set:"basement",note:"三声 / three shots",env:ie.rangeIn,pos:[[176,-1.9,1.6,7.8,Tt],[186,-.6,1.35,6.4,Tt]],look:[[176,0,1.3,3.6],[186,0,.85,2.4]],fov:[[176,30],[186,28]],handheld:.03,act(i,t){le(i);const{old1:e,old2:n,old3:s,zhang:r}=i.cast;St(e,"basement",-3.4,0,3.6,Math.PI),St(n,"basement",0,0,3.6,Math.PI),St(s,"basement",3.4,0,3.6,Math.PI),St(r,"basement",-3.2,0,6.6,Math.PI),i.pistol.visible=!0,r.aim(1,.02),r.lookAtWorld(Wt("basement",0,1.3,3.6),.6);const o=[177,178.2,179.4],a=[e,n,s],c=[1,-1,1],l=Kg(i,"basement",-3.2,1.42,5.8);for(let u=0;u<3;u++){const d=i.time-o[u],p=vn((d-.04)/.8);cr(a[u],p,c[u])}for(let u=0;u<3;u++)i.time>=o[u]&&i.time<o[u]+i.dt+.001&&!ds[u]&&(ds[u]=!0,i.fx.flash(l,16767392,90,9),i.fx.sparkBurst(l,26,16757847,3.4),i.fx.smoke(l,5,10133670,.5),i.fx.debris(l,3,13081162,1.4),i.rig.punch(1.1));i.time>o[2]+2.5&&t>.6&&r.setPose({shoulderRX:-.5,elbowRX:1.1,torsoX:.08,neckX:.12})}},{id:"c5",start:186,end:198,set:"basement",note:"余响 / the ringing",env:ie.rangeIn,pos:[[186,-1.2,.7,5.4,Tt],[198,1.6,1.35,3.4,Tt]],look:[[186,0,.5,3.4],[198,0,.6,2.2]],fov:[[186,30],[198,32]],handheld:.05,act(i,t){le(i);const{old1:e,old2:n,old3:s,zhang:r}=i.cast;St(e,"basement",-3.4,0,3.6,Math.PI),St(n,"basement",0,0,3.6,Math.PI),St(s,"basement",3.4,0,3.6,Math.PI),cr(e,1,1),cr(n,1,-1),cr(s,1,1),St(r,"basement",-3.2,0,6.6,Math.PI),i.pistol.visible=t<.72,r.setPose({shoulderRX:$t(-.6,-.05,ln(.2,.8,t)),elbowRX:.9,torsoX:.05}),r.lookAtWorld(Wt("basement",0,.6,3.6),.7),Math.floor(i.time*3)!==Math.floor((i.time-i.dt)*3)&&(i.fx.smoke(Wt("basement",-3.2,1.4,5.8),2,9080982,.4),i.fx.smoke(Wt("basement",0,.4,3.4),1,9080982,.3)),t>.85&&r.setPose({neckY:.5,torsoY:.15})}},{id:"d1",start:198,end:216,set:"lab",note:"法医 · 铁镍碎片 / the fragments",env:ie.lab,pos:[[198,-4.6,1.55,2.8,Tt],[216,3.4,1.42,2.1,Tt]],look:[[198,-3.6,1,.6],[216,3.6,1,.6]],fov:[[198,32],[216,30]],handheld:.035,act(i,t){le(i);const{investigator:e}=i.cast,n=$t(-3.6,3.4,ln(.05,.95,t));St(e,"lab",n,0,-.5,.15),e.setPose({shoulderRX:-1.1,elbowRX:1.05,neckX:.32,torsoX:.12}),e.lookAtWorld(Wt("lab",n,.98,.5),.9)}},{id:"d2",start:216,end:228,set:"lab",note:"报告 / the report",env:ie.lab,pos:[[216,-3.15,1.28,1.35,Tt],[228,-3.55,1.1,.95,Tt]],look:[[216,-3.6,.99,.5],[228,-3.6,.99,.5]],fov:[[216,26],[228,23]],handheld:.03,act(i){le(i);const{investigator:t}=i.cast;St(t,"lab",-3.6,0,-1,.1),t.setPose({shoulderRX:-1.2,elbowRX:1,neckX:.4,torsoX:.16}),t.lookAtWorld(Wt("lab",-3.6,.99,.5),1)}},{id:"d3",start:228,end:240,set:"review",note:"评审 · 通过 / approved",env:ie.review,pos:[[228,6.5,1.8,4,Tt],[240,-5.5,1.7,4.2,Tt]],look:[[228,0,1.4,0],[240,0,1.4,0]],fov:[[228,34],[240,34]],handheld:.04,act(i,t){le(i);const{chair:e,delegateA:n,delegateB:s,zhang:r}=i.cast;St(e,"review",-1.4,-.42,-1.15,.1),St(n,"review",1.4,-.42,-1.15,-.05),St(s,"review",3.6,-.42,-1.15,.05),St(r,"review",.6,-.42,1.15,Math.PI);for(const a of[e,n,s,r])us(a);e.setPose({shoulderRX:-.7,elbowRX:.9,neckY:-.1});const o=ln(.12,.4,t);n.setPose({shoulderRX:-1.2*o,elbowRX:1.3*o}),s.setPose({shoulderRX:-1.1*o,elbowRX:1.2*o}),lr(r),r.lookAtWorld(Wt("review",-1.4,1.4,-1.1),.5)}},{id:"d4",start:240,end:246,set:"corridor",note:"走廊 · 灯灭 / the lights go out",env:ie.corridor,pos:[[240,0,1.62,9,Tt],[246,0,1.6,4.5,Tt]],look:[[240,0,1.45,1],[246,0,1.4,-6]],fov:[[240,36],[246,36]],handheld:.05,act(i){le(i);const{zhang:t}=i.cast;St(t,"corridor",0,0,-1,Math.PI),t.startWalk(1);const e=9-(i.time-240)*2.6;i.sets.corridor.root.traverse(n=>{const s=n;s.isPointLight&&(s.intensity=s.position.z<e?0:2.2)})}},{id:"e1",start:246,end:262,set:"modelshop",note:"模型车间 · 夜 / the model shop at night",env:ie.modelshop,pos:[[246,0,1.5,-1.6,Tt],[262,.35,1.6,1.1,Tt]],look:[[246,0,1.5,3.4],[262,0,1.55,4]],fov:[[246,34],[262,31]],handheld:.03,act(i){le(i);const{zhang:t}=i.cast;St(t,"modelshop",0,0,2.6,0),t.setPose({shoulderLX:.05,shoulderRX:.05,torsoX:-.02});const n=i.sets.modelshop.root.getObjectByName("distantFlame")?.children.find(s=>s instanceof gn&&s.name!=="distantFlame");n?.setPower&&n.setPower(0)}},{id:"e2",start:262,end:276,set:"modelshop",note:"回忆 · 闪回 / memory",env:ie.modelshop,pos:[[262,-.95,1.6,1.55,Tt],[276,.75,1.52,1.95,Tt]],look:[[262,0,1.62,3],[276,0,1.6,3.2]],fov:[[262,28],[276,26]],handheld:.03,act(i){le(i);const{zhang:t,old1:e,old2:n,old3:s}=i.cast;St(t,"modelshop",0,0,2.6,0),t.setPose({shoulderLX:.05,shoulderRX:.05});const r=[264,266.6,269.2,271.8];let o=!1;for(let a=0;a<r.length;a++){const c=r[a];i.time>=c&&i.time<c+.24&&(o=!0,la<a+1&&(la=a+1,i.fx.flash(Wt("modelshop",0,1.9,4.4),12574975,26,7)))}o&&(St(e,"modelshop",-1.2,0,3.7,Math.PI),St(n,"modelshop",0,0,3.7,Math.PI),St(s,"modelshop",1.2,0,3.7,Math.PI),e.setPose({shoulderRX:-.5,elbowRX:.8,neckY:-.1}),n.setPose({shoulderRX:-.5,elbowRX:.8,neckY:.1}),s.setPose({neckY:0})),i.time>=273.4&&i.time<273.7&&!ha&&(ha=!0,i.fx.flash(Wt("modelshop",0,1.5,3.2),16767392,40,8),i.fx.sparkBurst(Wt("modelshop",0,1.5,3.2),20,16757847,2.6))}},{id:"e3",start:276,end:290,set:"modelshop",note:"窗前 / at the window",env:ie.modelshop,pos:[[276,1.4,2.2,1,Tt],[290,4.6,2.7,-1,Tt]],look:[[276,0,1.6,4],[290,0,1.8,4.5]],fov:[[276,34],[290,36]],handheld:.03,act(i,t){le(i);const{zhang:e}=i.cast;St(e,"modelshop",0,0,2.6,0),e.setPose({shoulderLX:.05,shoulderRX:.05,neckX:.04});const s=i.sets.modelshop.root.getObjectByName("distantFlame")?.children.find(r=>r instanceof gn);s?.setPower&&s.setPower(ln(.7,1,t)*.22)}},{id:"e4",start:290,end:314,set:"teststand",note:"点火 / ignition",env:ie.teststand,pos:[[290,30,7,42,Tt],[300,20,5,28,Tt],[306,15,4.5,21,Jo],[314,54,34,78,Tt]],look:[[290,0,12,0],[300,0,14,0],[306,0,15,0],[314,0,22,0]],fov:[[290,38],[306,42],[314,44]],handheld:.02,act(i,t){le(i);const e=i.plume();if(!e)return;const n=i.time;if(n<305.6)e.setPower(0);else{const r=ln(305.6,309,n);e.setPower(r),ca||(ca=!0,i.fx.flash(Wt("teststand",0,7,0),12576511,600,2.2),i.fx.sparkBurst(Wt("teststand",0,6,0),120,10473727,14),i.fx.smoke(Wt("teststand",0,3,0),40,12570848,3.5),i.fx.debris(Wt("teststand",0,3,0),40,9080982,5),i.rig.punch(2.6)),n>309&&Math.floor(n*6)!==Math.floor((n-i.dt)*6)&&(i.fx.sparkBurst(Wt("teststand",0,5,0),26,9423103,9),i.fx.smoke(Wt("teststand",0,2,0),6,13162728,2.2)),n>309&&i.rig.punch(.35)}const s=i.sets.teststand.root.getObjectByName("ship");s&&(s.position.x=Math.sin(n*60)*.02*ln(305.6,308,n))}},{id:"e5",start:314,end:326,set:"modelshop",note:"回望 / looking back",env:ie.modelshop,pos:[[314,-3,1.2,.6,Tt],[326,-2,1.55,-.6,Tt]],look:[[314,0,1.7,4.5],[326,0,1.8,4.5]],fov:[[314,36],[326,38]],handheld:.025,act(i,t){le(i);const{zhang:e}=i.cast;St(e,"modelshop",0,0,2.6,0),e.setPose({shoulderLX:.05,shoulderRX:.05,neckX:-.04});const s=i.sets.modelshop.root.getObjectByName("distantFlame")?.children.find(r=>r instanceof gn);s?.setPower&&s.setPower(.6+ln(0,1,t)*.5)}},{id:"z1",start:326,end:344,set:"space",note:"片尾 / credits",env:ie.space,pos:[[326,2.4,1.2,8,Tt],[344,-1.4,.4,3.6,Tt]],look:[[326,0,0,0],[344,0,0,0]],fov:[[326,40],[344,46]],handheld:.01}],ds=[!1,!1,!1];let ca=!1,la=0,ha=!1;function jg(){ds[0]=ds[1]=ds[2]=!1,ca=!1,la=0,ha=!1}let yl="";const hr=aa.map(i=>{const t=Sl(i.set,i.pos),e=Sl(i.set,i.look),n=i.fov?.map(([s,r,o])=>gg(s,r,o));return{id:i.id,start:i.start,end:i.end,set:i.set,note:i.note,update(s,r){i.env&&yl!==i.id&&(yl=i.id,s.applyEnv(i.env,!0)),ul(t,s.time,s.rig.pos),ul(e,s.time,s.rig.target),n&&(s.rig.fov=_g(n,s.time)),s.rig.handheld=i.handheld??.03,i.act?.(s,r)}}}),bl=aa[aa.length-1].end,Zg=[{start:2.6,end:8.2,main:"北 海 · 陨 石",sub:"危机纪元第四年"},{start:8.6,end:13.4,main:"",sub:`三体舰队还有四百年到达
但人类选择了太慢的飞船`},{start:14,end:19.4,main:"",sub:"太空军 · 推进方式评审"},{start:327,end:343,main:"北 海 · 陨 石",sub:`改编自《三体Ⅱ · 黑暗森林》
程序化体素影像 · Three.js
谨以此片纪念那些不被记住的夜晚`}];function Jg(i){return Zg.find(t=>i>=t.start&&i<t.end)}const Xn=[{id:"s01",time:0,action:"env",env:"vacuum"},{id:"s02",time:.2,action:"rumble",gain:.14,dur:22},{id:"s03",time:.6,action:"riser",dur:6,gain:.1},{id:"s04",time:12.6,action:"riser",dur:6.5,gain:.16},{id:"s05",time:14,action:"tone",freq:48,dur:6,gain:.06},{id:"s10",time:20,action:"env",env:"room"},{id:"s11",time:20.1,action:"loop",sample:"computerNoise_000",key:"councilHum",gain:.11,rate:.55},{id:"s12",time:21.4,action:"click",gain:.18},{id:"s13",time:29.2,action:"click",gain:.14},{id:"s14",time:36.6,action:"click",gain:.14},{id:"s15",time:46,action:"loop",sample:"computerNoise_001",key:"holoHum",gain:.08,rate:1.35},{id:"s16",time:57.6,action:"stopLoop",key:"councilHum"},{id:"s17",time:58,action:"stopLoop",key:"holoHum"},{id:"s18",time:58.1,action:"footsteps",repeat:22,interval:.54,gain:.2},{id:"s19",time:58.2,action:"loop",sample:"computerNoise_002",key:"corridorHum",gain:.07,rate:.5},{id:"s20",time:69.8,action:"stopLoop",key:"corridorHum"},{id:"s30",time:70,action:"env",env:"outdoor"},{id:"s31",time:70.1,action:"loop",sample:"computerNoise_000",key:"marketMurmur",gain:.06,rate:.32},{id:"s32",time:72.4,action:"sample",sample:"rollover2",gain:.14,rate:.9},{id:"s33",time:84.2,action:"click",gain:.2},{id:"s34",time:93.8,action:"stopLoop",key:"marketMurmur"},{id:"s35",time:94,action:"env",env:"room"},{id:"s36",time:94.1,action:"loop",sample:"engineCircular_002",key:"lathe",gain:.2,rate:1.05},{id:"s37",time:94.2,action:"loop",sample:"computerNoise_001",key:"shopHum",gain:.07,rate:.7},{id:"s38",time:96,action:"sample",sample:"impactMetal_light_001",gain:.14,rate:1.2,reverb:.35},{id:"s39",time:99.2,action:"click",gain:.22},{id:"s40",time:104,action:"click",gain:.22},{id:"s41",time:110,action:"sample",sample:"impactTin_medium_000",gain:.26,rate:1.1,reverb:.3},{id:"s42",time:116,action:"sample",sample:"impactMetal_medium_000",gain:.2,rate:1.3,reverb:.3},{id:"s43",time:122,action:"sample",sample:"impactMetal_medium_003",gain:.2,rate:1.1,reverb:.3},{id:"s44",time:135.6,action:"stopLoop",key:"lathe"},{id:"s45",time:135.6,action:"stopLoop",key:"shopHum"},{id:"s50",time:136,action:"env",env:"outdoor"},{id:"s51",time:136.2,action:"loop",sample:"engineCircular_000",key:"car",gain:.22,rate:.72},{id:"s52",time:143.2,action:"stopLoop",key:"car"},{id:"s53",time:143.8,action:"sample",sample:"doorOpen_000",gain:.45,rate:.9,reverb:.3},{id:"s54",time:146.4,action:"sample",sample:"doorClose_001",gain:.4,rate:.95,reverb:.35},{id:"s55",time:148,action:"env",env:"basement"},{id:"s56",time:148.1,action:"loop",sample:"computerNoise_002",key:"rangeHum",gain:.09,rate:.38},{id:"s57",time:148.2,action:"loop",sample:"engineCircular_003",key:"fluor",gain:.05,rate:.24},{id:"s58",time:150,action:"footsteps",repeat:12,interval:.6,gain:.24},{id:"s59",time:156.2,action:"click",gain:.3,bright:!0},{id:"s60",time:160.2,action:"click",gain:.26,bright:!0},{id:"s61",time:164.2,action:"breath",dur:8,gain:.1},{id:"s62",time:170,action:"rumble",gain:.13,dur:6},{id:"s63",time:177,action:"gunshot",gain:1},{id:"s64",time:178.2,action:"gunshot",gain:1},{id:"s65",time:179.4,action:"gunshot",gain:1},{id:"s66",time:177.5,action:"click",gain:.32,bright:!0},{id:"s67",time:178.7,action:"click",gain:.32,bright:!0},{id:"s68",time:179.9,action:"click",gain:.32,bright:!0},{id:"s69",time:180.1,action:"ring",freq:4200,dur:9,gain:.075},{id:"s70",time:186.2,action:"burst",dur:2.2,freq:280,gain:.05,reverb:.5},{id:"s80",time:197.8,action:"stopLoop",key:"rangeHum"},{id:"s81",time:197.8,action:"stopLoop",key:"fluor"},{id:"s82",time:198,action:"env",env:"room"},{id:"s83",time:198.1,action:"loop",sample:"computerNoise_000",key:"labHum",gain:.09,rate:.85},{id:"s84",time:202,action:"sample",sample:"impactTin_medium_001",gain:.2,rate:1.4,reverb:.3},{id:"s85",time:206.4,action:"sample",sample:"impactTin_medium_003",gain:.2,rate:1.5,reverb:.3},{id:"s86",time:210.6,action:"sample",sample:"impactTin_medium_000",gain:.18,rate:1.6,reverb:.3},{id:"s87",time:216.2,action:"sample",sample:"impactSoft_medium_000",gain:.32,rate:1.1,reverb:.3},{id:"s88",time:227.8,action:"stopLoop",key:"labHum"},{id:"s89",time:228,action:"env",env:"room"},{id:"s90",time:228.1,action:"loop",sample:"computerNoise_001",key:"reviewHum",gain:.08,rate:.95},{id:"s91",time:230.2,action:"sample",sample:"impactWood_medium_000",gain:.4,rate:.9,reverb:.3},{id:"s92",time:239.8,action:"stopLoop",key:"reviewHum"},{id:"s93",time:240.1,action:"footsteps",repeat:8,interval:.56,gain:.22},{id:"s100",time:246,action:"env",env:"room"},{id:"s101",time:246.1,action:"loop",sample:"spaceEngineLow_000",key:"shopWind",gain:.045,rate:.3},{id:"s102",time:264,action:"sample",sample:"impactPunch_heavy_000",gain:.45,rate:.9,reverb:.3},{id:"s103",time:266.6,action:"sample",sample:"impactPunch_heavy_002",gain:.45,rate:.9,reverb:.3},{id:"s104",time:269.2,action:"sample",sample:"impactPunch_heavy_000",gain:.45,rate:.85,reverb:.3},{id:"s105",time:271.8,action:"sample",sample:"impactPunch_heavy_002",gain:.45,rate:.85,reverb:.3},{id:"s106",time:273.4,action:"sample",sample:"lowFrequency_explosion_000",gain:.5,rate:.8,reverb:.4},{id:"s107",time:277.8,action:"riser",dur:10,gain:.14},{id:"s108",time:289.6,action:"stopLoop",key:"shopWind"},{id:"s109",time:290,action:"env",env:"outdoor"},{id:"s110",time:291.4,action:"static",dur:.9,gain:.09},{id:"s111",time:292.2,action:"beep",freq:760,dur:.1,gain:.14},{id:"s112",time:294.2,action:"beep",freq:760,dur:.1,gain:.14},{id:"s113",time:296.2,action:"beep",freq:760,dur:.1,gain:.14},{id:"s114",time:298.2,action:"beep",freq:760,dur:.1,gain:.14},{id:"s115",time:299.4,action:"static",dur:.6,gain:.07},{id:"s116",time:300.2,action:"beep",freq:760,dur:.1,gain:.14},{id:"s117",time:302.2,action:"beep",freq:760,dur:.1,gain:.14},{id:"s118",time:304.2,action:"beep",freq:760,dur:.1,gain:.14},{id:"s119",time:305.4,action:"beep",freq:1320,dur:.14,gain:.18},{id:"s120",time:305.9,action:"loop",sample:"thrusterFire_002",key:"thruster",gain:.5,rate:1},{id:"s121",time:305.9,action:"rumble",gain:.8,dur:12},{id:"s122",time:305.9,action:"sample",sample:"lowFrequency_explosion_001",gain:.9,rate:.9,reverb:.3},{id:"s123",time:306,action:"sample",sample:"explosionCrunch_002",gain:.55,rate:.85,reverb:.3},{id:"s124",time:314.1,action:"loop",sample:"thrusterFire_004",key:"thruster2",gain:.36,rate:.9},{id:"s125",time:320,action:"stopLoop",key:"thruster"},{id:"s126",time:326,action:"env",env:"vacuum"},{id:"s127",time:326,action:"stopLoop",key:"thruster2"},{id:"s128",time:326,action:"rumble",gain:.1,dur:17},{id:"s129",time:326.2,action:"loop",sample:"spaceEngineLow_001",key:"credits",gain:.1,rate:.4},{id:"s130",time:343,action:"stopLoop",key:"credits"}].sort((i,t)=>i.time-t.time),Qg=[20,70,136,198,246,326];function El(i){const t=Math.floor(i/60),e=Math.floor(i%60);return`${t.toString().padStart(2,"0")}:${e.toString().padStart(2,"0")}`}class t_{constructor(t,e,n){this.world=t,this.audio=e,this.dom=n,this.time=0,this.playing=!0,this.duration=bl,this.shot=null,this.sfxCursor=0,this.prevTime=0,this.envApplied=!1,this.seek(0,!0)}findShot(t){for(let e=0;e<hr.length;e++){const n=hr[e];if(t>=n.start&&t<n.end)return n}return hr[hr.length-1]}seek(t,e=!1){const n=Je(t,0,this.duration),s=e||Math.abs(n-this.time)>.75;if(this.time=n,this.prevTime=n,s){jg(),this.audio?.stopAll(),this.world.effects.root.traverse(()=>{});let o=0,a=null;for(let c=0;c<Xn.length&&Xn[c].time<=n;c++)o=c+1,Xn[c].action==="env"&&(a=Xn[c]);this.sfxCursor=o,a?.env&&this.audio?.setEnvironment(a.env),this.envApplied=!0}const r=this.findShot(n);r!==this.shot&&(this.shot=r,this.world.showSet(r.set))}restart(){this.seek(0,!0),this.playing=!0}togglePlay(){this.playing=!this.playing}update(t){if(this.playing){const e=this.time+t;this.advance(e),this.time=Math.min(e,this.duration),this.time>=this.duration&&(this.playing=!1)}this.render()}advance(t){const e=Math.min(t,this.duration);for(;this.sfxCursor<Xn.length&&Xn[this.sfxCursor].time<=e;){const s=Xn[this.sfxCursor];s.time>=this.prevTime-.001&&this.fire(s),this.sfxCursor++}this.prevTime=e;const n=this.findShot(e);n!==this.shot&&(this.shot=n,this.world.showSet(n.set))}fire(t){const e=this.audio;if(e)switch(t.action){case"env":t.env&&e.setEnvironment(t.env);break;case"sample":t.sample&&e.playSample(t.sample,{gain:t.gain,rate:t.rate,pan:t.pan,reverb:t.reverb,release:t.dur});break;case"loop":t.sample&&t.key&&e.loopSample(t.sample,t.key,t.gain??.2,t.rate??1);break;case"stopLoop":t.key&&e.stopLoop(t.key);break;case"gunshot":e.gunshot(t.gain??1);break;case"footsteps":{const n=t.repeat??1,s=t.interval??.55;for(let r=0;r<n;r++){const o=t.rateJitter??.08;window.setTimeout(()=>e.footstep(t.wood,(t.gain??.25)*(1-Math.random()*o)),r*s*1e3)}break}case"click":e.click(t.gain??.3,t.bright);break;case"ring":e.ring(t.freq??4200,t.dur??4,t.gain??.08);break;case"beep":e.beep(t.freq??880,t.dur??.12,t.gain??.16);break;case"riser":e.riser(t.dur??3,t.gain??.2);break;case"rumble":e.rumble(t.gain??.4,t.dur??8);break;case"breath":e.breath(t.dur??6,t.gain??.14);break;case"burst":e.burst({dur:t.dur,freq:t.freq,gain:t.gain,reverb:t.reverb});break;case"tone":e.tone({freq:t.freq??220,dur:t.dur??.4,gain:t.gain??.15,glide:t.glide});break;case"static":e.static_(t.dur??.5,t.gain??.1);break}}render(){const t=this.time,e=this.shot??this.findShot(t);e!==this.shot&&(this.shot=e,this.world.showSet(e.set));const n=Math.max(1e-4,e.end-e.start),s=vn((t-e.start)/n);this.world.time=t,this.world.dt=Math.max(0,t-this.prevTime)||1/60,e.update(this.world,s),this.world.tick(t,this.world.dt),this.updateSubtitle(t),this.updateCard(t),this.dom.curtain.style.opacity=e_(t,this.duration).toFixed(3),this.dom.hudTime.textContent=`${El(t)} / ${El(this.duration)}`,this.dom.hudShot.textContent=e.id,this.dom.progressFill.style.width=`${(t/this.duration*100).toFixed(2)}%`}updateSubtitle(t){const e=Xg(t);if(e){const n=qg(e);this.dom.subtitleText.textContent!==n&&(this.dom.subtitleText.textContent=n);const s=.18,r=Math.min(vn((t-e.start)/s),vn((e.end-t)/s));this.dom.subtitle.style.opacity=r.toFixed(2)}else this.dom.subtitle.style.opacity="0"}updateCard(t){const e=Jg(t);if(!e){this.dom.card.style.opacity="0";return}this.dom.cardMain.textContent!==e.main&&(this.dom.cardMain.textContent=e.main),this.dom.cardSub.textContent!==e.sub&&(this.dom.cardSub.textContent=e.sub);const n=1.1,s=Math.min(vn((t-e.start)/n),vn((e.end-t)/n));this.dom.card.style.opacity=s.toFixed(2)}}function e_(i,t){let e=0;i<1.7&&(e=Math.max(e,1-i/1.7));for(const s of Qg){const r=Math.abs(i-s);r<.55&&(e=Math.max(e,1-r/.55))}const n=t-1.1;return i>n&&(e=Math.max(e,(i-n)/1.1)),vn(e)}const Re=i=>document.getElementById(i),Tl={subtitle:Re("subtitle"),subtitleText:Re("subtitle-text"),card:Re("card"),cardMain:Re("card-main"),cardSub:Re("card-sub"),curtain:Re("curtain"),hudTime:Re("hud-time"),hudShot:Re("hud-shot"),progress:Re("progress"),progressFill:Re("progress-fill")},n_=Re("stage"),wl=Re("boot"),fs=Re("boot-fill"),ur=Re("boot-status"),ua=Re("sound-hint"),i_=Re("hud"),s_=Object.assign({"./assets/audio/click1.ogg":Hl,"./assets/audio/click2.ogg":Gl,"./assets/audio/click3.ogg":Vl,"./assets/audio/click4.ogg":Wl,"./assets/audio/click5.ogg":Xl,"./assets/audio/computerNoise_000.ogg":ql,"./assets/audio/computerNoise_001.ogg":Yl,"./assets/audio/computerNoise_002.ogg":$l,"./assets/audio/doorClose_000.ogg":Kl,"./assets/audio/doorClose_001.ogg":jl,"./assets/audio/doorClose_002.ogg":Zl,"./assets/audio/doorOpen_000.ogg":Jl,"./assets/audio/doorOpen_001.ogg":Ql,"./assets/audio/doorOpen_002.ogg":th,"./assets/audio/engineCircular_000.ogg":eh,"./assets/audio/engineCircular_001.ogg":nh,"./assets/audio/engineCircular_002.ogg":ih,"./assets/audio/engineCircular_003.ogg":sh,"./assets/audio/explosionCrunch_000.ogg":rh,"./assets/audio/explosionCrunch_001.ogg":oh,"./assets/audio/explosionCrunch_002.ogg":ah,"./assets/audio/footstep_concrete_000.ogg":ch,"./assets/audio/footstep_concrete_001.ogg":lh,"./assets/audio/footstep_concrete_002.ogg":hh,"./assets/audio/footstep_concrete_003.ogg":uh,"./assets/audio/footstep_wood_000.ogg":dh,"./assets/audio/footstep_wood_001.ogg":fh,"./assets/audio/footstep_wood_002.ogg":ph,"./assets/audio/footstep_wood_003.ogg":mh,"./assets/audio/forceField_001.ogg":gh,"./assets/audio/forceField_002.ogg":_h,"./assets/audio/forceField_003.ogg":vh,"./assets/audio/impactBell_heavy_000.ogg":xh,"./assets/audio/impactGeneric_light_001.ogg":Mh,"./assets/audio/impactGlass_heavy_000.ogg":Sh,"./assets/audio/impactGlass_light_000.ogg":yh,"./assets/audio/impactGlass_light_001.ogg":bh,"./assets/audio/impactGlass_light_002.ogg":Eh,"./assets/audio/impactGlass_light_003.ogg":Th,"./assets/audio/impactGlass_medium_001.ogg":wh,"./assets/audio/impactMetal_002.ogg":Ah,"./assets/audio/impactMetal_heavy_000.ogg":Rh,"./assets/audio/impactMetal_heavy_001.ogg":Ch,"./assets/audio/impactMetal_heavy_002.ogg":Ph,"./assets/audio/impactMetal_light_000.ogg":Lh,"./assets/audio/impactMetal_light_001.ogg":Uh,"./assets/audio/impactMetal_light_002.ogg":Ih,"./assets/audio/impactMetal_light_003.ogg":Dh,"./assets/audio/impactMetal_medium_000.ogg":Nh,"./assets/audio/impactMetal_medium_001.ogg":Fh,"./assets/audio/impactMetal_medium_002.ogg":Oh,"./assets/audio/impactMetal_medium_003.ogg":kh,"./assets/audio/impactMining_000.ogg":Bh,"./assets/audio/impactMining_001.ogg":zh,"./assets/audio/impactMining_003.ogg":Hh,"./assets/audio/impactPlate_heavy_000.ogg":Gh,"./assets/audio/impactPlate_heavy_002.ogg":Vh,"./assets/audio/impactPunch_heavy_000.ogg":Wh,"./assets/audio/impactPunch_heavy_002.ogg":Xh,"./assets/audio/impactSoft_heavy_000.ogg":qh,"./assets/audio/impactSoft_heavy_001.ogg":Yh,"./assets/audio/impactSoft_medium_000.ogg":$h,"./assets/audio/impactSoft_medium_001.ogg":Kh,"./assets/audio/impactTin_medium_000.ogg":jh,"./assets/audio/impactTin_medium_001.ogg":Zh,"./assets/audio/impactTin_medium_003.ogg":Jh,"./assets/audio/impactWood_light_002.ogg":Qh,"./assets/audio/impactWood_medium_000.ogg":tu,"./assets/audio/impactWood_medium_001.ogg":eu,"./assets/audio/impactWood_medium_002.ogg":nu,"./assets/audio/laserSmall_000.ogg":iu,"./assets/audio/lowFrequency_explosion_000.ogg":su,"./assets/audio/lowFrequency_explosion_001.ogg":ru,"./assets/audio/mouseclick1.ogg":ou,"./assets/audio/rollover2.ogg":au,"./assets/audio/slime_000.ogg":cu,"./assets/audio/slime_001.ogg":lu,"./assets/audio/spaceEngineLow_000.ogg":hu,"./assets/audio/spaceEngineLow_001.ogg":uu,"./assets/audio/spaceEngineLow_002.ogg":du,"./assets/audio/spaceEngineSmall_001.ogg":fu,"./assets/audio/spaceEngineSmall_002.ogg":pu,"./assets/audio/switch1.ogg":mu,"./assets/audio/switch11.ogg":gu,"./assets/audio/switch12.ogg":_u,"./assets/audio/switch2.ogg":vu,"./assets/audio/switch20.ogg":xu,"./assets/audio/switch27.ogg":Mu,"./assets/audio/switch3.ogg":Su,"./assets/audio/switch4.ogg":yu,"./assets/audio/switch5.ogg":bu,"./assets/audio/switch7.ogg":Eu,"./assets/audio/switch8.ogg":Tu,"./assets/audio/thrusterFire_000.ogg":wu,"./assets/audio/thrusterFire_001.ogg":Au,"./assets/audio/thrusterFire_002.ogg":Ru,"./assets/audio/thrusterFire_003.ogg":Cu,"./assets/audio/thrusterFire_004.ogg":Pu});function r_(i){return s_[`./assets/audio/${i}.ogg`]}function o_(){const i=new Set;for(const n of Xn)n.sample&&i.add(n.sample);const t=["footstep_concrete_000","footstep_concrete_001","footstep_concrete_002","footstep_concrete_003","footstep_wood_000","footstep_wood_001","footstep_wood_002","footstep_wood_003","click1","click2","click3","click4","impactMetal_light_001","impactMetal_light_002","impactMetal_light_003","explosionCrunch_000","explosionCrunch_001","impactMetal_heavy_002","impactPunch_heavy_000","impactPunch_heavy_002","lowFrequency_explosion_000","lowFrequency_explosion_001","computerNoise_000","computerNoise_001","computerNoise_002","engineCircular_000","engineCircular_002","engineCircular_003","spaceEngineLow_000","spaceEngineLow_001","thrusterFire_002","thrusterFire_004","doorOpen_000","doorClose_001","rollover2","impactTin_medium_000","impactTin_medium_001","impactTin_medium_003","impactSoft_medium_000","impactWood_medium_000","impactMetal_medium_000","impactMetal_medium_003"];for(const n of t)i.add(n);const e={};for(const n of i){const s=r_(n);s&&(e[n]=s)}return e}const We=new qm({antialias:!0,powerPreference:"high-performance",alpha:!1,stencil:!1});We.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75)),We.setSize(window.innerWidth,window.innerHeight),We.shadowMap.enabled=!0,We.shadowMap.type=Sa,We.toneMapping=Tr,We.toneMappingExposure=1,We.outputColorSpace=je,n_.appendChild(We.domElement),fs.style.width="22%",ur.textContent="正在搭建体素世界…";const Xe=Wg();fs.style.width="58%",ur.textContent="正在校准镜头与光…";const da=new fg(We,Xe.scene,Xe.camera);let dn=null,Al=!1;try{dn=new ng}catch{dn=null}async function a_(){if(!dn)return;const i=o_();ur.textContent=`正在生成声音…（${Object.keys(i).length} 个采样）`;try{await dn.load(i),Al=!0}catch{Al=!1}}const In=new t_(Xe,dn,Tl);Xe.director=In,window.__film={world:Xe,director:In,renderer:We,post:da,get audio(){return dn},FILM_DURATION:bl};const Rl=Yg();Rl.length&&console.warn("[cues]",Rl),fs.style.width="80%";let fa=!1;function Cl(){fa||(fa=!0,fs.style.width="100%",ur.textContent="开始",wl.style.opacity="0",window.setTimeout(()=>{wl.style.display="none",ua.classList.add("show"),window.setTimeout(()=>ua.classList.remove("show"),7e3)},900),dn?.resume())}fs.style.width="100%";const c_=a_();Promise.race([c_,new Promise(i=>window.setTimeout(i,1400))]).then(Cl).catch(Cl);let Pl=performance.now(),dr=!1;function Ll(){dn?.resume(),ua.classList.remove("show")}window.addEventListener("pointerdown",Ll),window.addEventListener("keydown",Ll),window.addEventListener("keydown",i=>{i.code==="Space"?(i.preventDefault(),In.togglePlay()):i.code==="ArrowRight"?In.seek(In.time+5):i.code==="ArrowLeft"?In.seek(In.time-5):i.key==="r"||i.key==="R"?In.restart():i.key==="m"||i.key==="M"?dn&&dn.setMuted(!dn.muted):i.key==="h"||i.key==="H"?(dr=!dr,i_.classList.toggle("show",dr),Tl.progress.classList.toggle("show",dr)):(i.key==="f"||i.key==="F")&&(document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen())}),window.addEventListener("resize",()=>{const i=window.innerWidth,t=window.innerHeight;We.setSize(i,t),We.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75)),Xe.camera.aspect=i/t,Xe.camera.updateProjectionMatrix(),da.setSize(i,t)});function Ul(i){requestAnimationFrame(Ul);const t=(i-Pl)/1e3;Pl=i;const e=Math.min(Math.max(t,0),1/24);fa?In.update(e):(Xe.time=0,Xe.dt=e,Xe.tick(0,e)),We.toneMappingExposure=Xe.env.exposure,da.render(e,Xe.time,Xe.env.bloom,0)}requestAnimationFrame(Ul)})();
