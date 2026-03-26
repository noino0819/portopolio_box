import type { Language } from './LanguageContext';

const ui = {
  landing: {
    hint: { ko: '두드려 안을 보기', en: 'Knock to look inside', ja: 'ノックして中を見る', zh: '敲一敲看看里面' },
    hintOpening: { ko: '안에 뭐가 있을까 ?', en: 'What could be inside?', ja: '中には何があるかな？', zh: '里面有什么呢？' },
    ariaLabel: { ko: '여행가방 두드려 열기', en: 'Knock the suitcase to open', ja: 'スーツケースをノックして開ける', zh: '敲击行李箱打开' },
  },
  interior: {
    back: { ko: '← 뒤로', en: '← Back', ja: '← 戻る', zh: '← 返回' },
    backAria: { ko: '가방 닫기, 랜딩으로 돌아가기', en: 'Close suitcase, return to landing', ja: 'スーツケースを閉じてトップに戻る', zh: '关闭行李箱，返回首页' },
  },
  items: {
    nametag: {
      label: { ko: '이름표', en: 'Nametag', ja: '名札', zh: '名牌' },
      sublabel: { ko: '프로필 & 연락처', en: 'Profile & Contact', ja: 'プロフィール & 連絡先', zh: '简介 & 联系方式' },
      subtitle: {
        ko: '만약 이름표를 직접 만들 수 있다면\n귀여운 얼굴이 그려져있었으면 좋겠어요.',
        en: 'If I could make my own nametag,\nI\'d want a cute face drawn on it.',
        ja: 'もし名札を自分で作れるなら\nかわいい顔が描いてあるといいな。',
        zh: '如果能自己做名牌的话，\n希望上面画一个可爱的脸。',
      },
    },
    book: {
      label: { ko: '책', en: 'Book', ja: '本', zh: '书' },
      sublabel: { ko: '프로젝트 & 경험', en: 'Projects & Experience', ja: 'プロジェクト & 経験', zh: '项目 & 经历' },
      subtitle: {
        ko: '제가 걸어온 길들에 대한 이야기입니다.\n즐거운 것들을 잔뜩 했어요 !',
        en: 'Stories of the paths I\'ve walked.\nI\'ve done lots of fun things!',
        ja: '私が歩んできた道のりの物語です。\n楽しいことをたくさんしました！',
        zh: '这是我走过的路的故事。\n做了好多有趣的事情！',
      },
    },
    switch: {
      label: { ko: '게임기', en: 'Console', ja: 'ゲーム機', zh: '游戏机' },
      sublabel: { ko: '취미 & 관심사', en: 'Hobbies & Interests', ja: '趣味 & 興味', zh: '爱好 & 兴趣' },
      subtitle: {
        ko: '가장 좋아하는 걸 묻는다면\n거리낌없이 게임이라 말할거에요.\n물론, 그외에도 좋아하는건 잔뜩 있지만요.',
        en: 'If asked what I like most,\nI\'d say gaming without hesitation.\nOf course, I have plenty of other interests too.',
        ja: '一番好きなものを聞かれたら\n迷わずゲームと答えます。\nもちろん、他にも好きなものはたくさんありますけど。',
        zh: '如果问我最喜欢什么，\n我会毫不犹豫地说游戏。\n当然，除此之外还有很多喜欢的东西。',
      },
    },
    cd: {
      label: { ko: 'CD', en: 'CD', ja: 'CD', zh: 'CD' },
      sublabel: { ko: '플레이리스트', en: 'Playlist', ja: 'プレイリスト', zh: '播放列表' },
      subtitle: {
        ko: '노래에는 기억이 담긴다 생각해요.\n당신에게도 이 노래에 지금의 기억이 담긴다면 좋겠네요.',
        en: 'I believe songs hold memories.\nI hope this song captures this moment for you too.',
        ja: '歌には記憶が込められると思います。\nこの歌にあなたの今の記憶も刻まれますように。',
        zh: '我觉得歌曲里承载着记忆。\n希望这首歌也能为你留住此刻的记忆。',
      },
    },
  },
  detail: {
    close: { ko: '닫기', en: 'Close', ja: '閉じる', zh: '关闭' },
    dragHint: { ko: '드래그하여 이동 가능', en: 'Drag to move', ja: 'ドラッグして移動可能', zh: '拖拽移动' },
  },
  nametag: {
    greeting: { ko: '안녕하세요,', en: 'Hello,', ja: 'こんにちは、', zh: '你好，' },
    skills: { ko: 'Skills', en: 'Skills', ja: 'スキル', zh: '技能' },
    awards: { ko: '🏆 Awards', en: '🏆 Awards', ja: '🏆 受賞歴', zh: '🏆 获奖经历' },
    profile: { ko: 'Profile', en: 'Profile', ja: 'プロフィール', zh: '个人信息' },
  },
  book: {
    educationCareer: { ko: 'Education & Career', en: 'Education & Career', ja: '学歴 & 経歴', zh: '教育 & 职业' },
    certifications: { ko: 'Certifications', en: 'Certifications', ja: '資格', zh: '资格证书' },
    projects: { ko: 'Projects', en: 'Projects', ja: 'プロジェクト', zh: '项目' },
    highlights: { ko: '주요 활동', en: 'Key Activities', ja: '主な活動', zh: '主要活动' },
    sections: {
      education: { ko: 'Education', en: 'Education', ja: '学歴', zh: '教育' },
      certs: { ko: 'Certs', en: 'Certs', ja: '資格', zh: '证书' },
      projects: { ko: 'Projects', en: 'Projects', ja: 'PJ', zh: '项目' },
    },
  },
  switch: {
    interests: { ko: 'Interests', en: 'Interests', ja: '興味', zh: '兴趣' },
    games: { ko: '🎮 Favorite Games', en: '🎮 Favorite Games', ja: '🎮 お気に入りゲーム', zh: '🎮 最喜欢的游戏' },
    albums: { ko: '🎵 Favorite Albums', en: '🎵 Favorite Albums', ja: '🎵 お気に入りアルバム', zh: '🎵 最喜欢的专辑' },
    books: { ko: '📚 Favorite Books', en: '📚 Favorite Books', ja: '📚 お気に入り本', zh: '📚 最喜欢的书' },
  },
  cd: {
    nowPlaying: { ko: 'Now Playing', en: 'Now Playing', ja: '再生中', zh: '正在播放' },
    playing: { ko: '재생 중', en: 'Playing', ja: '再生中', zh: '播放中' },
    paused: { ko: '일시정지', en: 'Paused', ja: '一時停止', zh: '已暂停' },
    keepPlaying: { ko: '이 창을 닫아도 음악은 계속 재생됩니다.', en: 'Music keeps playing when you close this.', ja: 'この画面を閉じても音楽は流れ続けます。', zh: '关闭此窗口后音乐将继续播放。' },
    desktopHint: { ko: '음악이 재생 중입니다. 하단 플레이어에서 조작하세요.', en: 'Music is playing. Use the player below.', ja: '音楽再生中。下のプレーヤーで操作してください。', zh: '音乐正在播放。请使用下方播放器操作。' },
    story: { ko: 'Story', en: 'Story', ja: 'ストーリー', zh: '故事' },
    viewOnYoutube: { ko: 'YouTube Music에서 보기 →', en: 'View on YouTube Music →', ja: 'YouTube Musicで見る →', zh: '在YouTube Music上查看 →' },
  },
  settings: {
    title: { ko: '설정', en: 'Settings', ja: '設定', zh: '设置' },
    language: { ko: '언어', en: 'Language', ja: '言語', zh: '语言' },
  },
  srOnly: {
    title: { ko: '여행가방 포트폴리오', en: 'Suitcase Portfolio', ja: 'スーツケース・ポートフォリオ', zh: '行李箱作品集' },
  },
} as const;

export type UiTranslations = typeof ui;

export function t(path: string, lang: Language): string {
  const keys = path.split('.');
  let obj: unknown = ui;
  for (const key of keys) {
    if (obj && typeof obj === 'object' && key in obj) {
      obj = (obj as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  if (obj && typeof obj === 'object' && lang in obj) {
    return (obj as Record<string, string>)[lang];
  }
  return path;
}

export default ui;
