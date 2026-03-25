export interface Profile {
  name: string;
  title: string;
  headline: string;
  bioPoints: { emoji: string; text: string }[];
  skills: string[];
  contacts: { label: string; value: string; url?: string; icon: string }[];
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
    { label: '연락처', value: '010-6510-1422', url: 'tel:010-6510-1422', icon: '📱' },
    { label: '이메일', value: 'noino0819@naver.com', url: 'mailto:noino0819@naver.com', icon: '✉️' },
    { label: '깃허브', value: 'noino0819', url: 'https://github.com/noino0819', icon: '😺' },
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
    title: '건강상담 웹앱',
    description: '현대퓨쳐넷 재직 중 개발한 건강상담 관련 웹 애플리케이션. 사용자 건강 데이터 기반 상담 서비스 제공.',
    techs: ['Java', 'Spring Boot', 'Oracle', 'JavaScript'],
  },
  {
    title: '건강상담 ERP 시스템',
    description: '건강관리 웹앱 및 건강상담시스템 관리를 위한 ERP 시스템 개발.',
    techs: ['Java', 'Spring Boot', 'Oracle', 'JavaScript'],
  },
  {
    title: 'ML Bootcamp 프로젝트',
    description: 'Google ML Bootcamp에서 Python/TensorFlow를 활용한 머신러닝 학습 프로젝트.',
    techs: ['Python', 'TensorFlow', 'Machine Learning'],
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
