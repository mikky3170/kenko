// [稼働作業版] スマートトースト通知フォールバック(Android Chromeエラー解消)、デスクワーク・表情筋セルフケア見守り通知対応

const MASTER_KEY_RECORDS = 'health_kun_data_master_records';
const MASTER_KEY_SETTINGS = 'health_kun_data_master_settings';
const MASTER_KEY_MENUS = 'health_kun_data_master_menus';
const MASTER_KEY_MEDS = 'health_kun_data_master_meds';
const MASTER_KEY_PROFILE = 'health_kun_data_master_profile';

// 専門家からの「健康に関する今日のひとことコメント」ライブラリ
const HEALTH_TIPS_LIBRARY = [
  {
    author: "🩺 Dr.ケン (循環器内科)",
    role: "循環器内科専門医",
    color: "var(--accent-blue)",
    tip: "起床後1時間は『モーニング・サージ（急な血圧上昇）』が最も起きやすい時間帯です。起き抜けに常温の水をコップ1杯飲むと血液粘度が下がり、血管事故を力強く防ぎます。"
  },
  {
    author: "🥗 管理栄養士 アヤ",
    role: "臨床病態栄養指導士",
    color: "var(--accent-green)",
    tip: "外食やラーメン等で塩分を摂りすぎた翌朝は、バナナ・納豆・ほうれん草・豆乳などの『カリウム食材』を意識。腎臓からのナトリウム排泄がぐんと促されます。"
  },
  {
    author: "🩺 Dr.ケン (循環器内科)",
    role: "循環器内科専門医",
    color: "var(--accent-blue)",
    tip: "デスクワーク中の腰痛は、お尻の尖った骨（坐骨）2点で座り、丸めたタオルを腰のくびれに挟むだけで椎間板への圧力が半減します。骨盤を立てて作業しましょう。"
  },
  {
    author: "🩺 Dr.ケン (循環器内科)",
    role: "循環器内科専門医",
    color: "var(--accent-blue)",
    tip: "目の奥の疲れと首こりは連動しています。首の後ろのくぼみ（天柱）を親指で斜め上に5秒じんわり押し上げると、毛様体筋の緊張が解けて視界が明るくなります。"
  },
  {
    author: "🥗 管理栄養士 アヤ",
    role: "臨床病態栄養指導士",
    color: "var(--accent-green)",
    tip: "食事の最初に野菜やおひたしを食べる『ベジファースト』は、血糖値スパイクを防ぐだけでなく、インスリンの過剰分泌による内臓脂肪の蓄積を直接ブロックします。"
  },
  {
    author: "🩺 Dr.ケン (循環器内科)",
    role: "循環器内科専門医",
    color: "var(--accent-blue)",
    tip: "家庭血圧は『座って1〜2分安静にしてから測定』が臨床の鉄則です。測定直前の深呼吸を2回するだけで、緊張による見かけの高血圧（白衣現象）をリセットできます。"
  },
  {
    author: "🥗 管理栄養士 アヤ",
    role: "臨床病態栄養指導士",
    color: "var(--accent-green)",
    tip: "集中すると無意識に眉間にシワが寄っていませんか？眉頭の骨を指でつまんで小さく揺らすと皺眉筋がほぐれ、表情の険しさと頭重感がスーッと消えますよ。"
  },
  {
    author: "🩺 Dr.ケン (循環器内科)",
    role: "循環器内科専門医",
    color: "var(--accent-blue)",
    tip: "最高血圧と最低血圧の差（脈圧）が65を超えてきたら血管の硬化シグナル。カリウム摂取と1日8,000歩のウォーキングで、動脈のしなやかさを取り戻しましょう。"
  },
  {
    author: "🥗 管理栄養士 アヤ",
    role: "臨床病態栄養指導士",
    color: "var(--accent-green)",
    tip: "麺類の『つゆを残す』だけで、1食あたり約2〜3g（1日の目標塩分6.0gの約半分）をカットできます！『残す勇気』が最大の生活習慣病予防です。"
  },
  {
    author: "🩺 Dr.ケン (循環器内科)",
    role: "循環器内科専門医",
    color: "var(--accent-blue)",
    tip: "就寝前の熱いお風呂は交感神経を刺激して夜間高血圧の原因に。39〜40度のぬるめのお湯に15分浸かるのが、自律神経を整え睡眠の質を高める黄金律です。"
  },
  {
    author: "🥗 管理栄養士 アヤ",
    role: "臨床病態栄養指導士",
    color: "var(--accent-green)",
    tip: "ほうれい線予防には、口の中で舌を大きく時計回りに10周回す『舌回しアイロン』が効果抜群！口輪筋が鍛えられ、頬のたるみが内側からリフトアップします。"
  },
  {
    author: "🩺 Dr.ケン (循環器内科)",
    role: "循環器内科専門医",
    color: "var(--accent-blue)",
    tip: "休肝日を週2日設けるだけで、肝臓の解毒酵素だけでなく血管内皮細胞が修復され、夜間血圧が平均3〜5mmHg低下することが医学的に証明されています。"
  },
  {
    author: "🥗 管理栄養士 アヤ",
    role: "臨床病態栄養指導士",
    color: "var(--accent-green)",
    tip: "主食を白米から『玄米』や『雑穀米』に置き換えるだけで、ビタミンB群とマグネシウムの摂取量が倍増！糖質代謝が活性化し、午後の疲労感が激減します。"
  },
  {
    author: "🩺 Dr.ケン (循環器内科)",
    role: "循環器内科専門医",
    color: "var(--accent-blue)",
    tip: "日々の体重や血圧が1〜2kg変動しても慌てる必要はありません。重要なのは『7日間移動平均（SMA7）』の方向性。ノイズに一喜一憂しないのが長続きの極意です。"
  },
  {
    author: "🥗 管理栄養士 アヤ",
    role: "臨床病態栄養指導士",
    color: "var(--accent-green)",
    tip: "魚に含まれるEPA・DHA（オメガ3）は、血液をサラサラにするだけでなく中性脂肪を減らす特効薬。週に3回はお魚を選ぶかサプリで上手に補いましょう。"
  },
  {
    author: "🩺 Dr.ケン (循環器内科)",
    role: "循環器内科専門医",
    color: "var(--accent-blue)",
    tip: "デスクワークで座りっぱなしが続くと下肢に血液が滞ります。1時間に1回は立ち上がり、つま先立ちやかかとの上げ下ろし運動を10回行いましょう。"
  },
  {
    author: "🥗 管理栄養士 アヤ",
    role: "臨床病態栄養指導士",
    color: "var(--accent-green)",
    tip: "味噌汁は塩分が心配されがちですが、具だくさん（豆腐・わかめ・きのこ）にして汁を半分残せば、大豆のイソフラボンや食物繊維の健康効果が上回ります！"
  },
  {
    author: "🩺 Dr.ケン (循環器内科)",
    role: "循環器内科専門医",
    color: "var(--accent-blue)",
    tip: "お酒を飲むときは『チェイサー（お水）』を同量飲むのが鉄則。アルコールの利尿作用による脱水を防ぎ、翌朝の血圧急上昇と頭痛を抑えます。"
  },
  {
    author: "🩺 Dr.ケン (循環器内科)",
    role: "循環器内科専門医",
    color: "var(--accent-blue)",
    tip: "睡眠時間が6時間を下回ると、交感神経が興奮したままになり高血圧・不整脈リスクが約1.5倍に。就寝前のスマホ画面を控えて脳を休ませましょう。"
  },
  {
    author: "🥗 管理栄養士 アヤ",
    role: "臨床病態栄養指導士",
    color: "var(--accent-green)",
    tip: "大豆イソフラボンや植物性タンパク質が豊富な『無調整豆乳』は、血圧を安定させる飲むサプリメント。朝のコーヒーに少し足す『ソイラテ』が手軽で最高です！"
  }
];

// サブタイプ定義
const SUBTYPES_DEF = {
  "チャーハン・炒飯": [
    { name: "ノーマル炒飯", cal: 580, salt: 2.5 },
    { name: "五目チャーハン", cal: 620, salt: 2.8 },
    { name: "キムチチャーハン", cal: 640, salt: 3.4 }
  ],
  "カレーライス": [
    { name: "定番カレーライス", cal: 680, salt: 2.8 },
    { name: "濃厚ビーフカレー", cal: 750, salt: 2.8 },
    { name: "カツカレー", cal: 950, salt: 3.5 }
  ],
  "牛ステーキ": [
    { name: "赤身肉中心 (ヒレ・もも)", cal: 360, salt: 1.0 },
    { name: "脂身多め (サーロイン/リブロース)", cal: 680, salt: 1.2 }
  ],
  "ハンバーグ": [
    { name: "デミグラス/和風", cal: 380, salt: 1.6 },
    { name: "チーズイン", cal: 460, salt: 1.8 }
  ],
  "とんかつ・カツ類": [
    { name: "ロースかつ (1枚)", cal: 450, salt: 1.2 },
    { name: "ヒレかつ (2〜3個)", cal: 340, salt: 1.0 }
  ],
  "牛焼肉・カルビ/ロース": [
    { name: "ロース・赤身肉中心", cal: 240, salt: 1.0 },
    { name: "カルビ・脂身多め", cal: 380, salt: 1.2 }
  ],
  "餃子・焼売": [
    { name: "焼き餃子 (1皿5〜6個)", cal: 220, salt: 1.1 },
    { name: "水餃子 (1皿5〜6個)", cal: 200, salt: 1.2 },
    { name: "焼売・中華点心 (4〜5個)", cal: 200, salt: 1.0 }
  ],
  "コーヒー": [
    { name: "ブラック", cal: 5, salt: 0.0 },
    { name: "ミルク入り", cal: 45, salt: 0.1 },
    { name: "ココア入り", cal: 75, salt: 0.1 },
    { name: "豆乳入り", cal: 50, salt: 0.1 }
  ],
  "ラーメン・中華麺": [
    { name: "中華そば", cal: 450, salt: 2.4 },
    { name: "チャーシューメン", cal: 650, salt: 3.2 },
    { name: "博多豚骨ラーメン", cal: 580, salt: 2.8 },
    { name: "横浜家系", cal: 850, salt: 4.0 },
    { name: "二郎系", cal: 1600, salt: 6.5 },
    { name: "つけ麺", cal: 800, salt: 3.2 },
    { name: "冷やし中華", cal: 480, salt: 2.0 }
  ],
  "ホルモン焼き・レバー炒め": [
    { name: "ホルモン(シロ/小腸)", cal: 280, salt: 1.2 },
    { name: "レバー(肝臓・高鉄分)", cal: 140, salt: 1.0 },
    { name: "ホルモンMIX炒め", cal: 250, salt: 1.2 }
  ]
};

