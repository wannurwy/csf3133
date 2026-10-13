const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const theme = $('#theme');
theme?.addEventListener('click',()=>{document.body.classList.toggle('dark');theme.setAttribute('aria-pressed',document.body.classList.contains('dark')?'true':'false');});

$$('.reveal').forEach(button=>button.addEventListener('click',()=>{const panel=document.getElementById(button.dataset.target);if(!panel)return;panel.hidden=!panel.hidden;button.textContent=panel.hidden?'Reveal examples ＋':'Hide examples −';}));
$('#showAnswer')?.addEventListener('click',()=>{const answer=$('#promptAnswer');answer.hidden=!answer.hidden;$('#showAnswer').textContent=answer.hidden?'Show a possible answer':'Hide possible answer';});

const demo=$('#demoPage');
$('#contrast')?.addEventListener('click',()=>{demo.classList.toggle('high-contrast');$('#demoCaption').textContent=demo.classList.contains('high-contrast')?'High-contrast demo enabled. Discuss whether text, controls and focus indicators remain clear.':'Default contrast restored. Compare the text and background carefully.';});
$('#textSize')?.addEventListener('click',()=>{demo.classList.toggle('large-text');$('#demoCaption').textContent=demo.classList.contains('large-text')?'Larger text enabled. Check whether the layout still works without clipping or overlap.':'Default text size restored.';});
$('#layoutSelect')?.addEventListener('change',e=>{demo.classList.remove('single-layout','compact-layout');if(e.target.value==='single')demo.classList.add('single-layout');if(e.target.value==='compact')demo.classList.add('compact-layout');});
$('#accentSelect')?.addEventListener('change',e=>{demo.classList.remove('accent-green','accent-purple');if(e.target.value==='green')demo.classList.add('accent-green');if(e.target.value==='purple')demo.classList.add('accent-purple');});
$('#resetDesign')?.addEventListener('click',()=>{demo.className='demopage';$('#contrast').textContent='◐ Contrast';$('#textSize').textContent='A+ Text';$('#layoutSelect').value='balanced';$('#accentSelect').value='blue';$('#demoCaption').textContent='Try contrast and text size. What changed? What remains important to test?';});

const checks=$$('.audit input[type="checkbox"]');
function updateAudit(){const n=checks.filter(c=>c.checked).length;$('#auditCount').textContent=`${n} of ${checks.length} checked`;$('#auditFeedback').textContent=n===checks.length?'All checklist items marked. Discuss the evidence your group observed.':n>0?'Keep checking the website and record examples to support each judgement.':'';}
checks.forEach(c=>c.addEventListener('change',updateAudit));
$('#copyAudit')?.addEventListener('click',async()=>{const selected=checks.filter(c=>c.checked).map(c=>'• '+c.value);const txt='CSF3133 Topic 2 — Website accessibility audit\\nChecked items:\\n'+(selected.length?selected.join('\\n'):'No items checked yet.')+'\\n\\nNote: classroom checklist only; not a formal WCAG conformance result.';try{await navigator.clipboard.writeText(txt);$('#auditFeedback').textContent='Group summary copied.';}catch(e){$('#auditFeedback').textContent=txt;}});

const questions=[
 {q:'Which website organization is usually suitable for a step-by-step tutorial?',a:['Random organization','Linear organization','Hierarchical organization','No navigation'],correct:1,why:'A linear structure presents pages in a sequence for users to follow.'},
 {q:'Which set contains the four basic visual design principles in the lecture?',a:['Repetition, contrast, proximity, alignment','Speed, colour, animation, sound','HTML, CSS, JavaScript, URL','Header, server, browser, footer'],correct:0,why:'The lecture identifies repetition, contrast, proximity and alignment.'},
 {q:'What is the main purpose of a wireframe?',a:['To publish the final website','To measure network speed','To sketch the structure and placement of page elements','To replace accessibility testing'],correct:2,why:'A wireframe is a sketch or blueprint showing the main page elements.'},
 {q:'What does responsive web design aim to do?',a:['Show exactly the same fixed layout on every device','Adapt a page to different screen sizes and viewing contexts','Remove navigation from mobile devices','Make all images full-screen'],correct:1,why:'Responsive design adapts layout and content to different viewing contexts.'},
 {q:'In WCAG, what does the “O” in POUR stand for?',a:['Organised','Optimised','Operable','Open'],correct:2,why:'Operable means users can operate interface components and navigate content.'},
 {q:'Which is a good accessibility practice for informative images?',a:['Use meaningful alternative text','Put all text inside an image','Use colour alone to communicate meaning','Make the image flash continuously'],correct:0,why:'Meaningful alternative text can communicate relevant image information to users who cannot see it.'}
];
let qi=0, chosen=null, checked=false, score=0;
function renderQuiz(){
 const q=questions[qi];$('#quizCount').textContent=`QUESTION ${qi+1} OF ${questions.length}`;$('#progress').style.width=`${((qi+1)/questions.length)*100}%`;
 $('#quizContent').innerHTML=`<h3>${q.q}</h3><div class="answers">${q.a.map((a,i)=>`<label class="answer"><input type="radio" name="quizAnswer" value="${i}" ${chosen===i?'checked':''} ${checked?'disabled':''}><span>${a}</span></label>`).join('')}</div>`;
 $('#quizFeedback').textContent=checked?(chosen===q.correct?'Correct. ':'Not quite. ')+q.why:'Choose one answer.';$('#quizNext').disabled=chosen===null&&!checked;$('#quizNext').textContent=checked?(qi===questions.length-1?'See result':'Next question →'):'Check answer';
 $$('#quizContent input').forEach(input=>input.addEventListener('change',()=>{chosen=Number(input.value);$('#quizNext').disabled=false;}));
}
$('#quizNext')?.addEventListener('click',()=>{if(!checked){if(chosen===null)return;checked=true;if(chosen===questions[qi].correct)score++;renderQuiz();}else if(qi<questions.length-1){qi++;chosen=null;checked=false;renderQuiz();}else{$('#quizContent').innerHTML=`<div class="result"><h3>You scored ${score} out of ${questions.length}.</h3><p>${score>=5?'Excellent work. Keep applying these principles when reviewing real websites.':score>=3?'Good start. Review the explanations and try connecting each concept to a real website.':'Review the lecture slides and revisit the examples, then try again.'}</p></div>`;$('#quizCount').textContent='QUIZ COMPLETE';$('#progress').style.width='100%';$('#quizFeedback').textContent='';$('#quizNext').disabled=true;$('#quizNext').textContent='Completed';}});
$('#quizReset')?.addEventListener('click',()=>{qi=0;chosen=null;checked=false;score=0;renderQuiz();});
renderQuiz();

$('#copyReflection')?.addEventListener('click',async()=>{const text=$('#exitTicket').value.trim();if(!text){$('#reflectionFeedback').textContent='Write a short reflection first.';return;}try{await navigator.clipboard.writeText(text);$('#reflectionFeedback').textContent='Reflection copied.';}catch(e){$('#reflectionFeedback').textContent='Your reflection is ready to select and copy.';}});
