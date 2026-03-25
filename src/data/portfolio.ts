export interface Profile {
  name: string;
  title: string;
  bio: string;
  photo?: string;
  skills: string[];
  contacts: { label: string; url: string; icon: string }[];
}

export interface Project {
  title: string;
  description: string;
  techs: string[];
  url?: string;
  github?: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface Game {
  title: string;
  platform: string;
  comment: string;
}

export interface Hobby {
  label: string;
  emoji: string;
}

export const profile: Profile = {
  name: 'Your Name',
  title: 'Frontend Developer',
  bio: '사용자 경험을 중시하는 프론트엔드 개발자입니다. 인터랙티브하고 아름다운 웹을 만드는 것을 좋아합니다.',
  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Node.js'],
  contacts: [
    { label: 'Email', url: 'mailto:hello@example.com', icon: '✉️' },
    { label: 'GitHub', url: 'https://github.com', icon: '🐙' },
    { label: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
  ],
};

export const timeline: TimelineEntry[] = [
  { year: '2024', title: 'OO대학교 컴퓨터공학과 졸업', description: '학사 졸업' },
  { year: '2023', title: 'OO기업 프론트엔드 인턴', description: 'React 기반 서비스 개발 참여' },
  { year: '2022', title: '해커톤 대상 수상', description: '실시간 협업 도구 프로젝트' },
];

export const projects: Project[] = [
  {
    title: 'Interactive Dashboard',
    description: '실시간 데이터 시각화 대시보드. WebSocket을 활용한 라이브 차트와 필터링 기능 구현.',
    techs: ['React', 'D3.js', 'WebSocket', 'TypeScript'],
    url: 'https://example.com',
    github: 'https://github.com',
  },
  {
    title: 'E-Commerce Platform',
    description: 'Next.js 기반 이커머스 플랫폼. SSR/SSG 최적화, Stripe 결제 연동.',
    techs: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe'],
    github: 'https://github.com',
  },
  {
    title: 'Open Source Contribution',
    description: '오픈소스 UI 라이브러리 접근성 개선 PR 기여.',
    techs: ['TypeScript', 'A11y', 'Testing Library'],
    github: 'https://github.com',
  },
];

export const games: Game[] = [
  { title: '젤다의 전설: 티어스 오브 더 킹덤', platform: 'Nintendo Switch', comment: '하이랄의 자유도는 끝이 없다' },
  { title: '슈퍼 마리오 오디세이', platform: 'Nintendo Switch', comment: '순수한 즐거움의 집약체' },
  { title: '셀레스트', platform: 'PC / Switch', comment: '도전과 성장의 메타포' },
  { title: '할로우 나이트', platform: 'PC / Switch', comment: '아름답고 잔혹한 지하세계' },
];

export const hobbies: Hobby[] = [
  { label: '게임', emoji: '🎮' },
  { label: '음악 감상', emoji: '🎵' },
  { label: '코딩', emoji: '💻' },
  { label: '여행', emoji: '✈️' },
  { label: '독서', emoji: '📚' },
  { label: '사진', emoji: '📷' },
];

export const youtubePlaylistId = 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf';