// 全メニューマスター（体系順ソート版）
const DEFAULT_50_MENUS = [
  // 🍚 主食 (15品)
  { id: 1,  cat: "主食", name: "ご飯・白米",       m: true,  l: true,  d: true,  ln: false, cal: 240, salt: 0.0 },
  { id: 2,  cat: "主食", name: "玄米・雑穀米",     m: true,  l: true,  d: true,  ln: false, cal: 230, salt: 0.0 },
  { id: 3,  cat: "主食", name: "食パン・トースト", m: true,  l: false, d: false, ln: false, cal: 160, salt: 0.8 },
  { id: 4,  cat: "主食", name: "ロール・惣菜パン", m: true,  l: true,  d: false, ln: true,  cal: 220, salt: 1.0 },
  { id: 5,  cat: "主食", name: "うどん",           m: true,  l: true,  d: true,  ln: true,  cal: 320, salt: 2.2 },
  { id: 6,  cat: "主食", name: "蕎麦",             m: true,  l: true,  d: true,  ln: true,  cal: 300, salt: 2.0 },
  { id: 7,  cat: "主食", name: "ラーメン・中華麺", m: false, l: true,  d: true,  ln: true,  cal: 450, salt: 2.4 },
  { id: 8,  cat: "主食", name: "パスタ",           m: false, l: true,  d: true,  ln: false, cal: 420, salt: 1.8 },
  { id: 9,  cat: "主食", name: "おにぎり",         m: true,  l: true,  d: false, ln: true,  cal: 180, salt: 0.5 },
  { id: 10, cat: "主食", name: "餅・シリアル類",   m: true,  l: false, d: false, ln: false, cal: 170, salt: 0.2 },
  { id: 11, cat: "主食", name: "牛丼",             m: false, l: true,  d: true,  ln: false, cal: 720, salt: 2.5 },
  { id: 12, cat: "主食", name: "天丼",             m: false, l: true,  d: true,  ln: false, cal: 820, salt: 2.8 },
  { id: 13, cat: "主食", name: "うな丼",           m: false, l: true,  d: true,  ln: false, cal: 750, salt: 2.2 },
  { id: 53, cat: "主食", name: "チャーハン・炒飯", m: false, l: true,  d: true,  ln: true,  cal: 580, salt: 2.5 },
  { id: 54, cat: "主食", name: "カレーライス",     m: false, l: true,  d: true,  ln: false, cal: 680, salt: 2.8 },

  // 🍲 汁物 (6品)
  { id: 14, cat: "汁物", name: "味噌汁(豆腐/わかめ)", m: true, l: true, d: true, ln: false, cal: 40, salt: 1.2 },
  { id: 15, cat: "汁物", name: "豚汁・けんちん汁",   m: false, l: true, d: true, ln: false, cal: 120, salt: 1.4 },
  { id: 16, cat: "汁物", name: "野菜コンソメスープ", m: true, l: true, d: true, ln: true,  cal: 40, salt: 1.0 },
  { id: 17, cat: "汁物", name: "中華・わかめスープ", m: false, l: true, d: true, ln: true,  cal: 35, salt: 1.1 },
  { id: 18, cat: "汁物", name: "ポタージュ濃縮汁",   m: true, l: true, d: false, ln: false, cal: 95, salt: 1.0 },
  { id: 56, cat: "汁物", name: "ミネストローネ",     m: true, l: true, d: true, ln: true,  cal: 70, salt: 1.1 },

  // 🥩 おかず (21品)
  { id: 19, cat: "おかず", name: "焼き魚・煮魚",       m: true,  l: true,  d: true, ln: false, cal: 160, salt: 1.1 },
  { id: 20, cat: "おかず", name: "刺身・生魚",         m: false, l: true,  d: true, ln: false, cal: 120, salt: 0.6 },
  { id: 21, cat: "おかず", name: "鶏唐揚げ・チキン",   m: false, l: true,  d: true, ln: true,  cal: 280, salt: 1.0 },
  { id: 22, cat: "おかず", name: "とんかつ・カツ類",   m: false, l: true,  d: true, ln: false, cal: 450, salt: 1.2 },
  { id: 23, cat: "おかず", name: "豚生姜焼き・野菜炒め", m: false, l: true, d: true, ln: false, cal: 260, salt: 1.2 },
  { id: 24, cat: "おかず", name: "ハンバーグ",         m: false, l: true,  d: true, ln: false, cal: 380, salt: 1.6 },
  { id: 25, cat: "おかず", name: "牛ステーキ",         m: false, l: true,  d: true, ln: false, cal: 360, salt: 1.0 },
  { id: 55, cat: "おかず", name: "牛焼肉・カルビ/ロース", m: false, l: true, d: true, ln: false, cal: 240, salt: 1.0 },
  { id: 26, cat: "おかず", name: "ホルモン焼き・レバー炒め", m: false, l: true, d: true, ln: false, cal: 250, salt: 1.2 },
  { id: 27, cat: "おかず", name: "目玉焼き・卵料理",   m: true,  l: true,  d: false, ln: false, cal: 95, salt: 0.3 },
  { id: 28, cat: "おかず", name: "納豆",               m: true,  l: true,  d: true, ln: false, cal: 90, salt: 0.6 },
  { id: 29, cat: "おかず", name: "豆腐・冷奴・厚揚げ", m: true,  l: true,  d: true, ln: true,  cal: 90, salt: 0.4 },
  { id: 30, cat: "おかず", name: "餃子・焼売",         m: false, l: true,  d: true, ln: true,  cal: 220, salt: 1.1 },
  { id: 32, cat: "おかず", name: "生野菜サラダ",       m: true,  l: true,  d: true, ln: false, cal: 35, salt: 0.4 },
  { id: 33, cat: "おかず", name: "温野菜・ブロッコリー", m: true, l: true,  d: true, ln: false, cal: 40, salt: 0.3 },
  { id: 34, cat: "おかず", name: "おひたし・和小鉢",   m: true,  l: true,  d: true, ln: false, cal: 30, salt: 0.5 },
  { id: 35, cat: "おかず", name: "きんぴら・ひじき煮", m: true,  l: true,  d: true, ln: false, cal: 65, salt: 0.6 },
  { id: 36, cat: "おかず", name: "ポテト・マカロニサラダ", m: false, l: true, d: true, ln: false, cal: 140, salt: 0.6 },
  { id: 37, cat: "おかず", name: "漬物・キムチ",       m: true,  l: true,  d: true, ln: true,  cal: 20, salt: 1.0 },
  { id: 38, cat: "おかず", name: "惣菜揚げ物(コロッケ等)", m: false, l: true, d: true, ln: false, cal: 200, salt: 0.8 },
  { id: 39, cat: "おかず", name: "その他・残り物惣菜", m: true,  l: true,  d: true, ln: true,  cal: 150, salt: 0.8 },

  // ☕ 飲料 (5品)
  { id: 40, cat: "飲料", name: "コーヒー",             m: true,  l: true,  d: true, ln: true,  cal: 5,  salt: 0.0 },
  { id: 41, cat: "飲料", name: "ノンアルソーダ",       m: true,  l: true,  d: true, ln: true,  cal: 15, salt: 0.0 },
  { id: 42, cat: "飲料", name: "ヤクルト",             m: true,  l: true,  d: false, ln: false, cal: 50, salt: 0.0 },
  { id: 43, cat: "飲料", name: "野菜ジュース",         m: true,  l: true,  d: true, ln: true,  cal: 70, salt: 0.1 },
  { id: 44, cat: "飲料", name: "オロナミンC",         m: true,  l: true,  d: false, ln: true,  cal: 79, salt: 0.0 },

  // 🍪 間食 (5品)
  { id: 45, cat: "間食", name: "チョコレート",         m: false, l: false, d: false, ln: false, cal: 140, salt: 0.0 },
  { id: 46, cat: "間食", name: "スナック菓子",         m: false, l: false, d: false, ln: false, cal: 165, salt: 0.4 },
  { id: 47, cat: "間食", name: "和菓子・せんべい",     m: false, l: false, d: false, ln: false, cal: 130, salt: 0.3 },
  { id: 51, cat: "間食", name: "ショートケーキ",       m: false, l: false, d: false, ln: false, cal: 340, salt: 0.2 },
  { id: 52, cat: "間食", name: "アイスクリーム",       m: false, l: false, d: false, ln: false, cal: 180, salt: 0.1 },

  // 🍜 夜食 (3品)
  { id: 48, cat: "夜食", name: "カップラーメン(麺)",   m: false, l: false, d: false, ln: true,  cal: 350, salt: 2.5 },
  { id: 49, cat: "夜食", name: "お茶漬け・雑炊",       m: false, l: false, d: false, ln: true,  cal: 180, salt: 1.2 },
  { id: 50, cat: "夜食", name: "深夜スナック・おつまみ", m: false, l: false, d: false, ln: true, cal: 160, salt: 0.6 }
];

const DEFAULT_MEDS = [
  { name: "降圧剤", m: true, l: false, d: false, n: false },
  { name: "脂質異常症薬", m: true, l: false, d: false, n: false },
  { name: "EPA・DHA (1000mg)", m: true, l: false, d: true, n: false },
  { name: "マルチビタミン (1日分)", m: true, l: false, d: false, n: false },
  { name: "胃薬・整腸剤", m: false, l: true, d: true, n: false }
];

const DEFAULT_PROFILE = {
  age: "50代",
  gender: "男性",
  height: 172,
  cares: ["高血圧", "脂質異常症"],
  milestones: [
    { date: "2025-06-30", targetWeight: 65.0, targetSteps: 8000 },
    { date: "", targetWeight: null, targetSteps: null },
    { date: "", targetWeight: null, targetSteps: null }
  ]
};

const PRAISE_MESSAGES = [
  { title: "記録完了！偉い！", msg: "タイムリーに入力した勇気が命を守る！" },
  { title: "ナイス習慣化！", msg: "日々の1分が未来の健康寿命を確実に伸ばします！" },
  { title: "完璧な自己管理！", msg: "忘れる前に入力完了。この積み重ねが最強の予防医学！" },
  { title: "さすがです！", msg: "その調子！ノイズに惑わされず淡々と進みましょう！" }
];

let currentSettings = {
  morning: { med: true, bp: true, weight: false },
  lunch:   { med: false, bp: false },
  dinner:  { med: true, bp: false },
  night:   { med: false, bp: true, weight: true },
  desktopNotification: false
};

let menuMaster = [];
let medMaster = [];
let userProfile = {};
let allRecords = {};
let activeDate = getTodayString();
let chartPeriod = '7d';
let weightChartInst = null;
let bpChartInst = null;
let stepsCalChartInst = null;
let notificationTimer = null;
let sentNotificationsToday = {};
let currentTipIndex = 0;
let toastTimeoutId = null;

let currentSelections = { morning: [], lunch: [], dinner: [], snack: [], latenight: [] };
let currentMeds = { morning: [], lunch: [], dinner: [], night: [] };

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getCurrentTimeString() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getAppVersion() {
  const badge = document.getElementById('appVersionBadge');
  return badge ? badge.textContent.trim() : 'v1.3.0';
}

function openDatePicker() {
  const inp = document.getElementById('selectedDateInput');
  if (!inp) return;
  try {
    if (inp.showPicker) inp.showPicker();
    else inp.focus();
  } catch (e) {
    inp.focus();
  }
}

function handleSelectChange(selectEl) {
  if (selectEl.value !== "") selectEl.classList.remove('unselected');
  else selectEl.classList.add('unselected');
}

function toggleFaq(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}

function handleStepsFocus(input) {
  input.value = input.value.replace(/,/g, '').trim();
}

function handleStepsBlur(input) {
  const raw = parseInt(input.value.replace(/,/g, '').trim(), 10);
  input.value = (!isNaN(raw) && raw > 0) ? raw.toLocaleString() : '';
  autoSaveField('night');
}

function isJapaneseHoliday(year, month, day) {
  const mmdd = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const fixedHolidays = ['01-01', '02-11', '02-23', '04-29', '05-03', '05-04', '05-05', '08-11', '11-03', '11-23'];
  if (fixedHolidays.includes(mmdd)) return true;
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay();
  const nthMonday = Math.floor((day - 1) / 7) + 1;
  if (dayOfWeek === 1) {
    if ((month === 1 && nthMonday === 2) || (month === 10 && nthMonday === 2)) return true;
    if ((month === 7 && nthMonday === 3) || (month === 9 && nthMonday === 3)) return true;
  }
  if (month === 3 && day === Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4))) return true;
  if (month === 9 && day === Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4))) return true;
  return false;
}

function updateDateBadge(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const day = dateObj.getDay();
  const daysArr = ['日', '月', '火', '水', '木', '金', '土'];
  const badge = document.getElementById('dateBadge');
  const holiday = isJapaneseHoliday(y, m, d);

  if (holiday) { badge.textContent = `祝(${daysArr[day]})`; badge.className = 'day-badge day-holiday'; }
  else if (day === 0) { badge.textContent = '日'; badge.className = 'day-badge day-sun'; }
  else if (day === 6) { badge.textContent = '土'; badge.className = 'day-badge day-sat'; }
  else { badge.textContent = `${daysArr[day]}`; badge.className = 'day-badge day-weekday'; }
}

function toggleSlotCard(slot) {
  const card = document.getElementById(`slot-${slot}`);
  const body = document.getElementById(`body-${slot}`);
  const icon = document.getElementById(`toggle-icon-${slot}`);
  if (!body) return;
  const isCollapsed = body.classList.toggle('collapsed');
  if (card) card.classList.toggle('collapsed', isCollapsed);
  if (icon) icon.textContent = isCollapsed ? '▼' : '▲';
}

function setSlotCardCollapsed(slot, collapsed) {
  const card = document.getElementById(`slot-${slot}`);
  const body = document.getElementById(`body-${slot}`);
  const icon = document.getElementById(`toggle-icon-${slot}`);
  if (!body) return;
  if (collapsed) {
    body.classList.add('collapsed');
    if (card) card.classList.add('collapsed');
    if (icon) icon.textContent = '▼';
  } else {
    body.classList.remove('collapsed');
    if (card) card.classList.remove('collapsed');
    if (icon) icon.textContent = '▲';
  }
}

function renderTodayHealthTip(dateStr) {
  if (!HEALTH_TIPS_LIBRARY || HEALTH_TIPS_LIBRARY.length === 0) return;
  
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const defaultIdx = Math.abs(hash) % HEALTH_TIPS_LIBRARY.length;
  currentTipIndex = defaultIdx;
  displayHealthTipByIndex(currentTipIndex);
}

function displayHealthTipByIndex(index) {
  const item = HEALTH_TIPS_LIBRARY[index];
  if (!item) return;

  const authEl = document.getElementById('todayTipAuthor');
  const bodyEl = document.getElementById('todayTipBody');
  const boxEl = document.getElementById('todayTipBox');

  if (authEl) {
    authEl.textContent = `${item.author}`;
    authEl.style.color = item.color;
  }
  if (bodyEl) {
    bodyEl.textContent = item.tip;
  }
  if (boxEl) {
    boxEl.style.borderLeftColor = item.color;
  }
}

function rotateTodayHealthTip() {
  currentTipIndex = (currentTipIndex + 1) % HEALTH_TIPS_LIBRARY.length;
  displayHealthTipByIndex(currentTipIndex);
}

function migratePastVersions() {
  if (!localStorage.getItem(MASTER_KEY_RECORDS)) {
    for (let v = 11; v >= 1; v--) {
      const past = localStorage.getItem(`health_kun_records_v${v}`);
      if (past) { localStorage.setItem(MASTER_KEY_RECORDS, past); break; }
    }
  }
  if (!localStorage.getItem(MASTER_KEY_SETTINGS)) {
    for (let v = 11; v >= 1; v--) {
      const past = localStorage.getItem(`health_kun_settings_v${v}`);
      if (past) { localStorage.setItem(MASTER_KEY_SETTINGS, past); break; }
    }
  }
  if (!localStorage.getItem(MASTER_KEY_MENUS)) {
    for (let v = 11; v >= 1; v--) {
      const past = localStorage.getItem(`health_kun_menus_v${v}`);
      if (past) { localStorage.setItem(MASTER_KEY_MENUS, past); break; }
    }
  }
  if (!localStorage.getItem(MASTER_KEY_MEDS)) {
    for (let v = 11; v >= 1; v--) {
      const past = localStorage.getItem(`health_kun_meds_v${v}`);
      if (past) { localStorage.setItem(MASTER_KEY_MEDS, past); break; }
    }
  }
  if (!localStorage.getItem(MASTER_KEY_PROFILE)) {
    for (let v = 11; v >= 1; v--) {
      const past = localStorage.getItem(`health_kun_profile_v${v}`);
      if (past) { localStorage.setItem(MASTER_KEY_PROFILE, past); break; }
    }
  }

  const rawM = localStorage.getItem(MASTER_KEY_MENUS);
  if (rawM) {
    try {
      let existing = JSON.parse(rawM);
      const cIdx = existing.findIndex(x => x.name.includes("カレー・ルー具材"));
      if (cIdx !== -1) {
        existing[cIdx].name = "カレーライス";
        existing[cIdx].cat = "主食";
        existing[cIdx].cal = 680;
        existing[cIdx].salt = 2.8;
      }
      const sIdx = existing.findIndex(x => x.name === "牛ステーキ・焼肉" || x.name === "牛ステーキ");
      if (sIdx !== -1) {
        existing[sIdx].name = "牛ステーキ";
        existing[sIdx].cal = 360;
        existing[sIdx].salt = 1.0;
      }
      if (!existing.some(x => x.name.includes("チャーハン"))) {
        existing.push({ id: 53, cat: "主食", name: "チャーハン・炒飯", m: false, l: true, d: true, ln: true, cal: 580, salt: 2.5 });
      }
      if (!existing.some(x => x.name.includes("牛焼肉"))) {
        existing.push({ id: 55, cat: "おかず", name: "牛焼肉・カルビ/ロース", m: false, l: true, d: true, ln: false, cal: 240, salt: 1.0 });
      }
      if (!existing.some(x => x.name.includes("ミネストローネ"))) {
        existing.push({ id: 56, cat: "汁物", name: "ミネストローネ", m: true, l: true, d: true, ln: true, cal: 70, salt: 1.1 });
      }

      const orderMap = {};
      DEFAULT_50_MENUS.forEach((item, idx) => { orderMap[item.name] = idx; });
      existing.sort((a, b) => {
        const orderA = orderMap[a.name] !== undefined ? orderMap[a.name] : 999;
        const orderB = orderMap[b.name] !== undefined ? orderMap[b.name] : 999;
        return orderA - orderB;
      });

      localStorage.setItem(MASTER_KEY_MENUS, JSON.stringify(existing));
    } catch (e) {}
  }
}

