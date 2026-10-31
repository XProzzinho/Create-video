# Gera as cenas da história "Evil Tale" (HyperFrames, 1080x1920).
# Rode: python3 tools/build_scenes.py  (escreve evil-tale/index.html e evil-tale/compositions/*.html)
import json, os, html

ROOT = os.path.join(os.path.dirname(__file__), "..", "evil-tale")
os.makedirs(os.path.join(ROOT, "compositions"), exist_ok=True)

# ---------- JS compartilhado (copiado em cada cena) ----------
HELPERS = r"""
const W=1080,H=1920;
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const prog=(t,a,b)=>clamp((t-a)/(b-a));
const eOut=x=>1-Math.pow(1-x,3);
const eInOut=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const lerp=(a,b,x)=>a+(b-a)*x;
function hero(c,x,y,s,pose,col){
  c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=col;c.strokeStyle=col;c.lineCap='round';c.lineJoin='round';
  if(pose==='kneel'){
    c.beginPath();c.arc(-6,-178,26,0,7);c.fill();
    c.beginPath();c.moveTo(-34,-150);c.quadraticCurveTo(-48,-90,-30,-40);c.lineTo(30,-40);c.quadraticCurveTo(34,-100,20,-150);c.closePath();c.fill();
    c.lineWidth=22;c.beginPath();c.moveTo(-20,-46);c.lineTo(-70,-8);c.lineTo(-100,0);c.stroke();
    c.beginPath();c.moveTo(20,-46);c.lineTo(58,-60);c.lineTo(60,0);c.stroke();
    c.lineWidth=16;c.beginPath();c.moveTo(18,-136);c.lineTo(62,-96);c.lineTo(84,-120);c.stroke();
    c.lineWidth=9;c.beginPath();c.moveTo(84,-170);c.lineTo(84,6);c.stroke();c.lineWidth=7;c.beginPath();c.moveTo(66,-128);c.lineTo(102,-128);c.stroke();
    c.lineWidth=10;c.beginPath();c.moveTo(-30,-140);c.quadraticCurveTo(-80,-110,-96,-60);c.stroke();
  } else if(pose==='sit'){
    c.beginPath();c.arc(14,-148,24,0,7);c.fill();
    c.beginPath();c.moveTo(-26,-140);c.quadraticCurveTo(-36,-80,-26,-40);c.lineTo(28,-40);c.quadraticCurveTo(34,-96,22,-136);c.closePath();c.fill();
    c.lineWidth=20;c.beginPath();c.moveTo(-14,-44);c.lineTo(46,-44);c.lineTo(52,0);c.stroke();
    c.lineWidth=14;c.beginPath();c.moveTo(20,-120);c.lineTo(56,-84);c.lineTo(80,-90);c.stroke();
  } else {
    c.beginPath();c.arc(0,-232,26,0,7);c.fill();
    c.beginPath();c.moveTo(-36,-204);c.lineTo(36,-204);c.lineTo(28,-96);c.lineTo(-28,-96);c.closePath();c.fill();
    c.lineWidth=22;c.beginPath();c.moveTo(-14,-100);c.lineTo(-24,0);c.stroke();c.beginPath();c.moveTo(14,-100);c.lineTo(26,0);c.stroke();
    c.lineWidth=15;c.beginPath();c.moveTo(-32,-196);c.lineTo(-48,-118);c.stroke();c.beginPath();c.moveTo(32,-196);c.lineTo(50,-120);c.stroke();
    c.lineWidth=9;c.beginPath();c.moveTo(52,-122);c.lineTo(70,40);c.stroke();
    c.lineWidth=10;c.beginPath();c.moveTo(-34,-196);c.quadraticCurveTo(-70,-140,-62,-90);c.stroke();
  }
  c.restore();
}
"""

CAPS_JS = r"""
function caps(tl,cls){document.querySelectorAll('.'+cls).forEach(function(c){
  const s=parseFloat(c.dataset.start),d=parseFloat(c.dataset.duration);const w=c.querySelectorAll('span');
  tl.fromTo(w,{opacity:0,filter:'blur(6px)'},{opacity:1,filter:'blur(0px)',duration:0.16,stagger:0.08,ease:'power2.out'},s+0.05);
  tl.to(w,{opacity:0,filter:'blur(6px)',duration:0.18,stagger:0.025,ease:'power3.in'},s+d-0.32);});}
"""

def cap(sid, n, text, start, dur, extra_style=""):
    words = "".join(f"<span>{html.escape(w)}</span>" for w in text.split(" "))
    return (f'<p id="{sid}-cap{n}" class="clip cap {sid}-cap" data-start="{start}" data-duration="{dur}" '
            f'style="{extra_style}">{words}</p>')

BASE_CSS = """
#root{position:absolute;inset:0;overflow:hidden;background:#07040f;font-family:Inter,sans-serif}
.bg{position:absolute;left:0;top:0;width:1080px;height:1920px}
.cap{position:absolute;left:80px;right:80px;top:1150px;margin:0;text-align:center;font-family:Inter;font-weight:700;font-size:56px;line-height:1.3;color:#fff;text-shadow:0 4px 20px rgba(0,0,0,.95),0 0 3px #000;z-index:20}
.cap span{display:inline-block;margin:0 .13em}
.win{position:absolute;background:rgba(9,6,24,.88);border:3px solid #6c4bd8;border-radius:14px;color:#efe9ff;font-family:Oswald;z-index:10}
.win h3{margin:0;font-family:Oswald;font-weight:700;letter-spacing:6px;color:#b9a4ff;font-size:34px}
"""

