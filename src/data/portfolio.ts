export interface Profile {
  name: string;
  title: string;
  headline: string;
  bioPoints: { emoji: string; text: string }[];
  skills: string[];
  contacts: { label: string; value: string; url?: string; icon: string; tooltip?: string }[];
}

export interface Education {
  institution: string;
  period: string;
  details: string[];
  status: string;
}

export interface Certification {
  category: string;
  categoryIcon: string;
  items: { name: string; date: string; detail?: string }[];
}

export interface Project {
  title: string;
  description: string;
  techs: string[];
  url?: string;
  github?: string;
}

export interface Award {
  title: string;
  grade: string;
  issuer: string;
  date: string;
  affiliation: string;
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
  name: '최시언',
  title: 'IT Developer',
  headline: '기술로 평등한 사회를 만들어 나가는 최시언입니다.',
  bioPoints: [
    { emoji: '❤️', text: '항상 밝고 긍정적인 에너지가 넘치는 사람입니다.' },
    { emoji: '🧡', text: '모든 일에 대해 책임감과 사람들간의 친밀감을 중요하게 생각하는 사람입니다.' },
    { emoji: '💛', text: '효율적인 로직을 구축하는 개발자가 되기 위해 노력합니다.' },
    { emoji: '💚', text: '팀 프로젝트로 팀원들간의 즉각적이고 원활한 의사소통과 협업 경험이 있습니다.' },
  ],
  skills: [
    'Java', 'Spring Boot', 'Python', 'TensorFlow',
    'JavaScript', 'TypeScript', 'React',
    'Oracle', 'MySQL', 'SQL',
    'Git', 'SVN',
  ],
  contacts: [
    { label: '생년월일', value: '1999.08.19', icon: '🙆‍♂️' },
    { label: '이메일', value: 'noino0819@naver.com', url: 'mailto:noino0819@naver.com', icon: '✉️' },
    { label: '깃허브', value: 'noino0819', url: 'https://github.com/noino0819', icon: '😺', tooltip: '귀여운 깃허브 구경하실분 !' },
    { label: '링크드인', value: 'LinkedIn', url: 'https://www.linkedin.com/in/%EC%8B%9C%EC%96%B8-%EC%B5%9C-77b9a5248/', icon: '💼' },
    {
      label: '블로그',
      value: 'NOINO의 일상리뷰',
      url: 'https://blog.naver.com/noino0819',
      icon: '📝',
      tooltip: '극히 개인적인 상업블로그입니다! 하지만 2023년부터 꾸준히 7일에 5일이상 포스팅을 진행하며 키워왔기에, 꾸준함의 증거로 보아주었으면 합니다',
    },
  ],
};

export const education: Education[] = [
  {
    institution: '예당고등학교',
    period: '2015.03 - 2018.01',
    details: [],
    status: '졸업',
  },
  {
    institution: '숭실대학교',
    period: '2018.03 - 2023.02',
    details: [
      '컴퓨터학부 전공 (전체 3.27/4.5 · 전공 3.12/4.5)',
      'ICT유통물류 융합전공',
    ],
    status: '졸업',
  },
  {
    institution: 'Google Developers ML Bootcamp / Google Korea',
    period: '2022.06 - 2022.09',
    details: ['Python / TensorFlow를 활용한 Machine Learning 학습'],
    status: '수료',
  },
  {
    institution: '현대백화점그룹 현대퓨쳐넷',
    period: '2023.11 - 현재',
    details: [
      'IT사업본부 리테일사업부문 | 선임 | 그린푸드2팀',
      '건강상담 웹앱 개발',
      '건강 상담사를 위한 상담 시스템 개발',
      '건강관리 웹앱 및 건강상담시스템 관리를 위한 ERP 시스템 개발',
    ],
    status: '재직중',
  },
];

export const certifications: Certification[] = [
  {
    category: 'IT',
    categoryIcon: '💻',
    items: [
      { name: 'TensorFlow Developer Certificate', date: '2022.09.12' },
      { name: 'SQLD', date: '2025.06.27', detail: 'SQLD-057014249 · 한국데이터산업진흥원' },
    ],
  },
  {
    category: '어학',
    categoryIcon: '🗣️',
    items: [
      { name: 'TOEIC SPEAKING', date: '2025.12.08', detail: 'Intermediate High (140) · YBM' },
    ],
  },
  {
    category: '기타',
    categoryIcon: '📖',
    items: [
      { name: 'MOS Master', date: '2018.06.18', detail: 'YBM' },
    ],
  },
];

