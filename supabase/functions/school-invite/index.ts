import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import {createClient} from 'npm:@supabase/supabase-js@2.49.8';
Deno.serve(async req=>{
 const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'};
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 try{
 const token=req.headers.get('authorization')?.split(' ')[1];if(!token)return new Response(JSON.stringify({error:'Authentication required'}),{status:401,headers});
 const api=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 if(!secret)return new Response(JSON.stringify({error:'Server configuration incomplete'}),{status:503,headers});
 const caller=createClient(api,anon,{global:{headers:{Authorization:'Bearer '+token}}});
 const {data:{user},error:ue}=await caller.auth.getUser(token);if(ue||!user)return new Response(JSON.stringify({error:'Invalid session'}),{status:401,headers});
 const {data:profile}=await caller.from('profiles').select('role,school_id').eq('id',user.id).single();if(profile?.role!=='admin'||!profile.school_id)return new Response(JSON.stringify({error:'School administrator required'}),{status:403,headers});
 const body=await req.json(),email=String(body.email||'').trim().toLowerCase(),full_name=String(body.full_name||'').trim(),role=String(body.role||'');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!full_name||full_name.length>160||!['student','parent','teacher','admin'].includes(role))return new Response(JSON.stringify({error:'Invalid invitation details'}),{status:400,headers});
 const admin=createClient(api,secret,{auth:{autoRefreshToken:false,persistSession:false}});
 const {data:inv,error:ie}=await admin.auth.admin.inviteUserByEmail(email,{data:{display_name:full_name}});
 if(ie||!inv.user)return new Response(JSON.stringify({error:ie?.message||'Invitation could not be sent'}),{status:400,headers});
 const {error:pe}=await admin.from('profiles').upsert({id:inv.user.id,school_id:profile.school_id,full_name,role,admission_number:String(body.admission_number||'').slice(0,80)||null},{onConflict:'id',ignoreDuplicates:true});
 if(pe)return new Response(JSON.stringify({error:'Invitation sent but profile setup failed. Contact administrator.'}),{status:500,headers});
 return new Response(JSON.stringify({success:true}),{headers});
 }catch(e){return new Response(JSON.stringify({error:e instanceof Error?e.message:'Unknown error'}),{status:500,headers});}
});