def scene(sid, dur, css, body, draw_js, tl_js):
    return f"""<template>
  <style>{BASE_CSS}{css}</style>
  <div id="root" data-composition-id="{sid}" data-width="1080" data-height="1920" data-duration="{dur}">
    <canvas id="{sid}-bg" class="bg" width="1080" height="1920"></canvas>
    {body}
  </div>
  <script>
  (function(){{
  {HELPERS}
  {CAPS_JS}
  const cv=document.getElementById('{sid}-bg');const ctx=cv.getContext('2d');
  {draw_js}
  const tl=gsap.timeline({{paused:true}});
  const clock={{t:0}};
  tl.fromTo(clock,{{t:0}},{{t:{dur},duration:{dur},ease:'none',onUpdate:function(){{draw(clock.t);}}}},0);
  draw(0);
  {tl_js}
  caps(tl,'{sid}-cap');
  window.__timelines["{sid}"]=tl;
  }})();
  </script>
</template>
"""

scenes = []

# ================= S1: abertura (12 s) =================
s1_draw = r"""
const R=rng(11);const embers=[];for(let i=0;i<70;i++)embers.push([R()*W,R()*H,0.5+R()*1.5,R()*6.28,2+R()*4]);
const ruins=[];let x=-20;while(x<W+60){const w=40+R()*110,h=120+R()*420;ruins.push([x,w,h,R()]);x+=w+30+R()*90;}
function draw(t){
  const z=1+t*0.012;ctx.setTransform(z,0,0,z,W/2*(1-z),H*0.55*(1-z));
  const g=ctx.createLinearGradient(0,0,0,1250);g.addColorStop(0,'#0a0420');g.addColorStop(.55,'#3a1060');g.addColorStop(1,'#a0306a');
  ctx.fillStyle=g;ctx.fillRect(-100,-100,W+200,H+200);
  ctx.fillStyle='rgba(255,120,160,0.12)';ctx.beginPath();ctx.arc(760,520,240,0,7);ctx.fill();
  ctx.fillStyle='#ffd9e8';ctx.beginPath();ctx.arc(760,520,120,0,7);ctx.fill();
  for(const r of ruins){ctx.fillStyle='#1a0a2c';ctx.beginPath();ctx.moveTo(r[0],1260);ctx.lineTo(r[0],1260-r[2]);ctx.lineTo(r[0]+r[1]*r[3],1260-r[2]+30);ctx.lineTo(r[0]+r[1],1260-r[2]*0.7);ctx.lineTo(r[0]+r[1],1260);ctx.fill();}
  const gg=ctx.createLinearGradient(0,1240,0,H);gg.addColorStop(0,'#14081f');gg.addColorStop(1,'#030106');ctx.fillStyle=gg;ctx.fillRect(-100,1240,W+200,H);
  ctx.fillStyle='rgba(160,48,106,0.25)';ctx.fillRect(-100,1240,W+200,6);
  hero(ctx,540,1250,1.5,'kneel','#05020a');
  for(const e of embers){const yy=((e[1]-t*e[4]*28)%H+H)%H;const xx=e[0]+Math.sin(t*1.3+e[3])*24;ctx.fillStyle=`rgba(255,${120+Math.floor(e[2]*60)},80,${0.35+0.4*Math.abs(Math.sin(t*2+e[3]))})`;ctx.beginPath();ctx.arc(xx,yy,e[2]*2.2,0,7);ctx.fill();}
  ctx.setTransform(1,0,0,1,0,0);
  const dim=0.55*(1-eOut(prog(t,2.9,4.2)));if(dim>0){ctx.fillStyle=`rgba(4,2,10,${dim})`;ctx.fillRect(0,0,W,H);}
  const v=ctx.createRadialGradient(W/2,H/2,H*.25,W/2,H/2,H*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.65)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
}
"""
s1_css = """
#s1-win{left:110px;top:520px;width:860px;height:380px;border-color:#ff2a4a;background:rgba(18,2,8,.9);text-align:center}
#s1-win .k{position:absolute;top:44px;left:0;right:0;font-family:Oswald;font-weight:700;font-size:30px;letter-spacing:10px;color:#ff8d9f}
#s1-win .t{position:absolute;top:120px;left:0;right:0;font-family:Oswald;font-weight:700;font-size:96px;line-height:1.05;color:#ff2a4a;text-shadow:0 0 24px rgba(255,42,74,.8)}
#s1-win .t span{display:block}
"""
s1_body = """
<div id="s1-winclip" class="clip" data-start="0" data-duration="3.4">
  <div id="s1-win" class="win"><div class="k">[ SISTEMA ]</div><div class="t"><span id="s1-t1">BEM-VINDO A</span><span id="s1-t2">EVIL TALE</span></div></div>
</div>
""" + cap("s1", 1, "Ninguém sai de Evil Tale.", 3.5, 3.9) + cap("s1", 2, "Eu tentei por anos.", 7.6, 4.2)
s1_tl = r"""
const gx=[0,-14,10,0,-6,12,0];
gx.forEach(function(v,i){tl.to('#s1-t2',{x:v,ease:'steps(1)',duration:0.04},0.6+i*0.07);});
gx.forEach(function(v,i){tl.to('#s1-t1',{x:-v,ease:'steps(1)',duration:0.04},1.9+i*0.06);});
tl.to('#s1-win',{opacity:0,filter:'blur(10px)',scale:1.06,duration:0.3,ease:'power3.in'},3.0);
"""
scenes.append(("s1", 12, scene("s1", 12, s1_css, s1_body, s1_draw, s1_tl)))

