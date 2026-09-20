import type { WeaponId } from './weapons';

export class SynthAudio {
  private context:AudioContext|null=null;
  private master:GainNode|null=null;
  private noise:AudioBuffer|null=null;
  muted=false;
  async unlock() {
    if(!this.context) {
      this.context=new AudioContext();this.master=this.context.createGain();this.master.gain.value=this.muted?0:.38;this.master.connect(this.context.destination);
      this.noise=this.context.createBuffer(1,this.context.sampleRate,this.context.sampleRate);
      const data=this.noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
    }
    if(this.context.state==='suspended')await this.context.resume();
  }
  toggle(){this.muted=!this.muted;if(this.master)this.master.gain.value=this.muted?0:.38;return this.muted;}
  private tone(freq:number,end:number,duration:number,volume:number,type:OscillatorType='sine',delay=0) {
    if(!this.context||!this.master||this.context.state!=='running')return;
    const ctx=this.context,osc=ctx.createOscillator(),gain=ctx.createGain(),t=ctx.currentTime+delay;
    osc.type=type;osc.frequency.setValueAtTime(freq,t);osc.frequency.exponentialRampToValueAtTime(Math.max(end,1),t+duration);
    gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),t+.003);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
    osc.connect(gain);gain.connect(this.master);osc.start(t);osc.stop(t+duration+.02);osc.onended=()=>{osc.disconnect();gain.disconnect();};
  }
  private burst(duration:number,volume:number,frequency:number,delay=0) {
    if(!this.context||!this.master||!this.noise||this.context.state!=='running')return;
    const ctx=this.context,source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain(),t=ctx.currentTime+delay;
    source.buffer=this.noise;filter.type='lowpass';filter.frequency.value=frequency;gain.gain.setValueAtTime(volume,t);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
    source.connect(filter);filter.connect(gain);gain.connect(this.master);source.start(t,Math.random()*.5,duration);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
  }
  fire(id:WeaponId,distance=0) {
    const volume=Math.max(.015,1/(1+distance*.09));
    if(id==='knife'){this.burst(.13,.13*volume,1600);return;}
    const profile:Record<Exclude<WeaponId,'knife'>,[number,number,number,number]>={ak47:[150,42,.23,5200],m4a4:[185,62,.15,4200],awp:[90,24,.65,6500],glock:[250,85,.12,3200],usp:[320,110,.085,1900],deagle:[135,40,.28,4800]};
    const [freq,end,duration,filter]=profile[id];this.burst(duration,.68*volume,filter);this.tone(freq,end,duration,.48*volume,'triangle');this.tone(75,32,.16,.28*volume);
    this.burst(.14,.08*volume,1300,.065);
  }
  reload(){this.burst(.08,.22,2500);this.tone(620,350,.07,.1,'square',.2);this.burst(.1,.26,4000,.55);}
  step(distance=0){const v=.13/(1+distance*.15);this.burst(.065,v,720);this.tone(85,40,.06,v*.7);}
  scope(){this.tone(820,410,.08,.16,'triangle');this.burst(.06,.09,2800);}
  hit(head=false){this.tone(head?1500:1000,head?2000:650,.07,.22,'sine');}
  kill(){this.tone(650,650,.12,.17,'sine');this.tone(980,980,.18,.13,'sine',.09);}
  plant(){this.tone(750,750,.12,.18,'square');this.tone(1100,1100,.2,.16,'square',.14);}
  defuse(){this.tone(1200,500,.3,.22);this.tone(800,300,.4,.15,'sine',.22);}
  beep(){this.tone(1600,1600,.065,.12);}
  explode(){this.burst(.95,1,1100);this.tone(100,16,1.8,.8,'sawtooth');this.burst(.8,.5,550,.18);}
  round(){this.tone(440,440,.18,.12);this.tone(554,554,.2,.12,'sine',.16);this.tone(660,660,.4,.12,'sine',.34);}
  dispose(){void this.context?.close();this.context=null;}
}
