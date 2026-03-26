import type { Language } from './LanguageContext';

const ui = {
  landing: {
    hint: {
      ko: '두드려 안을 보기', en: 'Knock to look inside', ja: 'ノックして中を見る', zh: '敲一敲看看里面',
      de: 'Klopfen, um hineinzusehen', es: 'Toca para mirar dentro', fr: 'Frappez pour regarder à l\'intérieur',
    },
    hintOpening: {
      ko: '안에 뭐가 있을까 ?', en: 'What could be inside?', ja: '中には何があるかな？', zh: '里面有什么呢？',
      de: 'Was könnte drinnen sein?', es: '¿Qué habrá dentro?', fr: 'Qu\'est-ce qu\'il pourrait y avoir dedans ?',
    },
    ariaLabel: {
      ko: '여행가방 두드려 열기', en: 'Knock the suitcase to open', ja: 'スーツケースをノックして開ける', zh: '敲击行李箱打开',
      de: 'Koffer anklopfen zum Öffnen', es: 'Golpea la maleta para abrirla', fr: 'Frappez la valise pour l\'ouvrir',
    },
    credit: {
      ko: '* 이 페이지는 기획부터 개발, 배포까지 Claude Opus 4.6을 활용하여 2시간동안 제작되었습니다.',
      en: '* This page was planned, developed, and deployed in 2 hours using Claude Opus 4.6.',
      ja: '* このページは企画から開発、デプロイまでClaude Opus 4.6を活用し、2時間で制作されました。',
      zh: '* 本页面从策划到开发、部署，全程使用Claude Opus 4.6，在2小时内完成。',
      de: '* Diese Seite wurde in 2 Stunden mit Claude Opus 4.6 geplant, entwickelt und bereitgestellt.',
      es: '* Esta página fue planificada, desarrollada y desplegada en 2 horas usando Claude Opus 4.6.',
      fr: '* Cette page a été conçue, développée et déployée en 2 heures avec Claude Opus 4.6.',
    },
  },
  interior: {
    back: {
      ko: '← 뒤로', en: '← Back', ja: '← 戻る', zh: '← 返回',
      de: '← Zurück', es: '← Volver', fr: '← Retour',
    },
    backAria: {
      ko: '가방 닫기, 랜딩으로 돌아가기', en: 'Close suitcase, return to landing', ja: 'スーツケースを閉じてトップに戻る', zh: '关闭行李箱，返回首页',
      de: 'Koffer schließen, zurück zur Startseite', es: 'Cerrar maleta, volver al inicio', fr: 'Fermer la valise, retourner à l\'accueil',
    },
  },
  items: {
    nametag: {
      label: {
        ko: '이름표', en: 'Nametag', ja: '名札', zh: '名牌',
        de: 'Namensschild', es: 'Etiqueta', fr: 'Badge',
      },
      sublabel: {
        ko: '프로필 & 연락처', en: 'Profile & Contact', ja: 'プロフィール & 連絡先', zh: '简介 & 联系方式',
        de: 'Profil & Kontakt', es: 'Perfil y contacto', fr: 'Profil & Contact',
      },
      subtitle: {
        ko: '만약 이름표를 직접 만들 수 있다면\n귀여운 얼굴이 그려져있었으면 좋겠어요.',
        en: 'If I could make my own nametag,\nI\'d want a cute face drawn on it.',
        ja: 'もし名札を自分で作れるなら\nかわいい顔が描いてあるといいな。',
        zh: '如果能自己做名牌的话，\n希望上面画一个可爱的脸。',
        de: 'Wenn ich mein eigenes Namensschild machen könnte,\nwürde ich ein süßes Gesicht darauf malen lassen.',
        es: 'Si pudiera hacer mi propia etiqueta,\nme gustaría que tuviera una cara linda dibujada.',
        fr: 'Si je pouvais faire mon propre badge,\nj\'aimerais qu\'il y ait un joli visage dessiné dessus.',
      },
    },
    book: {
      label: {
        ko: '책', en: 'Book', ja: '本', zh: '书',
        de: 'Buch', es: 'Libro', fr: 'Livre',
      },
      sublabel: {
        ko: '프로젝트 & 경험', en: 'Projects & Experience', ja: 'プロジェクト & 経験', zh: '项目 & 经历',
        de: 'Projekte & Erfahrung', es: 'Proyectos y experiencia', fr: 'Projets & Expérience',
      },
      subtitle: {
        ko: '제가 걸어온 길들에 대한 이야기입니다.\n즐거운 것들을 잔뜩 했어요 !',
        en: 'Stories of the paths I\'ve walked.\nI\'ve done lots of fun things!',
        ja: '私が歩んできた道のりの物語です。\n楽しいことをたくさんしました！',
        zh: '这是我走过的路的故事。\n做了好多有趣的事情！',
        de: 'Geschichten über die Wege, die ich gegangen bin.\nIch habe viele spannende Dinge gemacht!',
        es: 'Historias de los caminos que he recorrido.\n¡He hecho muchas cosas divertidas!',
        fr: 'Histoires des chemins que j\'ai parcourus.\nJ\'ai fait plein de choses amusantes !',
      },
    },
    switch: {
      label: {
        ko: '게임기', en: 'Console', ja: 'ゲーム機', zh: '游戏机',
        de: 'Konsole', es: 'Consola', fr: 'Console',
      },
      sublabel: {
        ko: '취미 & 관심사', en: 'Hobbies & Interests', ja: '趣味 & 興味', zh: '爱好 & 兴趣',
        de: 'Hobbys & Interessen', es: 'Hobbies e intereses', fr: 'Loisirs & Intérêts',
      },
      subtitle: {
        ko: '가장 좋아하는 걸 묻는다면\n거리낌없이 게임이라 말할거에요.\n물론, 그외에도 좋아하는건 잔뜩 있지만요.',
        en: 'If asked what I like most,\nI\'d say gaming without hesitation.\nOf course, I have plenty of other interests too.',
        ja: '一番好きなものを聞かれたら\n迷わずゲームと答えます。\nもちろん、他にも好きなものはたくさんありますけど。',
        zh: '如果问我最喜欢什么，\n我会毫不犹豫地说游戏。\n当然，除此之外还有很多喜欢的东西。',
        de: 'Wenn man mich fragt, was ich am liebsten mag,\nwürde ich ohne Zögern Gaming sagen.\nNatürlich habe ich auch viele andere Interessen.',
        es: 'Si me preguntan qué es lo que más me gusta,\ndiría videojuegos sin dudar.\nPor supuesto, también tengo muchos otros intereses.',
        fr: 'Si on me demandait ce que je préfère,\nje dirais les jeux vidéo sans hésiter.\nBien sûr, j\'ai aussi plein d\'autres centres d\'intérêt.',
      },
    },
    cd: {
      label: {
        ko: 'CD', en: 'CD', ja: 'CD', zh: 'CD',
        de: 'CD', es: 'CD', fr: 'CD',
      },
      sublabel: {
        ko: '플레이리스트', en: 'Playlist', ja: 'プレイリスト', zh: '播放列表',
        de: 'Playlist', es: 'Lista de reproducción', fr: 'Playlist',
      },
      subtitle: {
        ko: '노래에는 기억이 담긴다 생각해요.\n당신에게도 이 노래에 지금의 기억이 담긴다면 좋겠네요.',
        en: 'I believe songs hold memories.\nI hope this song captures this moment for you too.',
        ja: '歌には記憶が込められると思います。\nこの歌にあなたの今の記憶も刻まれますように。',
        zh: '我觉得歌曲里承载着记忆。\n希望这首歌也能为你留住此刻的记忆。',
        de: 'Ich glaube, Lieder bewahren Erinnerungen.\nIch hoffe, dieses Lied fängt auch diesen Moment für dich ein.',
        es: 'Creo que las canciones guardan recuerdos.\nEspero que esta canción capture este momento para ti también.',
        fr: 'Je crois que les chansons gardent des souvenirs.\nJ\'espère que cette chanson capturera aussi ce moment pour vous.',
      },
    },
  },
  detail: {
    close: {
      ko: '닫기', en: 'Close', ja: '閉じる', zh: '关闭',
      de: 'Schließen', es: 'Cerrar', fr: 'Fermer',
    },
    dragHint: {
      ko: '드래그하여 이동 가능', en: 'Drag to move', ja: 'ドラッグして移動可能', zh: '拖拽移动',
      de: 'Ziehen zum Verschieben', es: 'Arrastra para mover', fr: 'Glisser pour déplacer',
    },
  },
  nametag: {
    greeting: {
      ko: '안녕하세요,', en: 'Hello,', ja: 'こんにちは、', zh: '你好，',
      de: 'Hallo,', es: 'Hola,', fr: 'Bonjour,',
    },
    skills: {
      ko: 'Skills', en: 'Skills', ja: 'スキル', zh: '技能',
      de: 'Fähigkeiten', es: 'Habilidades', fr: 'Compétences',
    },
    awards: {
      ko: '🏆 Awards', en: '🏆 Awards', ja: '🏆 受賞歴', zh: '🏆 获奖经历',
      de: '🏆 Auszeichnungen', es: '🏆 Premios', fr: '🏆 Récompenses',
    },
    profile: {
      ko: 'Profile', en: 'Profile', ja: 'プロフィール', zh: '个人信息',
      de: 'Profil', es: 'Perfil', fr: 'Profil',
    },
  },
  book: {
    educationCareer: {
      ko: 'Education & Career', en: 'Education & Career', ja: '学歴 & 経歴', zh: '教育 & 职业',
      de: 'Bildung & Karriere', es: 'Educación y carrera', fr: 'Formation & Carrière',
    },
    certifications: {
      ko: 'Certifications', en: 'Certifications', ja: '資格', zh: '资格证书',
      de: 'Zertifizierungen', es: 'Certificaciones', fr: 'Certifications',
    },
    projects: {
      ko: 'Projects', en: 'Projects', ja: 'プロジェクト', zh: '项目',
      de: 'Projekte', es: 'Proyectos', fr: 'Projets',
    },
    highlights: {
      ko: '주요 활동', en: 'Key Activities', ja: '主な活動', zh: '主要活动',
      de: 'Highlights', es: 'Actividades clave', fr: 'Points clés',
    },
    sections: {
      education: {
        ko: 'Education', en: 'Education', ja: '学歴', zh: '教育',
        de: 'Bildung', es: 'Educación', fr: 'Formation',
      },
      certs: {
        ko: 'Certs', en: 'Certs', ja: '資格', zh: '证书',
        de: 'Zert.', es: 'Cert.', fr: 'Cert.',
      },
      projects: {
        ko: 'Projects', en: 'Projects', ja: 'PJ', zh: '项目',
        de: 'Projekte', es: 'Proyectos', fr: 'Projets',
      },
    },
  },
  switch: {
    interests: {
      ko: 'Interests', en: 'Interests', ja: '興味', zh: '兴趣',
      de: 'Interessen', es: 'Intereses', fr: 'Intérêts',
    },
    games: {
      ko: '🎮 Favorite Games', en: '🎮 Favorite Games', ja: '🎮 お気に入りゲーム', zh: '🎮 最喜欢的游戏',
      de: '🎮 Lieblingsspiele', es: '🎮 Juegos favoritos', fr: '🎮 Jeux préférés',
    },
    albums: {
      ko: '🎵 Favorite Albums', en: '🎵 Favorite Albums', ja: '🎵 お気に入りアルバム', zh: '🎵 最喜欢的专辑',
      de: '🎵 Lieblingsalben', es: '🎵 Álbumes favoritos', fr: '🎵 Albums préférés',
    },
    books: {
      ko: '📚 Favorite Books', en: '📚 Favorite Books', ja: '📚 お気に入り本', zh: '📚 最喜欢的书',
      de: '📚 Lieblingsbücher', es: '📚 Libros favoritos', fr: '📚 Livres préférés',
    },
  },
  cd: {
    nowPlaying: {
      ko: 'Now Playing', en: 'Now Playing', ja: '再生中', zh: '正在播放',
      de: 'Läuft gerade', es: 'Reproduciendo', fr: 'En lecture',
    },
    playing: {
      ko: '재생 중', en: 'Playing', ja: '再生中', zh: '播放中',
      de: 'Wiedergabe', es: 'Reproduciendo', fr: 'Lecture',
    },
    paused: {
      ko: '일시정지', en: 'Paused', ja: '一時停止', zh: '已暂停',
      de: 'Pausiert', es: 'Pausado', fr: 'Pause',
    },
    keepPlaying: {
      ko: '이 창을 닫아도 음악은 계속 재생됩니다.', en: 'Music keeps playing when you close this.', ja: 'この画面を閉じても音楽は流れ続けます。', zh: '关闭此窗口后音乐将继续播放。',
      de: 'Die Musik spielt weiter, wenn du dies schließt.', es: 'La música sigue sonando al cerrar esto.', fr: 'La musique continue quand vous fermez ceci.',
    },
    desktopHint: {
      ko: '음악이 재생 중입니다. 하단 플레이어에서 조작하세요.', en: 'Music is playing. Use the player below.', ja: '音楽再生中。下のプレーヤーで操作してください。', zh: '音乐正在播放。请使用下方播放器操作。',
      de: 'Musik wird abgespielt. Nutze den Player unten.', es: 'La música está sonando. Usa el reproductor de abajo.', fr: 'Musique en cours. Utilisez le lecteur ci-dessous.',
    },
    story: {
      ko: 'Story', en: 'Story', ja: 'ストーリー', zh: '故事',
      de: 'Geschichte', es: 'Historia', fr: 'Histoire',
    },
    viewOnYoutube: {
      ko: 'YouTube Music에서 보기 →', en: 'View on YouTube Music →', ja: 'YouTube Musicで見る →', zh: '在YouTube Music上查看 →',
      de: 'Auf YouTube Music ansehen →', es: 'Ver en YouTube Music →', fr: 'Voir sur YouTube Music →',
    },
  },
  settings: {
    title: {
      ko: '설정', en: 'Settings', ja: '設定', zh: '设置',
      de: 'Einstellungen', es: 'Ajustes', fr: 'Paramètres',
    },
    language: {
      ko: '언어', en: 'Language', ja: '言語', zh: '语言',
      de: 'Sprache', es: 'Idioma', fr: 'Langue',
    },
  },
  note: {
    title: {
      ko: '쪽지', en: 'Note', ja: 'メモ', zh: '便条',
      de: 'Notiz', es: 'Nota', fr: 'Note',
    },
    line1: {
      ko: '오랫동안 생각해온건데,', en: "I've been thinking about this for a while,", ja: 'ずっと考えていたんだけど、', zh: '想了很久，',
      de: 'Ich habe lange darüber nachgedacht,', es: 'He estado pensando en esto por un tiempo,', fr: 'J\'y pense depuis longtemps,',
    },
    line2: {
      ko: '전 역시 재밌는게 좋아요.', en: 'I really do love having fun.', ja: 'やっぱり楽しいことが好きです。', zh: '我果然还是喜欢有趣的事情。',
      de: 'Ich liebe es einfach, Spaß zu haben.', es: 'Realmente me encanta divertirme.', fr: 'J\'adore vraiment m\'amuser.',
    },
  },
  srOnly: {
    title: {
      ko: '여행가방 포트폴리오', en: 'Suitcase Portfolio', ja: 'スーツケース・ポートフォリオ', zh: '行李箱作品集',
      de: 'Koffer-Portfolio', es: 'Portafolio Maleta', fr: 'Portfolio Valise',
    },
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
  if (obj && typeof obj === 'object') {
    const rec = obj as Record<string, string>;
    if (lang in rec) return rec[lang];
    if ('en' in rec) return rec['en'];
    if ('ko' in rec) return rec['ko'];
  }
  return path;
}

export default ui;