# ================= S2: o jogo virou prisão (18 s) =================
s2_draw = r"""
function draw(t){
  ctx.fillStyle='#080414';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(108,75,216,0.16)';ctx.lineWidth=2;const o=(t*30)%90;
  for(let x=-90+o;x<W+90;x+=90){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=-90+o*0.6;y<H+90;y+=90){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  const g=ctx.createRadialGradient(W/2,760,60,W/2,760,900);g.addColorStop(0,'rgba(108,75,216,0.28)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  hero(ctx,880,1400,0.9,'stand','rgba(185,164,255,0.18)');
  const v=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.8);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.7)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
}
"""
s2_css = """
#s2-stat{left:120px;top:300px;width:840px;height:620px;padding:40px 50px;box-sizing:border-box}
#s2-stat .nm{font-family:Oswald;font-weight:700;font-size:72px;color:#fff;margin-top:18px}
#s2-stat .lv{font-family:Oswald;font-size:36px;color:#b9a4ff;letter-spacing:3px}
.bar{height:26px;border-radius:13px;background:#24163f;margin-top:14px;overflow:hidden}
.bar i{display:block;height:100%;border-radius:13px}
#s2-hp i{background:#e0304a;width:100%}
#s2-stat .lab{font-family:Oswald;font-size:30px;color:#9d8cc9;margin-top:34px;letter-spacing:4px}
#s2-time{font-family:Oswald;font-weight:700;font-size:58px;color:#ffd166;margin-top:6px}
.card{left:150px;width:780px;height:150px;display:flex;align-items:center;justify-content:space-between;padding:0 46px;box-sizing:border-box}
.card .a{font-family:Oswald;font-size:36px;color:#b9a4ff;letter-spacing:2px}
.card .b{font-family:Oswald;font-weight:700;font-size:64px;color:#fff}
#s2-menu{left:170px;top:300px;width:740px;height:720px;padding:44px 56px;box-sizing:border-box}
#s2-menu ul{list-style:none;margin:26px 0 0;padding:0}
#s2-menu li{font-family:Oswald;font-size:54px;color:#e6dcff;padding:14px 0;border-bottom:2px solid rgba(108,75,216,.35)}
#s2-exit{color:#ffd166 !important}
#s2-err{position:absolute;left:56px;right:56px;bottom:40px;font-family:Oswald;font-size:34px;color:#ff4d6a;letter-spacing:2px}
"""
s2_body = """
<div id="s2-statclip" class="clip" data-start="0" data-duration="5.6">
  <div id="s2-stat" class="win"><h3>STATUS</h3><div class="nm">KIM WOOJIN</div><div class="lv">NÍVEL 87 · ESPADACHIM</div>
  <div class="lab">VIDA</div><div id="s2-hp" class="bar"><i id="s2-hpf"></i></div>
  <div class="lab">TEMPO DE JOGO</div><div id="s2-time">0 anos, 0 meses, 0 dias</div></div>
</div>
<div id="s2-c1clip" class="clip" data-start="5.6" data-duration="4.2"><div id="s2-c1" class="win card" style="top:360px"><span class="a">MONSTROS DERROTADOS</span><span class="b">48.213</span></div></div>
<div id="s2-c2clip" class="clip" data-start="6.6" data-duration="3.2"><div id="s2-c2" class="win card" style="top:560px"><span class="a">VEZES QUE MORREU</span><span class="b">1.204</span></div></div>
<div id="s2-c3clip" class="clip" data-start="7.6" data-duration="2.2"><div id="s2-c3" class="win card" style="top:760px;border-color:#ff2a4a"><span class="a">DIAS SEM SAIR</span><span class="b" style="color:#ff4d6a">1.229</span></div></div>
<div id="s2-menuclip" class="clip" data-start="9.9" data-duration="8.1">
  <div id="s2-menu" class="win"><h3>MENU</h3><ul><li>Inventário</li><li>Mapa</li><li>Habilidades</li><li>Opções</li><li id="s2-exit">Sair do jogo</li></ul><div id="s2-err">ERRO: OPÇÃO INDISPONÍVEL</div></div>
</div>
""" + cap("s2", 1, "Era só um jogo online.", 0.9, 4.6) + cap("s2", 2, "Até o dia em que o botão de sair desapareceu.", 11.2, 6.6)
s2_tl = r"""
tl.fromTo('#s2-stat',{opacity:0,y:40,filter:'blur(8px)'},{opacity:1,y:0,filter:'blur(0px)',duration:0.5,ease:'expo.out'},0.05);
const tm={d:0};const el=document.getElementById('s2-time');
tl.fromTo(tm,{d:0},{d:1229,duration:3.4,ease:'power2.inOut',onUpdate:function(){const d=Math.round(tm.d);const a=Math.floor(d/365),m=Math.floor((d%365)/30),dd=Math.min(29,d%365%30);el.textContent=a+' anos, '+m+' meses, '+(d>=1229?12:dd)+' dias';}},1.0);
tl.fromTo('#s2-hpf',{width:'100%'},{width:'34%',duration:2.2,ease:'power2.inOut'},2.2);
tl.to('#s2-stat',{opacity:0,filter:'blur(8px)',duration:0.25,ease:'power3.in'},5.3);
['#s2-c1','#s2-c2','#s2-c3'].forEach(function(s,i){tl.fromTo(s,{opacity:0,x:-160,filter:'blur(12px)'},{opacity:1,x:0,filter:'blur(0px)',duration:0.45,ease:'expo.out'},5.65+i);});
tl.to(['#s2-c1','#s2-c2','#s2-c3'],{opacity:0,x:160,filter:'blur(10px)',duration:0.22,ease:'power3.in',stagger:0.04},9.55);
tl.fromTo('#s2-menu',{opacity:0,scale:0.92},{opacity:1,scale:1,duration:0.5,ease:'expo.out'},9.95);
tl.fromTo('#s2-err',{opacity:0},{opacity:1,duration:0.15},14.2);
const jit=[[-10,0.5],[14,0.2],[-6,0.7],[18,0.1],[0,0.4],[-20,0.05],[8,0.3],[0,0]];
jit.forEach(function(j,i){tl.to('#s2-exit',{x:j[0],opacity:j[1],ease:'steps(1)',duration:0.05},12.4+i*0.16);});
tl.to('#s2-exit',{opacity:0,duration:0.01},13.9);
tl.to('#s2-menu',{opacity:0,filter:'blur(10px)',duration:0.25,ease:'power3.in'},17.6);
"""
scenes.append(("s2", 18, scene("s2", 18, s2_css, s2_body, s2_draw, s2_tl)))

