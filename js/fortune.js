/**
 * fortune.js - マリエル 動物占い判定ロジック
 * 四柱推命の年・月干支をベースに命数(1-60)を計算し、動物タイプを判定
 * 参照: https://unkoi.com/special/animal/
 * バージョン: v1.0
 */

// ============================================================
// 動物データ（12種類）
// ============================================================
const ANIMAL_DATA = {
  wolf: {
    id: "wolf",
    name: "狼",
    emoji: "🐺",
    color: "#7B8FA1",
    personality: "人と群れるのが苦手な一匹狼気質。自分軸で生きることを重視し、自分を理解してくれる人とだけ深く繋がることを望む、独立心の強いタイプ。",
    love: "じっくりと信頼を育む恋を好む。相手を見極めるのに時間がかかるが、一度付き合うととことん愛情を注ぐ誠実な一途タイプ。",
    compatible: ["lion", "tiger", "raccoon"]
  },
  fawn: {
    id: "fawn",
    name: "こじか",
    emoji: "🦌",
    color: "#C8956C",
    personality: "無邪気で愛らしく素直で親しみやすく、誰からも愛される。真面目でルールを守るが、人への好き嫌いがハッキリしており、裏切りは許さない繊細な性格。",
    love: "傷つきたくない気持ちから相手を慎重に見極める。一度心を許すと一途に尽くすが、かまってちゃんな一面があり、誠実さを強く求める。",
    compatible: ["tiger", "raccoon", "koala"]
  },
  cheetah: {
    id: "cheetah",
    name: "チーター",
    emoji: "🐆",
    color: "#E8A838",
    personality: "何事も挑戦する行動派で好奇心旺盛、前向き。熱しやすく冷めやすく、競争意識で意欲が高まる。情に厚く愛情深いエネルギッシュなタイプ。",
    love: "追いかける恋を好み、積極的にアプローチ。うまくいかないと切り替えが早い。束縛されたくなく自由を重視する恋愛スタイル。",
    compatible: ["koala", "elephant", "sheep"]
  },
  blackleopard: {
    id: "blackleopard",
    name: "黒ひょう",
    emoji: "🐈‍⬛",
    color: "#3D3D3D",
    personality: "正義感が強く曲がったことが大嫌い。プライドが高くリーダー的ポジションを狙う。愛嬌があり人の目を惹きつける魅力を持ち、情に厚いタイプ。",
    love: "モテるが本命には一途に尽くす。好きになったら積極的にアプローチ。両思いにこだわり、結婚後も恋人同士のような新鮮な関係を求める。",
    compatible: ["elephant", "sheep", "pegasus"]
  },
  lion: {
    id: "lion",
    name: "ライオン",
    emoji: "🦁",
    color: "#E8B84B",
    personality: "常に一番になれるよう頑張る努力家。リーダーシップとカリスマ性があり、責任感・正義感が強く、愛情深い一面も持つが他人にも厳しいところがある。",
    love: "心を許す前と後で全く違うタイプ。好きになると積極的で一途。ベタベタ甘えるようになり、浮気は決して許さない独占欲が強い一面も。",
    compatible: ["sheep", "pegasus", "wolf"]
  },
  pegasus: {
    id: "pegasus",
    name: "ペガサス",
    emoji: "🦄",
    color: "#B8A9E0",
    personality: "明るく人当たりの良い性格で人の心を明るくする。感情のままに行動する気分屋で指示されるのが苦手。自由に動きたいロマンチストなタイプ。",
    love: "直感だけで人を好きになる。センスが良くモテやすく、一目惚れされることも多い。束縛が苦手で適度な距離感を保てる相手と長続きする。",
    compatible: ["blackleopard", "lion", "tiger"]
  },
  monkey: {
    id: "monkey",
    name: "猿",
    emoji: "🐒",
    color: "#C0874B",
    personality: "先のことを深く考えず今を楽しむポジティブな性格。楽観的でストレスなく過ごす。明るく愛嬌があり、周りの目にはとても素直で愛らしく映る人気者。",
    love: "好きな人と楽しいことをしたいという願望が強く、容姿や条件より楽しさを重視。失恋も早期に切り替え、人生を豊かにする恋を求める。",
    compatible: ["raccoon", "koala", "elephant"]
  },
  raccoon: {
    id: "raccoon",
    name: "たぬき",
    emoji: "🦝",
    color: "#8B7355",
    personality: "誰とでも打ち解ける明るく穏やかな性質で人好きのするタイプ。相手に合わせるのが上手で社交性と愛嬌があり、人に尽くすことを好む平和主義者。",
    love: "恋愛に奥手で受け身になりがち。相手からのアプローチに喜んで応じる。癒し系のパートナーを好み、時間をかけ将来を視野に入れた真剣交際を望む。",
    compatible: ["wolf", "fawn", "monkey"]
  },
  koala: {
    id: "koala",
    name: "コアラ",
    emoji: "🐨",
    color: "#8EA9A8",
    personality: "人を楽しませるのが大好きな社交家で奉仕精神が豊か。一見おっとりしているが慎重で警戒心が強く、頭の中で損得計算をするしっかり者。",
    love: "好きな人にはとことん尽くす。脈があるか見極めてからアプローチし、交際後は結婚を考えた真剣交際を望む、情熱的で誠実な恋愛スタイル。",
    compatible: ["fawn", "monkey", "cheetah"]
  },
  elephant: {
    id: "elephant",
    name: "ゾウ",
    emoji: "🐘",
    color: "#9B8EA0",
    personality: "目標達成に向けてコツコツ頑張る努力家。向上心が強く世渡り上手で誰からも愛される。面倒見が良く、相手のためにとことん尽くすタイプ。",
    love: "好きな相手に自分からアプローチする一途なタイプ。真っ直ぐに愛するが表現が苦手で気づかれにくい。誠実で真剣な交際で生涯のパートナーを求める。",
    compatible: ["monkey", "cheetah", "blackleopard"]
  },
  sheep: {
    id: "sheep",
    name: "ひつじ",
    emoji: "🐑",
    color: "#D4C9B0",
    personality: "誰とでも打ち解ける社交家で、寂しがり屋。気づかい上手で世話焼きな一面があり、人のために尽くすことに喜びを感じる。感情的になりやすい面も。",
    love: "好きな人とは常に繋がっていたいと望む。本心でぶつかってくれる人を好み、好きになると尽くし甘えたがる。連絡がまめな相手を求める。",
    compatible: ["cheetah", "blackleopard", "lion"]
  },
  tiger: {
    id: "tiger",
    name: "虎",
    emoji: "🐯",
    color: "#D4821A",
    personality: "自由を愛し自分の思い通りに物事を動かしたい強い思いを持つ。面倒見が良くプライドが高く正直者。嘘やごまかしが苦手で白黒をハッキリつけるタイプ。",
    love: "とても一途で真剣な恋をし、結婚を見据えた交際をする。モテやすいが内面まで深く理解してから恋に落ちる。誠実に尽くすが、プライドを傷つけられると許しがたい。",
    compatible: ["pegasus", "wolf", "fawn"]
  }
};

