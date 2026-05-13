(function(){
"use strict";
var deck=document.getElementById('deck'),body=document.body;
var cur=0,curF=0,total=SLIDES.length;
var fragState=[];// remember fragment index per slide
var visited=[];

// ═══ SVG ICONS ═══
var ICONS={
  bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  expand:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>',
  history:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  architecture:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  compare:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>',
  supervisor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0113 0"/></svg>',
  bulkhead:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="8" y1="4" x2="8" y2="20"/><line x1="16" y1="4" x2="16" y2="20"/></svg>',
  breaker:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
};

// ═══ BUILD SLIDES ═══
SLIDES.forEach(function(s,si){
  fragState[si]=0;
  var el=document.createElement('div');
  el.className='slide';
  el.id='s'+si;
  var html='';
  s.fragments.forEach(function(f){
    var a=f.a||'';
    var cls='frag'+(a?' a-'+a:'');
    switch(f.t){
      case 'badge':html+='<div class="'+cls+'"><span class="s-badge">'+f.c+'</span></div>';break;
      case 'logo':html+='<div class="'+cls+'"><div class="mbm-logo"><img src="mbm-logo.png" alt="MBM University"></div></div>';break;
      case 'h1':html+='<h1 class="s-h1 '+cls+'">'+f.c+'</h1>';break;
      case 'sub':html+='<p class="s-sub '+cls+'">'+f.c+'</p>';break;
      case 'quote':html+='<blockquote class="s-quote '+cls+'">'+f.c+'</blockquote>';break;
      case 'note':html+='<p class="s-note '+cls+'">'+f.c+'</p>';break;
      case 'divider':html+='<div class="s-divider '+cls+'"></div>';break;
      case 'icon':html+='<div class="s-icon-block '+cls+'">'+(ICONS[f.c]||'')+'</div>';break;
      case 'pills':
        html+='<div class="pill-row '+cls+'">'+f.c.map(function(p){return '<span class="pill">'+p+'</span>';}).join('')+'</div>';break;
      case 'presenter':
        var pr=f.c;
        html+='<div class="presenter-block '+cls+'"><div class="p-name">'+pr.name+'</div><div class="p-roll">'+pr.roll+'</div><div class="p-dept">'+pr.dept+'<br>'+pr.univ+'</div><div class="p-dept" style="margin-top:8px;font-style:italic">'+pr.note+'</div></div>';break;
      case 'cols':
        var c=f.c;
        html+='<div class="col-wrap '+cls+'"><div class="glass col-box '+c.l.cls+'"><h3>'+c.l.head+'</h3><ul>'+c.l.items.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul></div><div class="glass col-box '+c.r.cls+'"><h3>'+c.r.head+'</h3><ul>'+c.r.items.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul></div></div>';break;
      case 'grid4':
        html+='<div class="cards-grid '+cls+'">'+f.c.map(function(cd){
          return '<div class="glass"><div class="c-icon" style="background:'+cd.color+'15;color:'+cd.color+'">'+(ICONS[cd.icon]||'⚡')+'</div><h3>'+cd.head+'</h3><p>'+cd.text+'</p></div>';
        }).join('')+'</div>';break;
      case 'grid3':
        html+='<div class="cards-grid '+cls+'" style="grid-template-columns:1fr 1fr 1fr">'+f.c.map(function(cd){
          return '<div class="glass"><div class="c-icon" style="background:'+cd.color+'15;color:'+cd.color+'">'+(ICONS[cd.icon]||'')+'</div><h3>'+cd.head+'</h3><p>'+cd.text+'</p></div>';
        }).join('')+'</div>';break;
      case 'list':
        html+='<ul class="s-list '+cls+'">'+f.c.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>';break;
      case 'callout':
        var co=f.c;
        html+='<div class="s-callout '+cls+'"><h4>⚠ '+co.head+'</h4><p>'+co.text+'</p>'+(co.fix?'<div class="co-fix">'+co.fix+'</div>':'')+'</div>';break;
      case 'metrics':
        html+='<div class="met-row '+cls+'">'+f.c.map(function(m){return '<span class="met-pill">'+m+'</span>';}).join('')+'</div>';break;
      case 'stats':
        html+='<div class="stat-row '+cls+'">'+f.c.map(function(st){return '<div class="stat-box glass"><div class="sv">'+st.v+'</div><div class="sl">'+st.l+'</div></div>';}).join('')+'</div>';break;
      case 'table':
        var tb=f.c;
        html+='<div class="'+cls+'" style="overflow-x:auto"><table class="s-table"><thead><tr>'+tb.hd.map(function(h){return '<th>'+h+'</th>';}).join('')+'</tr></thead><tbody>'+tb.rows.map(function(r){return '<tr>'+r.map(function(c){return '<td>'+c+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';break;
      case 'highlight':
        html+='<div class="s-hl glass '+cls+'">'+f.c+'</div>';break;
      case 'split':
        var sp=f.c;
        html+='<div class="split-wrap '+cls+'">'+buildSplit(sp.l)+buildSplit(sp.r)+'</div>';break;
      case 'diamond':
        html+='<div class="dia '+cls+'"><div class="dia-diamond">'+
          '<div class="d-line d-lh"></div><div class="d-line d-lv"></div>'+
          '<div class="d-line d-ld1"></div><div class="d-line d-ld2"></div><div class="d-line d-ld3"></div><div class="d-line d-ld4"></div>'+
          '<div class="d-node d-n1">'+f.c[0]+'</div>'+
          '<div class="d-node d-n2">'+f.c[1]+'</div>'+
          '<div class="d-node d-n3">'+f.c[2]+'</div>'+
          '<div class="d-node d-n4">'+f.c[3]+'</div>'+
          '<div class="d-center">'+(f.c[4]||'REACTIVE')+'</div>'+
          '</div></div>';break;
      case 'flow':
        var fh='';f.c.forEach(function(item,i){
          if(i>0) fh+='<div class="f-arrow">→</div>';
          fh+='<div><div class="f-box f-b'+((i%5)+1)+'">'+item.box+'</div>'+(item.label?'<span class="f-label">'+item.label+'</span>':'')+'</div>';
        });
        html+='<div class="dia '+cls+'"><div class="dia-flow">'+fh+'</div></div>';break;
      case 'tree':
        html+='<div class="dia '+cls+'"><div class="dia-tree">'+
          '<div class="t-row"><div class="t-node t-root">'+f.c.root+'</div></div>'+
          '<div class="t-conn"></div>'+
          '<div class="t-row">'+f.c.children.map(function(ch){
            return '<div class="t-node '+(ch.fail?'t-fail':ch.sup?'t-sup':'t-act')+'">'+ch.name+'</div>';
          }).join('<div class="t-hconn"></div>')+'</div>'+
          (f.c.leaf?'<div class="t-conn"></div><div class="t-row">'+f.c.leaf.map(function(l){
            return '<div class="t-node t-act">'+l+'</div>';
          }).join('<div class="t-hconn"></div>')+'</div>':'')+
          '</div></div>';break;
      case 'scale':
        html+='<div class="dia '+cls+'"><div class="dia-scale">'+f.c.map(function(b){
          return '<div><div class="bar b'+b.i+'">'+b.v+'</div><div class="bar-label">'+b.l+'</div></div>';
        }).join('')+'</div></div>';break;
      case 'typewriter':
        html+='<div class="tw-wrap '+cls+'"><div class="tw-text">'+f.c+'</div></div>';break;
    }
  });
  el.innerHTML=html;
  deck.appendChild(el);
});

function buildSplit(b){
  return '<div class="glass"><h3>'+(ICONS[b.icon]?'<span style="display:inline-block;width:20px;height:20px;vertical-align:middle;margin-right:6px">'+ICONS[b.icon]+'</span>':'')+b.head+'</h3><ul>'+b.items.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>'+(b.anti?'<div class="s-anti">'+b.anti+'</div>':'')+'</div>';
}

// ═══ NAVIGATION — PPT-STYLE BACK/FORWARD ═══
function setAccent(idx){
  var ac=SLIDES[idx].accent||'indigo';
  body.className='accent-'+ac;
}

// showSlide: mode='fresh' (reset frags + auto-reveal first), 'restore' (restore saved frag state)
function showSlide(idx,mode){
  if(idx<0||idx>=total) return;
  var prev=document.getElementById('s'+cur);
  var next=document.getElementById('s'+idx);
  if(prev){
    fragState[cur]=curF;
    prev.classList.remove('active');
  }
  cur=idx;
  visited[idx]=true;
  setAccent(idx);
  var frags=next.querySelectorAll('.frag');
  var saved=Math.max(0,Math.min(fragState[idx]||0,frags.length));
  curF=0;
  for(var i=0;i<frags.length;i++) frags[i].classList.remove('vis');
  if(mode==='restore'){
    curF=saved;
    for(var j=0;j<saved;j++) frags[j].classList.add('vis');
  }else{
    setTimeout(revealNext,250);
  }
  next.classList.add('active');
  next.scrollTop=0;
  updateUI();
}

function revealNext(){
  var sl=document.getElementById('s'+cur);
  var frags=sl.querySelectorAll('.frag');
  if(curF<frags.length){
    frags[curF].classList.add('vis');curF++;
    fragState[cur]=curF;
    updateUI();return true;
  }
  return false;
}

function unrevealLast(){
  var sl=document.getElementById('s'+cur);
  var frags=sl.querySelectorAll('.frag');
  if(curF>0){
    curF--;
    frags[curF].classList.remove('vis');
    fragState[cur]=curF;
    updateUI();return true;
  }
  return false;
}

// ArrowRight: reveal next frag → if all shown, next slide
function advance(){
  if(!revealNext()&&cur<total-1){
    var nextIdx=cur+1;
    showSlide(nextIdx,visited[nextIdx]?'restore':'fresh');
  }
}
// ArrowLeft: un-reveal last frag → if none left, prev slide restored to last state
function goBack(){if(!unrevealLast()&&cur>0) showSlide(cur-1,'restore');}

function updateUI(){
  var sl=document.getElementById('s'+cur);
  var frags=sl.querySelectorAll('.frag');
  var pct=((cur+(curF/Math.max(1,frags.length)))/total)*100;
  document.getElementById('progress').style.width=pct+'%';
  document.getElementById('counter').textContent=(cur+1)+' / '+total;
}

// ═══ EVENTS — KEYBOARD ONLY (no click to advance) ═══
document.addEventListener('keydown',function(e){
  if(e.key==='ArrowRight'||e.key===' '||e.key==='Enter'||e.key==='ArrowDown'||e.key==='PageDown'){e.preventDefault();advance();}
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();goBack();}
  else if(e.key==='f'||e.key==='F'){tryFullscreen();}
});
// Touch swipe still works for mobile
var tx=0;
document.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;});
document.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50){d<0?advance():goBack();}});
setTimeout(function(){var h=document.getElementById('navHint');if(h)h.style.opacity='0';},6000);

