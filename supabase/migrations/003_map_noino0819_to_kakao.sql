-- noino0819 포트폴리오를 0326 카카오 계정에 매핑하고, 0326 포트폴리오 삭제

-- 1) 0326 슬러그의 user_id를 noino0819에 할당
UPDATE public.portfolios
SET user_id = (
  SELECT user_id FROM public.portfolios WHERE slug = '0326' LIMIT 1
)
WHERE slug = 'noino0819';

-- 2) 0326 포트폴리오 데이터(portfolio_data) 삭제 (cascade로 안 지워질 수 있으므로 명시)
DELETE FROM public.portfolio_data
WHERE portfolio_id = (
  SELECT id FROM public.portfolios WHERE slug = '0326' LIMIT 1
);

-- 3) 0326 포트폴리오 자체 삭제
DELETE FROM public.portfolios WHERE slug = '0326';