// 動物名（表示用）の日本語対応
const ANIMAL_NAMES_JA = {
  wolf: "狼",
  fawn: "こじか",
  cheetah: "チーター",
  blackleopard: "黒ひょう",
  lion: "ライオン",
  pegasus: "ペガサス",
  monkey: "猿",
  raccoon: "たぬき",
  koala: "コアラ",
  elephant: "ゾウ",
  sheep: "ひつじ",
  tiger: "虎"
};

// ============================================================
// 命数計算ロジック（四柱推命ベース・節入り日近似版）
// ============================================================

/**
 * 年の干支番号を計算（1-60）
 * 1864年 = 甲子(1) を基準とする
 */
function calcYearKanshi(year) {
  return ((year - 1864) % 60 + 60) % 60 + 1;
}

/**
 * 五虎遁年法: 年の天干から1月の月干支番号を決定
 * 天干: 甲(0)乙(1)丙(2)丁(3)戊(4)己(5)庚(6)辛(7)壬(8)癸(9)
 * 1月（寅月）の起算干支番号
 */
const MONTH_BASE = [
  51, // 甲年・己年: 甲寅(51)
  3,  // 乙年・庚年: 丙寅(3) ← 実際は3番 ※干支番号は1始まり
  15, // 丙年・辛年: 戊寅(15)
  27, // 丁年・壬年: 庚寅(27)
  39  // 戊年・癸年: 壬寅(39)
];

// 五虎遁のグループ（天干0-9 → グループ0-4）
const TENKAN_GROUP = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];

/**
 * 月の干支番号を計算（1-60）
 * yearKanshi: 年干支番号(1-60)
 * month: 月(1-12)
 * ※節入り日（旧暦の月切り替わり）は考慮しない近似版
 */
function calcMonthKanshi(yearKanshi, month) {
  const tenkan = (yearKanshi - 1) % 10; // 天干番号(0-9)
  const group = TENKAN_GROUP[tenkan];
  const base = MONTH_BASE[group]; // 1月（寅月）の干支番号
  // 寅月=1月として月ごとに+1
  return ((base - 1 + (month - 1)) % 60) + 1;
}

/**
 * 最終命数を計算（年命数 + 月命数の合算）
 */
function calcMeiSuu(year, month) {
  const yearKanshi = calcYearKanshi(year);
  const monthKanshi = calcMonthKanshi(yearKanshi, month);
  return ((yearKanshi + monthKanshi - 2) % 60) + 1;
}

/**
 * 命数(1-60)から動物IDを返す
 * 各動物に命数5つずつ割り当て
 */
