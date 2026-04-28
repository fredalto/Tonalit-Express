const SHARP_ORDER = ['Fa♯','Do♯','Sol♯','Ré♯','La♯','Mi♯','Si♯'];
const FLAT_ORDER = ['Si♭','Mi♭','La♭','Ré♭','Sol♭','Do♭','Fa♭'];
const KEYS = [
  {n:0,type:'none',key:'Do Majeur',minor:'La mineur'},
  {n:1,type:'sharp',key:'Sol Majeur',minor:'Mi mineur'},
  {n:2,type:'sharp',key:'Ré Majeur',minor:'Si mineur'},
  {n:3,type:'sharp',key:'La Majeur',minor:'Fa♯ mineur'},
  {n:4,type:'sharp',key:'Mi Majeur',minor:'Do♯ mineur'},
  {n:5,type:'sharp',key:'Si Majeur',minor:'Sol♯ mineur'},
  {n:6,type:'sharp',key:'Fa♯ Majeur',minor:'Ré♯ mineur'},
  {n:7,type:'sharp',key:'Do♯ Majeur',minor:'La♯ mineur'},
  {n:1,type:'flat',key:'Fa Majeur',minor:'Ré mineur'},
  {n:2,type:'flat',key:'Si♭ Majeur',minor:'Sol mineur'},
  {n:3,type:'flat',key:'Mi♭ Majeur',minor:'Do mineur'},
  {n:4,type:'flat',key:'La♭ Majeur',minor:'Fa mineur'},
  {n:5,type:'flat',key:'Ré♭ Majeur',minor:'Si♭ mineur'},
  {n:6,type:'flat',key:'Sol♭ Majeur',minor:'Mi♭ mineur'},
  {n:7,type:'flat',key:'Do♭ Majeur',minor:'La♭ mineur'}
];
let state={mode:'mixed',pool:[],i:0,total:0,score:0,current:null,reverse:false,challenge:false};
function $(id){return document.getElementById(id)}
function go(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('show'));$(id).classList.add('show'); if(id==='tuto') setTutorial('memory')}
function setTutorial(kind){
 ['Sharp','Flat','Memory','Plus'].forEach(k=>$('tab'+k).classList.remove('selected'));
 const box=$('tutorialContent');
 if(kind==='memory'){
   $('tabMemory').classList.add('selected');
   box.innerHTML=`<div class="tutorial-card"><h3>À savoir par cœur</h3>
   <div class="exception-box"><strong>Exceptions à connaître absolument</strong><br><span>Do Majeur</span> : rien à la clé<br><span>Fa Majeur</span> : 1 bémol à la clé</div>
   <div class="memo-grid"><div class="memo"><strong>Ordre des dièses</strong><br>${SHARP_ORDER.join(' → ')}</div><div class="memo"><strong>Ordre des bémols</strong><br>${FLAT_ORDER.join(' → ')}</div></div>
   <p class="mini-note">Commence par mémoriser ces 4 choses. Ensuite les méthodes deviennent beaucoup plus simples.</p>
   <div class="quick-actions"><button onclick="setTutorial('sharp')">Comprendre les dièses</button><button onclick="setTutorial('flat')">Comprendre les bémols</button></div></div>`;
 }
 if(kind==='sharp'){
   $('tabSharp').classList.add('selected');
   box.innerHTML=`<div class="tutorial-card"><h3>Armure avec des dièses ♯</h3>${staffSvg({type:'sharp',n:3})}<p class="rule">Dernier dièse + ½ ton diatonique = tonalité majeure.</p><div class="example"><strong>Exemple :</strong><br>Il y a Fa♯, Do♯, Sol♯.<br>Le dernier dièse est <strong>Sol♯</strong>.<br>Sol♯ + ½ ton = <strong>La</strong>.<br>Donc : <strong>La Majeur</strong>.</div><button onclick="startTraining('sharps')">Je m’entraîne avec les dièses</button></div>`;
 }
 if(kind==='flat'){
   $('tabFlat').classList.add('selected');
   box.innerHTML=`<div class="tutorial-card"><h3>Armure avec des bémols ♭</h3>${staffSvg({type:'flat',n:4})}<p class="rule">Avant-dernier bémol = tonalité majeure.</p><div class="example"><strong>Exemple :</strong><br>Il y a Si♭, Mi♭, La♭, Ré♭.<br>L’avant-dernier bémol est <strong>La♭</strong>.<br>Donc : <strong>La♭ Majeur</strong>.<br><br>⚠ Exception : <strong>1 bémol = Fa Majeur</strong>.</div><button onclick="startTraining('flats')">Je m’entraîne avec les bémols</button></div>`;
 }
 if(kind==='plus'){
   $('tabPlus').classList.add('selected');
   box.innerHTML=`<div class="tutorial-card"><h3>En plus</h3><div class="memo plus-memo"><strong>Relatives mineures</strong><br>Majeur − 3ce mineure = mineur relatif.<br>Exemple : Do Majeur → La mineur.</div>${recapTable()}</div>`;
 }
}
function startTraining(mode){state={mode,pool:getPool(mode),i:0,total:8,score:0,reverse:false,challenge:false};go('game');$('gameTitle').textContent='Entraînement';nextQuestion()}
function startChallenge(){state={mode:'mixed',pool:getPool('mixed'),i:0,total:10,score:0,reverse:false,challenge:true};go('game');$('gameTitle').textContent='Défi 10 questions';nextQuestion()}
function startReverse(){state={mode:'reverse',pool:getPool('mixed'),i:0,total:8,score:0,reverse:true,challenge:false};go('game');$('gameTitle').textContent='Tonalité → armure';nextQuestion()}
function getPool(mode){if(mode==='sharps')return KEYS.filter(k=>k.type==='sharp'); if(mode==='flats')return KEYS.filter(k=>k.type==='flat'); return KEYS.slice();}
function nextQuestion(){if(state.i>=state.total)return showResults(); $('feedback').innerHTML=''; $('nextBtn').classList.add('hidden'); $('answers').innerHTML=''; state.current=random(state.pool); state.i++; $('progress').textContent=`${state.i}/${state.total} — score ${state.score}`; renderQuestion(state.current)}
function renderQuestion(k){ if(state.reverse){$('questionType').textContent='Trouver l’armure'; $('staffBox').innerHTML=''; $('questionText').textContent=`Quelle armure pour ${k.key} ?`; const opts=makeOptions(k,'armure'); opts.forEach(o=>addAnswer(o.label, o.correct, explainReverse(k))); return;}
 $('questionType').textContent = k.type==='sharp'?'Armure en dièses':k.type==='flat'?'Armure en bémols':'Aucune altération'; $('staffBox').innerHTML=staffSvg(k); $('questionText').textContent='Quelle est la tonalité majeure ?'; makeOptions(k,'key').forEach(o=>addAnswer(o.label,o.correct,explainKey(k)));}
