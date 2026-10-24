-- Applied to Torch Bearers Academy Supabase project kzlzrdqsotbttfsiumbc.
-- First auth.users registration becomes the only automatic administrator.
create or replace function public.academy_bootstrap_available()
returns boolean language sql stable security definer set search_path=''
as $$ select not exists(select 1 from auth.users) $$;
revoke all on function public.academy_bootstrap_available() from public;
grant execute on function public.academy_bootstrap_available() to anon,authenticated;

create or replace function app_private.bootstrap_first_admin()
returns trigger language plpgsql security definer set search_path=''
as $$
declare v_school uuid;
begin
  perform pg_advisory_xact_lock(81243691);
  if (select count(*) from auth.users)=1
     and not exists(select 1 from public.profiles)
  then
    select s.id into v_school from public.schools s
      where s.name='Torch Bearers Academy' order by s.created_at limit 1;
    if v_school is null then
      raise exception 'Academy school configuration is missing';
    end if;
    insert into public.profiles(id,school_id,full_name,role)
      values(new.id,v_school,
       left(coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'),''),split_part(coalesce(new.email,''),'@',1)),160),
       'admin');
  end if;
  return new;
end
$$;
revoke all on function app_private.bootstrap_first_admin() from public,anon,authenticated;
drop trigger if exists academy_initial_admin_signup on auth.users;
create trigger academy_initial_admin_signup
after insert on auth.users
for each row execute function app_private.bootstrap_first_admin();
