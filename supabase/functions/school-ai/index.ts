import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import {createClient} from 'npm:@supabase/supabase-js@2.49.8';
Deno.serve(async req=>{
 const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'};
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 try{
 const token=req.headers.get('authorization')?.split(' ')[1];if(!token)return new Response(JSON.stringify({error:'Authentication required'}),{status:401,headers});
 const api=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!;
 const supabase=createClient(api,anon,{global:{headers:{Authorization:'Bearer '+token}}});
 const {data:{user},error:authError}=await supabase.auth.getUser(token);
 if(authError||!user)return new Response(JSON.stringify({error:'Authentication failed'}),{status:401,headers});
 const {data:profile,error:profileError}=await supabase.from('profiles').select('role,school_id').eq('id',user.id).single();
 if(profileError||!profile||!['teacher','admin'].includes(profile.role))return new Response(JSON.stringify({error:'Staff authorization required'}),{status:403,headers});
 const key=Deno.env.get('OPENAI_API_KEY');
 if(!key)return new Response(JSON.stringify({error:'AI credentials have not been configured by the school administrator.'}),{status:503,headers});
 const body=await req.json(),action=body.action;
 if(!['summarize','ocr','generate_questions'].includes(action))return new Response(JSON.stringify({error:'Unsupported AI action'}),{status:400,headers});
 const source=typeof body.text==='string'?body.text.slice(0,40000):'';
 let prompt='',content:any[];
 if(action==='ocr'){
  if(!body.image||typeof body.image!=='string'||body.image.length>11000000||!['image/png','image/jpeg','image/webp'].includes(body.media_type))return new Response(JSON.stringify({error:'Provide a valid image under 8MB'}),{status:400,headers});
  prompt='Transcribe the handwritten or printed school note. Return only text that is visible in the image. Preserve paragraphs. Never make up missing words.';
  content=[{type:'text',text:prompt},{type:'image_url',image_url:{url:'data:'+body.media_type+';base64,'+body.image,detail:'high'}}];
 }else if(action==='summarize'){
  if(!source)return new Response(JSON.stringify({error:'No lesson content'}),{status:400,headers});
  prompt='Organize the following school teaching material into clear structured notes. Use only information in the source and avoid inventions. SOURCE:\n'+source;
  content=[{type:'text',text:prompt}];
 }else{
  if(!source)return new Response(JSON.stringify({error:'No source notes supplied'}),{status:400,headers});
  const count=Math.min(20,Math.max(1,Number(body.count)||5)),kind=body.type==='theory'?'theory':'mcq';
  prompt='Generate '+count+' '+kind+' examination questions from the source notes ONLY. Return valid JSON object with key "questions" and objects {"type":"'+kind+'","prompt":"question text","options":["A","B","C","D"],"correct_index":0,"marks":1}. For theory: options [], marks 5, correct_index 0. For MCQ: four options, correct_index 0 to 3. Do not invent unsupported information. SOURCE:\n'+source;
  content=[{type:'text',text:prompt}];
 }
 const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model:'gpt-4o-mini',temperature:0.2,response_format:action==='generate_questions'?{type:'json_object'}:undefined,messages:[{role:'user',content}]})});
 const result=await response.json();
 if(!response.ok)return new Response(JSON.stringify({error:'AI provider request failed'}),{status:502,headers});
 const output=result.choices?.[0]?.message?.content||'';
 if(action==='generate_questions'){
  let parsed;try{parsed=JSON.parse(output)}catch{return new Response(JSON.stringify({error:'AI returned invalid JSON'}),{status:502,headers})}
  return new Response(JSON.stringify({questions:Array.isArray(parsed.questions)?parsed.questions:[]}),{headers});
 }
 return new Response(JSON.stringify({text:output}),{headers});
 }catch(e){return new Response(JSON.stringify({error:e instanceof Error?e.message:'Internal service error'}),{status:500,headers});}
});