function makeOptions(k,kind){let labels;if(kind==='key'){labels=[k.key]; while(labels.length<4){let x=random(KEYS).key;if(!labels.includes(x))labels.push(x)}} else {labels=[armureLabel(k)]; while(labels.length<4){let x=armureLabel(random(KEYS)); if(!labels.includes(x))labels.push(x)}} return shuffle(labels).map(label=>({label,correct:kind==='key'?label===k.key:label===armureLabel(k)}));}
function addAnswer(label,correct,explanation){const b=document.createElement('button');b.textContent=label;b.onclick=()=>answer(b,correct,explanation);$('answers').appendChild(b)}
function answer(btn,correct,explanation){document.querySelectorAll('#answers button').forEach(b=>b.disabled=true); if(correct){state.score++;btn.classList.add('good');$('feedback').innerHTML=`<span class="ok">Bravo !</span><br>${explanation}`;}else{btn.classList.add('wrong');$('feedback').innerHTML=`<span class="ko">Presque...</span><br>${explanation}`; document.querySelectorAll('#answers button').forEach(b=>{if(b.textContent===(state.reverse?armureLabel(state.current):state.current.key))b.classList.add('good')})} $('progress').textContent=`${state.i}/${state.total} — score ${state.score}`; $('nextBtn').classList.remove('hidden')}
function explainKey(k){ if(k.type==='none') return 'Do Majeur : il n’y a rien à la clé.'; if(k.type==='sharp'){const last=SHARP_ORDER[k.n-1]; return `Avec les dièses : dernier dièse = ${last}. On ajoute ½ ton : ${k.key}.`;} if(k.n===1)return 'Avec 1 bémol, c’est l’exception : Fa Majeur.'; return `Avec les bémols : l’avant-dernier bémol donne la tonalité : ${k.key}.`;}
function explainReverse(k){ if(k.type==='none')return 'Do Majeur : rien à la clé.'; if(k.type==='sharp')return `${k.key} : on descend d’½ ton et on récite l’ordre des dièses jusqu’à ${SHARP_ORDER[k.n-1]}.`; if(k.n===1)return 'Fa Majeur : 1 bémol à la clé.'; return `${k.key} : on récite l’ordre des bémols jusqu’à la note de la tonalité, puis on ajoute un bémol.`;}
function armureLabel(k){if(k.type==='none')return 'Rien à la clé';return `${k.n} ${k.type==='sharp'?'dièse'+(k.n>1?'s':''):'bémol'+(k.n>1?'s':'')}`}
function showResults(){go('results');$('scoreBig').textContent=`${state.score}/${state.total}`; const p=state.score/state.total; $('scoreText').textContent=p>=.9?'Excellent : les tonalités sont très solides !':p>=.7?'Très bien : encore quelques réflexes à automatiser.':p>=.5?'C’est en route : refais un tuto puis un entraînement.':'On reprend tranquillement : dièses puis bémols séparément.'}
function staffSvg(k){const sharpPos=[42,62,34,54,74,46,66], flatPos=[66,46,74,54,82,62,90]; let items=''; if(k.type==='sharp') for(let i=0;i<k.n;i++) items+=`<text class="acc" x="${125+i*28}" y="${sharpPos[i]}" font-size="32">♯</text>`; if(k.type==='flat') for(let i=0;i<k.n;i++) items+=`<text class="acc" x="${125+i*28}" y="${flatPos[i]}" font-size="32">♭</text>`; return `<svg viewBox="0 0 520 130" role="img" aria-label="armure"><rect x="0" y="0" width="520" height="130" rx="12" fill="#fff"/><g stroke="#222" stroke-width="1.4">${[34,46,58,70,82].map(y=>`<line x1="35" y1="${y}" x2="485" y2="${y}"/>`).join('')}</g><text x="54" y="82" font-size="62" font-family="Georgia">𝄞</text>${items}</svg>`}
function recapTable(){
 const sharps=KEYS.filter(k=>k.type==='none'||k.type==='sharp');
 const flats=KEYS.filter(k=>k.type==='flat');
 const rows=arr=>arr.map(k=>`<tr><td class="armure-cell">${staffSvg(k)}</td><td>${k.key}</td><td>${k.minor}</td></tr>`).join('');
 return `<h3 class="table-title">Tableau récapitulatif</h3><p class="mini-note">Armure en clé de sol, tonalité majeure et relative mineure.</p><h4>Armures avec dièses</h4><table class="table recap-table"><tr><th>Armure</th><th>Majeur</th><th>Mineur relatif</th></tr>${rows(sharps)}</table><h4>Armures avec bémols</h4><table class="table recap-table"><tr><th>Armure</th><th>Majeur</th><th>Mineur relatif</th></tr>${rows(flats)}</table>`;
}
function random(arr){return arr[Math.floor(Math.random()*arr.length)]} function shuffle(a){return a.sort(()=>Math.random()-0.5)}
setTutorial('memory');
