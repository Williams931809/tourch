
/* Presentation-only data. Never sent to Supabase or used for real grading. */
const levels=['KG 1','KG 2','Nursery 1','Nursery 2','Primary 1','Primary 2','Primary 3','Primary 4','Primary 5','Primary 6','JSS 1','JSS 2','JSS 3','SS 1','SS 2','SS 3'];
const subjectNames=['English Language','Mathematics','Basic Science','Basic Technology','Social Studies','Civic Education','Computer Studies','Agricultural Science','Physical & Health Education','Cultural & Creative Arts','Christian Religious Studies','Literature in English','Biology','Chemistry','Physics','Further Mathematics','Economics','Government','Geography','Financial Accounting','Commerce','Business Studies','Home Economics','Phonics','Handwriting','Numeracy','Literacy','Rhymes & Stories'];
const names=['Amara Okafor','David Osagie','Zara Bello','Chisom Eze','Mariam Yusuf','Samuel Omoregie','Teni Adebayo','Ifeoma Nwosu','Emmanuel Aigbe','Grace Uwagboe','Michael Obi','Precious Efe','Joshua Igbinoba','Hannah Akpata','Daniel Okon','Esther Bello','Faith Okafor','Peter Odion','Miracle Ojo','Cynthia Nwosu','Victory Ehizogie','Deborah Abiola','Joseph Osaze','Helen Oghogho','Sophia Adeyemi','Ethan Ede','Ruth Akenzua','Benjamin Udo','Adaeze Ibe','Ose Ogbebor','Oluwatobi Fashola','Divine Egharevba'];
const mentors=[['Mrs Ada Eze','Mathematics',['JSS 1','JSS 2','JSS 3','SS 1','SS 2','SS 3']],['Mr Daniel Osagie','English Language',['JSS 1','JSS 2','SS 1','SS 2']],['Mrs Favour Bello','Numeracy',['KG 1','KG 2','Nursery 1','Nursery 2']],['Mr Kelvin Aigbe','Biology',['SS 1','SS 2','SS 3']],['Mrs Ruth Omoregie','Literacy',['KG 1','KG 2','Nursery 1','Nursery 2']],['Mr Efe Emeka','Physics',['SS 1','SS 2','SS 3']],['Mrs Halima Musa','Chemistry',['SS 1','SS 2','SS 3']],['Mr Charles Okoro','Basic Science',['JSS 1','JSS 2','JSS 3']],['Mrs Victoria Edo','English Language',['Primary 1','Primary 2','Primary 3','Primary 4','Primary 5','Primary 6']],['Mr Kingsley Ize','Computer Studies',['JSS 1','JSS 2','JSS 3','SS 1','SS 2']]];
const demo={
 students:names.map((name,i)=>({id:'ST'+String(i+1).padStart(3,'0'),name,level:levels[i%levels.length],grade:65+(i*13)%32,attendance:['Present','Present','Present','Late','Present','Absent'][i%6],parent:['Mrs Okafor','Mr Osagie','Mrs Bello','Mrs Eze','Mr Yusuf'][i%5]})),
 staff:mentors.map((m,i)=>({id:'TR'+(i+1),name:m[0],subject:m[1],classes:[...m[2]],phone:'080-5550-'+String(1000+i)})),
 classes:levels.map((name,i)=>({id:'CL'+i,name,capacity:i<4?25:35})),
 subjects:subjectNames.map((name,i)=>({id:'SU'+i,name})),
 exams:[
 ['JSS 2 Mathematics — Fractions & Decimals','JSS 2','Mathematics',20,60,'Published'],
 ['SS 2 English — Comprehension','SS 2','English Language',30,90,'Published'],
 ['SS 1 Biology — Cells and Tissues','SS 1','Biology',25,60,'Draft'],
 ['Primary 5 Mathematics — Decimals','Primary 5','Mathematics',20,45,'Published'],
 ['JSS 3 Basic Science — Energy','JSS 3','Basic Science',30,60,'Scheduled'],
 ['SS 3 Physics — Electricity','SS 3','Physics',25,60,'Draft'],
 ['Nursery 2 Numeracy — Counting','Nursery 2','Numeracy',10,25,'Published'],
 ['Primary 3 English — Reading','Primary 3','English Language',15,45,'Published']
 ].map((r,i)=>({id:'EX'+i,title:r[0],level:r[1],subject:r[2],questions:r[3],duration:r[4],status:r[5]})),
 lessons:[
 ['Introduction to Fractions','JSS 2','Mathematics','Equivalent fractions, simplifying, mixed numbers and operations on fractions.'],
 ['Cell Structure and Functions','SS 1','Biology','Plant and animal cells, cell membrane, cytoplasm, nucleus and organelles.'],
 ['Comprehension Strategies','SS 2','English Language','Skimming, scanning, identifying main ideas and inferential questions.'],
 ['Counting Numbers 1–20','KG 2','Numeracy','Counting games, number recognition and matching objects to numbers.'],
 ['Basic Electricity','SS 3','Physics','Current, resistance, Ohm’s law, conductors and series circuits.'],
 ['Introduction to Computers','JSS 1','Computer Studies','Computer hardware, input devices, storage and simple ICT safety.']
 ].map((r,i)=>({id:'LE'+i,title:r[0],level:r[1],subject:r[2],body:r[3],status:'Published'})),
 announcements:[
 {title:'Welcome to 2026/2027 Academic Session',body:'We look forward to another outstanding academic year at Torch Bearers Academy.',date:'22 Oct 2026'},
 {title:'Parent–Teacher Conference',body:'Parents and guardians are invited to discuss learner progress and school activities.',date:'21 Oct 2026'},
 {title:'Continuous Assessment Week',body:'Teachers will conduct class assessments and update termly progress scores.',date:'20 Oct 2026'},
 {title:'STEM Innovation Day',body:'Learners will present science projects and problem-solving demonstrations.',date:'18 Oct 2026'}],
 assignments:[],
 marks:[]
};
function h(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}
function table(rows,head,cols){return '<div class="scroll"><table><thead><tr>'+head.map(x=>'<th>'+h(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+cols.map(c=>'<td>'+h(typeof c==='function'?c(r):r[c])+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
function stats(items){return '<div class="cards">'+items.map(([label,value,sub])=>'<div class="stat"><div class="tiny muted">'+h(label)+'</div><b>'+h(value)+'</b><span class="meta">'+h(sub)+'</span></div>').join('')+'</div>';}
function formField(label,id,opts){return '<div class="field"><label>'+h(label)+'</label>'+(Array.isArray(opts)?'<select id="'+id+'">'+opts.map(x=>'<option>'+h(x)+'</option>').join('')+'</select>':'<input id="'+id+'" placeholder="'+h(opts||label)+'">')+'</div>';}
function demoMarkup(content){return '<div class="notice" style="background:#fff3d9;border:1px solid #e4b861;margin-bottom:18px"><b>DEMO MODE — ALL PEOPLE, GRADES AND ACTIVITY ARE FICTIONAL</b><p class="tiny">Illustrative school data for presentations only. Nothing on this screen is saved to real student records.</p></div>'+content;}
const optionRow=a=>a.map(x=>'<option>'+h(x)+'</option>').join('');
const choices=arr=>'<select id="demoClass" style="width:100%;max-width:380px">'+optionRow(arr)+'</select>';
function teacherAssignments(){return demo.staff.flatMap(t=>t.classes.map(level=>({name:t.name,subject:t.subject,level}))); }
export function demoRoleAllowed(name,role){return role==='admin'||role==='teacher'||role==='student'||role==='parent';}
export function renderDemo(section,role,render,notify){
 const teacher=demo.staff[0],child=demo.students[0];
 const staffScoped=role==='teacher'?demo.staff.filter(t=>t.id===teacher.id):demo.staff;
 const teacherLevels=role==='teacher'?teacher.classes:levels;
 const shownStudents=role==='teacher'?demo.students.filter(s=>teacherLevels.includes(s.level)):role==='student'?[child]:role==='parent'?[child]:demo.students;
 const samples=role==='teacher'?demo.exams.filter(e=>teacherLevels.includes(e.level)&&e.subject===teacher.subject):role==='student'?demo.exams.filter(e=>e.level===child.level):demo.exams;
 let html='';
 if(section==='Overview'||section==='Demo Showcase'){
 html='<div class="hero"><div class="eyebrow">TORCH BEARERS ACADEMY · 2026/2027</div><h2>Welcome to your '+h(role)+' dashboard</h2><p>Always Ahead — Benin City. Explore populated sample records throughout every section.</p></div>'+stats([['Students',486,'Sample enrollment'],['Teachers',32,'Sample staff'],['Classes',demo.classes.length,'KG to SS3'],['Attendance','94.6%','Illustrative today']])+
 '<div class="split"><div class="card"><h2>Recent school announcements</h2>'+demo.announcements.map(x=>'<p><b>'+h(x.title)+'</b><br><span class="tiny muted">'+h(x.date)+'</span><br>'+h(x.body)+'</p>').join('')+'</div><div class="card"><h2>Next scheduled assessments</h2>'+table(demo.exams.slice(0,5),['Examination','Class','Status'],['title','level','status'])+'</div></div>';
 }else if(section==='Students'){
 html=stats([['Student profiles',486,'Presentation figure'],['Sample rows',shownStudents.length,'Fictional records'],['Average performance','84%','Illustrative']])+'<div class="card"><h2>Student directory</h2><p class="muted tiny">Showing sample learner records and admission numbers.</p>'+table(shownStudents,['Admission no.','Student','Class','Average','Attendance'],['id','name','level',r=>r.grade+'%','attendance'])+'</div>';
 }else if(section==='Staff'){
 html=stats([['Teachers',32,'Illustrative total'],['Subject specialists',demo.staff.length,'Sample staff records'],['Multi-class teaching','Enabled','Per subject / class']])+'<div class="card"><h2>Staff directory & teaching responsibilities</h2>'+table(demo.staff,['Staff member','Specialist subject','Assigned classes','Phone'],['name','subject',r=>r.classes.join(', '),'phone'])+'</div>';
 }else if(section==='Classes & Subjects'||section==='My Classes'){
 const list=role==='teacher'?demo.classes.filter(c=>teacherLevels.includes(c.name)):role==='student'||role==='parent'?demo.classes.filter(c=>c.name===child.level):demo.classes;
 html=stats([['Classes',list.length,'Available in this view'],['Subjects',demo.subjects.length,'Available subjects'],['Teacher assignments',teacherAssignments().length,'Illustrative allocations']])+'<div class="split"><div class="card"><h2>Class register</h2>'+table(list,['Class','Capacity','Students'],['name','capacity',r=>24+(r.name.length%11)])+'</div><div class="card"><h2>Subject directory</h2>'+table(demo.subjects,['Subject'],['name'])+'</div></div>'+
 '<div class="card"><h2>Teacher ↔ class ↔ subject allocation</h2><p>A teacher may teach multiple classes. Each class-and-subject assignment is independent.</p>'+table(role==='teacher'?teacherAssignments().filter(x=>x.name===teacher.name):teacherAssignments(),['Teacher','Subject','Class'],['name','subject','level'])+'</div>';
 if(role==='admin'&&section==='Classes & Subjects')html+='<div class="card"><h2>Try a teaching assignment (demo only)</h2><div class="form-grid">'+formField('Teacher','dTeacher',demo.staff.map(x=>x.name))+formField('Subject','dSubject',demo.subjects.map(x=>x.name))+'</div><div class="field"><label>Choose any number of classes</label><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:8px">'+levels.map(c=>'<label class="tiny"><input type="checkbox" data-demo-level="'+h(c)+'"> '+h(c)+'</label>').join('')+'</div></div><button class="btn" id="demoAssign">Assign selected classes</button></div>';
 }else if(section==='Lessons'){
 const list=role==='teacher'?demo.lessons.filter(x=>x.subject===teacher.subject&&teacherLevels.includes(x.level)):demo.lessons;
 html=stats([['Published lessons',list.length,'Illustrative library'],['Formats','Voice · PDF · Text','Supported workflows']])+'<div class="card"><h2>Learning materials</h2>'+table(list,['Lesson','Class','Subject','Status'],['title','level','subject','status'])+'</div>';
 if(role==='admin'||role==='teacher')html+='<div class="card"><h2>Compose lesson (demo)</h2><div class="form-grid">'+formField('Title','dLessonTitle','e.g. Introduction to Algebra')+formField('Class','dLessonClass',teacherLevels)+formField('Subject','dLessonSubject',role==='teacher'?[teacher.subject]:demo.subjects.map(s=>s.name))+'</div><textarea id="dLessonBody" placeholder="Enter an example lesson plan..."></textarea><button class="btn" id="demoLessonSave">Save sample lesson</button></div>';
 }else if(section==='Examinations'||section==='Take Exam'){
 html=stats([['Exam papers',samples.length,'Example papers'],['Objective marking','Automatic','Demo workflow'],['Theory review','Teacher assisted','Approval needed']])+'<div class="card"><h2>Examination timetable & question banks</h2>'+table(samples,['Examination','Class','Subject','Questions','Duration','Status'],['title','level','subject','questions',r=>r.duration+' min','status'])+'</div>';
 if(section==='Take Exam')html+='<div class="card"><h2>Practice assessment (demo)</h2><p>Mathematics: What is ½ + ¼?</p><label><input type="radio" name="demoQ" value="a"> ¾</label> &nbsp; <label><input type="radio" name="demoQ" value="b"> ⅔</label><p><button class="btn" id="demoAnswer">Submit sample answer</button></p></div>';
 else html+='<div class="card"><h2>New exam (demo)</h2><div class="form-grid">'+formField('Examination title','dExamTitle','Assessment title')+formField('Class','dExamClass',teacherLevels)+formField('Subject','dExamSubject',role==='teacher'?[teacher.subject]:demo.subjects.map(s=>s.name))+'</div><button class="btn" id="demoExamSave">Create sample exam</button></div>';
 }else if(section==='Marking'||section==='Assessments'||section==='My Results'){
 html=stats([['CA average','27/30','Fictional scores'],['Exam average','54/70','Fictional scores'],['Overall pass rate','91%','Illustrative']])+'<div class="card"><h2>'+h(section==='Marking'?'Theory scripts awaiting review':'Continuous assessment and examination scores')+'</h2>'+table(shownStudents.slice(0,14),['Student','Class','CA / 30','Exam / 70','Total / 100','Grade'],['name','level',r=>Math.round(r.grade*.3),r=>Math.round(r.grade*.7),'grade',r=>r.grade>=80?'A':r.grade>=70?'B':'C'])+'</div>';
 if(section==='Marking')html+='<div class="card"><h2>Sample theory grading</h2><p><b>Question:</b> Explain the difference between a conductor and an insulator.</p><p><b>Sample response:</b> A conductor allows electricity to flow easily, while an insulator resists current.</p>'+formField('Awarded marks / 10','dMarks','8')+'<button class="btn" id="demoMark">Record sample grade</button></div>';
 }else if(section==='Attendance'){
 const list=shownStudents.slice(0,16);
 html=stats([['Attendance today','94.6%','Illustrative'],['Present',28,'Example class count'],['Absent',2,'Example class count']])+'<div class="card"><h2>Attendance register — 24 October 2026</h2>'+table(list,['Student','Class','Status'],['name','level','attendance'])+'</div>';
 if(role==='admin'||role==='teacher')html+='<div class="card"><h2>Record example attendance</h2><div class="form-grid">'+formField('Student','dAttendanceStudent',list.map(s=>s.name))+formField('Status','dAttendanceStatus',['Present','Absent','Late','Excused'])+'</div><button class="btn" id="demoAttendanceSave">Save demo status</button></div>';
 }else if(section==='Report Cards'){
 html='<div class="card"><h2>Termly report cards — First term 2026/2027</h2><p class="muted">Illustrative report previews, teacher comments and approval status.</p>'+table(shownStudents.slice(0,14),['Student','Class','Average','Result','Approval'],['name','level',r=>r.grade+'%',r=>r.grade>=70?'Pass':'Needs support',r=>r.grade>=75?'Approved':'Pending review'])+'</div><div class="card"><h2>Report preview: '+h(shownStudents[0]?.name||'Student')+'</h2><p>Student performance is progressing well in core subjects. Recommended next step: guided revision and regular practice.</p><button class="btn secondary" id="demoReport">Preview report summary</button></div>';
 }else if(section==='Announcements'){
 html='<div class="card"><h2>School announcements</h2>'+demo.announcements.map(x=>'<div style="padding:17px 0;border-bottom:1px solid #eee"><b>'+h(x.title)+'</b><p class="tiny muted">'+h(x.date)+'</p><p>'+h(x.body)+'</p></div>').join('')+'</div>';
 if(role==='admin'||role==='teacher')html+='<div class="card"><h2>Draft a demo announcement</h2>'+formField('Title','dAnnouncementTitle','Announcement title')+'<textarea id="dAnnouncementBody" placeholder="Message..."></textarea><button class="btn" id="demoAnnouncementSave">Publish sample announcement</button></div>';
 }else if(section==='Parents'||section==='My Children'){
 const parents=shownStudents.slice(0,12).map(s=>({name:s.parent,child:s.name,level:s.level,contact:'080-5550-1200'}));
 html=stats([['Parent accounts',325,'Illustrative total'],['Linked children',486,'Illustrative total']])+'<div class="card"><h2>Parents and linked learners</h2>'+table(parents,['Parent / guardian','Student','Class','Contact'],['name','child','level','contact'])+'</div>';
 }else{
 html='<div class="card"><h2>'+h(section)+'</h2><p>Explore example school data through the menu.</p></div>';
 }
 render(demoMarkup(html));
 const $=id=>document.getElementById(id);
 if($('demoAssign'))$('demoAssign').onclick=()=>{
  const name=$('dTeacher').value,subject=$('dSubject').value,classes=[...document.querySelectorAll('[data-demo-level]:checked')].map(x=>x.dataset.demoLevel);
  if(!classes.length)return notify('Choose at least one class',true);
  const t=demo.staff.find(x=>x.name===name);if(!t)return;
  if(t.subject!==subject){const clone={...t,id:t.id+'X'+demo.staff.length,subject,classes:[...classes]};demo.staff.push(clone);}
  else t.classes=[...new Set([...t.classes,...classes])];
  notify('Sample teaching allocations updated');renderDemo(section,role,render,notify);
 };
 if($('demoLessonSave'))$('demoLessonSave').onclick=()=>{
  const title=$('dLessonTitle').value.trim(),body=$('dLessonBody').value.trim();if(!title||!body)return notify('Enter a title and lesson content',true);
  demo.lessons.unshift({title,body,level:$('dLessonClass').value,subject:$('dLessonSubject').value,status:'Draft'});
  notify('Demo lesson added');renderDemo(section,role,render,notify);
 };
 if($('demoExamSave'))$('demoExamSave').onclick=()=>{
  const title=$('dExamTitle').value.trim();if(!title)return notify('Enter an examination title',true);
  demo.exams.unshift({title,level:$('dExamClass').value,subject:$('dExamSubject').value,questions:10,duration:60,status:'Draft'});
  notify('Demo examination created');renderDemo(section,role,render,notify);
 };
 if($('demoAnnouncementSave'))$('demoAnnouncementSave').onclick=()=>{
  const title=$('dAnnouncementTitle').value.trim(),body=$('dAnnouncementBody').value.trim();if(!title||!body)return notify('Enter a title and message',true);
  demo.announcements.unshift({title,body,date:'Today'});notify('Demo announcement added');renderDemo(section,role,render,notify);
 };
 if($('demoAttendanceSave'))$('demoAttendanceSave').onclick=()=>{
  const s=demo.students.find(x=>x.name===$('dAttendanceStudent').value);if(s)s.attendance=$('dAttendanceStatus').value;
  notify('Demo attendance updated');renderDemo(section,role,render,notify);
 };
 if($('demoAnswer'))$('demoAnswer').onclick=()=>{
  const r=document.querySelector('input[name=demoQ]:checked');notify(!r?'Select an answer first':r.value==='a'?'Correct! ¾ · Sample grade: 1/1':'Try again. The correct answer is ¾',!r);
 };
 if($('demoMark'))$('demoMark').onclick=notify('Sample theory mark recorded for presentation only');
 if($('demoReport'))$('demoReport').onclick=notify('Sample report: First Term 2026/2027 · Result approved (demo only)');
}