window.addEventListener('DOMContentLoaded', () => {
  migratePastVersions();
  loadSettings();
  loadProfile();
  loadMeds();
  loadMenus();
  loadRecords();

  document.getElementById('selectedDateInput').value = activeDate;
  updateDateBadge(activeDate);

  renderProfileUI();
  renderMedSettingsTable();
  renderMenuMasterTable();
  rebuildAllInputChips();
  applySettingsToUI();

  loadRecordIntoForm(activeDate);
  highlightCurrentTimeSlot();
  renderTodayHealthTip(activeDate);

  initCharts();
  refreshDashboard();

  initDesktopNotifications();
});

function initDesktopNotifications() {
  updateNotificationBadge();
  if (window.location.protocol !== 'file:') {
    if (notificationTimer) clearInterval(notificationTimer);
    notificationTimer = setInterval(checkAndTriggerSmartNotification, 60000);
  }
}

function updateNotificationBadge() {
  const badge = document.getElementById('notif_permission_badge');
  if (!badge) return;
  const isFile = window.location.protocol === 'file:';

  if (isFile) {
    badge.textContent = "画面内見守り稼働中";
    badge.className = "time-badge recorded";
  } else if (!("Notification" in window)) {
    badge.textContent = "画面内見守り稼働中";
    badge.className = "time-badge recorded";
  } else if (Notification.permission === "granted") {
    badge.textContent = "有効（許可済）";
    badge.className = "time-badge recorded";
  } else if (Notification.permission === "denied") {
    badge.textContent = "画面内見守り稼働中";
    badge.className = "time-badge recorded";
  } else {
    badge.textContent = "未許可";
    badge.className = "time-badge";
  }
}

function showSmartToast(title, body) {
  const container = document.getElementById('smartToastContainer');
  const titleEl = document.getElementById('toastTitle');
  const bodyEl = document.getElementById('toastBody');
  if (!container) return;

  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.innerHTML = body;

  container.classList.add('show');
  if (toastTimeoutId) clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    container.classList.remove('show');
  }, 6000);
}

function hideSmartToast() {
  const container = document.getElementById('smartToastContainer');
  if (container) container.classList.remove('show');
  if (toastTimeoutId) clearTimeout(toastTimeoutId);
}

// Android Chrome等のIllegal constructorエラーを完全回避するハイブリッド通知
function triggerSmartNotification(title, body) {
  let desktopSuccess = false;

  if (window.location.protocol !== 'file:' && ("Notification" in window) && Notification.permission === "granted") {
    try {
      const notif = new Notification(title, {
        body: body.replace(/<[^>]+>/g, ''),
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🩺</text></svg>"
      });
      notif.onclick = function() { window.focus(); this.close(); };
      desktopSuccess = true;
    } catch (e) {
      desktopSuccess = false;
    }
  }

  showSmartToast(title, body);
}

function enableDesktopNotification() {
  if (window.location.protocol === 'file:') {
    showSmartToast("🩺 Dr.ケン (スマート見守り)", "ローカル環境で画面内トースト見守りが100%稼働しています！安心してご利用ください。");
    return;
  }
  if (!("Notification" in window)) {
    showSmartToast("🩺 Dr.ケン (スマート見守り)", "画面内スマートトースト通知が有効です。スマホでも快適に見守りメッセージをお届けします！");
    return;
  }
  Notification.requestPermission().then(permission => {
    updateNotificationBadge();
    if (permission === "granted") {
      currentSettings.desktopNotification = true;
      saveSettings();
      testDesktopNotification();
    } else {
      showSmartToast("🩺 Dr.ケン (スマート見守り)", "画面内スマート見守りバナーが有効化されました。作業中も安心してお使いいただけます！");
    }
  });
}

function testDesktopNotification() {
  triggerSmartNotification(
    "🩺 Dr.ケン (スマート見守り自己診断)",
    "【診断成功◎】デスクワークお疲れ様です！椅子では骨盤を立てて坐骨で座り、深呼吸を2回しましょう。"
  );
}

function checkAndTriggerSmartNotification() {
  const now = new Date();
  const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const today = getTodayString();
  if (!sentNotificationsToday[today]) sentNotificationsToday[today] = {};

  const schedules = [
    { time: "07:30", key: "m_remind", title: "🌅 朝の健康チェック (Dr.ケン)", body: "おはようございます！起床時の睡眠時間・血圧をサッと記録して今日も良い一日を！" },
    { time: "10:30", key: "water_am", title: "🪑 午前の一服＆坐骨リセット (Dr.ケン)", body: "コップ1杯の水分補給（0.25L）をどうぞ！丸めたタオルを腰に挟み、骨盤を垂直に立て直しましょう。" },
    { time: "12:30", key: "l_remind", title: "☀️ 昼食の記録 (アヤ)", body: "お昼時ですね！麺類のつゆ残し減塩やソイラテの活用、意識してみてくださいね◎" },
    { time: "15:30", key: "water_pm", title: "💆‍♂️ 肩こり＆目のリフレッシュ (Dr.ケン)", body: "午後の疲労ピークです！首の後ろのくぼみ（天柱）を5秒押し上げ、肩をストンと落として目を休めましょう。" },
    { time: "19:30", key: "d_remind", title: "🌙 夕食とお酒のチェック (Dr.ケン)", body: "夕食はお済みですか？今夜は休肝日にできると血管と肝臓の修復が進みますよ。" },
    { time: "20:30", key: "face_care", title: "✨ 1分表情筋リリース (アヤ)", body: "お風呂や食後のひと息に『舌回しアイロン』＆『眉間つまみ』！一日の表情のコリを解毒しましょう。" },
    { time: "22:30", key: "n_remind", title: "🛌 就寝前の締めくくり (アヤ)", body: "今日も一日お疲れ様でした！就寝前記録を完了したら、スマホを置いて目を休めましょう。" }
  ];

  schedules.forEach(sc => {
    if (hm === sc.time && !sentNotificationsToday[today][sc.key]) {
      triggerSmartNotification(sc.title, sc.body);
      sentNotificationsToday[today][sc.key] = true;
    }
  });
}

function getActiveMilestoneGoal() {
  const list = userProfile.milestones || [];
  const todayStr = getTodayString();
  const valid = list.filter(m => m.date && m.targetWeight && m.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date));
  if (valid.length > 0) return valid[0];
  if (list[0] && list[0].targetWeight) return list[0];
  return { targetWeight: 65.0, targetSteps: 8000, date: "2025-06-30" };
}

function loadProfile() {
  const raw = localStorage.getItem(MASTER_KEY_PROFILE);
  if (raw) {
    try {
      userProfile = JSON.parse(raw);
      if (!userProfile.milestones) {
        userProfile.milestones = [
          { date: userProfile.targetDate || "2025-06-30", targetWeight: userProfile.targetWeight || 65.0, targetSteps: userProfile.targetSteps || 8000 },
          { date: "", targetWeight: null, targetSteps: null },
          { date: "", targetWeight: null, targetSteps: null }
        ];
      }
    } catch (e) {
      userProfile = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    }
  } else {
    userProfile = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  }
}

function saveProfileSettings() {
  userProfile.age = document.getElementById('prof_age').value;
  userProfile.gender = document.getElementById('prof_gender').value;
  userProfile.height = parseFloat(document.getElementById('prof_height').value) || 172;

  userProfile.milestones = [
    {
      date: document.getElementById('prof_targetDate_1').value || "2025-06-30",
      targetWeight: parseFloat(document.getElementById('prof_targetWeight_1').value) || 65.0,
      targetSteps: parseInt(document.getElementById('prof_targetSteps_1').value, 10) || 8000
    },
    {
      date: document.getElementById('prof_targetDate_2').value || "",
      targetWeight: parseFloat(document.getElementById('prof_targetWeight_2').value) || null,
      targetSteps: parseInt(document.getElementById('prof_targetSteps_2').value, 10) || null
    },
    {
      date: document.getElementById('prof_targetDate_3').value || "",
      targetWeight: parseFloat(document.getElementById('prof_targetWeight_3').value) || null,
      targetSteps: parseInt(document.getElementById('prof_targetSteps_3').value, 10) || null
    }
  ];

  const cares = [];
  document.querySelectorAll('#prof_care_chips .chip-btn.selected-item').forEach(b => {
    cares.push(b.getAttribute('data-val'));
  });
  userProfile.cares = cares;

  localStorage.setItem(MASTER_KEY_PROFILE, JSON.stringify(userProfile));
  updateLiveSummary();
  refreshDashboard();
}

function renderProfileUI() {
  document.getElementById('prof_age').value = userProfile.age || "50代";
  document.getElementById('prof_gender').value = userProfile.gender || "男性";
  document.getElementById('prof_height').value = userProfile.height || 172;

  const ms = userProfile.milestones || [];
  const m1 = ms[0] || {};
  document.getElementById('prof_targetDate_1').value = m1.date || "2025-06-30";
  document.getElementById('prof_targetWeight_1').value = m1.targetWeight || 65.0;
  document.getElementById('prof_targetSteps_1').value = m1.targetSteps || 8000;

  const m2 = ms[1] || {};
  document.getElementById('prof_targetDate_2').value = m2.date || "";
  document.getElementById('prof_targetWeight_2').value = m2.targetWeight || "";
  document.getElementById('prof_targetSteps_2').value = m2.targetSteps || "";

  const m3 = ms[2] || {};
  document.getElementById('prof_targetDate_3').value = m3.date || "";
  document.getElementById('prof_targetWeight_3').value = m3.targetWeight || "";
  document.getElementById('prof_targetSteps_3').value = m3.targetSteps || "";

  const chips = document.querySelectorAll('#prof_care_chips .chip-btn');
  chips.forEach(c => {
    const val = c.getAttribute('data-val');
    const isSel = (userProfile.cares || []).includes(val);
    c.classList.toggle('selected-item', isSel);
    c.textContent = (isSel ? '☑ ' : '□ ') + c.textContent.replace(/^[☑□]\s*/, '');
  });
}

function toggleProfileCare(el) {
  const isSel = el.classList.toggle('selected-item');
  el.textContent = (isSel ? '☑ ' : '□ ') + el.textContent.replace(/^[☑□]\s*/, '');
  saveProfileSettings();
}

function loadMeds() {
  const raw = localStorage.getItem(MASTER_KEY_MEDS);
  medMaster = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_MEDS));
}

function saveMedSettings() {
  const rows = document.querySelectorAll('#medMasterTableBody tr');
  const newList = [];
  rows.forEach(tr => {
    const name = tr.querySelector('.in-med-name').value.trim();
    if (name) {
      newList.push({
        name: name,
        m: tr.querySelector('.in-med-m').checked,
        l: tr.querySelector('.in-med-l').checked,
        d: tr.querySelector('.in-med-d').checked,
        n: tr.querySelector('.in-med-n').checked
      });
    }
  });
  medMaster = newList;
  localStorage.setItem(MASTER_KEY_MEDS, JSON.stringify(medMaster));
  rebuildMedChipsUI();
  updateLiveSummary();
  alert("お薬・サプリ設定を保存しました！");
}