# ================= S3: solidão (20 s) =================
s3_draw = r"""
const R=rng(5);const dust=[];for(let i=0;i<60;i++)dust.push([R()*W,R()*H,R()*6.28,0.6+R()]);
function candle(x,y,t,k){const f=0.85+0.15*Math.sin(t*9+k)*Math.sin(t*5.3+k*2);
  const g=ctx.createRadialGradient(x,y-20,4,x,y-20,260*f);g.addColorStop(0,'rgba(255,170,80,0.55)');g.addColorStop(1,'rgba(255,120,40,0)');ctx.fillStyle=g;ctx.fillRect(x-300,y-320,600,600);
  ctx.fillStyle='#f3e2c4';ctx.fillRect(x-9,y-6,18,44);ctx.fillStyle='#ffd27a';ctx.beginPath();ctx.ellipse(x,y-18,7,16*f,0,0,7);ctx.fill();}
function npc(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#120a08';
  ctx.beginPath();ctx.arc(0,-210,24,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-40,-184);ctx.lineTo(40,-184);ctx.lineTo(54,0);ctx.lineTo(-54,0);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(220,220,240,0.55)';ctx.fillRect(-12,-216,7,4);ctx.fillRect(6,-216,7,4);ctx.restore();}
function draw(t){
  const px=Math.sin(t*0.15)*14;
  ctx.fillStyle='#160c08';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#22130c';for(let i=0;i<7;i++)ctx.fillRect(i*170-20+px*0.3,0,90,1300);
  ctx.fillStyle='#0d0705';for(let y of [180,620])ctx.fillRect(0,y,W,46);
  candle(220+px,980,t,1);candle(850+px,940,t,2.4);candle(540+px,700,t,4.1);
  npc(150+px*0.6,1260,1.0);npc(930+px*0.6,1250,0.95);npc(700+px*0.6,1180,0.7);
  ctx.fillStyle='#0b0604';ctx.fillRect(250+px,1150,580,36);ctx.fillRect(290+px,1186,26,200);ctx.fillRect(770+px,1186,26,200);
  hero(ctx,470+px,1260,1.35,'sit','#050302');
  ctx.fillStyle='#070403';ctx.fillRect(0,1260,W,H);
  for(const d of dust){const yy=((d[1]+t*14*d[3])%H);const xx=d[0]+Math.sin(t*0.6+d[2])*30;ctx.fillStyle=`rgba(255,210,150,${0.15+0.2*Math.abs(Math.sin(t+d[2]))})`;ctx.fillRect(xx,yy,3,3);}
  const v=ctx.createRadialGradient(W/2,H*0.45,H*.2,W/2,H/2,H*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.75)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
}
"""
s3_css = """
.bub{position:absolute;background:#fff4dc;color:#2a1a10;font-family:Inter;font-weight:700;font-size:38px;padding:22px 30px;border-radius:26px;z-index:10}
#s3-party{left:150px;top:300px;width:780px;height:660px;padding:40px 56px;box-sizing:border-box}
#s3-party ul{list-style:none;padding:0;margin:24px 0 0}
#s3-party li{display:flex;justify-content:space-between;align-items:center;font-family:Oswald;font-size:46px;color:#fff;padding:14px 0;border-bottom:2px solid rgba(108,75,216,.35)}
#s3-party li b{font-size:32px;color:#59e08a;letter-spacing:2px}
#s3-party li.me b{color:#ffd166}
"""
bub = lambda i, x, y, st: f'<div id="s3-b{i}clip" class="clip" data-start="{st}" data-duration="2.0"><div id="s3-b{i}" class="bub" style="left:{x}px;top:{y}px">Bem-vindo, aventureiro!</div></div>'
names = ["Ryu_Hyun", "Sora", "DarkMage77", "Jiwon"]
lis = "".join(f'<li><span id="s3-n{i}">{n}</span><b id="s3-s{i}">ONLINE</b></li>' for i, n in enumerate(names))
s3_body = (bub(1, 90, 760, 0.6) + bub(2, 520, 700, 2.8) + bub(3, 330, 560, 5.0) +
 f'<div id="s3-partyclip" class="clip" data-start="7.4" data-duration="12.6"><div id="s3-party" class="win"><h3>GRUPO</h3><ul>{lis}<li class="me"><span>Kim Woojin</span><b>VOCÊ</b></li></ul></div></div>'
 + cap("s3", 1, "Os outros jogadores sumiram, um por um.", 8.4, 5.6) + cap("s3", 2, "Só restaram eu e as vozes do jogo.", 14.4, 5.4))
