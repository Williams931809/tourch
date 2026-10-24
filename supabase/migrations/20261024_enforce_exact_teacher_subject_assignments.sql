-- Applied to Torch Bearers Academy Supabase project on 2026-10-24.
-- Security rule: class access is not subject access.
drop policy if exists exam_insert on public.exams;
create policy exam_insert on public.exams for insert to authenticated
with check (
 teacher_id=(select auth.uid()) and class_id is not null and subject_id is not null
 and (
  exists(select 1 from public.classes c where c.id=class_id and app_private.is_admin(c.school_id))
  or exists(select 1 from public.teacher_assignments t where t.teacher_id=(select auth.uid()) and t.class_id=exams.class_id and t.subject_id=exams.subject_id)
 )
);
drop policy if exists lesson_insert on public.lesson_notes;
create policy lesson_insert on public.lesson_notes for insert to authenticated
with check (
 teacher_id=(select auth.uid())
 and (
  (class_id is null and subject_id is null and app_private.my_role() in ('admin','teacher'))
  or exists(select 1 from public.classes c where c.id=class_id and app_private.is_admin(c.school_id))
  or exists(select 1 from public.teacher_assignments t where t.teacher_id=(select auth.uid()) and t.class_id=lesson_notes.class_id and t.subject_id=lesson_notes.subject_id)
 )
);
drop policy if exists lesson_update on public.lesson_notes;
create policy lesson_update on public.lesson_notes for update to authenticated
using(teacher_id=(select auth.uid()) or app_private.is_admin(app_private.my_school()))
with check(
 (teacher_id=(select auth.uid()) or app_private.is_admin(app_private.my_school()))
 and (
  (class_id is null and subject_id is null and app_private.my_role() in ('admin','teacher'))
  or exists(select 1 from public.classes c where c.id=class_id and app_private.is_admin(c.school_id))
  or exists(select 1 from public.teacher_assignments t where t.teacher_id=(select auth.uid()) and t.class_id=lesson_notes.class_id and t.subject_id=lesson_notes.subject_id)
 )
);
drop policy if exists lesson_read on public.lesson_notes;
create policy lesson_read on public.lesson_notes for select to authenticated
using(
 teacher_id=(select auth.uid()) or app_private.is_admin(app_private.my_school())
 or exists(select 1 from public.teacher_assignments t where t.teacher_id=(select auth.uid()) and t.class_id=lesson_notes.class_id and t.subject_id=lesson_notes.subject_id)
 or (published and class_id is not null and (app_private.student_class(class_id) or app_private.parent_class(class_id)))
);
drop policy if exists profile_read on public.profiles;
create policy profile_read on public.profiles for select to authenticated using (
 id=(select auth.uid()) or app_private.is_admin(school_id) or app_private.is_parent(id)
 or (app_private.my_role()='teacher' and role='student'
 and exists(select 1 from public.enrollments e join public.teacher_assignments t on t.class_id=e.class_id
 where e.student_id=profiles.id and t.teacher_id=(select auth.uid())))
);
