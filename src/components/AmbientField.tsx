import { useEffect, useRef } from 'react';

const vertex = `attribute vec2 position; void main(){ gl_Position=vec4(position,0.,1.); }`;
const fragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 resolution;
uniform vec2 pointer;
uniform float presence;
uniform float time;
uniform vec2 lightA;
uniform vec2 lightB;
uniform vec2 lightC;
float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y); }
float field(vec2 p){ return noise(p)*.57+noise(p*2.03)*.28+noise(p*4.01)*.15; }
void main(){
  vec2 uv=gl_FragCoord.xy/resolution;
  float aspect=resolution.x/resolution.y;
  vec2 p=uv*vec2(aspect,1.);
  vec2 delta=p-pointer*vec2(aspect,1.);
  float d=length(delta);
  // Inverse displacement pushes the contours outward, leaving a hollow near the cursor.
  p-=normalize(delta+vec2(.0001))*presence*.20*exp(-d*d*16.);
  vec2 warp=vec2(field(p*2.+time*.026),field(p*2.+vec2(7.,3.)-time*.018))-.5;
  p+=warp*.32;
  float a=exp(-length((p-lightA*vec2(aspect,1.))*vec2(.82,1.2))*3.1);
  float b=exp(-length((p-lightB*vec2(aspect,1.))*vec2(1.05,.72))*3.5);
  float c=exp(-length((p-lightC*vec2(aspect,1.))*vec2(.68,1.))*3.7);
  float wave=field(p*3.5+vec2(time*.014,-time*.011));
  float fold=pow(.5+.5*sin(p.x*3.8+p.y*4.8+wave*5.8),3.);
  vec3 color=vec3(.014,.021,.037);
  color+=vec3(.20,.37,.62)*a*(.4+fold*.8);
  color+=vec3(.34,.24,.52)*b*(.4+wave*.7);
  color+=vec3(.32,.51,.58)*c*(.45+fold*.5);
  float rim=exp(-pow((d-.22)*13.,2.))*presence;
  color+=vec3(.15,.20,.29)*rim*.38;
  color*=1.-presence*.38*exp(-d*d*32.);
  float silver=pow(max(0.,1.-abs(wave-.53)*9.),3.);
  color+=vec3(.17,.21,.28)*silver*(a+b+c)*.3;
  float grain=(hash(gl_FragCoord.xy)-.5)*.057;
  color+=grain;
  color*=.82+.18*(1.-smoothstep(.2,.8,length(uv-.5)));
  gl_FragColor=vec4(color,1.);
}`;

/** Persistent, decorative atmosphere. Pointer input never captures or blocks page gestures. */
export default function AmbientField({ enabled }: { enabled: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const settings = useRef(enabled);
  const renderOnce = useRef<() => void>(() => {});
  useEffect(() => { settings.current = enabled; renderOnce.current(); }, [enabled]);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const gl = element.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!; shaders.push(shader);
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Atmosphere shader unavailable');
      return shader;
    };
    let program: WebGLProgram | null = null, buffer: WebGLBuffer | null = null;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Atmosphere unavailable');
      gl.useProgram(program);
      buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
      const attribute = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(attribute); gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
    } catch {
      shaders.forEach(s => gl.deleteShader(s)); gl.deleteProgram(program); gl.deleteBuffer(buffer); return;
    }
    const uniforms = Object.fromEntries(['resolution','pointer','presence','time','lightA','lightB','lightC'].map(name => [name,gl.getUniformLocation(program!,name)]));
    const target = { x: .5, y: .5, presence: 0 }, cursor = { ...target };
    const lights = [{ x:.27,y:.64,vx:0,vy:0 },{ x:.80,y:.77,vx:0,vy:0 },{ x:.61,y:.08,vx:0,vy:0 }];
    let frame = 0, last = 0, time = 0, lost = false;
    const draw = (stamp: number) => {
      frame = 0;
      if (document.hidden || lost) return;
      const dt = Math.min((stamp-last)/1000 || .033,.05);
      if (settings.current && stamp-last < 32) { frame = requestAnimationFrame(draw); return; }
      last = stamp;
      if (settings.current) time += dt;
      const blend = settings.current ? 1-Math.exp(-dt*7) : 1;
      cursor.x += (target.x-cursor.x)*blend; cursor.y += (target.y-cursor.y)*blend;
      cursor.presence += ((settings.current ? target.presence : 0)-cursor.presence)*blend;
      lights.forEach((light,i) => {
        const homeX = [.27,.80,.61][i]+Math.sin(time*.09+i*2)*.065;
        const homeY = [.64,.77,.08][i]+Math.cos(time*.075+i)*.075;
        const dx = (light.x-cursor.x)*element.width/element.height, dy = light.y-cursor.y;
        const distance = Math.hypot(dx,dy), force = Math.max(0,1-distance/.62)*cursor.presence;
        light.vx += ((homeX-light.x)*2.8+dx/(distance+.03)*force*.9-light.vx*3.5)*dt;
        light.vy += ((homeY-light.y)*2.8+dy/(distance+.03)*force*.9-light.vy*3.5)*dt;
        if (settings.current) { light.x += light.vx*dt; light.y += light.vy*dt; }
        gl.uniform2f(uniforms[['lightA','lightB','lightC'][i]],light.x,light.y);
      });
      gl.uniform2f(uniforms.resolution,element.width,element.height);
      gl.uniform2f(uniforms.pointer,cursor.x,cursor.y);
      gl.uniform1f(uniforms.presence,cursor.presence); gl.uniform1f(uniforms.time,time);
      gl.drawArrays(gl.TRIANGLES,0,6); element.classList.add('ambient-ready');
      if (settings.current) frame = requestAnimationFrame(draw);
    };
    const wake = () => { if (!frame && !lost) frame = requestAnimationFrame(draw); };
    renderOnce.current = wake;
    const resize = () => {
      const ratio = Math.min(1,1200/window.innerWidth,850/window.innerHeight);
      element.width = Math.max(1,Math.round(window.innerWidth*ratio)); element.height = Math.max(1,Math.round(window.innerHeight*ratio));
      gl.viewport(0,0,element.width,element.height); wake();
    };
    const move = (event: PointerEvent) => { target.x=event.clientX/window.innerWidth; target.y=1-event.clientY/window.innerHeight; target.presence=1; };
    const leave = () => { target.presence=0; };
    const touchEnd = (event: PointerEvent) => { if (event.pointerType !== 'mouse') leave(); };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame=0; } else { last=performance.now(); wake(); } };
    const contextLost = (event: Event) => { event.preventDefault(); lost=true; cancelAnimationFrame(frame); element.classList.remove('ambient-ready'); };
    window.addEventListener('pointermove',move,{passive:true}); window.addEventListener('pointerdown',move,{passive:true});
    window.addEventListener('pointerup',touchEnd,{passive:true}); window.addEventListener('pointercancel',leave,{passive:true});
    document.documentElement.addEventListener('pointerleave',leave); window.addEventListener('blur',leave);
    window.addEventListener('resize',resize); document.addEventListener('visibilitychange',visibility);
    element.addEventListener('webglcontextlost',contextLost);
    resize();
    return () => {
      cancelAnimationFrame(frame); renderOnce.current=()=>{};
      window.removeEventListener('pointermove',move); window.removeEventListener('pointerdown',move); window.removeEventListener('pointerup',touchEnd); window.removeEventListener('pointercancel',leave);
      document.documentElement.removeEventListener('pointerleave',leave); window.removeEventListener('blur',leave); window.removeEventListener('resize',resize); document.removeEventListener('visibilitychange',visibility);
      element.removeEventListener('webglcontextlost',contextLost);
      shaders.forEach(s=>gl.deleteShader(s)); gl.deleteProgram(program); gl.deleteBuffer(buffer);
    };
  }, []);
  return <div className="ambient-field" aria-hidden="true"><canvas ref={canvas}/><div className="ambient-vignette"/></div>;
}