s3_tl = r"""
[1,2,3].forEach(function(i,k){const st=[0.6,2.8,5.0][k];tl.fromTo('#s3-b'+i,{opacity:0,scale:0.8,y:20},{opacity:1,scale:1,y:0,duration:0.35,ease:'back.out(1.6)'},st+0.02);tl.to('#s3-b'+i,{opacity:0,duration:0.2,ease:'power2.in'},st+1.7);});
tl.fromTo('#s3-party',{opacity:0,y:40,filter:'blur(8px)'},{opacity:1,y:0,filter:'blur(0px)',duration:0.5,ease:'expo.out'},7.45);
[0,1,2,3].forEach(function(i){const at=9.6+i*1.1;
  tl.to('#s3-s'+i,{color:'#7d7396',duration:0.01},at);
  tl.call(function(){},[],at);
  tl.fromTo('#s3-n'+i,{opacity:1},{opacity:0.35,duration:0.3,ease:'power2.out'},at);});
const offs=document.querySelectorAll('#s3-party li b');
const lab={k:0};tl.fromTo(lab,{k:0},{k:4,duration:4.4,ease:'none',onUpdate:function(){for(let i=0;i<4;i++)offs[i].textContent=(lab.k>i+0.0001)?'OFFLINE':'ONLINE';}},9.6);
tl.to('#s3-party',{opacity:0,filter:'blur(8px)',duration:0.25,ease:'power3.in'},19.6);
"""
scenes.append(("s3", 20, scene("s3", 20, s3_css, s3_body, s3_draw, s3_tl)))

# ================= S4: o último chefe (20 s) =================
s4_draw = r"""
const R=rng(77);const parts=[];for(let i=0;i<900;i++){const a=R(),b=R();parts.push([a,b,R()*6.28,0.4+R()*1.6,R()]);}
const HITS=[2.4,4.9,7.4,9.9,12.4];
function bossShape(x,y){ctx.beginPath();ctx.moveTo(x-260,y);ctx.lineTo(x-200,y-520);ctx.lineTo(x-120,y-620);ctx.lineTo(x-90,y-760);ctx.lineTo(x-50,y-690);ctx.lineTo(x,y-800);ctx.lineTo(x+50,y-690);ctx.lineTo(x+90,y-760);ctx.lineTo(x+120,y-620);ctx.lineTo(x+200,y-520);ctx.lineTo(x+260,y);ctx.closePath();}
function draw(t){
  let sh=0;for(const h of HITS){const k=prog(t,h,h+0.35);if(k>0&&k<1)sh=Math.max(sh,(1-k)*16);}
  const sx=Math.sin(t*90)*sh,sy=Math.cos(t*77)*sh;ctx.setTransform(1,0,0,1,sx,sy);
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#12020a');g.addColorStop(.6,'#3a0614');g.addColorStop(1,'#080104');ctx.fillStyle=g;ctx.fillRect(-40,-40,W+80,H+80);
  for(let i=0;i<6;i++){ctx.fillStyle='#0b0206';ctx.fillRect(40+i*190,200,70,1100);}
  const T=13.6;const bx=540,by=1320;
  if(t<T){
    ctx.save();ctx.shadowColor='#ff3b1f';ctx.shadowBlur=60;ctx.fillStyle='#050103';bossShape(bx,by);ctx.fill();ctx.restore();
    const eg=0.75+0.25*Math.sin(t*6);ctx.save();ctx.shadowColor='#ff6a00';ctx.shadowBlur=40;ctx.fillStyle=`rgba(255,${130+Math.floor(80*eg)},40,1)`;
    ctx.beginPath();ctx.ellipse(bx-70,by-560,34,14,0.25,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(bx+70,by-560,34,14,-0.25,0,7);ctx.fill();ctx.restore();
  } else {
    const k=prog(t,T,T+3.2);
    for(const p of parts){const px=bx-260+p[0]*520,py=by-p[1]*780;const d=eOut(k)*(200+p[3]*500);
      const xx=px+Math.cos(p[2])*d,yy=py+Math.sin(p[2])*d-k*k*300*p[3];const a=(1-k)*(0.6+0.4*p[4]);if(a<=0)continue;
      ctx.fillStyle=p[4]<0.3?`rgba(255,210,120,${a})`:`rgba(255,90,40,${a})`;ctx.fillRect(xx,yy,4+p[3]*3,4+p[3]*3);}
  }
  hero(ctx,540,1700,1.1,'stand','#000');
  ctx.fillStyle='#050103';ctx.fillRect(-40,1700,W+80,300);
  ctx.setTransform(1,0,0,1,0,0);
  let fl=0;for(const h of HITS){const k=prog(t,h,h+0.25);if(k>0&&k<1)fl=Math.max(fl,1-k);}const kk=prog(t,T,T+0.5);if(kk>0&&kk<1)fl=Math.max(fl,1-kk);
  if(fl>0){ctx.fillStyle=`rgba(255,240,230,${fl*0.8})`;ctx.fillRect(0,0,W,H);}
  const q=prog(t,T+1,T+3.5);if(q>0){ctx.fillStyle=`rgba(3,1,3,${q*0.5})`;ctx.fillRect(0,0,W,H);}
}
"""
s4_css = """
#s4-hpw{left:110px;top:240px;width:860px;height:170px;padding:24px 34px;box-sizing:border-box;border-color:#ff3b1f;background:rgba(20,2,6,.85)}
#s4-hpw h3{color:#ff9a7a}
#s4-hpbar{height:34px;border-radius:17px;background:#2a0710;margin-top:18px;overflow:hidden}
#s4-hpf{display:block;height:100%;width:100%;background:#ff3b1f;border-radius:17px}
.dmg{position:absolute;font-family:Oswald;font-weight:700;font-size:96px;color:#ffd166;text-shadow:0 0 18px rgba(255,120,0,.9),0 4px 0 #000;z-index:12}
"""
dm = [(2.4, 640, 600, "-12.480"), (4.9, 230, 760, "-15.022"), (7.4, 600, 820, "-9.731"), (9.9, 260, 600, "-18.400"), (12.4, 520, 700, "CRÍTICO!")]
s4_body = ('<div id="s4-hpclip" class="clip" data-start="0" data-duration="14.4"><div id="s4-hpw" class="win"><h3>REI DAS SOMBRAS · CHEFE FINAL</h3><div id="s4-hpbar"><i id="s4-hpf"></i></div></div></div>'
 + "".join(f'<div id="s4-d{i}clip" class="clip" data-start="{s}" data-duration="1.2"><div id="s4-d{i}" class="dmg" style="left:{x}px;top:{y}px">{txt}</div></div>' for i, (s, x, y, txt) in enumerate(dm))
 + cap("s4", 1, "Eu derrotei o último chefe.", 14.6, 2.8) + cap("s4", 2, "E então, o silêncio.", 17.5, 2.5))