export const projects: Project[] = [
  {
    title: 'AI 기반 헬스케어 상담 지원 플랫폼',
    description:
      '헬스케어 전문가를 위한 AI 기반 상담 지원 플랫폼. GPT + 벡터 임베딩 DB 연동으로 영양·질병·식재료 정보를 의미 기반 검색. 인바디 데이터 연동 맞춤형 리포트, 식사 사진 기반 식습관 분석, 상담 이력 통계 리포트 등 구현.',
    techs: ['React', 'PostgreSQL', 'GPT', 'Vector DB', 'Python'],
    github: 'https://github.com/noino0819',
  },
  {
    title: '개인 건강관리 웹앱 (그리팅케어)',
    description:
      'B2C 대상 AI 기반 건강관리 웹앱. 영양제 관리, 식단 기록 및 AI 분석, 헬스 챌린지 리워드 시스템, 건강 카드뉴스 콘텐츠, 개인 맞춤형 피드백 기능 구현.',
    techs: ['React', 'AWS', 'Node.js', 'AI'],
  },
  {
    title: 'Alt for U (대체텍스트 자동삽입 솔루션)',
    description:
      '시각장애인 웹 접근성 향상을 위한 GPT 기반 대체 텍스트 자동 생성 시스템. 이벤트 페이지, 배너, 상품 이미지 등에 AI가 문맥 분석 후 설명 삽입. 직접 기획·주도하여 그리팅 홈페이지에 실서비스 적용.',
    techs: ['PostgreSQL', 'JavaScript', 'GPT', 'Python', 'Web Accessibility'],
  },
  {
    title: 'Hyunique (스타일링 공유 플랫폼)',
    description:
      '온·오프라인 통합 스타일링 공유 플랫폼. GPT 챗봇 & DALL·E 이미지 생성, Toss Payments 결제, QR 기반 상품 확인, Inception V3 + k-NN 유사 상품 검색, 소셜 로그인 등 풀스택 구현. 기획 및 AI 스타일링 흐름 설계 주도.',
    techs: ['MySQL', 'AWS', 'React', 'GPT', 'DALL·E', 'Jenkins'],
    github: 'https://github.com/it-e-7/hyunique',
  },
  {
    title: 'TaxMate (온라인 경제 교육 플랫폼)',
    description:
      '학급을 가상 국가로 설정하여 세금·직업·은행·주식·법률을 시뮬레이션하는 참여형 경제 교육 플랫폼. 실제 교사 자문 기반. React + Node.js + MongoDB 환경 구성, 백엔드 전반 직접 구현.',
    techs: ['React', 'Node.js', 'MongoDB', 'Bootstrap'],
    github: 'https://github.com/SSU-Taxmate/taxpayer-Backend',
  },
  {
    title: 'GitTalk (Git 기반 실시간 협업 채팅툴)',
    description:
      'Git 리포지토리를 데이터 저장소이자 협업 채널로 활용하는 CLI 기반 채팅 프로그램. 별도 서버 없이 자동 브랜치 분기/병합, 로그인 암호화, Pull/Push 기반 최적화 구현. C언어 개인 프로젝트.',
    techs: ['C', 'Git', 'MySQL', 'CLI'],
    github: 'https://github.com/noino0819/GitTalk',
  },
];

export const awards: Award[] = [
  {
    title: '2024 스타트업데이',
    grade: '대상',
    issuer: '현대퓨쳐넷',
    date: '2024.09',
    affiliation: '현대퓨쳐넷',
    description:
      '시각장애인 웹 접근성 개선을 위한 AI 기반 프로젝트 \'Alf for U\'를 기획·개발. 페이지 내 비표준 요소 자동 감지 및 대체 텍스트 생성 등 접근성 강화 자동화 솔루션 구현. 기획 및 프론트엔드 개발 담당.',
  },
  {
    title: '서울과학기술대학교 창의적 종합설계 경진대회',
    grade: '동상',
    issuer: '서울과학기술대학교 공학교육선도센터',
    date: '2021.11',
    affiliation: '숭실대학교',
    description:
      '틸트 구조 드론 제어 시스템 개발 프로젝트. 오픈소스 드론 플랫폼 PX4의 비행 제어 알고리즘 및 파라미터를 수정하여 안정적인 제어 구현. 시뮬레이션을 통한 성능 검증 및 최적화된 비행 패턴 도출.',
  },
  {
    title: '숭실대학교 2021 IT대학 소프트웨어 공모전',
    grade: '금상',
    issuer: '숭실대학교',
    date: '2021.11',
    affiliation: '숭실대학교',
    description:
      '세금 교육 웹앱 \'TaxMate\' 기획·개발. 주식 거래·신문 뉴스·법 제정 시뮬레이션 기능으로 온라인 세금 학습 구현. 기획 및 프론트엔드 개발 담당.',
  },
  {
    title: '2020 오픈소스 컨트리뷰톤',
    grade: '특별상',
    issuer: '가비아',
    date: '2020.11',
    affiliation: '현대퓨쳐넷',
    description:
      '강화학습 기반 게임 AI 프로젝트 \'rosetta stone\'에 컨트리뷰터로 기여. 하스스톤 게임 플레이 시뮬레이션 및 에이전트 학습 알고리즘 개선. 코드 리뷰, 브랜치 전략, 이슈 관리 등 실무형 개발 문화 체득.',
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

export const youtubePlaylistId = 'OLAK5uy_nFQRM2uZ2n_LRJKXX22AZiqgt-G_50Q2U';
export const youtubeFirstVideoId = 'NewORF3VFeA';
