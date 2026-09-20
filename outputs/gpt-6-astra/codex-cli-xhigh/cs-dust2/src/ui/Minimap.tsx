import { useEffect,useRef } from 'react';
import { REGIONS, SITES } from '../game/map';
import type { GameSnapshot } from '../game/types';

export default function Minimap({snapshot:s}:{snapshot:GameSnapshot}) {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext('2d')!;
    const ratio=2,size=240;canvas.width=size*ratio;canvas.height=230*ratio;ctx.scale(ratio,ratio);
    const scale=2.34,tx=117,tz=105;
    const point=(x:number,z:number)=>[tx+x*scale,tz+z*scale];
    ctx.clearRect(0,0,240,230);
    ctx.strokeStyle='rgba(161,183,179,.055)';ctx.lineWidth=.5;
    for(let i=0;i<240;i+=16){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,230);ctx.moveTo(0,i);ctx.lineTo(240,i);ctx.stroke();}
    ctx.fillStyle='#394342';ctx.strokeStyle='#7e8880';ctx.lineWidth=1.6;
    for(const r of REGIONS){const [x,z]=point(r.x1,r.z1);ctx.strokeRect(x,z,(r.x2-r.x1)*scale,(r.z2-r.z1)*scale);}
    for(const r of REGIONS){const [x,z]=point(r.x1,r.z1);ctx.fillRect(x,z,(r.x2-r.x1)*scale,(r.z2-r.z1)*scale);}
    ctx.fillStyle='#172123';
    for(const [x,z,w,d] of [[29,-25,3.5,3.5],[34,-30,3,3],[-32,-26,3.5,3.5],[-36,-17,3,3],[4,-4,2.4,2.6],[36,6,2.5,4]]){const p=point(x-w/2,z-d/2);ctx.fillRect(p[0],p[1],w*scale,d*scale);}
    for(const [label,pos] of Object.entries(SITES)) {
      const [x,z]=point(pos.x,pos.z);ctx.fillStyle='rgba(219,173,87,.12)';ctx.strokeStyle='#cfa656';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(x,z,13,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.font='bold 13px Arial';ctx.fillStyle='#edc777';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,x,z);
    }
    ctx.font='7px Arial';ctx.fillStyle='#a5afa4';ctx.textAlign='center';ctx.fillText('T SPAWN',point(6,36)[0],point(6,36)[1]);ctx.fillText('CT',point(1,-30)[0],point(1,-30)[1]);
    for(const a of s.actors) {
      if(!a.alive||(!a.visible&&s.started))continue;
      if(!s.started&&a.team!==s.team)continue;
      const [x,z]=point(a.x,a.z);const self=a.id===s.playerId;
      const color=self?'#fff6da':a.team===s.team?'#8bb6c6':'#e77565';
      if(self) {
        ctx.save();ctx.translate(x,z);ctx.rotate(-a.yaw);const gradient=ctx.createRadialGradient(0,0,3,0,0,27);gradient.addColorStop(0,'rgba(242,216,158,.32)');gradient.addColorStop(1,'rgba(242,216,158,0)');ctx.fillStyle=gradient;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,27,-Math.PI/2-.47,-Math.PI/2+.47);ctx.closePath();ctx.fill();
        ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(4,4);ctx.lineTo(0,2);ctx.lineTo(-4,4);ctx.closePath();ctx.fill();ctx.restore();
      }else{ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,z,2.7,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#152023';ctx.lineWidth=1;ctx.stroke();}
    }
    if(s.bomb.state!=='exploded'&&s.bomb.state!=='defused') {
      const [x,z]=point(s.bomb.x,s.bomb.z);ctx.strokeStyle='#e8c074';ctx.fillStyle=s.bomb.state==='planted'?'#e8a866':'#e8c074';ctx.lineWidth=1;
      ctx.fillRect(x-2.5,z-2.5,5,5);if(s.bomb.state==='planted'){ctx.beginPath();ctx.arc(x,z,8+Math.sin(s.elapsed*5)*2,0,Math.PI*2);ctx.stroke();}
    }
  },[s]);
  return <div className="minimap-panel"><div className="map-top"><span><i className="live-dot"/>TACTICAL MAP</span><span className="map-north">N ↑</span></div><canvas ref={ref} aria-label="Dust II minimap: A and B sites, teammates, spotted enemies and C4"/><div className="map-bottom"><span>{s.started?s.location:'DUST II'}</span><span>SECTOR 02</span></div></div>;
}