const MEISUU_TO_ANIMAL = [
  "wolf",        // 1-5
  "fawn",        // 6-10
  "cheetah",     // 11-15
  "blackleopard",// 16-20
  "lion",        // 21-25
  "pegasus",     // 26-30
  "monkey",      // 31-35
  "raccoon",     // 36-40
  "koala",       // 41-45
  "elephant",    // 46-50
  "sheep",       // 51-55
  "tiger"        // 56-60
];

function getAnimalIdByMeiSuu(meiSuu) {
  const index = Math.floor((meiSuu - 1) / 5);
  return MEISUU_TO_ANIMAL[Math.min(index, 11)];
}

// ============================================================
// Flexメッセージ生成
// ============================================================

/**
 * 動物データからLINE Flexメッセージオブジェクトを生成
 * liff.sendMessages() で直接送信できる形式
 */
function buildFlexMessage(animal) {
  const compatibleBoxes = animal.compatibleAnimals.map(a => ({
    type: "box",
    layout: "vertical",
    flex: 1,
    backgroundColor: "#FFF8F0",
    cornerRadius: "12px",
    paddingAll: "12px",
    contents: [
      {
        type: "image",
        url: `https://marryelll-fortune.vercel.app/images/animals/png/${a.id}.png`,
        size: "60px",
        align: "center",
        aspectMode: "fit"
      },
      {
        type: "text",
        text: a.name,
        size: "xxs",
        align: "center",
        color: "#555555",
        weight: "bold",
        margin: "sm"
      }
    ]
  }));

  return {
    type: "flex",
    altText: `${animal.emoji} あなたの動物キャラ【${animal.name}】診断結果`,
    contents: {
      type: "bubble",
      size: "mega",
      styles: {
        header: { backgroundColor: animal.color },
        footer: { backgroundColor: "#fafafa" }
      },
      header: {
        type: "box",
        layout: "vertical",
        paddingTop: "20px",
        paddingBottom: "20px",
        contents: [
          {
            type: "image",
            url: `https://marryelll-fortune.vercel.app/images/animals/png/${animal.id}.png`,
            size: "100px",
            align: "center",
            aspectMode: "fit"
          },
          {
            type: "text",
            text: "ANIMAL TYPE",
            size: "xxs",
            color: "#ffffffaa",
            align: "center",
            margin: "md"
          },
          {
            type: "text",
            text: animal.name,
            size: "xxl",
            weight: "bold",
            color: "#ffffff",
            align: "center",
            margin: "sm"
          }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        paddingAll: "20px",
        contents: [
          // 性格
          {
            type: "text",
            text: "💡 基本性格",
            size: "xs",
            weight: "bold",
            color: "#888888"
          },
          {
            type: "text",
            text: animal.personality,
            size: "sm",
            wrap: true,
            margin: "sm",
            color: "#333333"
          },
          // セパレーター
          { type: "separator", margin: "lg", color: "#f0f0f0" },
          // 恋愛傾向
          {
            type: "text",
            text: "💕 恋愛傾向",
            size: "xs",
            weight: "bold",
            color: "#888888",
            margin: "lg"
          },
          {
            type: "text",
            text: animal.love,
            size: "sm",
            wrap: true,
            margin: "sm",
            color: "#333333"
          },
          // セパレーター
          { type: "separator", margin: "lg", color: "#f0f0f0" },
          // 相性
          {
            type: "text",
            text: "★ 相性の良い動物 TOP3",
            size: "xs",
            weight: "bold",
            color: "#888888",
            margin: "lg"
          },
          {
            type: "box",
            layout: "horizontal",
            spacing: "sm",
            margin: "md",
            contents: compatibleBoxes
          }
        ]
      },
      footer: {
        type: "box",
        layout: "vertical",
        paddingAll: "16px",
        contents: [
          {
            type: "text",
            text: "💍 marryell",
            size: "xs",
            color: "#aaaaaa",
            align: "center"
          }
        ]
      }
    }
  };
}

// ============================================================
// メイン: 生年月日から動物タイプを判定
// ============================================================

/**
 * @param {number} year - 生まれ年
 * @param {number} month - 生まれ月(1-12)
 * @param {number} day - 生まれ日(1-31) ※現在は年・月のみで判定
 * @returns {object} 動物データオブジェクト
 */
function getAnimalFortune(year, month, day) {
  const meiSuu = calcMeiSuu(year, month);
  const animalId = getAnimalIdByMeiSuu(meiSuu);
  const animal = ANIMAL_DATA[animalId];

  // 相性の良い動物3つのデータを付与
  const compatibleAnimals = animal.compatible.map(id => ({
    id,
    name: ANIMAL_DATA[id].name,
    emoji: ANIMAL_DATA[id].emoji
  }));

  return {
    ...animal,
    meiSuu,
    compatibleAnimals
  };
}
