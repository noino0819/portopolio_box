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
  period: string;
  affiliation: string;
  description: string;
  highlights: string[];
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

export interface Album {
  artist: string;
  title: string;
  comment: string;
}

export interface Book {
  author: string;
  titles: string[];
  comment: string;
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
    period: '2023.11 - 현재',
    affiliation: '현대퓨쳐넷',
    description: '건강 데이터를 활용한 맞춤형 영양 및 라이프스타일 상담 시스템. AI 기술과 바이오 데이터 연계를 통해 상담의 질을 높이고 상담사의 업무 효율성을 극대화.',
    highlights: [
      '회원별 세션 기반 상담 프로세스 구축 — 고객별 상담 이력 유지 및 지속적 건강 관리 흐름',
      'GPT + 벡터 임베딩 DB(Vector Core) 연동 — 영양소, 질병, 식재료 등 의미 기반 검색 및 응답 생성',
      '바이오 데이터 연동 리포트 생성 — 인바디 데이터 기반 개인 맞춤형 영양/다이어트/피부관리 리포트',
      '하루 식사 사진 기반 진단 기능 — 식습관을 정량·정성적으로 분석하고 개선 방향 제시',
      '상담 이력 데이터 분석 및 통계 리포트 — 개인별 건강 트렌드 및 개선 방향 도출',
    ],
    techs: ['React', 'PostgreSQL', 'GPT', 'Vector DB', 'Python'],
  },
  {
    title: '개인 건강관리 웹앱 (그리팅케어)',
    period: '2025.03 - 2025.09',
    affiliation: '현대퓨쳐넷',
    description: 'B2C 대상 AI 기반 개인 건강관리 웹앱. 맞춤형 기능과 챌린지 기반 리워드 시스템을 통해 유저의 지속적인 참여를 유도하며 실질적인 건강 개선을 지원.',
    highlights: [
      '영양제 관리 시스템 — 복용 중인 영양제 등록, 섭취 이력 및 주의사항 관리',
      '식단 기록 및 AI 분석 — 하루 식단 기록, 영양 균형·섭취 패턴 시각화 피드백',
      '헬스 챌린지 및 리워드 시스템 — 걷기, 물 마시기 등 건강 습관 챌린지 + 포인트 적립',
      '건강 콘텐츠 제공 — 카드뉴스 형태의 건강 정보 주기적 제공',
      '개인 맞춤형 피드백 — 기록 데이터 기반 영양 및 생활 습관 개선 인사이트',
    ],
    techs: ['React', 'AWS', 'Node.js', 'AI'],
  },
  {
    title: 'Alt for U (대체텍스트 자동삽입 솔루션)',
    period: '2024.05 - 2024.09',
    affiliation: '현대퓨쳐넷',
    description: '시각장애인 웹 접근성 향상을 위한 GPT 기반 대체 텍스트 자동 생성 시스템. 직접 기획·주도하여 그리팅 홈페이지에 실서비스 적용 및 시범 운영.',
    highlights: [
      'GPT 기반 이미지 설명 생성 — 이미지 주변 텍스트와 문맥을 분석하여 자연어 대체 텍스트 생성',
      '어드민 관리 페이지 구축 — 생성된 Alt 텍스트 검토·수정 및 재생성 관리',
      '웹 접근성 향상 자동화 — 이미지 업로드 시 자동 대체 텍스트 삽입',
      '콘텐츠 유형별 최적화 — 이벤트 페이지, 상품 상세, 메인 배너 등 설명 스타일 자동 조정',
      '서비스 적용 완료 — 현대퓨쳐넷 HR 플랫폼 그리팅 홈페이지에 실제 적용, 웹 접근성 개선 효과 검증',
    ],
    techs: ['PostgreSQL', 'JavaScript', 'GPT', 'Python', 'Web Accessibility'],
  },
  {
    title: 'Hyunique (스타일링 공유 플랫폼)',
    period: '2024.03 - 2024.06',
    affiliation: '숭실대학교',
    description: '온·오프라인 쇼핑 경험을 통합한 스타일링 공유 플랫폼. AI 기술과 결제, QR, 소셜 로그인 등을 통합하여 상용 수준의 UX를 구현.',
    highlights: [
      'GPT 기반 스타일링 챗봇 & DALL·E 이미지 생성 — 자연어로 스타일링 추천 + 시각적 이미지 자동 생성',
      'Toss Payments 연동 간편 결제 — 실제 결제 흐름을 반영한 구매 설계',
      'QR 코드 기반 상품 스타일 확인 — 오프라인 QR 스캔 시 스타일링 정보 확인 (온오프라인 연계)',
      'Inception V3 + k-NN 유사 상품 검색 — AI 이미지 기반 유사 상품 추천',
      'Papago API 프롬프트 번역 최적화 — DALL·E 정확도를 위한 한→영 자동 번역',
      '소셜 로그인, 옷장, 커뮤니티 등 풀스택 구현 — 카카오/네이버 OAuth, AWS HTTPS 배포, Jenkins CI',
    ],
    techs: ['MySQL', 'AWS', 'React', 'GPT', 'DALL·E', 'Jenkins'],
    github: 'https://github.com/it-e-7/hyunique',
  },
  {
    title: 'TaxMate (온라인 경제 교육 플랫폼)',
    period: '2022.03 - 2022.12',
    affiliation: '숭실대학교',
    description: '학급을 가상 국가로 설정하여 세금·직업·은행·주식·법률을 시뮬레이션하는 참여형 경제 교육 플랫폼. 실제 교사 자문 기반으로 교육적 효과 극대화.',
    highlights: [
      '사용자 유형별 맞춤 화면 구성 — 선생님/학생 역할에 따라 대시보드와 접근 기능 차등 설정',
      '가상 직업 및 월급 시스템 — 직업별 자격 조건, 월급, 고용기간 설정 및 지원서 승인 프로세스',
      '은행 모듈 — 입출금 내역, 예금 상품 가입 및 이자 처리',
      '증권거래소 모듈 — 주식 상품 개설, 뉴스 기반 주가 변동, 매도/매수 기능',
      '국세청 시스템 — 직접세/간접세 정의, 자동 납부, 세수 통계',
      '법률 시스템 — 선생님 중심 법률 등록·수정, 학생 열람 기능',
    ],
    techs: ['React', 'Node.js', 'MongoDB', 'Bootstrap'],
    github: 'https://github.com/SSU-Taxmate/taxpayer-Backend',
  },
  {
    title: 'GitTalk (Git 기반 실시간 협업 채팅툴)',
    period: '2019.03 - 2019.06',
    affiliation: '개인 프로젝트',
    description: 'Git 리포지토리를 데이터 저장소이자 협업 채널로 활용하는 CLI 기반 채팅 프로그램. 별도 서버 없이 빠르고 경량화된 협업 도구 제공.',
    highlights: [
      'Git 기반 데이터 저장 및 채널 운영 — 별도 서버 없이 Git 리포지토리로 채팅 메시지 기록·공유',
      '자동 브랜치 분기 및 병합 — 실행 시 자동으로 새 브랜치 생성 및 작업 내용 병합 자동화',
      'CLI 채팅 인터페이스 — 개발 디렉토리 내에서 바로 실행, 간단한 커맨드로 팀원 소통',
      '로그인 및 사용자 인증 암호화 처리',
      '성능 최적화 — Web Parsing보다 Pull/Push 방식이 빠른 응답 속도를 보여 실제 적용',
    ],
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
  { title: '젤다의 전설: 티어스 오브 더 킹덤', platform: 'Nintendo Switch', comment: '매끄러운 맵디자인으로 유저가 직접 만들어갈 수 있게 한 세계' },
  { title: '할로우 나이트', platform: 'PC / Switch', comment: '탐험의 몰입감을 극대화한 완성도 높은 메트로배니아의 정수' },
  { title: '슈퍼 마리오 오디세이', platform: 'Nintendo Switch', comment: '순수한 즐거움의 집약체' },
  { title: '셀레스트', platform: 'PC / Switch', comment: '실패와 도전 그뒤에 있는 딸기' },
];

export const albums: Album[] = [
  { artist: 'AKMU (악뮤)', title: '항해', comment: '항해라는 이름처럼, 듣고 있으면 어딘가로 떠나고 싶어지는 앨범' },
  { artist: '태연 (TAEYEON)', title: 'My Voice', comment: '목소리 하나로 감정의 모든 결을 담아낸 앨범' },
];

export const books: Book[] = [
  { author: '베르나르 베르베르', titles: ['개미', '파피용', '신', '타나토노트'], comment: '상상력의 끝을 보여주는 작가' },
];

export const hobbies: Hobby[] = [
  { label: '게임', emoji: '🎮' },
  { label: '음악 감상', emoji: '🎵' },
  { label: '독서', emoji: '📚' },
  { label: '사진', emoji: '📷' },
];

export const youtubePlaylistId = 'OLAK5uy_nFQRM2uZ2n_LRJKXX22AZiqgt-G_50Q2U';
export const youtubeFirstVideoId = 'NewORF3VFeA';