s4_tl = r"""
tl.fromTo('#s4-hpw',{opacity:0,y:-30},{opacity:1,y:0,duration:0.5,ease:'expo.out'},0.2);
const lv=['78%','55%','36%','14%','0%'];[2.4,4.9,7.4,9.9,12.4].forEach(function(h,i){tl.to('#s4-hpf',{width:lv[i],duration:0.35,ease:'power3.out'},h+0.02);
  tl.fromTo('#s4-d'+i,{opacity:0,scale:1.6,y:0},{opacity:1,scale:1,y:-20,duration:0.25,ease:'expo.out'},h+0.02);tl.to('#s4-d'+i,{opacity:0,y:-90,duration:0.4,ease:'power3.in'},h+0.75);});
tl.to('#s4-hpw',{opacity:0,filter:'blur(10px)',duration:0.3,ease:'power3.in'},13.7);
"""
scenes.append(("s4", 20, scene("s4", 20, s4_css, s4_body, s4_draw, s4_tl)))

# ================= S5: o botão (20 s) =================
s5_draw = r"""
const R=rng(3);const dust=[];for(let i=0;i<90;i++)dust.push([R()*W,R()*H,R()*6.28,0.4+R()*1.2]);
function draw(t){
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0614');g.addColorStop(1,'#120a10');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const gl=eOut(prog(t,0.8,2.2));const lg=ctx.createRadialGradient(W/2,640,40,W/2,640,820);lg.addColorStop(0,`rgba(255,200,90,${0.42*gl})`);lg.addColorStop(1,'rgba(255,200,90,0)');ctx.fillStyle=lg;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#07040a';for(let i=0;i<5;i++){ctx.fillRect(60+i*230,260+(i%2)*80,60,1100);}
  for(const d of dust){const yy=((d[1]-t*10*d[3])%H+H)%H;const xx=d[0]+Math.sin(t*0.5+d[2])*40;const near=Math.max(0,1-Math.hypot(xx-W/2,yy-640)/700);ctx.fillStyle=`rgba(255,220,150,${0.08+0.5*near*gl})`;ctx.fillRect(xx,yy,3,3);}
  const reach=eInOut(prog(t,3.0,15.5));const tr=Math.sin(t*23)*3+Math.sin(t*37)*2;
  const hx=W/2+40+tr,hy=lerp(2100,1120,reach)+Math.cos(t*29)*2;
  ctx.save();ctx.translate(hx,hy);ctx.rotate(-0.12);ctx.fillStyle='#030204';
  ctx.beginPath();ctx.moveTo(-70,900);ctx.lineTo(-60,120);ctx.quadraticCurveTo(-64,40,-40,10);ctx.lineTo(-30,-110);ctx.quadraticCurveTo(-18,-140,-4,-112);ctx.lineTo(4,-20);ctx.lineTo(14,-90);ctx.quadraticCurveTo(28,-114,40,-86);ctx.lineTo(40,-6);ctx.quadraticCurveTo(60,-50,74,-20);ctx.lineTo(70,40);ctx.quadraticCurveTo(110,30,104,80);ctx.lineTo(70,180);ctx.lineTo(80,900);ctx.closePath();ctx.fill();
  ctx.strokeStyle=`rgba(255,200,90,${0.5*gl})`;ctx.lineWidth=3;ctx.stroke();ctx.restore();
  const v=ctx.createRadialGradient(W/2,H*0.4,H*.2,W/2,H/2,H*.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.7)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
}
"""
s5_css = """
#s5-win{left:140px;top:380px;width:800px;height:520px;border-color:#ffc94a;background:rgba(24,16,4,.9);text-align:center;box-shadow:0 0 60px rgba(255,201,74,.45)}
#s5-win h3{color:#ffc94a;margin-top:44px}
#s5-q{font-family:Inter;font-weight:700;font-size:48px;color:#fff6dc;margin-top:40px;line-height:1.3}
#s5-btn{display:inline-block;margin-top:56px;font-family:Oswald;font-weight:700;font-size:84px;color:#1d1200;background:#ffc94a;padding:10px 70px;border-radius:16px}
"""
s5_body = ('<div id="s5-winclip" class="clip" data-start="0.9" data-duration="19.1"><div id="s5-win" class="win"><h3>[ SISTEMA ]</h3><div id="s5-q">Deseja sair<br>de Evil Tale?</div><div id="s5-btn">SAIR</div></div></div>'
 + cap("s5", 1, "Depois de tanto tempo...", 5.0, 4.6) + cap("s5", 2, "ali estava ele.", 9.8, 4.2) + cap("s5", 3, "O botão de sair.", 14.2, 5.6))