// ═══ FULLSCREEN ═══
function tryFullscreen(){
  var el=document.documentElement;
  if(!document.fullscreenElement){
    if(el.requestFullscreen) el.requestFullscreen();
    else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if(el.msRequestFullscreen) el.msRequestFullscreen();
  }
}

// ═══ MORPH PRELOADER — ONCE PER SESSION ═══
var overlay=document.getElementById('morph-overlay');
var morphPlayed=sessionStorage.getItem('morphPlayed');

function endMorph(){
  if(!overlay) return;
  sessionStorage.setItem('morphPlayed','1');
  overlay.classList.add('hide');
  setTimeout(function(){
    overlay.style.display='none';
    showSlide(0,'fresh');
    // Auto fullscreen after morph ends (user gesture required for some browsers)
    tryFullscreen();
  },800);
}

if(overlay&&!morphPlayed){
  var mCvs=document.getElementById('morph-canvas');
  var mCtx=mCvs.getContext('2d');
  var imgA=new Image(),imgB=new Image(),ldA=false,ldB=false;
  imgA.onload=function(){ldA=true;tryMorph();};
  imgB.onload=function(){ldB=true;tryMorph();};
  imgA.src='hod1.png';imgB.src='hod2.png';

  function tryMorph(){
    if(!ldA||!ldB)return;
    var ldr=document.querySelector('.morph-loader');if(ldr)ldr.style.display='none';
    var W=mCvs.width=window.innerWidth,H=mCvs.height=window.innerHeight;
    var scale=Math.min(W/imgA.width,H/imgA.height)*.75;
    var dW=Math.round(Math.min(imgA.width,imgB.width)*scale);
    var dH=Math.round(Math.min(imgA.height,imgB.height)*scale);
    var offA=document.createElement('canvas');offA.width=dW;offA.height=dH;
    offA.getContext('2d').drawImage(imgA,0,0,dW,dH);
    var pA=offA.getContext('2d').getImageData(0,0,dW,dH);
    var offB=document.createElement('canvas');offB.width=dW;offB.height=dH;
    offB.getContext('2d').drawImage(imgB,0,0,dW,dH);
    var pB=offB.getContext('2d').getImageData(0,0,dW,dH);
    var out=mCtx.createImageData(dW,dH);
    var oC=document.createElement('canvas');oC.width=dW;oC.height=dH;
    var oX=oC.getContext('2d');
    var ox=Math.round((W-dW)/2),oy=Math.round((H-dH)/2);
    var ph=0,pf=0;
    var FI=30,HA=35,MO=60,HB=40,DI=35;

    function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}
    function tick(){
      mCtx.fillStyle='#f4f1ec';mCtx.fillRect(0,0,W,H);
      var dA=pA.data,dB=pB.data,o=out.data;
      if(ph===0){var t=ease(Math.min(1,pf/FI));for(var i=0;i<dA.length;i+=4){o[i]=244+(dA[i]-244)*t|0;o[i+1]=241+(dA[i+1]-241)*t|0;o[i+2]=236+(dA[i+2]-236)*t|0;o[i+3]=255;}if(pf>=FI){ph=1;pf=-1;}
      }else if(ph===1){for(var i=0;i<dA.length;i+=4){o[i]=dA[i];o[i+1]=dA[i+1];o[i+2]=dA[i+2];o[i+3]=255;}if(pf>=HA){ph=2;pf=-1;}
      }else if(ph===2){var sw=ease(Math.min(1,pf/MO));var edge=dW*.25,sPos=sw*(dW+edge)-edge;for(var i=0;i<dA.length;i+=4){var px=(i/4)%dW;var bl=Math.max(0,Math.min(1,1-(px-sPos+edge)/edge));o[i]=dA[i]+(dB[i]-dA[i])*bl|0;o[i+1]=dA[i+1]+(dB[i+1]-dA[i+1])*bl|0;o[i+2]=dA[i+2]+(dB[i+2]-dA[i+2])*bl|0;o[i+3]=255;}if(pf>=MO){ph=3;pf=-1;}
      }else if(ph===3){for(var i=0;i<dB.length;i+=4){o[i]=dB[i];o[i+1]=dB[i+1];o[i+2]=dB[i+2];o[i+3]=255;}if(pf>=HB){ph=4;pf=-1;}
      }else if(ph===4){var t=ease(Math.min(1,pf/DI));for(var i=0;i<dB.length;i+=4){o[i]=dB[i]+(244-dB[i])*t|0;o[i+1]=dB[i+1]+(241-dB[i+1])*t|0;o[i+2]=dB[i+2]+(236-dB[i+2])*t|0;o[i+3]=255;}if(pf>=DI){endMorph();return;}
      }
      oX.putImageData(out,0,0);mCtx.drawImage(oC,ox,oy);
      pf++;requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  // Skip morph on click or key
  overlay.addEventListener('click',endMorph);
  document.addEventListener('keydown',function sk(e){if(overlay.style.display!=='none'){endMorph();document.removeEventListener('keydown',sk);}});
}else{
  // Morph already played or no overlay
  if(overlay) overlay.style.display='none';
  showSlide(0,'fresh');
}
})();
