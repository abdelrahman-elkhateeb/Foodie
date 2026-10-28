-- =============================================================================
-- Foodie — the dashboard is for admins only
--
-- Run once in the Supabase SQL editor, after the earlier migrations.
-- Safe to re-run.
--
-- Until now the dashboard was a public demo: anyone could read every order
-- (names, phones, addresses), move orders between statuses and add, edit or
-- delete non-seed products. From here on:
--   - products: everyone can read, only admins can write
--   - orders / order_items: you see your own orders, admins see all
--   - update_order_status / delete_product: admins only
-- =============================================================================


-- Products --------------------------------------------------------------------

drop policy if exists "products: create" on public.products;
drop policy if exists "products: update" on public.products;
drop policy if exists "products: delete" on public.products;

create policy "products: create" on public.products
  for insert with check (public.is_admin());

create policy "products: update" on public.products
  for update using (public.is_admin())
  with check (public.is_admin());

create policy "products: delete" on public.products
  for delete using (public.is_admin());


-- Orders ------------------------------------------------------------------------

drop policy if exists "orders: read" on public.orders;
drop policy if exists "order_items: read" on public.order_items;

create policy "orders: read" on public.orders
  for select using (user_id = auth.uid() or public.is_admin());

create policy "order_items: read" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );


-- update_order_status: admins only ---------------------------------------------

create or replace function public.update_order_status(
  p_order_id bigint,
  p_status text
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
begin
  if not public.is_admin() then
    raise exception 'Only admins can update orders';
  end if;

  update public.orders
  set status = p_status
  where id = p_order_id
  returning * into v_order;

  if v_order.id is null then
    raise exception 'Order % not found', p_order_id;
  end if;

  return v_order;
end;
$$;

revoke all on function public.update_order_status(bigint, text) from public, anon;
grant execute on function public.update_order_status(bigint, text) to authenticated;


-- delete_product: admins only ----------------------------------------------------

create or replace function public.delete_product(p_product_id bigint)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can delete products';
  end if;

  if not exists (
    select 1 from public.products
    where id = p_product_id and archived_at is null
  ) then
    raise exception 'Product % not found', p_product_id;
  end if;

  if exists (select 1 from public.order_items where product_id = p_product_id) then
    update public.products
    set archived_at = now(), is_available = false
    where id = p_product_id;
    return 'archived';
  end if;

  delete from public.products where id = p_product_id;
  return 'deleted';
end;
$$;

revoke all on function public.delete_product(bigint) from public, anon;
grant execute on function public.delete_product(bigint) to authenticated;