s5_tl = r"""
tl.fromTo('#s5-win',{opacity:0,scaleX:0.05,scaleY:0.02,filter:'blur(12px)'},{opacity:1,scaleX:1,scaleY:1,filter:'blur(0px)',duration:0.7,ease:'expo.out'},1.0);
tl.fromTo('#s5-btn',{opacity:0,y:20},{opacity:1,y:0,duration:0.4,ease:'expo.out'},1.8);
"""
scenes.append(("s5", 20, scene("s5", 20, s5_css, s5_body, s5_draw, s5_tl)))

# ================= S6: a escolha (15 s) =================
s6_draw = r"""
const R=rng(19);const shards=[];for(let i=0;i<70;i++){const cx=R()*W,cy=R()*H;const pts=[];const n=3+Math.floor(R()*2);for(let k=0;k<n;k++){const a=k/n*6.28+R()*0.6;const r=60+R()*130;pts.push([Math.cos(a)*r,Math.sin(a)*r]);}
  shards.push({cx,cy,pts,vx:(cx-W/2)*(0.6+R()),vy:(cy-H/2)*(0.6+R())-200*R(),rot:(R()-0.5)*4,hue:R()});}
const frag=[];for(let i=0;i<40;i++)frag.push([R()*W,R()*H,R()*6.28,10+R()*40,R()]);
const P=3.0;
function world(){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a0630');g.addColorStop(.6,'#4a1050');g.addColorStop(1,'#0a0410');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
function draw(t){
  if(t<P+0.2){world();const lg=ctx.createRadialGradient(W/2,820,40,W/2,820,700);lg.addColorStop(0,'rgba(255,200,90,0.45)');lg.addColorStop(1,'rgba(255,200,90,0)');ctx.fillStyle=lg;ctx.fillRect(0,0,W,H);
    const k=eInOut(prog(t,0.6,P));ctx.save();ctx.translate(W/2+30,lerp(1900,1010,k));ctx.fillStyle='#030204';
    ctx.beginPath();ctx.moveTo(-40,900);ctx.lineTo(-34,40);ctx.quadraticCurveTo(-30,-10,0,-12);ctx.quadraticCurveTo(30,-10,34,40);ctx.lineTo(40,900);ctx.closePath();ctx.fill();ctx.restore();
  } else if(t<7.2){
    const k=prog(t,P+0.2,7.2);ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);ctx.fillStyle=`rgba(5,3,10,${eOut(prog(t,P+0.3,5.5))})`;ctx.fillRect(0,0,W,H);
    for(const s of shards){const kk=eOut(k);ctx.save();ctx.translate(s.cx+s.vx*kk*1.4,s.cy+s.vy*kk*1.4);ctx.rotate(s.rot*kk);ctx.globalAlpha=1-k;
      ctx.beginPath();s.pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
      ctx.fillStyle=s.hue<0.5?'#4a1050':'#2a0a40';ctx.fill();ctx.strokeStyle='rgba(255,220,255,0.8)';ctx.lineWidth=2;ctx.stroke();ctx.restore();}
    const seg=Math.floor(t*15);const gr=rng(seg);for(let i=0;i<8;i++){const y=gr()*H,h=6+gr()*40;ctx.fillStyle=gr()<0.5?`rgba(0,255,255,${0.35*(1-k)})`:`rgba(255,0,120,${0.35*(1-k)})`;ctx.fillRect(0,y,W,h);}
  } else {
    ctx.fillStyle='#05030a';ctx.fillRect(0,0,W,H);
    for(const f of frag){const yy=f[1]+Math.sin(t*0.4+f[2])*30;const xx=f[0]+(t-7.2)*8*Math.cos(f[2]);ctx.save();ctx.translate(xx,yy);ctx.rotate(t*0.2+f[2]);ctx.fillStyle=`rgba(180,150,255,${0.12+0.12*f[4]})`;ctx.fillRect(-f[3]/2,-f[3]/2,f[3],f[3]*0.6);ctx.restore();}
  }
}
"""
s6_css = """
#s6-btn{position:absolute;left:290px;top:640px;width:500px;height:240px;border-radius:30px;background:#ffc94a;display:flex;align-items:center;justify-content:center;font-family:Oswald;font-weight:700;font-size:150px;color:#1d1200;box-shadow:0 0 80px rgba(255,201,74,.7);z-index:10}
"""
s6_body = ('<div id="s6-btnclip" class="clip" data-start="0" data-duration="3.3"><div id="s6-btn">SAIR</div></div>'
 + cap("s6", 1, "Eu só queria voltar para casa.", 8.2, 6.6))
s6_tl = r"""
tl.fromTo('#s6-btn',{scale:1},{scale:0.9,duration:0.12,ease:'power3.in'},2.95);
tl.to('#s6-btn',{scale:1.15,opacity:0,duration:0.2,ease:'power3.out'},3.07);
"""
scenes.append(("s6", 15, scene("s6", 15, s6_css, s6_body, s6_draw, s6_tl)))

