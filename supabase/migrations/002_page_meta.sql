-- 포트폴리오별 브라우저 탭 제목/설명 커스터마이즈
ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS page_title text;
ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS page_description text;
