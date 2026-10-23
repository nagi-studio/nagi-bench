// No recordings: all excitation, resonances, ambience and music are synthesized.
export class Soundtrack {
  constructor(){this.enabled=false;this.ready=false;this.nextNote=0;this.noteIndex=0;}
  async enable(){
    if(!this.ready){
      const AudioCtx=window.AudioContext||window.webkitAudioContext;this.ctx=new AudioCtx();const c=this.ctx;
      this.master=c.createGain();this.master.gain.value=0;
      this.limiter=c.createDynamicsCompressor();Object.assign(this.limiter.threshold,{value:-17});this.limiter.knee.value=12;this.limiter.ratio.value=5;this.limiter.attack.value=.005;this.limiter.release.value=.25;
      this.master.connect(this.limiter);this.limiter.connect(c.destination);
      const len=c.sampleRate*3,buf=c.createBuffer(1,len,c.sampleRate),data=buf.getChannelData(0);let last=0;
      for(let i=0;i<len;i++){last=(last+Math.random()*.055-.0275)/1.022;data[i]=last*4;}
      const noise=c.createBufferSource();noise.buffer=buf;noise.loop=true;
      const filter=c.createBiquadFilter();filter.type='bandpass';filter.frequency.value=1450;filter.Q.value=.45;
      this.water=c.createGain();this.water.gain.value=.12;noise.connect(filter);filter.connect(this.water);this.water.connect(this.master);noise.start();
      this.ready=true;
    }
    await this.ctx.resume();this.enabled=true;this.setPlaying(true);this.nextNote=0;
  }
  setPlaying(playing){if(!this.ready)return;const t=this.ctx.currentTime;this.master.gain.cancelScheduledValues(t);this.master.gain.setTargetAtTime(this.enabled&&playing?.38:0,t,.12);}
  mute(){this.enabled=false;this.setPlaying(false);}
  tone(freq,start,duration,gain,type='sine',dest=this.master){const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(gain,start+.015);g.gain.exponentialRampToValueAtTime(.0001,start+duration);o.connect(g);g.connect(dest);o.start(start);o.stop(start+duration+.04);}
  event(type){
    if(!this.enabled||!this.ready)return;const t=this.ctx.currentTime;
    if(type==='release'){this.tone(830,t,.052,.055,'triangle');this.tone(390,t+.025,.07,.035);}
    if(type==='bell'){for(const [ratio,vol,dur] of [[1,.23,3],[2.76,.075,1.8],[5.4,.026,.9],[8.93,.008,.4]])this.tone(342*ratio,t,dur,vol);}
  }
  update(filmTime,playing){
    if(!this.ready||!this.enabled||!playing)return;
    if(filmTime>=this.nextNote){const notes=[146.83,220,293.66,329.63,440,293.66,220,164.81];const f=notes[this.noteIndex++%notes.length],t=this.ctx.currentTime;this.tone(f,t,2.6,.08,'triangle');this.tone(f*2.003,t+.018,1.8,.025);this.nextNote=filmTime+3.6;}
  }
}