# ================= S7: o outro mundo (10 s) =================
s7_draw = r"""
const R=rng(9);const eyes=[[170,1460,0.2],[300,1520,1.3],[860,1480,2.1],[960,1430,0.7]];const grass=[];for(let i=0;i<220;i++)grass.push([R()*W,1360+R()*560,R()*6.28,20+R()*40]);
function island(x,y,s,t,k){ctx.save();ctx.translate(x,y+Math.sin(t*0.6+k)*10);ctx.scale(s,s);ctx.fillStyle='#4b3a7a';ctx.beginPath();ctx.moveTo(-160,0);ctx.lineTo(160,0);ctx.lineTo(40,170);ctx.lineTo(0,240);ctx.lineTo(-50,160);ctx.closePath();ctx.fill();
  ctx.fillStyle='#3fae8f';ctx.beginPath();ctx.ellipse(0,0,165,26,0,0,7);ctx.fill();ctx.fillStyle='#d9f2ff';ctx.fillRect(-30,-90,16,90);ctx.fillRect(-10,-130,22,130);ctx.fillRect(18,-70,18,70);
  ctx.fillStyle='rgba(180,230,255,0.55)';ctx.fillRect(100,10,10,200+Math.sin(t*3+k)*6);ctx.restore();}
function draw(t){
  const g=ctx.createLinearGradient(0,0,0,1400);g.addColorStop(0,'#123a5a');g.addColorStop(.5,'#4a5fa6');g.addColorStop(1,'#e8a8c8');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff8e8';ctx.beginPath();ctx.arc(300,420,110,0,7);ctx.fill();ctx.fillStyle='#cfe6ff';ctx.beginPath();ctx.arc(520,300,60,0,7);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.15)';ctx.beginPath();ctx.arc(300,420,170,0,7);ctx.fill();
  island(820,620,1.0,t,0);island(170,860,0.6,t,1.7);island(640,1000,0.45,t,3.1);
  ctx.fillStyle='#2e6a5c';ctx.beginPath();ctx.moveTo(0,1380);ctx.quadraticCurveTo(300,1280,620,1360);ctx.quadraticCurveTo(880,1420,1080,1330);ctx.lineTo(1080,H);ctx.lineTo(0,H);ctx.fill();
  ctx.fillStyle='#1d4a40';ctx.fillRect(0,1500,W,H);
  for(const gr of grass){const sw=Math.sin(t*2+gr[2]+gr[0]*0.01)*8;ctx.strokeStyle='#5fb59a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gr[0],gr[1]);ctx.quadraticCurveTo(gr[0]+sw,gr[1]-gr[3]*0.6,gr[0]+sw*1.6,gr[1]-gr[3]);ctx.stroke();}
  for(const e of eyes){const bl=((t+e[2])%2.6)<0.12?0.15:1;ctx.fillStyle='#0b2a24';ctx.beginPath();ctx.ellipse(e[0],e[1],70,40,0,0,7);ctx.fill();
    ctx.fillStyle='#ffe066';ctx.beginPath();ctx.ellipse(e[0]-18,e[1],8,8*bl,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(e[0]+18,e[1],8,8*bl,0,0,7);ctx.fill();}
  const up=eInOut(prog(t,2.6,5.4));
  ctx.save();ctx.translate(560,1460);ctx.rotate(lerp(-Math.PI/2,0,up));hero(ctx,0,0,1.25,'stand','#0a1420');ctx.restore();
  const wake=1-eOut(prog(t,0,1.6));if(wake>0){ctx.fillStyle=`rgba(255,255,255,${wake})`;ctx.fillRect(0,0,W,H);}
}
"""
s7_body = cap("s7", 1, "Mas aquilo não era casa.", 5.6, 4.3, "font-style:italic;font-weight:400;color:#f4f0ff")
scenes.append(("s7", 10, scene("s7", 10, "", s7_body, s7_draw, "")))

# ================= S8: X (5 s) =================
s8_draw = r"""
function draw(t){
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0e1d3a');g.addColorStop(1,'#5a4a8a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff8e8';ctx.beginPath();ctx.arc(240,1200,90,0,7);ctx.fill();ctx.fillStyle='#cfe6ff';ctx.beginPath();ctx.arc(860,1080,50,0,7);ctx.fill();
  const k=eOut(prog(t,0.4,1.4));if(k>0){ctx.strokeStyle=`rgba(255,255,255,${0.6*k})`;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(540,760);ctx.lineTo(470,560);ctx.lineTo(510,470);ctx.moveTo(540,760);ctx.lineTo(640,600);ctx.lineTo(620,500);ctx.moveTo(540,760);ctx.lineTo(560,980);ctx.stroke();}
  if(t>=3.8){ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);}
}
"""
s8_css = "#s8-x{position:absolute;left:0;right:0;top:640px;text-align:center;font-family:Oswald;font-weight:700;font-size:200px;color:#fff;text-shadow:0 0 40px rgba(200,180,255,.9);z-index:10}"
s8_body = '<div id="s8-xclip" class="clip" data-start="0.5" data-duration="3.3"><div id="s8-x">……X.</div></div>'
s8_tl = r"""
tl.fromTo('#s8-x',{opacity:0,filter:'blur(16px)',scale:1.2},{opacity:1,filter:'blur(0px)',scale:1,duration:0.8,ease:'expo.out'},0.55);
"""
scenes.append(("s8", 5, scene("s8", 5, s8_css, s8_body, s8_draw, s8_tl)))

# ---------- escrever arquivos ----------
total = sum(d for _, d, _ in scenes)
hosts = []
t = 0
for sid, d, content in scenes:
    open(os.path.join(ROOT, "compositions", f"{sid}.html"), "w").write(content)
    hosts.append(f'      <div id="{sid}" data-composition-id="{sid}" data-composition-src="compositions/{sid}.html" data-start="{t}" data-duration="{d}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>')
    t += d

index = f"""<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Evil Tale</title>
  <meta name="viewport" content="width=1080, height=1920" />
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
  <style>*{{margin:0;padding:0;box-sizing:border-box}}html,body{{margin:0;width:1080px;height:1920px;overflow:hidden;background:#000}}#root{{width:100%;height:100%}}</style></head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="1080" data-height="1920">
{chr(10).join(hosts)}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
"""
open(os.path.join(ROOT, "index.html"), "w").write(index)
print("ok", total, "s")
