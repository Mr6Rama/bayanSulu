export const collectibleGames = {
  memory: 'Казахские пары',
  math: 'Счёт с КамБотом',
  words: 'Казахские слова',
};

export const collectibles = [
  {
    id: 'almaty-mountains',
    title: 'Горы Алматы',
    category: 'Локация',
    unlockGameId: 'memory',
    learning: 'Алматы находится у подножия Заилийского Алатау',
    icon: '🏔️',
  },
  {
    id: 'baiterek',
    title: 'Байтерек',
    category: 'Локация',
    unlockGameId: 'math',
    learning: 'Байтерек — символ Астаны',
    icon: '🗼',
  },
  {
    id: 'yurt',
    title: 'Юрта',
    category: 'Культура',
    unlockGameId: 'words',
    learning: 'Юрта — традиционное жилище кочевников',
    icon: '🏕️',
  },
  {
    id: 'charyn',
    title: 'Чарын',
    category: 'Природа',
    unlockGameId: null,
    lockedReason: 'Откроется в будущей локации',
    icon: '🏜️',
  },
  {
    id: 'dombra',
    title: 'Домбра',
    category: 'Культура',
    unlockGameId: null,
    lockedReason: 'Откроется в культурной миссии',
    icon: '🎵',
  },
  {
    id: 'kambot-backpack',
    title: 'Рюкзак КамБота',
    category: 'Аксессуар',
    unlockGameId: null,
    lockedReason: 'Откроется через серию заданий',
    icon: '🎒',
  },
  {
    id: 'kazakh-ornament',
    title: 'Казахский орнамент',
    category: 'Декор',
    unlockGameId: null,
    lockedReason: 'Откроется за ежедневное задание',
    icon: '🔶',
  },
  {
    id: 'apple-tree',
    title: 'Яблоня',
    category: 'Природа',
    unlockGameId: null,
    lockedReason: "Откроется через слово 'алма'",
    icon: '🌳',
  },
];

export const collectibleByGameId = collectibles.reduce((acc, collectible) => {
  if (collectible.unlockGameId) {
    acc[collectible.unlockGameId] = collectible;
  }

  return acc;
}, {});

export const learningReceiptByGameId = {
  memory: {
    skill: 'Память',
    done: 'Найди одинаковые пары и запомни их.',
    learned: 'Память помогает быстрее узнавать предметы и слова.',
  },
  math: {
    skill: 'Счёт',
    done: 'Реши задачу вместе с КамБотом.',
    learned: 'Счёт помогает считать покупки и монеты.',
  },
  words: {
    skill: 'Казахский язык',
    done: 'Выбери правильное слово и запомни его значение.',
    learned: 'Новые слова помогают понимать и говорить по-казахски.',
  },
};