function renderMedSettingsTable() {
  const tbody = document.getElementById('medMasterTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  medMaster.forEach(med => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="table-input in-med-name" value="${escapeHtml(med.name)}"></td>
      <td class="center"><input type="checkbox" class="in-med-m" ${med.m ? 'checked' : ''}></td>
      <td class="center"><input type="checkbox" class="in-med-l" ${med.l ? 'checked' : ''}></td>
      <td class="center"><input type="checkbox" class="in-med-d" ${med.d ? 'checked' : ''}></td>
      <td class="center"><input type="checkbox" class="in-med-n" ${med.n ? 'checked' : ''}></td>
      <td class="center"><button style="background:transparent; border:none; color:var(--accent-rose); cursor:pointer; font-size:0.9rem;" onclick="this.closest('tr').remove()">✕</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function addMedItemRow() {
  const tbody = document.getElementById('medMasterTableBody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="table-input in-med-name" placeholder="例: 降圧剤 (朝1錠)"></td>
    <td class="center"><input type="checkbox" class="in-med-m" checked></td>
    <td class="center"><input type="checkbox" class="in-med-l"></td>
    <td class="center"><input type="checkbox" class="in-med-d"></td>
    <td class="center"><input type="checkbox" class="in-med-n"></td>
    <td class="center"><button style="background:transparent; border:none; color:var(--accent-rose); cursor:pointer; font-size:0.9rem;" onclick="this.closest('tr').remove()">✕</button></td>
  `;
  tbody.appendChild(tr);
}

function rebuildMedChipsUI() {
  ['morning', 'lunch', 'dinner', 'night'].forEach(slot => {
    const prefix = slot === 'morning' ? 'm' : (slot === 'lunch' ? 'l' : (slot === 'dinner' ? 'd' : 'n'));
    const wrap = document.getElementById(`${prefix}_medChipsWrap`);
    if (!wrap) return;
    wrap.innerHTML = '';

    const slotMeds = medMaster.filter(med => {
      if (slot === 'morning') return med.m;
      if (slot === 'lunch') return med.l;
      if (slot === 'dinner') return med.d;
      if (slot === 'night') return med.n;
      return false;
    });

    if (slotMeds.length === 0) {
      wrap.innerHTML = '<span style="font-size:0.7rem; color:var(--text-muted);">設定されたお薬・サプリはありません</span>';
      return;
    }

    slotMeds.forEach(med => {
      const chip = document.createElement('div');
      const isChk = (currentMeds[slot] || []).includes(med.name);
      chip.className = `med-chip ${isChk ? 'checked' : ''}`;
      chip.textContent = med.name;
      chip.onclick = () => {
        chip.classList.toggle('checked');
        if (chip.classList.contains('checked')) {
          if (!currentMeds[slot].includes(med.name)) currentMeds[slot].push(med.name);
        } else {
          currentMeds[slot] = currentMeds[slot].filter(x => x !== med.name);
        }
        autoSaveField(slot);
      };
      wrap.appendChild(chip);
    });
  });
}

function checkAllMed(slot) {
  const slotMeds = medMaster.filter(med => {
    if (slot === 'morning') return med.m;
    if (slot === 'lunch') return med.l;
    if (slot === 'dinner') return med.d;
    if (slot === 'night') return med.n;
    return false;
  }).map(med => med.name);

  currentMeds[slot] = JSON.parse(JSON.stringify(slotMeds));
  rebuildMedChipsUI();
  autoSaveField(slot);
}

function loadMenus() {
  const rawM = localStorage.getItem(MASTER_KEY_MENUS);
  menuMaster = rawM ? JSON.parse(rawM) : JSON.parse(JSON.stringify(DEFAULT_50_MENUS));
}

function saveMenuMasterChanges() {
  const rows = document.querySelectorAll('#menuMasterTableBody tr');
  const warnings = [];

  rows.forEach((tr, idx) => {
    if (menuMaster[idx]) {
      const name = tr.querySelector('.in-name').value.trim() || menuMaster[idx].name;
      const cal = parseFloat(tr.querySelector('.in-cal').value) || 0;
      const salt = parseFloat(tr.querySelector('.in-salt').value) || 0;

      if (cal >= 1500) warnings.push(`・「${name}」のカロリーが ${cal} kcal（高値警戒）`);
      if (salt >= 7.0) warnings.push(`・「${name}」の塩分が ${salt} g（1日の目標6g超過）`);
      if (cal < 0 || salt < 0) warnings.push(`・「${name}」にマイナス値が入力されています`);

      menuMaster[idx].name = name;
      menuMaster[idx].m = tr.querySelector('.in-m').checked;
      menuMaster[idx].l = tr.querySelector('.in-l').checked;
      menuMaster[idx].d = tr.querySelector('.in-d').checked;
      menuMaster[idx].ln = tr.querySelector('.in-ln').checked;
      menuMaster[idx].cal = Math.max(0, cal);
      menuMaster[idx].salt = Math.max(0, salt);
    }
  });

  if (warnings.length > 0) {
    if (!confirm("⚠️【数値確認】以下の設定値を確認してください：\n\n" + warnings.join("\n") + "\n\nこのまま保存してよろしいですか？")) return;
  }

  localStorage.setItem(MASTER_KEY_MENUS, JSON.stringify(menuMaster));
  rebuildAllInputChips();
  updateLiveSummary();
  alert("全メニュー設定を保存しました！");
}

function resetMenusToDefault() {
  if (!confirm("メニュー・お薬を初期値に戻しますか？")) return;
  menuMaster = JSON.parse(JSON.stringify(DEFAULT_50_MENUS));
  medMaster = JSON.parse(JSON.stringify(DEFAULT_MEDS));
  localStorage.setItem(MASTER_KEY_MENUS, JSON.stringify(menuMaster));
  localStorage.setItem(MASTER_KEY_MEDS, JSON.stringify(medMaster));
  renderMenuMasterTable();
  renderMedSettingsTable();
  rebuildAllInputChips();
  rebuildMedChipsUI();
  updateLiveSummary();
  alert("初期設定にリセットしました。");
}

function renderMenuMasterTable() {
  const tbody = document.getElementById('menuMasterTableBody');
  tbody.innerHTML = '';
  menuMaster.forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="center"><span class="cat-badge cat-badge-${item.cat}">${item.cat}</span></td>
      <td><input type="text" class="table-input in-name" value="${escapeHtml(item.name)}"></td>
      <td class="center"><input type="checkbox" class="in-m" ${item.m ? 'checked' : ''}></td>
      <td class="center"><input type="checkbox" class="in-l" ${item.l ? 'checked' : ''}></td>
      <td class="center"><input type="checkbox" class="in-d" ${item.d ? 'checked' : ''}></td>
      <td class="center"><input type="checkbox" class="in-ln" ${item.ln ? 'checked' : ''}></td>
      <td><input type="number" class="table-input table-input-compact in-cal" value="${item.cal ?? 0}"></td>
      <td><input type="number" step="0.1" class="table-input table-input-compact in-salt" value="${item.salt ?? 0}"></td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

// ボタンチップ用の直感短縮表示関数（スマホでの行数爆発・スクロール防止）
function getShortChipLabel(item) {
  const n = item.name;
  if (n === "豚生姜焼き・野菜炒め") return "🐷 豚生姜焼/炒め";
  if (n === "温野菜・ブロッコリー") return "🥦 温野菜";
  if (n === "おひたし・和小鉢") return "🥬 おひたし小鉢";
  if (n === "きんぴら・ひじき煮") return "🥢 きんぴら/ひじき";
  if (n === "ポテト・マカロニサラダ") return "🥔 ポテトサラダ";
  if (n === "惣菜揚げ物(コロッケ等)") return "コロッケ・揚物";
  if (n === "ホルモン焼き・レバー炒め") return "ホルモン/レバー";
  if (n === "豆腐・冷奴・厚揚げ") return "冷奴・豆腐";
  if (n === "牛焼肉・カルビ/ロース") return "🥩 牛焼肉";
  if (n === "牛ステーキ") return "🥩 ステーキ";
  if (n === "チャーハン・炒飯") return "チャーハン";
  if (n === "目玉焼き・卵料理") return "🍳 卵料理";
  if (n === "ロール・惣菜パン") return "惣菜パン";
  if (n === "餅・シリアル類") return "餅・シリアル";
  if (n === "深夜スナック・おつまみ") return "おつまみ菓子";
  if (n === "その他・残り物惣菜") return "残り物惣菜";
  if (n === "味噌汁(豆腐/わかめ)") return "味噌汁";
  if (n === "野菜コンソメスープ") return "コンソメスープ";
  if (n === "中華・わかめスープ") return "中華スープ";
  if (n === "ミネストローネ") return "🍅 ミネストローネ";
  if (n === "カップラーメン(麺)") return "カップ麺";
  return n;
}

function rebuildAllInputChips() {
  buildCategoryChips('m_chips_main', 'morning', menuMaster.filter(x => x.m && x.cat === "主食"));
  buildCategoryChips('m_chips_soup', 'morning', menuMaster.filter(x => x.m && x.cat === "汁物"));
  buildCategoryChips('m_chips_side', 'morning', menuMaster.filter(x => x.m && x.cat === "おかず"));
  buildCategoryChips('m_chips_drink', 'morning', menuMaster.filter(x => x.m && x.cat === "飲料"));

  buildCategoryChips('l_chips_main', 'lunch', menuMaster.filter(x => x.l && x.cat === "主食"));
  buildCategoryChips('l_chips_soup', 'lunch', menuMaster.filter(x => x.l && x.cat === "汁物"));
  buildCategoryChips('l_chips_side', 'lunch', menuMaster.filter(x => x.l && x.cat === "おかず"));
  buildCategoryChips('l_chips_drink', 'lunch', menuMaster.filter(x => x.l && x.cat === "飲料"));

  buildCategoryChips('d_chips_main', 'dinner', menuMaster.filter(x => x.d && x.cat === "主食"));
  buildCategoryChips('d_chips_soup', 'dinner', menuMaster.filter(x => x.d && x.cat === "汁物"));
  buildCategoryChips('d_chips_side', 'dinner', menuMaster.filter(x => x.d && x.cat === "おかず"));
  buildCategoryChips('d_chips_drink', 'dinner', menuMaster.filter(x => x.d && x.cat === "飲料"));

  buildCategoryChips('snack_chips', 'snack', menuMaster.filter(x => x.cat === "飲料" || x.cat === "間食" || x.name.includes('おにぎり') || x.name.includes('パン') || x.name.includes('チョコ') || x.name.includes('スナック') || x.name.includes('和菓子') || x.name.includes('ケーキ') || x.name.includes('アイス')));
  buildCategoryChips('latenight_chips', 'latenight', menuMaster.filter(x => x.ln));

  rebuildMedChipsUI();

  ['morning', 'lunch', 'dinner', 'snack', 'latenight'].forEach(slot => renderTray(slot));
  updateLiveSummary();
}

function buildCategoryChips(containerId, slot, list) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = '';
  list.forEach(item => {
    const chip = document.createElement('div');
    chip.className = 'chip-btn';
    chip.textContent = `+ ${getShortChipLabel(item)}`;
    chip.title = item.name;
    chip.onclick = () => addComponentToTray(slot, item);
    c.appendChild(chip);
  });
}

function copyPreviousMeal(slot) {
  const sortedDates = Object.keys(allRecords).sort().reverse();
  let foundItems = null;

  for (const d of sortedDates) {
    if (d === activeDate) continue;
    const r = allRecords[d];
    if (r && r[slot] && r[slot].items && r[slot].items.length > 0) {
      foundItems = r[slot].items;
      break;
    }
  }

  if (!foundItems || foundItems.length === 0) {
    alert("過去の記録に同時間帯の食事パーツが見つかりませんでした。");
    return;
  }

  currentSelections[slot] = JSON.parse(JSON.stringify(foundItems));
  renderTray(slot);
  flashTrayHighlight(slot);
  autoSaveField(slot);
}

function flashTrayHighlight(slot) {
  const prefix = slot === 'morning' ? 'm' : (slot === 'lunch' ? 'l' : (slot === 'dinner' ? 'd' : (slot === 'latenight' ? 'ln' : slot)));
  const trayWrap = document.getElementById(`${prefix}_tray_wrap`);
  if (!trayWrap) return;
  trayWrap.classList.remove('tray-highlight-flash');
  void trayWrap.offsetWidth;
  trayWrap.classList.add('tray-highlight-flash');
  setTimeout(() => { trayWrap.classList.remove('tray-highlight-flash'); }, 600);
}

function addComponentToTray(slot, item) {
  const subOpts = SUBTYPES_DEF[item.name] || null;
  let initSub = null;
  let cal = item.cal || 0;
  let salt = item.salt || 0;

  if (subOpts && subOpts.length > 0) {
    initSub = subOpts[0].name;
    cal = subOpts[0].cal;
    salt = subOpts[0].salt;
  }

  currentSelections[slot].push({
    id: item.id,
    cat: item.cat,
    name: item.name,
    subtype: initSub,
    amount: "普通",
    cal: cal,
    salt: salt
  });
  renderTray(slot);
  flashTrayHighlight(slot);
  autoSaveField(slot);
}

function removeTrayItem(slot, index) {
  currentSelections[slot].splice(index, 1);
  renderTray(slot);
  autoSaveField(slot);
}

function setTrayItemAmount(slot, index, amount) {
  const target = currentSelections[slot][index];
  if (!target) return;
  target.amount = amount;
  renderTray(slot);
  autoSaveField(slot);
}

function changeTrayItemSubtype(slot, index, subName) {
  const target = currentSelections[slot][index];
  if (!target) return;
  const subOpts = SUBTYPES_DEF[target.name];
  if (subOpts) {
    const found = subOpts.find(x => x.name === subName);
    if (found) {
      target.subtype = found.name;
      target.cal = found.cal;
      target.salt = found.salt;
    }
  }
  renderTray(slot);
  autoSaveField(slot);
}

function getSaltBadgeHTML(item) {
  let badges = '';
  if (item.name.includes('味噌汁')) {
    badges += `<span class="salt-badge salt-badge-miso-half">味噌：半分(減塩)</span>`;
  }
  if (item.name.includes('納豆')) {
    badges += `<span class="salt-badge salt-badge-natto-half">タレ半分</span>`;
  }
  if (item.name.includes('うどん') || item.name.includes('蕎麦') || item.name.includes('ラーメン')) {
    badges += `<span class="salt-badge salt-badge-noodle-soup">つゆ飲まない</span>`;
  }
  return badges;
}

function calcEffectiveItemStats(item) {
  const isSnack = item.cat === '間食' || item.name.includes('チョコ') || item.name.includes('スナック') || item.name.includes('和菓子') || item.name.includes('ケーキ') || item.name.includes('アイス');
  const isSteak = item.name.includes('牛ステーキ');
  const isHamburg = item.name.includes('ハンバーグ');
  const isTonkatsu = item.name.includes('とんかつ');

  let mult = 1.0;
  if (isSnack) {
    mult = item.amount === '少ない' ? 0.35 : (item.amount === '多い' ? 2.0 : 1.0);
  } else if (isSteak) {
    mult = item.amount === '少ない' ? 0.6 : (item.amount === '多い' ? 1.75 : 1.0);
  } else if (isHamburg) {
    mult = item.amount === '少ない' ? 0.6 : (item.amount === '多い' ? 1.5 : 1.0);
  } else if (isTonkatsu) {
    mult = item.amount === '少ない' ? 0.5 : (item.amount === '多い' ? 1.5 : 1.0);
  } else {
    mult = item.amount === '少ない' ? 0.6 : (item.amount === '多い' ? 1.6 : 1.0);
  }

  const cal = Math.round((item.cal || 0) * mult);
  let salt = (item.salt || 0) * mult;

  // 味噌汁と納豆（タレ半分）のみ半減適用
  if (item.name.includes('味噌汁')) {
    salt *= 0.5;
  } else if (item.name.includes('納豆')) {
    salt *= 0.5;
  }

  return { cal, salt };
}

function calculateDayNutrients() {
  let inCal = 0;
  let saltTotal = 0;

  ['morning', 'lunch', 'dinner', 'snack', 'latenight'].forEach(sKey => {
    if (['morning', 'lunch', 'dinner'].includes(sKey)) {
      const prefix = sKey === 'morning' ? 'm' : (sKey === 'lunch' ? 'l' : 'd');
      if (getSelectedMealType(`${prefix}_mealTypeChips`) === '抜き') return;
    }
    currentSelections[sKey].forEach(item => {
      const eff = calcEffectiveItemStats(item);
      inCal += eff.cal;
      saltTotal += eff.salt;
    });
  });

  const dAlc = document.getElementById('d_alcAmount')?.value || '';
  let dAlcCal = 0;
  let dBottles = 0;
  if (dAlc === '1本(350ml)') { dAlcCal = 140; dBottles = 1; }
  else if (dAlc === '2本(700ml)') { dAlcCal = 280; dBottles = 2; }
  else if (dAlc === '3杯以上') { dAlcCal = 420; dBottles = 3; }

  const lnAlc = document.getElementById('ln_alcAmount')?.value || '';
  let lnAlcCal = 0;
  let lnBottles = 0;
  if (lnAlc === '1本(350ml)') { lnAlcCal = 140; lnBottles = 1; }
  else if (lnAlc === '2本(700ml)') { lnAlcCal = 280; lnBottles = 2; }
  else if (lnAlc === '3杯以上') { lnAlcCal = 420; lnBottles = 3; }

  inCal += (dAlcCal + lnAlcCal);

  return {
    inCal: Math.round(inCal),
    saltTotal: Number(saltTotal.toFixed(1)),
    dAlcCal,
    lnAlcCal,
    totalBottles: dBottles + lnBottles,
    dAlc
  };
}

function renderTray(slot) {
  const prefix = slot === 'morning' ? 'm' : (slot === 'lunch' ? 'l' : (slot === 'dinner' ? 'd' : (slot === 'latenight' ? 'ln' : slot)));
  const trayEl = document.getElementById(slot === 'latenight' ? 'latenight_selectedTray' : (slot === 'snack' ? 'snack_selectedTray' : `${prefix}_selectedTray`));
  if (!trayEl) return;
  trayEl.innerHTML = '';
  const list = currentSelections[slot];

  const soupBadge = document.getElementById(`${prefix}_soup_status_badge`);
  if (soupBadge) {
    const hasMiso = list.some(x => x.name.includes('味噌汁'));
    if (hasMiso) {
      soupBadge.className = 'salt-badge salt-badge-miso-half';
      soupBadge.textContent = '味噌：半分 (約0.6g)';
    } else {
      soupBadge.className = 'salt-badge salt-badge-miso-none';
      soupBadge.textContent = '味噌汁：なし (0g)';
    }
  }

  let quickCal = 0;
  list.forEach(x => {
    const eff = calcEffectiveItemStats(x);
    quickCal += eff.cal;
  });
  const qTotalEl = document.getElementById(slot === 'latenight' ? 'ln_tray_quick_total' : `${prefix}_tray_quick_total`);
  if (qTotalEl) qTotalEl.textContent = `${quickCal.toLocaleString()} kcal`;

  if (!list || list.length === 0) {
    trayEl.innerHTML = '<div class="tray-empty" style="grid-column: 1/-1;">まだパーツが選ばれていません。<br>上のボタンから追加してください。</div>';
    return;
  }

  list.forEach((item, index) => {
    const eff = calcEffectiveItemStats(item);
    const estCal = eff.cal;
    const estSalt = eff.salt.toFixed(1);

    const hasSub = !!SUBTYPES_DEF[item.name];

    let subSelectHTML = '';
    if (hasSub) {
      const opts = SUBTYPES_DEF[item.name].map(o => 
        `<option value="${o.name}" ${item.subtype === o.name ? 'selected' : ''}>${o.name}</option>`
      ).join('');
      subSelectHTML = `<select class="subtype-select-box" onchange="changeTrayItemSubtype('${slot}', ${index}, this.value)">${opts}</select>`;
    }

    let btnLabelLess = "少";
    let btnLabelNorm = "普";
    let btnLabelMore = "多";
    let btnTitleLess = "少なめ";
    let btnTitleNorm = "普通";
    let btnTitleMore = "大盛り";

    if (item.name.includes("牛ステーキ")) {
      btnLabelLess = "120g"; btnLabelNorm = "200g"; btnLabelMore = "350g";
      btnTitleLess = "少なめ(120g)"; btnTitleNorm = "標準(200g・1枚)"; btnTitleMore = "大盛(350g)";
    } else if (item.name.includes("ハンバーグ")) {
      btnLabelLess = "120g"; btnLabelNorm = "200g"; btnLabelMore = "300g";
      btnTitleLess = "小(120g)"; btnTitleNorm = "並(200g)"; btnTitleMore = "大(300g)";
    } else if (item.name.includes("とんかつ")) {
      btnLabelLess = "半枚"; btnLabelNorm = "1枚"; btnLabelMore = "大判";
      btnTitleLess = "ハーフ"; btnTitleNorm = "標準1枚"; btnTitleMore = "大判1枚(大盛)";
    } else if (item.name.includes("チャーハン")) {
      btnLabelLess = "半炒飯"; btnLabelNorm = "並盛"; btnLabelMore = "大盛";
      btnTitleLess = "半チャーハン"; btnTitleNorm = "普通(1人前)"; btnTitleMore = "大盛り";
    }

    const div = document.createElement('div');
    div.className = 'tray-item';

    div.innerHTML = `
      <div class="tray-item-top">
        <div class="tray-item-title">
          <span class="cat-badge cat-badge-${item.cat}">[${item.cat}]</span>
          <span>${escapeHtml(item.name)}</span>
          ${getSaltBadgeHTML(item)}
        </div>
        <div style="display:flex; align-items:center; gap:2px;">
          <button class="amt-btn ${item.amount === '少ない' ? 'active' : ''}" data-amt="少ない" title="${btnTitleLess}" onclick="setTrayItemAmount('${slot}', ${index}, '少ない')">${btnLabelLess}</button>
          <button class="amt-btn ${item.amount === '普通' ? 'active' : ''}" data-amt="普通" title="${btnTitleNorm}" onclick="setTrayItemAmount('${slot}', ${index}, '普通')">${btnLabelNorm}</button>
          <button class="amt-btn ${item.amount === '多い' ? 'active' : ''}" data-amt="多い" title="${btnTitleMore}" onclick="setTrayItemAmount('${slot}', ${index}, '多い')">${btnLabelMore}</button>
          <button style="background:transparent; border:none; color:var(--accent-rose); font-size:0.85rem; cursor:pointer; padding:0 3px;" onclick="removeTrayItem('${slot}', ${index})">✕</button>
        </div>
      </div>
      ${hasSub ? `
      <div class="tray-item-sub-row">
        <div style="display:flex; align-items:center; gap:4px;">
          <span style="font-size:0.68rem; color:var(--accent-blue); font-weight:bold;">↳</span>
          ${subSelectHTML}
        </div>
        <div class="tray-item-calsalt">約 ${estCal}kcal / ${estSalt}g</div>
      </div>` : `
      <div class="tray-item-single-row">
        <div class="tray-item-calsalt">約 ${estCal}kcal / ${estSalt}g</div>
      </div>`}
    `;
    trayEl.appendChild(div);
  });
}

function selectMealType(slot, el) {
  const prefix = slot === 'morning' ? 'm' : (slot === 'lunch' ? 'l' : 'd');
  const parent = document.getElementById(`${prefix}_mealTypeChips`);
  parent.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('selected-item'));
  el.classList.add('selected-item');
  const isSkip = el.getAttribute('data-val') === '抜き';
  document.getElementById(`${prefix}_mealComponentArea`).style.display = isSkip ? 'none' : 'grid';
  autoSaveField(slot);
}

function toggleSection(secId) {
  document.getElementById(`${secId}-content`).classList.toggle('open');
}

function highlightCurrentTimeSlot() {
  const h = new Date().getHours();
  document.querySelectorAll('.card').forEach(c => c.classList.remove('highlight'));
  if (h >= 5 && h < 11) document.getElementById('slot-morning')?.classList.add('highlight');
  else if (h >= 11 && h < 15) document.getElementById('slot-lunch')?.classList.add('highlight');
  else if (h >= 17 && h < 21) document.getElementById('slot-dinner')?.classList.add('highlight');
  else if (h >= 21 || h < 5) document.getElementById('slot-night')?.classList.add('highlight');
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  event.currentTarget.classList.add('active');
  document.getElementById(tabId).classList.add('active');
  if (tabId === 'chartTab') refreshDashboard();
}

function adjustWater(diff) {
  if (!allRecords[activeDate]) allRecords[activeDate] = {};
  let cur = allRecords[activeDate].waterGlasses || 0;
  cur = Math.max(0, cur + diff);
  allRecords[activeDate].waterGlasses = cur;
  saveAllRecords();
  updateWaterDisplay(cur);
  updateLiveSummary();
}

function updateWaterDisplay(glasses) {
  const L = (glasses * 0.25).toFixed(1);
  document.getElementById('topWaterText').textContent = `${glasses}杯 (${L}L)`;
}

function loadSettings() {
  const raw = localStorage.getItem(MASTER_KEY_SETTINGS);
  if (raw) {
    try { currentSettings = Object.assign(currentSettings, JSON.parse(raw)); } catch (e) {}
  }
}

function saveSettings() {
  localStorage.setItem(MASTER_KEY_SETTINGS, JSON.stringify(currentSettings));
  applySettingsToUI();
}

function applySettingsToUI() {
  document.getElementById('set_m_med').checked = currentSettings.morning.med;
  document.getElementById('set_m_bp').checked = currentSettings.morning.bp;
  document.getElementById('set_m_weight').checked = !!currentSettings.morning.weight;
  document.getElementById('set_l_med').checked = currentSettings.lunch.med;
  document.getElementById('set_l_bp').checked = currentSettings.lunch.bp;
  document.getElementById('set_d_med').checked = currentSettings.dinner.med;
  document.getElementById('set_d_bp').checked = currentSettings.dinner.bp;
  document.getElementById('set_n_med').checked = currentSettings.night.med;
  document.getElementById('set_n_bp').checked = currentSettings.night.bp;
  document.getElementById('set_n_weight').checked = !!currentSettings.night.weight;

  document.querySelectorAll('.setting-cond-morning-bp').forEach(el => el.style.display = currentSettings.morning.bp ? 'grid' : 'none');
  document.querySelectorAll('.setting-cond-morning-med').forEach(el => el.style.display = currentSettings.morning.med ? 'block' : 'none');
  document.querySelectorAll('.setting-cond-morning-weight').forEach(el => el.style.display = currentSettings.morning.weight ? 'block' : 'none');

  document.querySelectorAll('.setting-cond-lunch-bp').forEach(el => el.style.display = currentSettings.lunch.bp ? 'grid' : 'none');
  document.querySelectorAll('.setting-cond-lunch-med').forEach(el => el.style.display = currentSettings.lunch.med ? 'block' : 'none');

  document.querySelectorAll('.setting-cond-dinner-bp').forEach(el => el.style.display = currentSettings.dinner.bp ? 'grid' : 'none');
  document.querySelectorAll('.setting-cond-dinner-med').forEach(el => el.style.display = currentSettings.dinner.med ? 'block' : 'none');

  document.querySelectorAll('.setting-cond-night-bp').forEach(el => el.style.display = currentSettings.night.bp ? 'grid' : 'none');
  document.querySelectorAll('.setting-cond-night-med').forEach(el => el.style.display = currentSettings.night.med ? 'block' : 'none');
  document.querySelectorAll('.setting-cond-night-weight').forEach(el => el.style.display = currentSettings.night.weight ? 'block' : 'none');
}

function updateSettings() {
  currentSettings.morning.med = document.getElementById('set_m_med').checked;
  currentSettings.morning.bp = document.getElementById('set_m_bp').checked;
  currentSettings.morning.weight = document.getElementById('set_m_weight').checked;
  currentSettings.lunch.med = document.getElementById('set_l_med').checked;
  currentSettings.lunch.bp = document.getElementById('set_l_bp').checked;
  currentSettings.dinner.med = document.getElementById('set_d_med').checked;
  currentSettings.dinner.bp = document.getElementById('set_d_bp').checked;
  currentSettings.night.med = document.getElementById('set_n_med').checked;
  currentSettings.night.bp = document.getElementById('set_n_bp').checked;
  currentSettings.night.weight = document.getElementById('set_n_weight').checked;
  saveSettings();
  updateLiveSummary();
}

function loadRecords() {
  const raw = localStorage.getItem(MASTER_KEY_RECORDS);
  if (raw) {
    try { allRecords = JSON.parse(raw); } catch (e) { allRecords = {}; }
  }
}

function saveAllRecords() {
  localStorage.setItem(MASTER_KEY_RECORDS, JSON.stringify(allRecords));
}

function changeActiveDate(newDate) {
  activeDate = newDate;
  updateDateBadge(activeDate);
  loadRecordIntoForm(activeDate);
  renderTodayHealthTip(activeDate);
}

function setSelectValueSafely(selectId, val) {
  const el = document.getElementById(selectId);
  if (!el) return;
  if (val !== undefined && val !== null && val !== '') {
    el.value = val;
    el.classList.remove('unselected');
  } else {
    el.selectedIndex = 0;
    el.classList.add('unselected');
  }
}

function autoSaveField(slot) {
  if (!allRecords[activeDate]) allRecords[activeDate] = {};
  const r = allRecords[activeDate];

  if (slot === 'morning') {
    if (!r.morning) r.morning = {};
    r.morning.sleepHours = document.getElementById('m_sleepHours').value || null;
    r.morning.sleepQuality = document.getElementById('m_sleepQuality').value || null;
    r.morning.bpSys = parseFloat(document.getElementById('m_bpSys').value) || null;
    r.morning.bpDia = parseFloat(document.getElementById('m_bpDia').value) || null;
    r.pulse = parseInt(document.getElementById('m_pulse').value, 10) || null;
    r.morning.pulse = r.pulse;
    const w = parseFloat(document.getElementById('m_weight').value) || null;
    if (w) { r.morning.weight = w; r.weight = w; }
    r.morning.meds = JSON.parse(JSON.stringify(currentMeds.morning));
    r.morning.mealType = getSelectedMealType('m_mealTypeChips');
    r.morning.items = JSON.parse(JSON.stringify(currentSelections.morning));
  } else if (slot === 'lunch') {
    if (!r.lunch) r.lunch = {};
    r.lunch.bpSys = parseFloat(document.getElementById('l_bpSys').value) || null;
    r.lunch.bpDia = parseFloat(document.getElementById('l_bpDia').value) || null;
    r.lunch.pulse = parseInt(document.getElementById('l_pulse').value, 10) || null;
    r.lunch.meds = JSON.parse(JSON.stringify(currentMeds.lunch));
    r.lunch.mealType = getSelectedMealType('l_mealTypeChips');
    r.lunch.items = JSON.parse(JSON.stringify(currentSelections.lunch));
  } else if (slot === 'snack') {
    if (!r.snack) r.snack = {};
    r.snack.items = JSON.parse(JSON.stringify(currentSelections.snack));
  } else if (slot === 'dinner') {
    if (!r.dinner) r.dinner = {};
    r.dinner.bpSys = parseFloat(document.getElementById('d_bpSys').value) || null;
    r.dinner.bpDia = parseFloat(document.getElementById('d_bpDia').value) || null;
    r.dinner.pulse = parseInt(document.getElementById('d_pulse').value, 10) || null;
    r.dinner.meds = JSON.parse(JSON.stringify(currentMeds.dinner));
    r.dinner.mealType = getSelectedMealType('d_mealTypeChips');
    r.dinner.items = JSON.parse(JSON.stringify(currentSelections.dinner));
    r.dinner.alcType = document.getElementById('d_alcType').value || null;
    r.dinner.alcAmount = document.getElementById('d_alcAmount').value || null;
  } else if (slot === 'latenight') {
    if (!r.latenight) r.latenight = {};
    r.latenight.items = JSON.parse(JSON.stringify(currentSelections.latenight));
    r.latenight.alcType = document.getElementById('ln_alcType').value || null;
    r.latenight.alcAmount = document.getElementById('ln_alcAmount').value || null;
  } else if (slot === 'night') {
    if (!r.night) r.night = {};
    const st = parseInt(document.getElementById('daily_steps').value.replace(/,/g, '').trim(), 10) || null;
    if (st) r.steps = st;
    r.night.bpSys = parseFloat(document.getElementById('n_bpSys').value) || null;
    r.night.bpDia = parseFloat(document.getElementById('n_bpDia').value) || null;
    r.night.meds = JSON.parse(JSON.stringify(currentMeds.night));
    r.night.bowelStatus = document.getElementById('n_bowelStatus').value || null;
    r.night.moodStatus = document.getElementById('n_moodStatus').value || null;
    const nw = parseFloat(document.getElementById('daily_weight').value) || null;
    if (nw) r.weight = nw;
  }

  const nut = calculateDayNutrients();
  r.totalInCal = nut.inCal;
  r.totalSalt = nut.saltTotal;

  saveAllRecords();
  updateLiveSummary();
}

function loadRecordIntoForm(dateStr) {
  const r = allRecords[dateStr] || {};
  updateWaterDisplay(r.waterGlasses || (r.waterBottles ? r.waterBottles * 2 : 0));

  const setBadge = (id, time, isNone = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (time) {
      el.textContent = isNone ? `記録済 (飲食なし)` : `記録済 ${time}`;
      el.className = 'time-badge recorded';
    } else {
      el.textContent = '未記録';
      el.className = 'time-badge';
    }
  };

  const m = r.morning || {};
  setBadge('badge-morning', m.time);
  document.getElementById('m_sleepHours').value = m.sleepHours || '';
  setSelectValueSafely('m_sleepQuality', m.sleepQuality);
  document.getElementById('m_bpSys').value = m.bpSys || '';
  document.getElementById('m_bpDia').value = m.bpDia || '';
  document.getElementById('m_pulse').value = m.pulse || '';
  document.getElementById('m_weight').value = m.weight || '';
  currentMeds.morning = m.meds ? JSON.parse(JSON.stringify(m.meds)) : [];
  setMealTypeSelected('m_mealTypeChips', m.mealType || '家食');
  document.getElementById('m_mealComponentArea').style.display = m.mealType === '抜き' ? 'none' : 'grid';
  currentSelections.morning = m.items ? JSON.parse(JSON.stringify(m.items)) : [];
  renderTray('morning');

  const s = r.snack || {};
  setBadge('badge-snack', s.time, s.isNone);
  currentSelections.snack = s.items ? JSON.parse(JSON.stringify(s.items)) : [];
  renderTray('snack');
  if (s.time && !s.isNone) document.getElementById('snack-content').classList.add('open');
  else document.getElementById('snack-content').classList.remove('open');

  const l = r.lunch || {};
  setBadge('badge-lunch', l.time);
  document.getElementById('l_bpSys').value = l.bpSys || '';
  document.getElementById('l_bpDia').value = l.bpDia || '';
  document.getElementById('l_pulse').value = l.pulse || '';
  currentMeds.lunch = l.meds ? JSON.parse(JSON.stringify(l.meds)) : [];
  setMealTypeSelected('l_mealTypeChips', l.mealType || '外食・中食');
  document.getElementById('l_mealComponentArea').style.display = m.mealType === '抜き' ? 'none' : 'grid';
  currentSelections.lunch = l.items ? JSON.parse(JSON.stringify(l.items)) : [];
  renderTray('lunch');

  const d = r.dinner || {};
  setBadge('badge-dinner', d.time);
  document.getElementById('d_bpSys').value = d.bpSys || '';
  document.getElementById('d_bpDia').value = d.bpDia || '';
  document.getElementById('d_pulse').value = d.pulse || '';
  currentMeds.dinner = d.meds ? JSON.parse(JSON.stringify(d.meds)) : [];
  setMealTypeSelected('d_mealTypeChips', d.mealType || '家食');
  document.getElementById('d_mealComponentArea').style.display = d.mealType === '抜き' ? 'none' : 'grid';
  currentSelections.dinner = d.items ? JSON.parse(JSON.stringify(d.items)) : [];
  renderTray('dinner');
  setSelectValueSafely('d_alcType', d.alcType);
  setSelectValueSafely('d_alcAmount', d.alcAmount);

  const ln = r.latenight || {};
  setBadge('badge-latenight', ln.time, ln.isNone);
  currentSelections.latenight = ln.items ? JSON.parse(JSON.stringify(ln.items)) : [];
  renderTray('latenight');
  setSelectValueSafely('ln_alcType', ln.alcType);
  setSelectValueSafely('ln_alcAmount', ln.alcAmount);
  if (ln.time && !ln.isNone) document.getElementById('latenight-content').classList.add('open');
  else document.getElementById('latenight-content').classList.remove('open');

  const n = r.night || {};
  setBadge('badge-night', n.time);
  const stVal = r.steps || '';
  document.getElementById('daily_steps').value = stVal ? parseInt(stVal, 10).toLocaleString() : '';
  document.getElementById('n_bpSys').value = n.bpSys || '';
  document.getElementById('n_bpDia').value = n.bpDia || '';
  currentMeds.night = n.meds ? JSON.parse(JSON.stringify(n.meds)) : [];
  setSelectValueSafely('n_bowelStatus', n.bowelStatus);
  setSelectValueSafely('n_moodStatus', n.moodStatus);
  document.getElementById('daily_weight').value = r.weight || '';

  updateCardCompletionStates(r);
  rebuildMedChipsUI();
  updateLiveSummary();
}

function updateCardCompletionStates(r) {
  const isMorningComplete = !!(r.morning?.time);
  document.getElementById('slot-morning').classList.toggle('slot-completed', isMorningComplete);
  setSlotCardCollapsed('morning', isMorningComplete);

  const isLunchComplete = !!(r.lunch?.time);
  document.getElementById('slot-lunch').classList.toggle('slot-completed', isLunchComplete);
  setSlotCardCollapsed('lunch', isLunchComplete);

  const isDinnerComplete = !!(r.dinner?.time);
  document.getElementById('slot-dinner').classList.toggle('slot-completed', isDinnerComplete);
  setSlotCardCollapsed('dinner', isDinnerComplete);

  const isNightComplete = !!(r.night?.time);
  document.getElementById('slot-night').classList.toggle('slot-completed', isNightComplete);
  setSlotCardCollapsed('night', isNightComplete);

  const h = new Date().getHours();
  if (activeDate === getTodayString()) {
    if (h >= 5 && h < 11 && !isMorningComplete) setSlotCardCollapsed('morning', false);
    else if (h >= 11 && h < 15 && !isLunchComplete) setSlotCardCollapsed('lunch', false);
    else if (h >= 17 && h < 21 && !isDinnerComplete) setSlotCardCollapsed('dinner', false);
    else if ((h >= 21 || h < 5) && !isNightComplete) setSlotCardCollapsed('night', false);
  }
}

function setMealTypeSelected(containerId, value) {
  const parent = document.getElementById(containerId);
  if (!parent) return;
  parent.querySelectorAll('.chip-btn').forEach(b => {
    b.classList.toggle('selected-item', b.getAttribute('data-val') === value);
  });
}

function getSelectedMealType(containerId) {
  const el = document.querySelector(`#${containerId} .chip-btn.selected-item`);
  return el ? el.getAttribute('data-val') : '家食';
}

function updateLiveSummary() {
  const nut = calculateDayNutrients();

  document.getElementById('d_alc_cal_badge').textContent = `お酒: ${nut.dAlcCal}kcal`;
  document.getElementById('ln_alc_cal_badge').textContent = `深夜: ${nut.lnAlcCal}kcal`;

  const alcCombinedEl = document.getElementById('alcCombinedTotalText');
  if (alcCombinedEl) {
    alcCombinedEl.textContent = `本日計: ${nut.totalBottles}本`;
  }

  const goal = getActiveMilestoneGoal();
  const steps = parseInt(document.getElementById('daily_steps')?.value.replace(/,/g, ''), 10) || 0;
  const inCal = nut.inCal;
  const saltTotal = nut.saltTotal;

  document.getElementById('sumInCal').textContent = inCal.toLocaleString();

  const saltEl = document.getElementById('sumSalt');
  saltEl.textContent = saltTotal.toFixed(1);
  if (saltTotal <= 6.0) { saltEl.className = 'b-val b-salt-good'; }
  else if (saltTotal <= 8.5) { saltEl.className = 'b-val b-salt-warn'; }
  else { saltEl.className = 'b-val b-salt-danger'; }

  let score = 20;

  const activeMedSlots = [];
  if (currentSettings.morning.med) activeMedSlots.push('morning');
  if (currentSettings.lunch.med) activeMedSlots.push('lunch');
  if (currentSettings.dinner.med) activeMedSlots.push('dinner');
  if (currentSettings.night.med) activeMedSlots.push('night');

  if (activeMedSlots.length === 0) {
    score += 30;
  } else {
    const pointPerSlot = 30 / activeMedSlots.length;
    activeMedSlots.forEach(slot => {
      const targetMeds = medMaster.filter(m => {
        if (slot === 'morning') return m.m;
        if (slot === 'lunch') return m.l;
        if (slot === 'dinner') return m.d;
        if (slot === 'night') return m.n;
        return false;
      }).map(m => m.name);

      if (targetMeds.length === 0) {
        score += pointPerSlot;
      } else {
        const checkedList = currentMeds[slot] || [];
        const allTaken = targetMeds.every(name => checkedList.includes(name));
        if (allTaken) score += pointPerSlot;
      }
    });
  }

  const glasses = parseInt(document.getElementById('topWaterText')?.textContent, 10) || 0;
  if (glasses >= 4) score += 15;
  if (steps >= (goal.targetSteps || 8000)) score += 15;
  if (saltTotal > 0 && saltTotal <= 6.5) score += 10;

  if (nut.dAlc !== '') {
    if (nut.totalBottles === 0) score += 10;
    else if (nut.totalBottles === 1) score += 5;
  }

  score = Math.min(100, Math.round(score));
  document.getElementById('liveScoreNum').textContent = score;

  const rankTitle = document.getElementById('liveRankTitle');
  if (score >= 85) { rankTitle.textContent = '🥇 ゴールド'; rankTitle.style.color = '#fbbf24'; }
  else if (score >= 60) { rankTitle.textContent = '🥈 シルバー'; rankTitle.style.color = '#38bdf8'; }
  else { rankTitle.textContent = '🥉 ブロンズ'; rankTitle.style.color = '#94a3b8'; }

  updateSidePanelLive({
    mRecorded: !!allRecords[activeDate]?.morning?.time,
    lRecorded: !!allRecords[activeDate]?.lunch?.time,
    dRecorded: !!allRecords[activeDate]?.dinner?.time,
    nRecorded: !!allRecords[activeDate]?.night?.time,
    waterGlasses: glasses,
    bpSys: parseFloat(document.getElementById('m_bpSys')?.value) || parseFloat(document.getElementById('n_bpSys')?.value) || null,
    bpDia: parseFloat(document.getElementById('m_bpDia')?.value) || parseFloat(document.getElementById('n_bpDia')?.value) || null,
    sleepH: parseFloat(document.getElementById('m_sleepHours')?.value) || null,
    saltTotal: saltTotal,
    inCal: inCal,
    bottlesTotal: nut.totalBottles,
    dAlc: nut.dAlc
  });
}

function updateSidePanelLive(data) {
  let doneCount = 0;
  const setChip = (id, done) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('done', done);
    if (done) doneCount++;
  };

  setChip('chip_todo_m', data.mRecorded);
  setChip('chip_todo_water', data.waterGlasses >= 4);
  setChip('chip_todo_l', data.lRecorded);
  setChip('chip_todo_d', data.dRecorded);
  setChip('chip_todo_n', data.nRecorded);

  const rateEl = document.getElementById('side_todo_rate');
  if (rateEl) rateEl.textContent = `${doneCount}/5 完了`;

  const docMsgEl = document.getElementById('side_doc_msg');
  if (docMsgEl) {
    if (data.bpSys && data.bpDia) {
      const pp = data.bpSys - data.bpDia;
      let ppComment = pp < 65 ? `<span style="color:var(--accent-green);">脈圧<b>${pp}</b>(血管のしなやかさ良好◎)</span>` : `<span style="color:var(--accent-amber);">脈圧<b>${pp}</b>(やや開き気味・動脈硬化予防を意識)</span>`;

      if (data.bpSys < 125 && data.bpDia < 75) {
        docMsgEl.innerHTML = `血圧 <b>${data.bpSys}/${data.bpDia} mmHg</b>。至適血圧です！家庭基準クリア！ ${ppComment}`;
      } else if (data.bpSys <= 135) {
        docMsgEl.innerHTML = `血圧 <b>${data.bpSys}/${data.bpDia} mmHg</b>。正常高値域です。${ppComment}`;
      } else {
        docMsgEl.innerHTML = `血圧 <b>${data.bpSys}/${data.bpDia} mmHg</b>。やや高めです。前夜の睡眠や塩分を確認しましょう。${ppComment}`;
      }
    } else if (data.sleepH && data.sleepH < 6.0) {
      docMsgEl.innerHTML = `睡眠<b>${data.sleepH}時間</b>ですね。今夜は無理せず、早めにお風呂に浸かって体を休めましょう。`;
    } else if (data.dAlc === 'なし' || data.bottlesTotal === 0) {
      docMsgEl.innerHTML = `本日は<b>休肝日</b>ですね！素晴らしい自己管理です。肝細胞と血管の再生がスムーズに進みます。`;
    } else {
      docMsgEl.innerHTML = `朝の血圧や睡眠時間を入力すると、臨床基準（125/75未満）と脈圧に基づきリアルタイムにコメントします。`;
    }
  }

  const nutMsgEl = document.getElementById('side_nut_msg');
  if (nutMsgEl) {
    const allSelected = [...currentSelections.morning, ...currentSelections.lunch, ...currentSelections.dinner, ...currentSelections.snack, ...currentSelections.latenight];
    const hasNoodle = allSelected.some(x => x.name.includes('ラーメン') || x.name.includes('うどん'));
    const hasCake = allSelected.some(x => x.name.includes('ケーキ') || x.name.includes('アイス'));
    const hasSoy = allSelected.some(x => x.name.includes('豆乳') || x.name.includes('納豆') || (x.subtype && x.subtype.includes('豆乳')));

    if (data.saltTotal > 7.0) {
      nutMsgEl.innerHTML = `推定塩分が<b>${data.saltTotal.toFixed(1)}g</b>です。「野菜ジュース」や「豆乳コーヒー」をプラスしてカリウムで塩分排出を促しましょう！`;
    } else if (hasCake) {
      nutMsgEl.innerHTML = `スイーツを楽しまれましたね！おやつを味わうのも長続きの秘訣です。夕食を少し軽めに調整すればバッチリです◎`;
    } else if (hasNoodle) {
      nutMsgEl.innerHTML = `麺類が入っていますね！「つゆを残す」だけで約2〜3gの大幅減塩が完了しています。ナイス選択です！`;
    } else if (hasSoy) {
      nutMsgEl.innerHTML = `大豆製品・豆乳が摂れていますね！植物性タンパク質とカリウムが血圧を力強くサポートします。`;
    } else if (data.waterGlasses < 3) {
      nutMsgEl.innerHTML = `現在水分は<b>${data.waterGlasses}杯(${(data.waterGlasses*0.25).toFixed(1)}L)</b>。1日4杯(1.0L)を目指して補給しましょう！`;
    } else {
      nutMsgEl.innerHTML = `現在推定塩分は<b>${data.saltTotal.toFixed(1)}g</b>。目標6.0g未満に向けてとても良いペースです！`;
    }
  }
}

function saveSlot(slot) {
  const nowTime = getCurrentTimeString();
  if (!allRecords[activeDate]) allRecords[activeDate] = {};
  const r = allRecords[activeDate];

  autoSaveField(slot);

  if (slot === 'morning') {
    r.morning.time = nowTime;
    document.getElementById('badge-morning').textContent = `記録済 ${nowTime}`;
    document.getElementById('badge-morning').className = 'time-badge recorded';
    setSlotCardCollapsed('morning', true);
  } else if (slot === 'lunch') {
    r.lunch.time = nowTime;
    document.getElementById('badge-lunch').textContent = `記録済 ${nowTime}`;
    document.getElementById('badge-lunch').className = 'time-badge recorded';
    setSlotCardCollapsed('lunch', true);
  } else if (slot === 'snack') {
    const isNone = (currentSelections.snack.length === 0);
    r.snack.time = nowTime;
    r.snack.isNone = isNone;
    document.getElementById('badge-snack').textContent = isNone ? `記録済 (飲食なし)` : `記録済 ${nowTime}`;
    document.getElementById('badge-snack').className = 'time-badge recorded';
    document.getElementById('snack-content').classList.remove('open');
  } else if (slot === 'dinner') {
    r.dinner.time = nowTime;
    document.getElementById('badge-dinner').textContent = `記録済 ${nowTime}`;
    document.getElementById('badge-dinner').className = 'time-badge recorded';
    setSlotCardCollapsed('dinner', true);
  } else if (slot === 'latenight') {
    const isNone = (currentSelections.latenight.length === 0 && (!r.latenight?.alcAmount || r.latenight?.alcAmount === 'なし'));
    r.latenight.time = nowTime;
    r.latenight.isNone = isNone;
    document.getElementById('badge-latenight').textContent = isNone ? `記録済 (飲食なし)` : `記録済 ${nowTime}`;
    document.getElementById('badge-latenight').className = 'time-badge recorded';
    document.getElementById('latenight-content').classList.remove('open');
  } else if (slot === 'night') {
    r.night.time = nowTime;
    document.getElementById('badge-night').textContent = `記録済 ${nowTime}`;
    document.getElementById('badge-night').className = 'time-badge recorded';
    setSlotCardCollapsed('night', true);
  }

  const nut = calculateDayNutrients();
  r.totalInCal = nut.inCal;
  r.totalSalt = nut.saltTotal;

  saveAllRecords();
  
  const slotCard = document.getElementById(`slot-${slot}`);
  if (slotCard) slotCard.classList.add('slot-completed');

  triggerCelebration();
}

function triggerCelebration() {
  if (typeof confetti === 'function') confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
  const item = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
  document.getElementById('praiseTitle').textContent = item.title;
  document.getElementById('praiseMsg').textContent = item.msg;
  document.getElementById('praiseModal').classList.add('show');
}

function closePraiseModal() {
  document.getElementById('praiseModal').classList.remove('show');
}

function setChartPeriod(period) {
  chartPeriod = period;
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`period-${period}`).classList.add('active');
  refreshDashboard();
}

function calculateSMA7(arr) {
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    let sum = 0, count = 0;
    const start = Math.max(0, i - 6);
    for (let j = start; j <= i; j++) {
      if (arr[j] !== null && arr[j] !== undefined && !isNaN(arr[j])) {
        sum += arr[j];
        count++;
      }
    }
    res.push(count > 0 ? Number((sum / count).toFixed(2)) : null);
  }
  return res;
}

