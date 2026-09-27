import {T,applyPose,idle,walk,aim,drift,lerpPose,clamp,smooth,mix,rnd} from './art.js';
export const DURATION=252;
export const EDIT=[
 ['prologue',0,12,'orbit','归尘'],['threshold',12,21,'court','门内'],
 ['small-world',21,34,'home','收藏者的小世界'],['price',34,46,'home','石头的代价'],
 ['tea',46,58,'home','一块大陨石'],['purchase',58,68,'home','三块'],
 ['machine',68,77,'shop','夜班'],['cutting',77,85,'shop','切割'],
 ['basement',85,94,'cellar','用途'],['test',94,100,'cellar','回声'],['fragments',100,111,'cellar','伪装'],
 ['doctrine',111,126,'meeting','路线'],['orbit',126,138,'orbit','黄河站'],['shipyard',138,149,'orbit','海岸'],
 ['drifter',149,162,'orbit','等待'],['assembly',162,173,'photo','合影'],['faces',173,184,'photo','人'],
 ['decision',184,193,'orbit','判断'],['fire',193,201,'orbit','寂静的击发'],['flight',201,211,'photo','十秒'],
 ['breach',211,221,'photo','陨石雨'],['rescue',221,231,'photo','五个人'],['return',231,241,'orbit','归途'],
 ['memory',241,246,'home','茶还温着'],['end',246,252,'orbit','没有回答']
];
export function makeFilm(scene,camera,worlds){
 const card=document.querySelector('#card'),title=document.querySelector('#card-title'),kicker=document.querySelector('#card-kicker'),sub=document.querySelector('#card-sub'),shutter=document.querySelector('#shutter');
 const eye=new T.Vector3(),target=new T.Vector3();
 function cam(a,b,look,fov=45,p=0,lookEnd=look){eye.fromArray(a).lerp(new T.Vector3(...b),smooth(p));target.fromArray(look).lerp(new T.Vector3(...lookEnd),smooth(p));camera.position.copy(eye);camera.up.set(0,1,0);camera.lookAt(target);camera.fov=fov;camera.updateProjectionMatrix()}
 function text(k,h,s,opacity){kicker.textContent=k;title.textContent=h;sub.textContent=s;card.style.opacity=opacity}
 function home(t){const w=worlds.home;w.dust(t);w.collector.root.visible=w.zhang.root.visible=t<241;w.zhang.root.position.set(1.5,0,.03);w.zhang.root.rotation.y=-.82;w.collector.root.rotation.y=.7;w.heldCup.visible=t>=46&&t<58;w.cup.visible=!w.heldCup.visible;w.stones.forEach((a,i)=>a.visible=!(i===0&&t>=34&&t<46));w.heldStone.visible=t>=34&&t<46;
 const c=idle(t*.6),z=idle(t*.4);c.neck=[.04,Math.sin(t*.4)*.1,Math.sin(t*.3)*.02];c.armL=[-.2,0,-.05];c.armR=[-.42+Math.sin(t*.8)*.08,0,.18];z.neck=[.1,-.16,0];z.armL=[-.18,0,-.04];
 if(t>=34&&t<46){const a=smooth((t-34)/3);c.armL=[-1.35*a,.1,-.25*a];c.neck=[.2,-.15,0];}
 if(t>=46&&t<58){const lift=smooth((t-46)/2)*(1-smooth((t-55.5)/2.5));z.armL=[-.95-lift*.48,.18,-.28];z.neck=[.12-lift*.14,-.05,0];c.armR=[-.15,0,.08];}
 if(t>=58&&t<68){z.neck=[.32,-.05,0];z.armR=[-.65,0,.05];c.neck=[.1,.18,0];}
 applyPose(w.collector,c);applyPose(w.zhang,z);
 }
 function workshop(t){const w=worlds.shop;w.dust(t);const tt=t-68;w.head.position.x=Math.sin(tt*.52)*.25;w.workRock.rotation.y=tt*4;w.head.position.y=-.17+.035*Math.sin(tt*4);w.sparkLight.intensity=(t>77?3:1)*(.5+.5*Math.sin(t*57));w.sparks.update(i=>{const q=(t*1.7+rnd(i))%1,dir=rnd(i+5)*Math.PI*2;return [w.head.position.x+Math.cos(dir)*q*.9,1.42+q*.4-q*q*.8,-.16+Math.sin(dir)*q*.65,(1-q)*1.3]});applyPose(w.zhang,{...idle(t),neck:[.24,.12,0],armL:[-.85,.2,-.2],armR:[-.42,-.1,.12]});}
 function basement(t){const w=worlds.cellar,fire=[95,96.3,97.6];const kick=Math.max(...fire.map(x=>Math.exp(-Math.max(0,t-x)*18)*(t>=x?1:0)));w.flash.intensity=kick*22;w.holes.forEach((h,i)=>h.visible=t>=fire[i]);w.gun.visible=t<94||t>=100;w.heldGun.visible=t>=94&&t<100;w.zhang.root.visible=t<100;
 if(t>=94&&t<100){applyPose(w.zhang,{...aim(-.05-kick*.15),neck:[.05,0,0],legL:[0,0,-.08],legR:[0,0,.08]});w.zhang.root.position.set(-.8,0,1.3+kick*.035);w.zhang.root.rotation.y=Math.PI;}
 else{w.zhang.root.position.set(.7,0,-.08);w.zhang.root.rotation.y=.22;applyPose(w.zhang,{...idle(t),neck:[.4,0,0],armR:[-.7,0,.2],armL:[-.8,0,-.2]});}
 w.fragments.forEach(a=>a.visible=t>=100);w.smoke.mesh.visible=t>=95;w.smoke.update(i=>{const q=((t-95)*.09+rnd(i))%1;return[-.8+(rnd(i+3)-.5)*q,1.2+q*.7,.2+(rnd(i+5)-.5)*q,q*.8]});
 }
 function orbit(t){const w=worlds.orbit;w.earth.rotation.y=.14+t*.0008;w.earth.position.set(-40,-34,-135);w.halo.position.copy(w.earth.position);w.station.position.set(7,5,-45);w.station.rotation.set(.05,-.25,.12);w.station.visible=true;w.dock.visible=true;w.heroRock.visible=false;w.sun.position.set(20,12,-170);w.glow.position.copy(w.sun.position);w.sun.visible=w.glow.visible=true;w.glow.material.opacity=1;w.sunLight.intensity=3.5;if(t>=149&&t<231){const dusk=smooth((t-149)/52);w.sun.position.set(mix(20,6,dusk),mix(12,2,dusk),-170);w.glow.position.copy(w.sun.position);w.glow.material.opacity=1-smooth((t-177)/24);}
 w.zhang.root.visible=true;w.zhang.root.position.set(0,0,3);w.zhang.root.rotation.set(.08,Math.PI+.2,-.08);w.gun.visible=false;w.muzzle.visible=false;w.thrust.mesh.visible=false;applyPose(w.zhang,{...drift(t*.6),neck:[.06,-.18,0],armL:[-.55,.1,-.26],armR:[-.5,-.1,.17]});
 if(t<12){w.zhang.root.position.set(2.5,-.6,-4);w.zhang.root.rotation.y=2.7;w.heroRock.visible=true;w.heroRock.position.set(4.7,2.2,2.8);w.heroRock.rotation.set(.5+t*.03,t*.06,.3);w.station.position.set(22,8,-55);w.dock.visible=false;}
 if(t>=126&&t<149){w.zhang.root.visible=false;w.station.rotation.y=-.35+(t-126)*.006;}
 if(t>=149&&t<162){w.zhang.root.position.set(0,.2+Math.sin(t*.4)*.07,3);w.zhang.root.rotation.y=mix(3.4,3.1,smooth((t-149)/13));}
 if(t>=184&&t<201){w.zhang.root.rotation.set(.06,Math.PI-.18,-.07);const p=smooth((t-184)/7);const firing=t>=193;const shots=[194,196,198];const recoil=Math.max(...shots.map(a=>t>=a?Math.exp(-(t-a)*18):0));const base=drift(t);applyPose(w.zhang,lerpPose({...base,neck:[.18,-.1,0],armR:[-.4,-.1,.15]},{...aim(-.04-recoil*.13),neck:[.03,-.06,0],legR:[-.4,0,.13],legL:[-.15,0,-.11]},p));w.gun.visible=t>=187.8;w.muzzle.visible=firing&&shots.some(a=>t>=a&&t<a+.12);w.zhang.root.position.z=3+Math.max(0,t-194)*.025+recoil*.028;w.sunLight.intensity=2.4;}
 if(t>=231){const q=(t-231);w.zhang.root.position.set(-q*.45,.5+q*.08,2-q*.75);w.zhang.root.rotation.set(-.15,3.55,-.35);applyPose(w.zhang,{...drift(t),armR:[-.25,0,.12],armL:[-.5,0,-.2],legR:[-.07,0,.07],legL:[-.12,0,-.1]});w.thrust.mesh.visible=t<241;w.thrust.update(i=>{const a=(t*1.1+rnd(i))%1;return [w.zhang.root.position.x+a*.7+(rnd(i+17)-.5)*.25,w.zhang.root.position.y+.9+a*.3,w.zhang.root.position.z+a*3,.4*(1-a)]});w.sunLight.intensity=1.8;}
 if(t>=246){w.zhang.root.visible=false;w.station.visible=false;w.dock.visible=false;w.heroRock.visible=true;w.heroRock.position.set(4.7,2.2,2.8);w.heroRock.rotation.set(.5+(t-246)*.03,(t-246)*.06,.3);w.sunLight.intensity=1.5;}
 }
 function photo(t){const w=worlds.photo,u=t-162,impact=Math.max(0,t-211),escape=smooth((t-220)/10);w.door.position.x=-7-smooth(u/4)*2.75;w.hatchLight.material.color.set(t<211?0x86c4aa:0xe58a69);w.warmLight.intensity=t>=211?(Math.sin(t*8)>.1?2:0):0;w.key.intensity=mix(4.2,1.5,smooth((t-173)/38));
 w.people.forEach((f,i)=>{let x,y,z;if(i<3){x=(i-1)*1.7;y=.25;z=.35}else{const j=i-3;x=((j%6)-2.5)*1.62;y=1.95+Math.floor(j/6)*1.8;z=-1.15-Math.floor(j/6)*1.15;}const arrive=smooth((u-i*.15)/7);x=mix(-7,x,arrive);y=mix(.1,y,arrive);z=mix(-5,z,arrive);const hit=[0,1,2,5,9].includes(i);let pose=drift(t*.3+i);pose.hips=[-.035,Math.sin(t*.4+i)*.025,Math.sin(t*.4+i)*.035];pose.neck=[Math.sin(t*.3+i)*.035,Math.sin(t*.33+i)*.09,0];pose.armR=[-.2,0,.10];pose.armL=[-.27,0,-.12];pose.legR=[-.1,0,.06];pose.legL=[-.18,0,-.06];if(t>=173&&t<180&&i===0){pose.armL=[-.75,0,-.6];pose.neck=[-.1,-.25,0]}
 let roll=Math.sin(t*.25+i)*.035;if(t>=211){if(hit){const a=clamp(impact/4);roll+=a*(i%2?-.6:.7);y-=a*.38;z-=a*.3;pose.armL=[-.1,0,-.48*a];pose.armR=[.16,0,.4*a];pose.neck=[.25*a,0,.2*a];}else{pose.armR=[-1.0,0,.55];pose.armL=[-1.05,0,-.5];pose.neck=[.05,i%2?.4:-.4,0];}}
 if(t>=220){const e=smooth((t-220-i*.08)/10);x=mix(x,-7,e);y=mix(y,.05,e);z=mix(z,-6.5,e);if(!hit)pose.armL=[-1.3,0,-.4];roll*=1-e*.4;}
 f.root.position.set(x,y+Math.sin(t*.5+i)*.025,z);f.root.rotation.set(0,t>=220?-escape*2.6:Math.sin(t*.22+i)*.04,roll);f.root.visible=t<230.8||i<3;applyPose(f,pose);
 if(f.cracked){const next=t<172.5?f.opaque.texture:t>=211.7&&i===1?f.cracked.texture:f.userData.clothes.texture;if(f.currentSuit!==next){f.setClothes(next);f.currentSuit=next;}}
 });
 if(t>=218){[3,4,6,7,8].forEach((h,j)=>{const victim=w.people[[0,1,2,5,9][j]],helper=w.people[h],a=smooth((t-218)/2.5);helper.root.position.lerp(victim.root.position.clone().add(new T.Vector3(.72,.12,.1)),a);helper.root.rotation.set(0,.08,a*.13);applyPose(helper,{...drift(t),armR:[-.15,0,-1.18*a],armL:[-.5,0,-.18],neck:[.14,-.25,0]});});}w.clouds.mesh.visible=t>=211;w.clouds.mesh.material.opacity=t<222?.62:.3;w.clouds.update(i=>{const j=i%5,index=[0,1,2,5,9][j],f=w.people[index],age=(impact*.4+rnd(i))%1;const spread=Math.min(2.0,impact*.3);return[f.root.position.x+(rnd(i+3)-.5)*age*spread,f.root.position.y+1.1+age*(.4+rnd(i+9))*spread,f.root.position.z+age*1.8,.2+age*1.7]});w.specks.mesh.visible=t>=211;w.specks.update(i=>{const q=clamp(impact/6);return[(rnd(i)-.5)*6*q,.5+rnd(i+5)*3-q*.3,rnd(i+3)*q*2,.5]});
 }
 const shots=EDIT.map(([id,start,end,world])=>({id,start,end,enter(){Object.values(worlds).forEach(w=>w.root.visible=false);const w=worlds[world];w.root.visible=true;scene.background=new T.Color(w.bg);scene.fog=w.fog??null;},leave(){worlds[world].root.visible=false},update({time:t,localTime:l,progress:p}){
 card.style.opacity='0';card.dataset.titling=String(id==='prologue'||id==='end');shutter.style.opacity='0';
 if(world==='home')home(t);if(world==='shop')workshop(t);if(world==='cellar')basement(t);if(world==='orbit')orbit(t);if(world==='photo')photo(t);
 switch(id){
 case 'prologue':cam([-1,2.8,13],[-.4,2.7,12.1],[0,1,-16],47,p);text('原文改编短片','归尘','DUST, RETURNING',smooth((l-1)/2)*(1-smooth((l-9)/2)));break;
 case 'threshold':{const w=worlds.court;w.dust(t);w.zhang.root.position.set(-.2,0,mix(3.9,-.2,smooth(p)));applyPose(w.zhang,p>.88?idle(t):walk(l,.85));applyPose(w.elder,{...idle(t),armL:[-.52,0,-.24],neck:[.05,.1,0]});cam([5.6,2.5,8.2],[4.4,2.1,6.9],[0,1.25,-.5],43,p);text('地球 · 三个月前','胡同深处','',smooth(l/1)*(1-smooth((l-5)/2)));break;}
 case 'small-world':cam([3.7,2.05,5.2],[3.3,1.9,4.7],[-.3,1.25,-.2],45,p);break;
 case 'price':cam([-.1,1.85,2.5],[-.4,1.74,2.1],[-1.42,1.22,-.22],39,p);break;
 case 'tea':cam([.5,1.72,2.7],[.55,1.66,2.35],[1.43,1.37,.13],38,p);break;
 case 'purchase':cam([.9,2.15,2.1],[.6,1.6,1.85],[.1,1.02,.65],35,p);break;
 case 'machine':cam([-4.2,2.5,5.8],[-3.6,2.2,4.6],[.2,1.5,0],43,p);text('太空军研究所','闭馆以后','',smooth(l/1)*(1-smooth((l-5)/2)));break;
 case 'cutting':cam([.77,1.77,1.05],[.55,1.6,.91],[.01,1.37,-.13],37,p);break;
 case 'basement':cam([2.6,1.95,3.4],[2.1,1.65,2.8],[.4,1.03,.4],41,p);break;
 case 'test':cam([-2.7,1.55,3.9],[-2.7,1.55,3.9],[-.7,1.2,-.3],50,p);camera.position.x+=worlds.cellar.flash.intensity*.0008;break;
 case 'fragments':cam([1.5,1.65,1.7],[1.23,1.36,1.4],[1.04,.98,.65],32,p);break;
 case 'doctrine':{const w=worlds.meeting;w.elders.forEach((f,i)=>applyPose(f,{...idle(t*.4+i),neck:[.02,Math.sin(t*.4+i)*.05,0],armR:[i===1?-.6:-.2,0,.08],armL:[-.18,0,-.12]}));applyPose(w.zhang,{...idle(t),neck:[.05,-.2,0]});cam([-3.7,1.75,4.8],[-2.8,1.5,3.9],[.15,1.6,-1],43,p);text('此前 · 路线论证会','', '',smooth(l/1)*(1-smooth((l-4)/1)));break;}
 case 'orbit':cam([32,20,48],[21,15,34],[0,3,-44],47,p);text('三个月后 · 同步轨道','黄河空间站','日落前',smooth(l/2)*(1-smooth((l-8)/3)));break;
 case 'shipyard':cam([-16,14,12],[-26,16,8],[-31,14,-49],48,p);break;
 case 'drifter':cam([3,2.5,10],[2,1.9,8],[0,1,2.4],47,p);break;
 case 'assembly':cam([5,4,17],[4,3.8,14.5],[-.7,2.25,-1.3],49,p);break;
 case 'faces':cam([2.8,2.1,7],[1.4,1.8,6.3],[-.45,1.5,.1],41,p);break;
 case 'decision':cam([1.5,1.8,.1],[1,1.74,.7],[0,1.47,3],37,p);break;
 case 'fire':cam([3.4,1.65,4.8],[3.1,1.55,4.5],[0,1.25,2.5],44,p);break;
 case 'flight':cam([2.5,3.3,14],[2.35,3.25,13.7],[0,2,-.3],47,p);break;
 case 'breach':cam([1.8,2.6,8],[.8,2.45,8.8],[0,1.6,0],47,p);break;
 case 'rescue':cam([4.6,4.6,15],[3.7,4,13.5],[-3,1.5,-2.5],49,p);break;
 case 'return':cam([5.2,3.6,13],[9,6,20],[-2,1,-8],49,p);break;
 case 'memory':cam([2.8,1.75,3.7],[2.7,1.7,3.5],[.4,1.03,.3],41,p);break;
 case 'end':cam([-1,2.8,13],[-.7,2.8,13],[0,1,-16],47,p);text('DUST, RETURNING','归尘','据所提供的章北海片段改编\n终',smooth(l/1));shutter.style.opacity=smooth((l-4.5)/1.4)*.64;break;
 }
 }}));
 return shots;
}
