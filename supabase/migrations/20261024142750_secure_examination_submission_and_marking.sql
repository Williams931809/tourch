create or replace function public.submit_exam(p_exam uuid,p_answers jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_student uuid:=auth.uid(); v_attempt uuid; q record; v_answer jsonb; v_score numeric:=0; v_total numeric:=0; v_pending integer:=0;
begin
 if v_student is null or app_private.my_role()<>'student' then raise exception 'Student sign-in required'; end if;
 if not app_private.exam_visible(p_exam) then raise exception 'Exam unavailable'; end if;
 if jsonb_typeof(p_answers)<>'array' then raise exception 'Expected array of answers'; end if;
 if jsonb_array_length(p_answers)>(select count(*) from public.questions where exam_id=p_exam) then raise exception 'Too many submitted answers'; end if;
 insert into public.exam_attempts(exam_id,student_id,submitted_at,score) values(p_exam,v_student,now(),0) returning id into v_attempt;
 for q in select que.id,que.question_type,que.marks,k.correct_answer from public.questions que left join public.question_keys k on k.question_id=que.id where que.exam_id=p_exam order by que.position loop
   select x->'response' into v_answer from jsonb_array_elements(p_answers) x where x->>'question_id'=q.id::text limit 1;
   if v_answer is null then v_answer:='null'::jsonb; end if;
   v_total:=v_total+q.marks;
   if q.question_type='mcq' then
    if q.correct_answer is not null and v_answer=q.correct_answer then
      insert into public.student_answers(attempt_id,question_id,answer,awarded_marks) values(v_attempt,q.id,jsonb_build_object('response',v_answer),q.marks);
      v_score:=v_score+q.marks;
    else
      insert into public.student_answers(attempt_id,question_id,answer,awarded_marks) values(v_attempt,q.id,jsonb_build_object('response',v_answer),0);
    end if;
   else
      insert into public.student_answers(attempt_id,question_id,answer) values(v_attempt,q.id,jsonb_build_object('response',v_answer));
      v_pending:=v_pending+1;
   end if;
 end loop;
 update public.exam_attempts set score=v_score where id=v_attempt;
 return jsonb_build_object('attempt_id',v_attempt,'objective_score',v_score,'total_marks',v_total,'theory_pending',v_pending);
end $$;
create or replace function public.mark_theory_answer(p_answer uuid,p_marks numeric)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_attempt uuid; v_exam uuid; v_max numeric; v_kind text; v_score numeric;
begin
 select a.id,a.exam_id,q.marks,q.question_type into v_attempt,v_exam,v_max,v_kind from public.student_answers s join public.exam_attempts a on a.id=s.attempt_id join public.questions q on q.id=s.question_id where s.id=p_answer;
 if v_attempt is null or v_kind<>'theory' or not app_private.manage_exam(v_exam) then raise exception 'Not authorized to mark answer'; end if;
 if p_marks is null or p_marks<0 or p_marks>v_max then raise exception 'Marks out of range'; end if;
 update public.student_answers set awarded_marks=p_marks where id=p_answer;
 select coalesce(sum(awarded_marks),0) into v_score from public.student_answers where attempt_id=v_attempt;
 update public.exam_attempts set score=v_score where id=v_attempt;
 return jsonb_build_object('attempt_id',v_attempt,'score',v_score);
end $$;
revoke all on function public.submit_exam(uuid,jsonb) from public,anon;
revoke all on function public.mark_theory_answer(uuid,numeric) from public,anon;
grant execute on function public.submit_exam(uuid,jsonb) to authenticated;
grant execute on function public.mark_theory_answer(uuid,numeric) to authenticated;