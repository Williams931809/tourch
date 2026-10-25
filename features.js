
/* Nine new school modules; demo records remain in-memory only. */
const samples={
 'School Fees':[['Amara Okafor','2026/27 Tuition','₦185,000','₦125,000','Partial'],['David Osagie','2026/27 Tuition','₦160,000','₦160,000','Paid'],['Zara Bello','School Transport','₦45,000','₦0','Unpaid'],['Chisom Eze','2026/27 Tuition','₦185,000','₦185,000','Paid']],
 'Homework':[['JSS 2','Mathematics','Fractions worksheet','28 Oct 2026','18 / 24'],['SS 2','English Language','Comprehension practice','29 Oct 2026','21 / 29'],['SS 1','Biology','Cell diagrams','30 Oct 2026','15 / 27']],
 'Lesson Plans':[['JSS 2','Mathematics','Week 4','Fractions and decimals','Approved'],['SS 1','Biology','Week 4','Cell organisation','Submitted'],['SS 2','English Language','Week 5','Reading comprehension','Draft']],
 'Messages':[['Mrs. Eze','Mr. Osagie','David’s progress this term','Yesterday'],['Mrs. Bello','Mrs. Okafor','Parent meeting confirmation','Today'],['Mr. Aigbe','Mrs. Eze','Science project feedback','Monday']],
 'Performance Insights':[['JSS 2','Mathematics','74%','Fractions practice'],['SS 1','Biology','81%','Cell diagrams'],['SS 2','English Language','68%','Comprehension support'],['Primary 5','Mathematics','88%','Advanced exercises']],
 'Notifications':[['Attendance','Samuel Omoregie was absent today','Today'],['Examination','JSS 2 Mathematics test approaching','Tomorrow'],['Fees','First term balance reminder','27 Oct 2026'],['Results','Continuous assessment available','Today']],
 'Digital Library':[['Mathematics','JSS 2','Fractions revision pack','PDF'],['Biology','SS 1','Cell structure study guide','PDF'],['English Language','SS 2','Comprehension passages','Document'],['Computer Studies','JSS 1','Introduction to ICT','PDF']],
 'Digital ID Cards':[['Amara Okafor','ST001','SS 2','Student'],['Mrs. Ada Eze','TR001','Mathematics','Teacher'],['David Osagie','ST002','JSS 2','Student']],
 'School Calendar':[['26 Oct 2026','Continuous assessment week','Academics'],['02 Nov 2026','Parent–Teacher Conference','Parents'],['14 Nov 2026','STEM Innovation Day','School event'],['18 Dec 2026','End of term','Academics']]
};
const config={
 'School Fees':{table:'school_fees',fields:['title','amount','due_date'],labels:['Fee title','Amount (₦)','Due date'],types:['text','number','date'],student:true},
 'Homework':{table:'homework',fields:['title','details','due_at'],labels:['Assignment title','Instructions','Deadline'],types:['text','textarea','datetime-local'],teacher:true},
 'Lesson Plans':{table:'lesson_plans',fields:['topic','objectives','activities'],labels:['Topic','Learning objectives','Teaching activities'],types:['text','textarea','textarea'],teacher:true},
 'Messages':{table:'parent_messages',fields:['recipient_id','body'],labels:['Recipient profile ID','Message'],types:['text','textarea']},
 'Notifications':{table:'school_notifications',fields:['recipient_id','title','body'],labels:['Recipient profile ID','Title','Message'],types:['text','text','textarea'],admin:true},
 'Digital Library':{table:'library_resources',fields:['title','description','resource_url'],labels:['Resource title','Description','Resource link (https://)'],types:['text','textarea','url'],teacher:true},
 'Digital ID Cards':{table:'digital_id_cards',fields:['profile_id','card_number'],labels:['Profile ID','Card number'],types:['text','text'],admin:true},
 'School Calendar':{table:'school_events',fields:['title','details','event_date'],labels:['Event name','Description','Date'],types:['text','textarea','date'],admin:true}
};
function x(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}
function t(rows,heads){return '<div class="scroll"><table><thead><tr>'+heads.map(h=>'<th>'+x(h)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(c=>'<td>'+x(c)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
function form(c,extra=''){return '<form id="featureForm"><div class="form-grid">'+c.fields.map((f,i)=>'<div class="field"><label>'+x(c.labels[i])+'</label>'+(c.types[i]==='textarea'?'<textarea name="'+f+'" required></textarea>':'<input name="'+f+'" type="'+c.types[i]+'" required>')+'</div>').join('')+extra+'</div><button type="submit" class="btn">Save</button></form>';}
export async function showFeature(section,ctx){
 const {db,profile,user,demoMode,demoRole,setPage,toast}=ctx;
 const role=demoMode&&profile.role==='admin'?demoRole:profile.role;
 const c=config[section];
 const rows=samples[section]||[];
 let intro='<div class="hero"><div class="eyebrow">TORCH BEARERS ACADEMY · ALWAYS AHEAD</div><h2>'+x(section)+'</h2><p>'+(demoMode?'Interactive demonstration with fictional school records.':'School records, protected by your account permissions.')+'</p></div>';
 if(demoMode){
  let html=intro+'<div class="notice" style="background:#fff3d9;border:1px solid #e7c46d"><b>DEMO MODE — fictional data only</b><p>Entries made here are for presentation purposes and are not stored in the school database.</p></div>';
  if(section==='Performance Insights')html+='<div class="cards"><div class="stat"><div class="muted tiny">Illustrative pass rate</div><b>91%</b></div><div class="stat"><div class="muted tiny">Students needing support</div><b>23</b></div></div>';
  html+='<div class="card"><h2>'+x(section)+' records</h2>'+t(rows,section==='School Fees'?['Student','Fee','Amount','Paid','Status']:section==='Homework'?['Class','Subject','Task','Deadline','Submitted']:section==='Lesson Plans'?['Class','Subject','Week','Topic','Approval']:section==='Messages'?['From','To','Message','When']:section==='Performance Insights'?['Class','Subject','Average','Suggested support']:section==='Notifications'?['Type','Message','When']:section==='Digital Library'?['Subject','Class','Resource','Format']:section==='Digital ID Cards'?['Name','ID','Class / Subject','Role']:['Date','Event','Category'])+'</div>';
  if(section==='Digital ID Cards')html+='<div class="card"><h2>Sample digital identity</h2><div style="padding:22px;border-radius:18px;background:linear-gradient(120deg,#8c356b,#d28cb3);color:white;max-width:370px"><strong>TORCH BEARERS ACADEMY</strong><p>ALWAYS AHEAD</p><h2>Amara Okafor</h2><p>ST001 · SS 2 · STUDENT</p><small>DEMONSTRATION — NOT VALID FOR ACCESS</small></div></div>';
  if(section==='Performance Insights')html+='<div class="card"><h2>AI-supported intervention ideas</h2><p>Review Mathematics fractions with JSS 2 learners; assign reading comprehension practice in SS 2; check improvement against the next assessment. These are illustrative recommendations, not actual AI analysis of student records.</p></div>';
  if(c)html+='<div class="card"><h2>Add '+x(section)+' sample</h2>'+form(c)+'</div>';
  setPage(html);
  const el=document.querySelector('#featureForm');if(el)el.onsubmit=e=>{e.preventDefault();const vals=[...new FormData(el).values()].map(String);const row=rows.length?Array(rows[0].length).fill('—'):[];vals.forEach((v,i)=>{if(i<row.length)row[i]=v});if(row.length)rows.unshift(row);toast('Sample entry added (demo only)');showFeature(section,ctx);};
  return;
 }
 if(section==='Performance Insights'){
  try{const [scores,students]=await Promise.all([db.from('assessments').select('*').limit(200),db.from('profiles').select('id,full_name').eq('role','student').limit(200)]);if(scores.error)throw scores.error;setPage(intro+'<div class="card"><h2>Performance overview</h2><p>'+x(scores.data.length)+' assessment records and '+x(students.data?.length||0)+' student profiles found. Recommendations require verified assessment coverage and teacher review.</p></div>');}catch(e){setPage(intro+'<div class="card">Unable to load assessment insights: '+x(e.message)+'</div>');}return;
 }
 if(!c)return;
 let query=db.from(c.table).select('*').limit(100);
 if(c.table==='school_fees'&&role==='student')query=query.eq('student_id',user.id);
 const response=await query;
 if(response.error){setPage(intro+'<div class="card"><h2>Unable to load records</h2><p>'+x(response.error.message)+'</p></div>');return;}
 const records=response.data||[];
 const columns=records.length?Object.keys(records[0]).filter(k=>!['school_id','created_at'].includes(k)).slice(0,7):['title','details','status'];
 let html=intro+'<div class="card"><h2>Live '+x(section)+'</h2>'+(records.length?t(records.map(r=>columns.map(k=>typeof r[k]==='object'?JSON.stringify(r[k]):r[k]??'—')),columns):'<p class="muted">No records yet. Add the first record using the form below.</p>')+'</div>';
 const canWrite=role==='admin'||(c.teacher&&role==='teacher')||(section==='Messages'&&['teacher','parent'].includes(role));
 if(canWrite){
  let extra='';
  if(['Homework','Lesson Plans','Digital Library'].includes(section))extra='<div class="field"><label>Class ID</label><input name="class_id" required placeholder="Select a class from Classes & Subjects"></div><div class="field"><label>Subject ID</label><input name="subject_id" required placeholder="Select an assigned subject"></div>';
  if(section==='School Fees')extra='<div class="field"><label>Student profile ID</label><input name="student_id" required></div>';
  html+='<div class="card"><h2>Create '+x(section)+' record</h2>'+form(c,extra)+'</div>';
 }
 setPage(html);
 const el=document.querySelector('#featureForm');if(el)el.onsubmit=async e=>{e.preventDefault();const values=Object.fromEntries(new FormData(el).entries());if(section==='Digital Library'&&values.resource_url&&!/^https:\/\//i.test(values.resource_url)){toast('Use a secure HTTPS resource URL',true);return;}const payload={...values,school_id:profile.school_id};if(['Homework','Lesson Plans'].includes(section))payload.teacher_id=user.id;if(section==='Digital Library')payload.uploader_id=user.id;if(section==='Messages')payload.sender_id=user.id;const result=await db.from(c.table).insert(payload);if(result.error)toast(result.error.message,true);else{toast('Saved to school database');showFeature(section,ctx);}};
}
