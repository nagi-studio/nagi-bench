// Every sound is generated here. No decoding, fetches, audio files, or speech
// services: filtered noise for water, resonant oscillators for wood and bronze.
export class Soundtrack {
  constructor(){this.enabled=false;this.ctx=null;this.nextNote=0;this.lastTime=0;this.running=true;}
  async enable(){
    if(!this.ctx){
      const AC=window.AudioContext||window.webkitAudioContext;this.ctx=new AC();
      this.master=this.ctx.createGain();this.master.gain.value=.42;
      const limiter=this.ctx.createDynamicsCompressor();limiter.threshold.value=-16;limiter.knee.value=14;limiter.ratio.value=5;limiter.attack.value=.006;limiter.release.value=.22;
      this.meter=this.ctx.createAnalyser();this.meter.fftSize=512;
      this.master.connect(limiter);limiter.connect(this.meter);this.meter.connect(this.ctx.destination);
      const length=this.ctx.sampleRate*3,buffer=this.ctx.createBuffer(1,length,this.ctx.sampleRate),d=buffer.getChannelData(0);
      let previous=0;for(let i=0;i<length;i++){previous=.92*previous+.08*(Math.random()*2-1);d[i]=previous;}
      this.flow=this.ctx.createBufferSource();this.flow.buffer=buffer;this.flow.loop=true;
      const high=this.ctx.createBiquadFilter();high.type='highpass';high.frequency.value=550;
      const low=this.ctx.createBiquadFilter();low.type='lowpass';low.frequency.value=4200;
      this.flowGain=this.ctx.createGain();this.flowGain.gain.value=.18;
      this.flow.connect(high);high.connect(low);low.connect(this.flowGain);this.flowGain.connect(this.master);this.flow.start();
    }
    await this.ctx.resume();this.enabled=true;this.master.gain.setTargetAtTime(this.running?.42:0,this.ctx.currentTime,.08);this.nextNote=this.lastTime;
  }
  mute(){this.enabled=false;if(this.ctx)this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.06);}
  setPlaying(playing){this.running=playing;if(this.ctx)this.master.gain.setTargetAtTime(this.enabled&&playing?.42:0,this.ctx.currentTime,.07);}
  tone(freq,amp,duration=1.5,type='sine',delay=0){
    const t=this.ctx.currentTime+delay,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(amp,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+duration+.05);
  }
  pluck(freq){this.tone(freq,.11,2.4);this.tone(freq*2,.025,.8,'triangle');this.tone(freq*3,.008,.35);}
  bell(){if(!this.enabled||!this.running)return;for(const [ratio,amp,decay]of [[1,.11,2.4],[2.76,.041,1.6],[5.4,.019,.8],[8.93,.008,.35]])this.tone(440*ratio,amp,decay);}
  event(e){
    if(!this.enabled||!this.running||!this.ctx)return;
    if(e.type==='bell')this.bell();
    if(e.type==='tick'){this.tone(740,.05,.065,'triangle');this.tone(320,.045,.045,'sine',.012);}
    if(e.type==='release')this.tone(180,.035,.095,'triangle');
  }
  update(time){
    this.lastTime=time;if(!this.enabled||!this.running||!this.ctx)return;
    if(time>=this.nextNote){
      const melody=[196,293.665,329.628,440,391.995,293.665,261.626,196,293.665,391.995,440,329.628];
      const i=Math.floor(time/1.35);this.pluck(melody[i%melody.length]);
      if(i%4===0)this.tone(98,.04,4);
      this.nextNote=time+1.35;
    }
    const level=time>=4&&time<9?.31:.16;this.flowGain.gain.setTargetAtTime(level,this.ctx.currentTime,.7);
  }
  reset(){this.nextNote=0;this.lastTime=0;}
  status(){const data=new Float32Array(512);this.meter?.getFloatTimeDomainData(data);return {enabled:this.enabled,state:this.ctx?.state||'not-started',peak:data.reduce((p,x)=>Math.max(p,Math.abs(x)),0)};}
}