function initCharts() {
  const baseOpt = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#8b9bb4', font: { size: 10 } } }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { ticks: { color: '#64748b', maxTicksLimit: 8 }, grid: { color: '#1a243a' } },
      y: { ticks: { color: '#64748b' }, grid: { color: '#1a243a' } }
    }
  };

  const ctxW = document.getElementById('weightTrendChart').getContext('2d');
  weightChartInst = new Chart(ctxW, {
    type: 'line',
    data: { labels: [], datasets: [
      { label: '7日移動平均', data: [], borderColor: '#38bdf8', borderWidth: 3, tension: 0.3, pointRadius: 0 },
      { label: '実測体重', data: [], borderColor: 'rgba(139, 155, 180, 0.4)', borderDash: [2, 2], borderWidth: 1, pointRadius: 2, pointBackgroundColor: '#8b9bb4' },
      { label: '目標体重', data: [], borderColor: 'rgba(251, 191, 36, 0.7)', borderDash: [4, 4], borderWidth: 1.5, pointRadius: 0, fill: false },
      { label: '適正体重(BMI22)', data: [], borderColor: 'rgba(52, 211, 153, 0.7)', borderDash: [4, 4], borderWidth: 1.5, pointRadius: 0, fill: false }
    ]},
    options: baseOpt
  });

  const ctxB = document.getElementById('bpTrendChart').getContext('2d');
  bpChartInst = new Chart(ctxB, {
    type: 'line',
    data: { labels: [], datasets: [
      { label: '最高血圧 (7日平均)', data: [], borderColor: '#fb7185', borderWidth: 2.5, tension: 0.3, pointRadius: 0 },
      { label: '最低血圧 (7日平均)', data: [], borderColor: '#34d399', borderWidth: 2.5, tension: 0.3, pointRadius: 0 },
      { label: '実測 最高', data: [], borderColor: 'rgba(251, 113, 133, 0.25)', borderDash: [2, 2], borderWidth: 1, pointRadius: 2 },
      { label: '実測 最低', data: [], borderColor: 'rgba(52, 211, 153, 0.25)', borderDash: [2, 2], borderWidth: 1, pointRadius: 2 },
      { label: '家庭至適(125)', data: [], borderColor: 'rgba(52, 211, 153, 0.6)', borderDash: [4, 4], borderWidth: 1, pointRadius: 0 },
      { label: '高血圧警戒(135)', data: [], borderColor: 'rgba(244, 63, 94, 0.6)', borderDash: [4, 4], borderWidth: 1, pointRadius: 0 }
    ]},
    options: baseOpt
  });

  const ctxS = document.getElementById('stepsCalChart').getContext('2d');
  stepsCalChartInst = new Chart(ctxS, {
    type: 'bar',
    data: { labels: [], datasets: [
      { label: '歩数 (歩)', type: 'bar', data: [], backgroundColor: 'rgba(56, 189, 248, 0.3)', borderColor: '#38bdf8', borderWidth: 1, yAxisID: 'ySteps' },
      { label: '目標歩数', type: 'line', data: [], borderColor: 'rgba(56, 189, 248, 0.8)', borderDash: [4, 4], borderWidth: 1.5, pointRadius: 0, yAxisID: 'ySteps' },
      { label: '摂取エネルギー (kcal)', type: 'line', data: [], borderColor: '#fbbf24', borderWidth: 2, tension: 0.3, pointRadius: 2, yAxisID: 'yCal' }
    ]},
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#8b9bb4' } } },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { color: '#1a243a' } },
        ySteps: { type: 'linear', position: 'left', ticks: { color: '#38bdf8' }, grid: { color: '#1a243a' } },
        yCal: {
          type: 'linear', position: 'right', min: 0, max: 2500, suggestedMax: 2500,
          ticks: { color: '#fbbf24', stepSize: 500 }, grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

function refreshDashboard() {
  updateStreakDisplay();

  const dateList = [];
  const today = new Date();

  let daysCount = 7;
  if (chartPeriod === '1m') daysCount = 30;
  else if (chartPeriod === 'year') {
    const fiscalYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
    const startD = new Date(fiscalYear, 3, 1);
    const diffTime = Math.abs(today - startD);
    daysCount = Math.max(14, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
  }

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dateList.push(`${y}-${m}-${day}`);
  }

  const labels = dateList.map(d => d.slice(5));
  const weights = [];
  const bpSysList = [];
  const bpDiaList = [];
  const stepsList = [];
  const calsList = [];

  const heightM = (userProfile.height || 172) / 100;
  const stdWeight = Number((heightM * heightM * 22).toFixed(1));
  const goal = getActiveMilestoneGoal();
  const targetW = goal.targetWeight || 65.0;
  const targetStepsVal = goal.targetSteps || 8000;

  const stdWeightLine = Array(dateList.length).fill(stdWeight);
  const targetWeightLine = Array(dateList.length).fill(targetW);
  const bp125Line = Array(dateList.length).fill(125);
  const bp135Line = Array(dateList.length).fill(135);
  const targetStepsLine = Array(dateList.length).fill(targetStepsVal);

  let totalSys = 0, countSys = 0;
  let totalSalt = 0, countSalt = 0;
  let hasFishOilCount = 0;
  let hasSoyMilkCount = 0;

  let weekVegCount = 0;
  let weekFishCount = 0;
  let weekNoAlcDays = 0;

  dateList.forEach((d, idx) => {
    const rec = allRecords[d] || {};
    const w = rec.weight ?? null;
    weights.push(w);

    const sys = rec.morning?.bpSys || rec.night?.bpSys || rec.lunch?.bpSys || rec.dinner?.bpSys || null;
    const dia = rec.morning?.bpDia || rec.night?.bpDia || rec.lunch?.bpDia || rec.dinner?.bpDia || null;
    bpSysList.push(sys);
    bpDiaList.push(dia);

    if (sys) { totalSys += sys; countSys++; }
    if (rec.totalSalt) { totalSalt += rec.totalSalt; countSalt++; }

    const allM = [...(rec.morning?.meds || []), ...(rec.dinner?.meds || []), ...(rec.night?.meds || [])];
    const hasFishOil = allM.some(x => x.includes('フィッシュオイル') || x.includes('オメガ') || x.includes('EPA'));
    if (hasFishOil) hasFishOilCount++;

    const allItems = [
      ...(rec.morning?.items || []),
      ...(rec.lunch?.items || []),
      ...(rec.dinner?.items || []),
      ...(rec.snack?.items || []),
      ...(rec.latenight?.items || [])
    ];

    if (allItems.some(x => x.name.includes('豆乳') || (x.subtype && x.subtype.includes('豆乳')))) hasSoyMilkCount++;

    if (idx >= dateList.length - 7) {
      allItems.forEach(it => {
        if (it.name.includes('野菜') || it.name.includes('サラダ') || it.name.includes('おひたし') || it.name.includes('きんぴら') || it.name.includes('ひじき') || it.name.includes('野菜ジュース') || it.name.includes('ミネストローネ')) {
          weekVegCount++;
        }
        if (it.name.includes('魚') || it.name.includes('刺身')) {
          weekFishCount++;
        }
      });
      if (hasFishOil) weekFishCount++;

      const dAlc = rec.dinner?.alcAmount || 'なし';
      const lnAlc = rec.latenight?.alcAmount || 'なし';
      if (dAlc === 'なし' && lnAlc === 'なし') {
        weekNoAlcDays++;
      }
    }

    stepsList.push(rec.steps ?? 0);
    calsList.push(rec.totalInCal ?? null);
  });

  const maWeight = calculateSMA7(weights);
  const maSys = calculateSMA7(bpSysList);
  const maDia = calculateSMA7(bpDiaList);

  if (weightChartInst) {
    weightChartInst.data.labels = labels;
    weightChartInst.data.datasets[0].data = maWeight;
    weightChartInst.data.datasets[1].data = weights;
    weightChartInst.data.datasets[2].data = targetWeightLine;
    weightChartInst.data.datasets[3].data = stdWeightLine;
    weightChartInst.update();
  }

  if (bpChartInst) {
    bpChartInst.data.labels = labels;
    bpChartInst.data.datasets[0].data = maSys;
    bpChartInst.data.datasets[1].data = maDia;
    bpChartInst.data.datasets[2].data = bpSysList;
    bpChartInst.data.datasets[3].data = bpDiaList;
    bpChartInst.data.datasets[4].data = bp125Line;
    bpChartInst.data.datasets[5].data = bp135Line;
    bpChartInst.update();
  }

  if (stepsCalChartInst) {
    stepsCalChartInst.data.labels = labels;
    stepsCalChartInst.data.datasets[0].data = stepsList;
    stepsCalChartInst.data.datasets[1].data = targetStepsLine;
    stepsCalChartInst.data.datasets[2].data = calsList;
    stepsCalChartInst.update();
  }

  updateWeeklyNutritionCard({
    veg: weekVegCount,
    fish: weekFishCount,
    noAlc: weekNoAlcDays
  });

  generateExpertComments({
    avgSys: countSys > 0 ? Math.round(totalSys / countSys) : null,
    avgSalt: countSalt > 0 ? (totalSalt / countSalt).toFixed(1) : null,
    fishOilDays: hasFishOilCount,
    soyMilkDays: hasSoyMilkCount
  });
}

function updateWeeklyNutritionCard(stats) {
  const vegEl = document.getElementById('wn_veg_score');
  const fishEl = document.getElementById('wn_fish_score');
  const alcEl = document.getElementById('wn_alc_score');
  const adviceEl = document.getElementById('wn_weekly_advice');

  if (vegEl) vegEl.textContent = `${stats.veg} 品`;
  if (fishEl) fishEl.textContent = `${stats.fish} 回`;
  if (alcEl) alcEl.textContent = `${stats.noAlc} 日`;

  if (adviceEl) {
    let msg = `<b>🥗 管理栄養士 アヤからの週間カルテ:</b> `;
    if (stats.veg >= 14 && stats.fish >= 5 && stats.noAlc >= 2) {
      msg += `素晴らしい！抗酸化野菜、オメガ3、休肝日のすべてが目標達成です。血管内皮の保護と解毒が最高のサイクルで回っています◎`;
    } else {
      const tips = [];
      if (stats.veg < 14) tips.push(`野菜小鉢・野菜ジュース（あと${14 - stats.veg}品）を足してカリウムを強化`);
      if (stats.fish < 5) tips.push(`焼き魚やEPAサプリの補填をあと${5 - stats.fish}回意識`);
      if (stats.noAlc < 2) tips.push(`夜間血圧を休めるため休肝日をあと${2 - stats.noAlc}日確保`);
      msg += `今週は順調なペースです！来週は<b>『${tips.join('』『')}』</b>を意識すると、さらに完璧な栄養バランスになりますよ！`;
    }
    adviceEl.innerHTML = msg;
  }
}

function generateExpertComments(stats) {
  const docEl = document.getElementById('expertDoctorText');
  const nutEl = document.getElementById('expertNutritionText');
  const cares = userProfile.cares || [];

  if (!stats.avgSys) {
    docEl.textContent = "血圧データが蓄積されると、プロファイルに合わせた臨床傾向が表示されます。";
  } else {
    let docMsg = `期間の7日平均血圧は <b>${stats.avgSys} mmHg</b> です。`;
    if (cares.includes("高血圧")) {
      docMsg += stats.avgSys < 125 ? "家庭血圧目標（125/75未満）を完全に達成しており、脳心血管事故リスクが劇的に抑えられています◎" : "家庭血圧基準（125未満）に対しやや高値です。起床直後の冷え込み防止と減塩を意識しましょう。";
    }
    if (stats.fishOilDays > 0) docMsg += ` フィッシュオイル継続も血管内皮機能の維持に大きく貢献しています◎`;
    docEl.innerHTML = docMsg;
  }

  if (!stats.avgSalt) {
    nutEl.textContent = "食事パーツの入力から推定塩分や脂質バランスを評価します。";
  } else {
    let nutMsg = `推定平均塩分は <b>${stats.avgSalt} g</b>（目標6.0g未満）です。`;
    if (stats.soyMilkDays > 0) nutMsg += ` 豆乳コーヒーや大豆製品のカリウムが塩分排泄を力強くサポートしています◎`;
    if (cares.includes("脂質異常症")) nutMsg += ` 揚げ物やお肉の際は赤身肉や野菜小鉢を選ぶ組み合わせが極めて効果的です。`;
    nutEl.innerHTML = nutMsg;
  }
}

function updateStreakDisplay() {
  const recordedSet = new Set(Object.keys(allRecords));
  let streak = 0;
  let chk = new Date();
  const todayStr = getTodayString();
  if (!recordedSet.has(todayStr)) chk.setDate(chk.getDate() - 1);

  while (true) {
    const y = chk.getFullYear();
    const m = String(chk.getMonth() + 1).padStart(2, '0');
    const d = String(chk.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${d}`;
    if (recordedSet.has(key)) { streak++; chk.setDate(chk.getDate() - 1); }
    else break;
  }

  document.getElementById('streakDaysCount').textContent = streak;

  const grid = document.getElementById('streakCardGrid');
  grid.innerHTML = '';
  for (let i = 6; i >= 0; i--) {
    const target = new Date();
    target.setDate(target.getDate() - i);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, '0');
    const d = String(target.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${d}`;
    const isDone = recordedSet.has(key);

    const box = document.createElement('div');
    box.className = `stamp-box ${isDone ? 'active' : ''}`;
    box.innerHTML = `<span style="font-size:0.9rem;">${isDone ? '💮' : '○'}</span><span>${target.getMonth() + 1}/${target.getDate()}</span>`;
    grid.appendChild(box);
  }
}

function exportFullJSON() {
  const fullBackup = {
    version: getAppVersion(),
    exportedAt: new Date().toISOString(),
    profile: userProfile,
    meds: medMaster,
    settings: currentSettings,
    menus: menuMaster,
    records: allRecords
  };
  const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `健康管理くん_丸ごとバックアップ_${getTodayString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importFullJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.records && !data.menus) {
        alert("有効な丸ごとバックアップファイルではありませんでした。");
        return;
      }

      if (!confirm("【確認】このファイルを復元すると、現在の設定もお薬も全記録も、バックアップ時の状態に完全に復元されます。よろしいですか？")) return;

      if (data.profile) {
        userProfile = data.profile;
        if (!userProfile.milestones) {
          userProfile.milestones = [
            { date: userProfile.targetDate || "2025-06-30", targetWeight: userProfile.targetWeight || 65.0, targetSteps: userProfile.targetSteps || 8000 },
            { date: "", targetWeight: null, targetSteps: null },
            { date: "", targetWeight: null, targetSteps: null }
          ];
        }
        localStorage.setItem(MASTER_KEY_PROFILE, JSON.stringify(userProfile));
      }
      if (data.meds) {
        medMaster = data.meds;
        localStorage.setItem(MASTER_KEY_MEDS, JSON.stringify(data.meds));
      }
      if (data.settings) {
        currentSettings = data.settings;
        localStorage.setItem(MASTER_KEY_SETTINGS, JSON.stringify(data.settings));
      }
      if (data.menus) {
        menuMaster = data.menus;
        localStorage.setItem(MASTER_KEY_MENUS, JSON.stringify(data.menus));
      }
      if (data.records) {
        allRecords = data.records;
        localStorage.setItem(MASTER_KEY_RECORDS, JSON.stringify(data.records));
      }

      const recordDates = Object.keys(allRecords).sort();
      if (recordDates.length > 0) {
        activeDate = recordDates[recordDates.length - 1];
      } else {
        activeDate = getTodayString();
      }
      document.getElementById('selectedDateInput').value = activeDate;
      updateDateBadge(activeDate);

      renderProfileUI();
      renderMedSettingsTable();
      renderMenuMasterTable();
      applySettingsToUI();
      rebuildAllInputChips();
      loadRecordIntoForm(activeDate);
      renderTodayHealthTip(activeDate);
      refreshDashboard();

      const recordCount = recordDates.length;
      const msg = `✅ 丸ごと復元が完了しました！\n\n` +
                  `・日次記録：${recordCount} 日分\n` +
                  `・表示中の日付：${activeDate}\n` +
                  `・お薬・サプリ設定：${medMaster.length} 件\n` +
                  `・プロファイル：${userProfile.age || ''} ${userProfile.gender || ''} (身長 ${userProfile.height || 172}cm)`;
      alert(msg);

    } catch (err) {
      alert("JSONファイルの解析に失敗しました。正しいバックアップファイルかご確認ください。");
      console.error(err);
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

function formatItemsForCSV(items) {
  if (!items || items.length === 0) return '';
  return items.map(x => {
    const eff = calcEffectiveItemStats(x);
    return `${x.name}${x.subtype ? `[${x.subtype}]` : ''}(${x.amount}:${eff.cal}kcal:${eff.salt.toFixed(1)}g)`;
  }).join(' + ');
}

function exportDataToCSV() {
  const dates = Object.keys(allRecords).sort();
  if (dates.length === 0) { alert("保存されている記録がありません。"); return; }

  const headers = [
    "日付", "体重", "歩数", "水分_杯数(250ml)", "摂取カロリー合計", "塩分合計",
    "朝_時刻", "朝_睡眠時間", "朝_睡眠質", "朝_上血圧", "朝_下血圧", "朝_脈拍", "朝_服薬", "朝_場所", "朝_内訳",
    "間食_時刻", "間食_内訳",
    "昼_時刻", "昼_上血圧", "昼_下血圧", "昼_脈拍", "昼_服薬", "昼_場所", "昼_内訳",
    "晩_時刻", "晩_上血圧", "晩_下血圧", "晩_脈拍", "晩_服薬", "晩_場所", "晩_内訳", "晩_酒種", "晩_酒量",
    "夜食_時刻", "夜食_内訳", "夜食_酒種", "夜食_酒量",
    "就寝_時刻", "就寝_上血圧", "就寝_下血圧", "就寝_服薬", "お通じ", "体調・気分"
  ];

  const rows = dates.map(d => {
    const r = allRecords[d];
    const m = r.morning || {};
    const s = r.snack || {};
    const l = r.lunch || {};
    const din = r.dinner || {};
    const ln = r.latenight || {};
    const n = r.night || {};

    return [
      d, r.weight ?? '', r.steps ?? '', r.waterGlasses ?? (r.waterBottles ? r.waterBottles * 2 : 0), r.totalInCal ?? 0, r.totalSalt ?? 0,
      m.time ?? '', m.sleepHours ?? '', m.sleepQuality ?? '', m.bpSys ?? '', m.bpDia ?? '', m.pulse ?? '', (m.meds || []).join(';'), m.mealType ?? '', `"${formatItemsForCSV(m.items)}"`,
      s.time ?? '', `"${formatItemsForCSV(s.items)}"`,
      l.time ?? '', l.bpSys ?? '', l.bpDia ?? '', l.pulse ?? '', (l.meds || []).join(';'), l.mealType ?? '', `"${formatItemsForCSV(l.items)}"`,
      din.time ?? '', din.bpSys ?? '', din.bpDia ?? '', din.pulse ?? '', (din.meds || []).join(';'), din.mealType ?? '', `"${formatItemsForCSV(din.items)}"`, `"${din.alcType || ''}"`, `"${din.alcAmount || ''}"`,
      ln.time ?? '', `"${formatItemsForCSV(ln.items)}"`, `"${ln.alcType || ''}"`, `"${ln.alcAmount || ''}"`,
      n.time ?? '', n.bpSys ?? '', n.bpDia ?? '', (n.meds || []).join(';'), n.bowelStatus ?? '', n.moodStatus ?? ''
    ];
  });

  const csvStr = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
  const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `健康管理くん_Excel記録_${getTodayString()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function importDataFromCSV(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length <= 1) { alert("有効なCSVデータではありませんでした。"); return; }

      for (let i = 1; i < lines.length; i++) {
        const c = lines[i].split(',').map(s => s.replace(/(^"|"$)/g, '').trim());
        const d = c[0];
        if (!d) continue;

        allRecords[d] = {
          weight: c[1] ? parseFloat(c[1]) : null,
          steps: c[2] ? parseInt(c[2], 10) : null,
          waterGlasses: c[3] ? parseInt(c[3], 10) : 0,
          totalInCal: c[4] ? parseInt(c[4], 10) : 0,
          totalSalt: c[5] ? parseFloat(c[5]) : 0,
          morning: {
            time: c[6] || null,
            sleepHours: c[7] || null,
            sleepQuality: c[8] || null,
            bpSys: c[9] ? parseFloat(c[9]) : null,
            bpDia: c[10] ? parseFloat(c[10]) : null,
            pulse: c[11] ? parseInt(c[11], 10) : null,
            meds: c[12] ? c[12].split(';') : [],
            mealType: c[13] || '家食',
            items: parseItemsFromCSV(c[14])
          },
          snack: { time: c[15] || null, items: parseItemsFromCSV(c[16]), isNone: false },
          lunch: {
            time: c[17] || null,
            bpSys: c[18] ? parseFloat(c[18]) : null,
            bpDia: c[19] ? parseFloat(c[19]) : null,
            pulse: c[20] ? parseInt(c[20], 10) : null,
            meds: c[21] ? c[21].split(';') : [],
            mealType: c[22] || '外食・中食',
            items: parseItemsFromCSV(c[23])
          },
          dinner: {
            time: c[24] || null,
            bpSys: c[25] ? parseFloat(c[25]) : null,
            bpDia: c[26] ? parseFloat(c[26]) : null,
            pulse: c[27] ? parseInt(c[27], 10) : null,
            meds: c[28] ? c[28].split(';') : [],
            mealType: c[29] || '家食',
            items: parseItemsFromCSV(c[30]),
            alcType: c[31] || null,
            alcAmount: c[32] || null
          },
          latenight: { time: c[33] || null, items: parseItemsFromCSV(c[34]), alcType: c[35] || null, alcAmount: c[36] || null, isNone: false },
          night: {
            time: c[37] || null,
            bpSys: c[38] ? parseFloat(c[38]) : null,
            bpDia: c[39] ? parseFloat(c[39]) : null,
            meds: c[40] ? c[40].split(';') : [],
            bowelStatus: c[41] || null,
            moodStatus: c[42] || null
          }
        };
      }

      saveAllRecords();
      loadRecordIntoForm(activeDate);
      renderTodayHealthTip(activeDate);
      refreshDashboard();
      alert("CSVデータの復元が完了しました！");
    } catch (err) {
      alert("CSV読み込み中にエラーが発生しました。");
      console.error(err);
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

function parseItemsFromCSV(str) {
  if (!str) return [];
  return str.split('+').map(part => {
    const p = part.trim();
    const match = p.match(/^([^(]+)(\[[^\]]+\])?\(([^:]+):?([^:]*):?(.*)\)$/);
    if (match) {
      return {
        cat: "主食",
        name: match[1].trim(),
        subtype: match[2] ? match[2].replace(/[\[\]]/g, '') : null,
        amount: match[3].trim(),
        cal: parseInt(match[4], 10) || 0,
        salt: parseFloat(match[5]) || 0
      };
    }
    return { cat: "主食", name: p, amount: "普通", cal: 0, salt: 0 };
  });
}

function resetDailyRecordsOnly() {
  const count = Object.keys(allRecords).length;
  if (!confirm(`【確認】登録したマイお薬リストや食事メニュー設定は《そのまま残ります》。\n毎日の血圧・食事などの記録データ（${count}日分）のみを消去します。よろしいですか？`)) return;
  if (!confirm("【最終確認】記録データをリセットします。本当によろしいですか？")) return;

  allRecords = {};
  saveAllRecords();
  loadRecordIntoForm(activeDate);
  renderTodayHealthTip(activeDate);
  refreshDashboard();
  alert("日次記録をリセットしました（お薬やメニュー設定は保持されています）。");
}

function factoryResetAll() {
  if (!confirm("⚠️【警告】あなたの個人プロファイルもお薬もメニュー設定も全記録も《すべて消去》され、初期状態に戻ります。\n\nよろしいですか？")) return;
  if (!confirm("【最終警告】本当にすべてのデータを完全消去して初期化しますか？")) return;

  localStorage.removeItem(MASTER_KEY_RECORDS);
  localStorage.removeItem(MASTER_KEY_SETTINGS);
  localStorage.removeItem(MASTER_KEY_MENUS);
  localStorage.removeItem(MASTER_KEY_MEDS);
  localStorage.removeItem(MASTER_KEY_PROFILE);

  for (let v = 1; v <= 11; v++) {
    localStorage.removeItem(`health_kun_records_v${v}`);
    localStorage.removeItem(`health_kun_settings_v${v}`);
    localStorage.removeItem(`health_kun_menus_v${v}`);
    localStorage.removeItem(`health_kun_meds_v${v}`);
    localStorage.removeItem(`health_kun_profile_v${v}`);
  }

  alert("すべてのデータを完全消去し、初期化しました。初期状態から再起動します。");
  location.reload();
}