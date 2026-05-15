-- 기존 payments INSERT 정책 삭제 (auth.uid() is not null만 체크하여 타 유저 user_id 삽입 가능했음)
drop policy if exists "portfolio_box_payments_insert_authenticated" on public.portfolio_box_payments;

-- 본인의 user_id로만 결제 기록을 삽입할 수 있도록 수정
create policy "portfolio_box_payments_insert_own"
  on public.portfolio_box_payments for insert
  with check (auth.uid() = user_id);
