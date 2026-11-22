// =========================================================
// 健康管理くん - 共通 食品・栄養・臨床マスタ辞書 (food_dict.js)
// 文部科学省「日本食品標準成分表（八訂）」準拠
// スマホ（mobile_logic.js）＆ PC（viewer_logic.js）完全共通参照
// =========================================================

// サブメニュー・詳細バリエーション定義（減塩・部位・調理法別の規格値）
const SUBTYPES_DEF = {
  "味噌汁": [
    { name: "汁半分 (減塩)", cal: 40, salt: 0.6 },
    { name: "普通 (標準)", cal: 45, salt: 1.2 }
  ],
  "チーズ": [
    { name: "スライス・ベビー", cal: 63, salt: 0.6 },
    { name: "とろける", cal: 66, salt: 0.6 },
    { name: "カマンベール", cal: 62, salt: 0.4 }
  ],
  "卵・たまご料理": [
    { name: "生卵", cal: 76, salt: 0.2 },
    { name: "ゆで卵", cal: 76, salt: 0.2 },
    { name: "半熟卵・温泉卵", cal: 76, salt: 0.2 },
    { name: "目玉焼き", cal: 95, salt: 0.3 },
    { name: "卵焼き・だし巻き", cal: 110, salt: 0.5 },
    { name: "スクランブルエッグ", cal: 120, salt: 0.4 }
  ],
  "コーヒー": [
    { name: "ブラック", cal: 5, salt: 0.0 },
    { name: "ミルク入り", cal: 45, salt: 0.1 },
    { name: "豆乳入り", cal: 50, salt: 0.1 },
    { name: "アーモンド入り", cal: 25, salt: 0.0 },
    { name: "ココア入り", cal: 75, salt: 0.1 }
  ],
  "焼き鳥・串焼き": [
    { name: "もも・ねぎま (塩)", cal: 160, salt: 1.2 },
    { name: "もも・ねぎま (タレ)", cal: 180, salt: 1.6 },
    { name: "ささみ・むね", cal: 120, salt: 1.2 },
    { name: "レバー (鉄分)", cal: 110, salt: 1.2 },
    { name: "皮・かわ (脂多)", cal: 300, salt: 1.2 },
    { name: "盛り合わせ (3本)", cal: 240, salt: 1.8 }
  ],
  "刺身・生魚": [
    { name: "盛り合わせ (標準1人前)", cal: 130, salt: 0.6 },
    { name: "赤身中心 (マグロ/カツオ)", cal: 100, salt: 0.6 },
    { name: "白身中心 (タイ/ヒラメ)", cal: 90, salt: 0.6 },
    { name: "青魚中心 (サバ/アジ/EPA高)", cal: 150, salt: 0.6 },
    { name: "サーモン・トロ (脂乗り)", cal: 180, salt: 0.6 }
  ],
  "寿司": [
    { name: "並・盛り合わせ (8〜10貫)", cal: 550, salt: 2.2 },
    { name: "上・特上 (中トロ等 8〜10貫)", cal: 650, salt: 2.0 },
    { name: "赤身・白身 (8〜10貫)", cal: 480, salt: 1.8 },
    { name: "回転寿司 (12〜14貫)", cal: 800, salt: 3.0 },
    { name: "助六・巻寿司 (いなり等)", cal: 500, salt: 2.5 },
    { name: "小腹・軽め (5〜6貫/細巻)", cal: 320, salt: 1.4 }
  ],
  "麻婆豆腐": [
    { name: "家庭風・定番 (中辛)", cal: 280, salt: 2.2 },
    { name: "本格四川 (油・花椒多め)", cal: 340, salt: 2.6 },
    { name: "麻婆茄子 (ナス・野菜入り)", cal: 320, salt: 2.4 }
  ],
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
    { name: "サーロイン/リブロース", cal: 680, salt: 1.2 }
  ],
  "ハンバーグ": [
    { name: "デミグラス/和風", cal: 380, salt: 1.6 },
    { name: "チーズイン", cal: 460, salt: 1.8 }
  ],
  "とんかつ・カツ類": [
    { name: "ロースかつ (1枚)", cal: 450, salt: 1.2 },
    { name: "ヒレかつ (2〜3個)", cal: 340, salt: 1.0 }
  ],
  "牛焼肉": [
    { name: "ロース・赤身肉中心", cal: 240, salt: 1.0 },
    { name: "カルビ・脂身多め", cal: 380, salt: 1.2 }
  ],
  "餃子・焼売": [
    { name: "焼き餃子 (1皿5〜6個)", cal: 220, salt: 1.1 },
    { name: "水餃子 (1皿5〜6個)", cal: 200, salt: 1.2 },
    { name: "焼売・点心 (4〜5個)", cal: 200, salt: 1.0 }
  ],
  "ラーメン": [
    { name: "中華そば", cal: 450, salt: 2.4 },
    { name: "チャーシューメン", cal: 650, salt: 3.2 },
    { name: "博多豚骨ラーメン", cal: 580, salt: 2.8 },
    { name: "横浜家系", cal: 850, salt: 4.0 },
    { name: "二郎系", cal: 1600, salt: 6.5 },
    { name: "つけ麺", cal: 800, salt: 3.2 },
    { name: "冷やし中華", cal: 480, salt: 2.0 }
  ],
  "ホルモン・レバー": [
    { name: "ホルモン(シロ/小腸)", cal: 280, salt: 1.2 },
    { name: "レバー(肝臓・高鉄分)", cal: 140, salt: 1.0 },
    { name: "ホルモンMIX炒め", cal: 250, salt: 1.2 }
  ]
};

// 全食品・栄養代謝・PFC基準マスタ（朝m, 昼l, 晩d, 間食s, 夜食ln の初期時間帯チェックを完全内包）
const COMPREHENSIVE_FOOD_DICT = [
  // 🍚 主食 (18品)
  {
    id: 1, cat: "主食", name: "ご飯・白米",
    portion: "お茶碗1杯 (約150g)", levels: "少:100g / 普:150g / 多:250g(大盛)",
    cal: 240, salt: 0.0, p: 3.8, f: 0.5, c: 55.7,
    m: true, l: true, d: true, s: false, ln: false,
    memo: "精白米。糖質中心。玄米への置換でビタミンB群強化可"
  },
  {
    id: 2, cat: "主食", name: "玄米・雑穀米",
    portion: "お茶碗1杯 (約150g)", levels: "少:100g / 普:150g / 多:250g(大盛)",
    cal: 230, salt: 0.0, p: 4.2, f: 1.5, c: 51.3,
    m: true, l: true, d: true, s: false, ln: false,
    memo: "食物繊維・マグネシウム・ビタミンB1豊富。血糖値急上昇抑制"
  },
  {
    id: 3, cat: "主食", name: "食パン・トースト",
    portion: "6枚切 1枚 (約60g)", levels: "少:8枚切 / 普:6枚切1枚 / 多:厚切(4枚切)",
    cal: 160, salt: 0.8, p: 5.6, f: 2.6, c: 28.0,
    m: true, l: false, d: false, s: false, ln: false,
    memo: "製造時の食塩含む。バター・ジャム塗布量に注意"
  },
  {
    id: 4, cat: "主食", name: "惣菜パン",
    portion: "個包装 1個 (約80g)", levels: "少:小ぶり / 普:1個 / 多:2個(ボリューミー)",
    cal: 220, salt: 1.0, p: 6.5, f: 8.0, c: 30.5,
    m: true, l: true, d: false, s: true, ln: true,
    memo: "菓子パン系は脂質・糖質上昇に留意"
  },
  {
    id: 5, cat: "主食", name: "うどん",
    portion: "茹で1玉 (約220g) つゆ残し", levels: "少:半玉 / 普:1玉(並) / 多:大盛(1.5玉)",
    cal: 320, salt: 2.2, p: 7.0, f: 1.2, c: 68.0,
    m: true, l: true, d: true, s: false, ln: true,
    memo: "つゆを飲まない前提(約2.2g)。全飲みは約5.5g"
  },
  {
    id: 6, cat: "主食", name: "蕎麦",
    portion: "茹で1玉 (約200g) つゆ残し", levels: "少:半玉 / 普:1玉(並) / 多:大盛(1.5玉)",
    cal: 300, salt: 2.0, p: 10.5, f: 2.0, c: 58.0,
    m: true, l: true, d: true, s: false, ln: true,
    memo: "ルチン（毛細血管保護成分）含有。GI値低め"
  },
  {
    id: 7, cat: "主食", name: "ラーメン",
    portion: "生麺140g＋具 つゆ残し", levels: "少:半麺 / 普:1杯(並) / 多:大盛/替玉",
    cal: 450, salt: 2.4, p: 16.0, f: 14.0, c: 65.0,
    m: false, l: true, d: true, s: false, ln: true,
    memo: "中華そば/家系/二郎系/つけ麺。つゆ残し計算"
  },
  {
    id: 8, cat: "主食", name: "パスタ",
    portion: "乾麺80g＋ソース", levels: "少:60g / 普:80g(1人前) / 多:120g(大盛)",
    cal: 420, salt: 1.8, p: 13.0, f: 11.0, c: 67.0,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "トマトソース基準。カルボナーラ等は脂質＋15g"
  },
  {
    id: 9, cat: "主食", name: "おにぎり",
    portion: "コンビニおにぎり 1個(110g)", levels: "少:ミニ1個 / 普:1個 / 多:大きめ1個",
    cal: 180, salt: 0.5, p: 3.5, f: 0.6, c: 39.5,
    m: true, l: true, d: false, s: true, ln: true,
    memo: "具材（梅・鮭・昆布等）により若干変動"
  },
  {
    id: 10, cat: "主食", name: "餅・シリアル",
    portion: "切り餅2個 / シリアル40g", levels: "少:1個 / 普:2個(40g) / 多:3個以上",
    cal: 170, salt: 0.2, p: 3.0, f: 0.8, c: 37.0,
    m: true, l: false, d: false, s: false, ln: false,
    memo: "消化吸収が速やか。朝のエネルギー補給向き"
  },
  {
    id: 11, cat: "主食", name: "牛丼",
    portion: "並盛 1杯 (ご飯250g+牛肉)", levels: "少:小盛 / 普:並盛 / 多:大盛/特盛",
    cal: 720, salt: 2.5, p: 20.0, f: 23.0, c: 102.0,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "つゆだくは塩分+0.8g。生野菜サラダ追加で相殺推奨"
  },
  {
    id: 12, cat: "主食", name: "天丼",
    portion: "並盛 1杯 (海老・野菜・タレ)", levels: "少:小天丼 / 普:並盛 / 多:特上/大盛",
    cal: 820, salt: 2.8, p: 18.0, f: 28.0, c: 118.0,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "衣の吸油率高め。夕食時はタレの塩分に注意"
  },
  {
    id: 13, cat: "主食", name: "うな丼",
    portion: "うなぎ半身〜1尾＋タレご飯", levels: "少:うな小丼 / 普:並(半身) / 多:上/特上(1尾)",
    cal: 750, salt: 2.2, p: 28.0, f: 24.0, c: 98.0,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "ビタミンA・DHA・EPA豊富。疲労回復効果高"
  },
  {
    id: 53, cat: "主食", name: "チャーハン・炒飯",
    portion: "並盛 1人前 (約300g)", levels: "少:半炒飯 / 普:並盛(1人前) / 多:大盛り",
    cal: 580, salt: 2.5, p: 14.0, f: 18.0, c: 86.0,
    m: false, l: true, d: true, s: false, ln: true,
    memo: "五目炒飯(620kcal) / キムチ炒飯(640kcal)"
  },
  {
    id: 54, cat: "主食", name: "カレーライス",
    portion: "定番ポーク/チキン 1皿", levels: "少:小盛 / 普:並盛(1皿) / 多:大盛/カツカレー",
    cal: 680, salt: 2.8, p: 16.0, f: 20.0, c: 105.0,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "濃厚ビーフ(750kcal) / カツカレー(950kcal)"
  },
  {
    id: 57, cat: "主食", name: "寿司",
    portion: "並・盛り合わせ 8〜10貫", levels: "少:5〜6貫 / 普:8〜10貫(並) / 多:12〜14貫",
    cal: 550, salt: 2.2, p: 24.0, f: 6.0, c: 98.0,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "上特上/赤身・白身/回転寿司/助六。酢飯糖質に留意"
  },
  {
    id: 58, cat: "主食", name: "すき焼き丼",
    portion: "並盛 1杯 (牛肉・豆腐・玉ねぎ)", levels: "少:小盛 / 普:並盛 / 多:大盛",
    cal: 750, salt: 2.8, p: 22.0, f: 22.0, c: 108.0,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "割り下による糖質・塩分を含む。卵でタンパク質強化"
  },
  {
    id: 59, cat: "主食", name: "チャーシュー丼",
    portion: "並盛 1杯 (煮豚・タレ)", levels: "少:ミニ丼 / 普:並盛 / 多:肉増し大盛",
    cal: 680, salt: 2.6, p: 24.0, f: 22.0, c: 92.0,
    m: false, l: true, d: true, s: false, ln: true,
    memo: "豚バラ肉の動物性脂質。ラーメンセット時は半量推奨"
  },

  // 🍲 汁物 (6品)
  {
    id: 14, cat: "汁物", name: "味噌汁",
    portion: "お椀1杯 (汁半分:0.6g / 普通:1.2g)", levels: "少:具のみ / 普:1杯 / 多:大椀",
    cal: 40, salt: 0.6, p: 2.5, f: 1.2, c: 4.5,
    m: true, l: true, d: true, s: false, ln: false,
    memo: "汁半分(減塩・0.6g / 自炊時) / 普通(1.2g / 奥様の手料理・外食定食)"
  },
  {
    id: 15, cat: "汁物", name: "豚汁・けんちん汁",
    portion: "根菜・豚肉具だくさん お椀1杯", levels: "少:小椀 / 普:標準椀 / 多:大椀・おかず椀",
    cal: 120, salt: 1.4, p: 6.5, f: 5.5, c: 10.5,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "ゴボウ・大根・人参で食物繊維・カリウム豊富"
  },
  {
    id: 16, cat: "汁物", name: "コンソメスープ",
    portion: "マグカップ1杯 (約150ml)", levels: "少:少量 / 普:1杯 / 多:大きめ",
    cal: 40, salt: 1.0, p: 1.5, f: 0.5, c: 7.0,
    m: true, l: true, d: true, s: false, ln: true,
    memo: "玉ねぎ・キャベツのカリウムが塩分排泄を補助"
  },
  {
    id: 17, cat: "汁物", name: "中華スープ",
    portion: "中華スープ椀1杯 (約150ml)", levels: "少:少量 / 普:1杯 / 多:大きめ",
    cal: 35, salt: 1.1, p: 1.8, f: 1.0, c: 4.5,
    m: false, l: true, d: true, s: false, ln: true,
    memo: "わかめの水溶性食物繊維（アルギン酸）が血圧を安定"
  },
  {
    id: 18, cat: "汁物", name: "ポタージュ",
    portion: "コーンポタージュ 1杯", levels: "少:少量 / 普:1杯 / 多:2杯",
    cal: 95, salt: 1.0, p: 2.2, f: 3.5, c: 13.5,
    m: true, l: true, d: false, s: false, ln: false,
    memo: "生クリーム・バター由来の脂質を含む"
  },
  {
    id: 56, cat: "汁物", name: "ミネストローネ",
    portion: "トマト野菜煮込み 1杯", levels: "少:少量 / 普:1杯 / 多:具沢山大杯",
    cal: 70, salt: 1.1, p: 2.8, f: 1.8, c: 10.5,
    m: true, l: true, d: true, s: false, ln: true,
    memo: "リコピン（強力抗酸化）・カリウム高含有"
  },

  // 🥩 おかず (19品)
  {
    id: 19, cat: "おかず", name: "焼き魚・煮魚",
    portion: "切り身 1切 (約80〜100g)", levels: "少:小さめ切身 / 普:1切(約90g) / 多:大ぶり/2切",
    cal: 160, salt: 1.1, p: 19.5, f: 8.5, c: 0.8,
    m: true, l: true, d: true, s: false, ln: false,
    memo: "鮭/サバ/ホッケ。オメガ3（EPA・DHA）が血管内皮を修復"
  },
  {
    id: 20, cat: "おかず", name: "刺身・生魚",
    portion: "盛り合わせ (約5〜6切・100g)", levels: "少:3切 / 普:1人前(5〜6切) / 多:舟盛り/多め",
    cal: 130, salt: 0.6, p: 22.0, f: 4.5, c: 0.2,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "赤身(100kcal)/白身(90kcal)/青魚(150kcal)/トロ(180kcal)"
  },
  {
    id: 21, cat: "おかず", name: "鶏唐揚げ・チキン",
    portion: "標準サイズ 3個 (約90g)", levels: "少:1〜2個 / 普:3個 / 多:5個以上",
    cal: 280, salt: 1.0, p: 16.5, f: 18.0, c: 11.0,
    m: false, l: true, d: true, s: false, ln: true,
    memo: "良質な動物性タンパク質。揚げ油の酸化に配慮"
  },
  {
    id: 61, cat: "おかず", name: "焼き鳥・串焼き",
    portion: "串焼き 2本 (約80g)", levels: "少:1本 / 普:2本 / 多:4本",
    cal: 160, salt: 1.2, p: 18.0, f: 8.5, c: 1.2,
    m: false, l: true, d: true, s: false, ln: true,
    memo: "もも(塩/タレ)/ささみ(120kcal)/レバー(110kcal)/皮(300kcal)"
  },
  {
    id: 64, cat: "おかず", name: "サラダチキン",
    portion: "個包装 1パック (約110g)", levels: "少:半量 / 普:1パック / 多:大盛",
    cal: 115, salt: 1.0, p: 24.0, f: 1.5, c: 0.5,
    m: false, l: true, d: true, s: false, ln: true,
    memo: "超高タンパク・低糖質・低脂質。筋肉維持の代表食材"
  },
  {
    id: 22, cat: "おかず", name: "とんかつ・カツ類",
    portion: "ロースかつ 1枚 (約120g)", levels: "少:ハーフ(60g) / 普:1枚(120g) / 多:大判1枚(180g)",
    cal: 450, salt: 1.2, p: 21.0, f: 32.0, c: 16.0,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "ヒレかつ(340kcal/脂質低め)"
  },
  {
    id: 23, cat: "おかず", name: "豚生姜焼・炒め",
    portion: "豚ロース3枚＋玉ねぎキャベツ", levels: "少:肉2枚 / 普:並盛1皿 / 多:肉大盛",
    cal: 260, salt: 1.2, p: 17.5, f: 16.0, c: 9.5,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "ビタミンB1豊富（糖質代謝促進・疲労回復）"
  },
  {
    id: 24, cat: "おかず", name: "ハンバーグ",
    portion: "デミグラス 1個 (約150g)", levels: "少:小(100g) / 普:標準(150g) / 多:大(250g)",
    cal: 380, salt: 1.6, p: 19.0, f: 24.0, c: 18.0,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "チーズイン(460kcal)。脂質高め"
  },
  {
    id: 25, cat: "おかず", name: "牛ステーキ",
    portion: "赤身肉 1枚 (約180g)", levels: "少:120g / 普:200g(標準1枚) / 多:350g(大盛)",
    cal: 360, salt: 1.0, p: 35.0, f: 22.0, c: 1.0,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "サーロイン/リブロース(680kcal/高脂質)"
  },
  {
    id: 55, cat: "おかず", name: "牛焼肉",
    portion: "ロース・赤身肉中心 1人前(100g)", levels: "少:ハーフ / 普:1人前(100g) / 多:肉増し(180g)",
    cal: 240, salt: 1.0, p: 20.0, f: 16.0, c: 3.0,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "カルビ・脂身多め(380kcal)"
  },
  {
    id: 26, cat: "おかず", name: "ホルモン・レバー",
    portion: "ニラレバ/ホルモン 1皿", levels: "少:小鉢 / 普:1皿 / 多:大盛り",
    cal: 250, salt: 1.2, p: 18.0, f: 16.0, c: 6.5,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "レバー(高鉄分・140kcal) / ホルモン(280kcal)"
  },
  {
    id: 27, cat: "おかず", name: "卵・たまご料理",
    portion: "生卵 1個 (約60g)", levels: "少:半量 / 普:1個(標準) / 多:2個",
    cal: 76, salt: 0.2, p: 6.5, f: 5.4, c: 0.2,
    m: true, l: true, d: true, s: false, ln: false,
    memo: "生卵/半熟/ゆで卵(各76kcal)/目玉焼き(95kcal)/だし巻き(110kcal)"
  },
  {
    id: 65, cat: "おかず", name: "チーズ",
    portion: "スライス1枚 / 個包装1個 (約20g)", levels: "少:10g(ハーフ) / 普:20g(1枚/個) / 多:40g(2枚/ピザ用)",
    cal: 63, salt: 0.6, p: 4.5, f: 5.2, c: 0.3,
    m: true, l: true, d: true, s: true, ln: true,
    memo: "スライス・ベビー/とろける(66kcal)/カマンベール(62kcal/0.4g)。カルシウム補給"
  },
  {
    id: 66, cat: "おかず", name: "明太子",
    portion: "半腹・一口大 (約25g)", levels: "少:12g(一口) / 普:25g(半腹) / 多:50g(1本)",
    cal: 30, salt: 1.4, p: 5.3, f: 0.8, c: 0.8,
    m: true, l: true, d: true, s: false, ln: true,
    memo: "高タンパクだが塩分・プリン体高め。高血圧時は『少なめ』推奨"
  },
  {
    id: 28, cat: "おかず", name: "納豆",
    portion: "1パック タレ半分使用 (約45g)", levels: "少:半パック / 普:1パック / 多:2パック",
    cal: 90, salt: 0.3, p: 7.4, f: 4.5, c: 5.4,
    m: true, l: true, d: true, s: false, ln: false,
    memo: "タレ半分で減塩(0.3g)。ナットウキナーゼで血栓予防"
  },
  {
    id: 29, cat: "おかず", name: "豆腐・冷奴・厚揚げ",
    portion: "絹・木綿冷奴 半丁 (約150g)", levels: "少:一口サイズ / 普:半丁(150g) / 多:1丁",
    cal: 90, salt: 0.4, p: 8.0, f: 4.8, c: 3.0,
    m: true, l: true, d: true, s: false, ln: true,
    memo: "植物性タンパク質・マグネシウム豊富"
  },
  {
    id: 60, cat: "おかず", name: "麻婆豆腐",
    portion: "家庭風 1人前 (約180g)", levels: "少:小鉢 / 普:1人前(180g) / 多:大皿盛",
    cal: 280, salt: 2.2, p: 14.0, f: 18.0, c: 12.0,
    m: false, l: true, d: true, s: false, ln: true,
    memo: "本格四川(340kcal) / 麻婆茄子(320kcal)"
  },
  {
    id: 30, cat: "おかず", name: "餃子・焼売",
    portion: "焼き餃子 1皿 (5〜6個・約120g)", levels: "少:3個 / 普:1皿(5〜6個) / 多:2皿/大皿",
    cal: 220, salt: 1.1, p: 8.5, f: 11.5, c: 20.0,
    m: false, l: true, d: true, s: false, ln: true,
    memo: "水餃子(200kcal) / 焼売・点心(200kcal)"
  },
  {
    id: 32, cat: "おかず", name: "生野菜サラダ",
    portion: "中皿1杯 ノンドレ/薄掛け", levels: "少:小鉢 / 普:中皿1杯 / 多:特大ボウル",
    cal: 35, salt: 0.4, p: 1.2, f: 0.3, c: 6.5,
    m: true, l: true, d: true, s: false, ln: false,
    memo: "ベジファーストで食後血糖値スパイクを強力抑制"
  },
  {
    id: 33, cat: "おかず", name: "温野菜・ブロッコリー",
    portion: "小鉢1皿 (約80g)", levels: "少:一口 / 普:小鉢1皿 / 多:山盛り",
    cal: 40, salt: 0.3, p: 3.5, f: 0.5, c: 5.2,
    m: true, l: true, d: true, s: false, ln: false,
    memo: "スルフォラファン含有。血管内皮の解毒酵素活性化"
  },
  {
    id: 34, cat: "おかず", name: "おひたし・和小鉢",
    portion: "ほうれん草/小松菜 1小鉢", levels: "少:一口 / 普:1小鉢 / 多:2小鉢",
    cal: 30, salt: 0.5, p: 2.0, f: 0.3, c: 4.5,
    m: true, l: true, d: true, s: false, ln: false,
    memo: "カリウム・葉酸の宝庫。ナトリウム排泄を促進"
  },
  {
    id: 35, cat: "おかず", name: "きんぴら・ひじき煮",
    portion: "小鉢1皿 (約50g)", levels: "少:一口 / 普:1小鉢 / 多:大盛り",
    cal: 65, salt: 0.6, p: 1.5, f: 1.8, c: 9.8,
    m: true, l: true, d: true, s: false, ln: false,
    memo: "食物繊維（不溶性・水溶性）バランス良好"
  },
  {
    id: 36, cat: "おかず", name: "ポテトサラダ",
    portion: "小鉢1盛 (約70g)", levels: "少:一口 / 普:1盛 / 多:大盛り",
    cal: 140, salt: 0.6, p: 2.0, f: 8.5, c: 13.5,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "マヨネーズ由来の脂質を含むため主食扱いに近い"
  },
  {
    id: 37, cat: "おかず", name: "漬物・キムチ",
    portion: "小皿1盛 (約30g)", levels: "少:一口 / 普:1盛 / 多:多め",
    cal: 20, salt: 1.0, p: 1.0, f: 0.2, c: 3.5,
    m: true, l: true, d: true, s: false, ln: true,
    memo: "植物性乳酸菌（プロバイオティクス）。塩分注意"
  },
  {
    id: 38, cat: "おかず", name: "コロッケ・揚物",
    portion: "コロッケ 1個 (約80g)", levels: "少:ハーフ / 普:1個 / 多:2個以上",
    cal: 200, salt: 0.8, p: 3.5, f: 11.0, c: 21.0,
    m: false, l: true, d: true, s: false, ln: false,
    memo: "糖質＋脂質の組み合わせ。夕食時は控えめ推奨"
  },
  {
    id: 63, cat: "おかず", name: "ヨーグルト",
    portion: "小カップ 1個 (約100g)", levels: "少:半量 / 普:1カップ / 多:2個",
    cal: 65, salt: 0.1, p: 3.6, f: 3.0, c: 5.5,
    m: true, l: true, d: false, s: true, ln: false,
    memo: "乳酸菌で腸内環境改善。カルシウム豊富で血圧安定"
  },
  {
    id: 39, cat: "おかず", name: "残り物惣菜",
    portion: "家庭の小鉢 1品", levels: "少:一口 / 普:1品 / 多:大盛り",
    cal: 150, salt: 0.8, p: 6.0, f: 7.0, c: 14.0,
    m: true, l: true, d: true, s: false, ln: true,
    memo: "一般的な家庭料理の平均マクロ栄養素を適用"
  },

  // ☕ 飲料 (5品)
  {
    id: 40, cat: "飲料", name: "コーヒー",
    portion: "ブラック 1杯 (約150ml)", levels: "少:半杯 / 普:1杯 / 多:大マグ",
    cal: 5, salt: 0.0, p: 0.3, f: 0.0, c: 0.9,
    m: true, l: true, d: true, s: true, ln: true,
    memo: "ブラック/ミルク/豆乳/アーモンド/ココア。リフレッシュ"
  },
  {
    id: 41, cat: "飲料", name: "ノンアルソーダ",
    portion: "グラス/缶 1本 (約350ml)", levels: "少:グラス半 / 普:1本 / 多:2本",
    cal: 15, salt: 0.0, p: 0.0, f: 0.0, c: 3.5,
    m: true, l: true, d: true, s: true, ln: true,
    memo: "休肝日の代替飲料として交感神経の興奮を抑制"
  },
  {
    id: 42, cat: "飲料", name: "ヤクルト",
    portion: "1本 (約65ml)", levels: "少:1本 / 普:1本 / 多:2本",
    cal: 50, salt: 0.0, p: 0.8, f: 0.1, c: 11.5,
    m: true, l: true, d: false, s: true, ln: false,
    memo: "乳酸菌シロタ株。腸内環境・自律神経の調整"
  },
  {
    id: 43, cat: "飲料", name: "野菜ジュース",
    portion: "紙パック 1本 (約200ml)", levels: "少:半杯 / 普:1本(200ml) / 多:2本",
    cal: 70, salt: 0.1, p: 1.5, f: 0.2, c: 15.5,
    m: true, l: true, d: true, s: true, ln: true,
    memo: "カリウム高含有(約400〜600mg)。塩分排出に直結"
  },
  {
    id: 44, cat: "飲料", name: "オロナミンC",
    portion: "1瓶 (約120ml)", levels: "少:1瓶 / 普:1瓶 / 多:2瓶",
    cal: 79, salt: 0.0, p: 0.0, f: 0.0, c: 19.0,
    m: true, l: true, d: false, s: true, ln: true,
    memo: "ビタミンB2・B6・C含有。糖質中心"
  },

  // 🍪 間食 (6品)
  {
    id: 62, cat: "間食", name: "果物・バナナ",
    portion: "バナナ1本 / りんご半分 (約100g)", levels: "少:一口 / 普:1本(100g) / 多:2本(200g)",
    cal: 80, salt: 0.0, p: 1.0, f: 0.2, c: 20.0,
    m: true, l: true, d: false, s: true, ln: false,
    memo: "カリウム高含有(360mg)。ナトリウム排泄を直接促す降圧食材"
  },
  {
    id: 45, cat: "間食", name: "チョコレート",
    portion: "個包装 2〜3枚 (約25g)", levels: "少:一口(1枚) / 普:2〜3枚 / 多:板チョコ半枚",
    cal: 140, salt: 0.0, p: 1.8, f: 9.0, c: 13.0,
    m: false, l: false, d: false, s: true, ln: false,
    memo: "カカオポリフェノール（血管拡張・降圧作用）"
  },
  {
    id: 46, cat: "間食", name: "スナック菓子",
    portion: "小袋 1袋 (約30g)", levels: "少:一口 / 普:小袋(30g) / 多:大袋半量",
    cal: 165, salt: 0.4, p: 1.5, f: 9.8, c: 17.5,
    m: false, l: false, d: false, s: true, ln: false,
    memo: "油分と塩分が重なるため夕食の減塩で相殺推奨"
  },
  {
    id: 47, cat: "間食", name: "和菓子・せんべい",
    portion: "大福1個 / せんべい2枚", levels: "少:半個 / 普:1個(2枚) / 多:2個以上",
    cal: 130, salt: 0.3, p: 2.2, f: 0.5, c: 29.0,
    m: false, l: false, d: false, s: true, ln: false,
    memo: "洋菓子に比べ脂質が極めて低い（脂質異常症に有利）"
  },
  {
    id: 51, cat: "間食", name: "ショートケーキ",
    portion: "カットケーキ 1個", levels: "少:小さめ / 普:1個 / 多:大ぶり",
    cal: 340, salt: 0.2, p: 4.5, f: 22.0, c: 31.0,
    m: false, l: false, d: false, s: true, ln: false,
    memo: "生クリームの飽和脂肪酸。夕食は赤身魚や和食推奨"
  },
  {
    id: 52, cat: "間食", name: "アイスクリーム",
    portion: "カップアイス 1個 (約100ml)", levels: "少:ミニ / 普:1個 / 多:大型カップ",
    cal: 180, salt: 0.1, p: 3.5, f: 9.0, c: 21.0,
    m: false, l: false, d: false, s: true, ln: false,
    memo: "ラクトアイスより乳脂肪分高めの純アイスが良質"
  },

  // 🍜 夜食 (3品)
  {
    id: 48, cat: "夜食", name: "カップ麺",
    portion: "ミニ〜普通サイズ つゆ残し", levels: "少:ミニ / 普:普通カップ / 多:大盛",
    cal: 350, salt: 2.5, p: 7.5, f: 14.0, c: 48.0,
    m: false, l: false, d: false, s: false, ln: true,
    memo: "就寝直前は消化管負担。つゆ残し必須"
  },
  {
    id: 49, cat: "夜食", name: "お茶漬け・雑炊",
    portion: "お茶碗1杯 (約150g)", levels: "少:軽め / 普:1杯 / 多:丼盛り",
    cal: 180, salt: 1.2, p: 4.0, f: 0.5, c: 39.0,
    m: false, l: false, d: false, s: false, ln: true,
    memo: "サラサラ食べられるが咀嚼を意識して満腹中枢刺激"
  },
  {
    id: 50, cat: "夜食", name: "おつまみ・ナッツ",
    portion: "ミックスナッツ/チーズ等", levels: "少:小袋 / 普:1皿 / 多:多め",
    cal: 160, salt: 0.6, p: 5.5, f: 12.0, c: 7.5,
    m: false, l: false, d: false, s: true, ln: true,
    memo: "無塩ナッツなら良質な不飽和脂肪酸を補給可能"
  }
];

// スマホ側（mobile_logic.js）の初期メニュー配列として完全互換提供
const DEFAULT_50_MENUS = COMPREHENSIVE_FOOD_DICT.map(it => ({
  id: it.id,
  cat: it.cat,
  name: it.name,
  m: it.m,
  l: it.l,
  d: it.d,
  s: it.s !== undefined ? it.s : false,
  ln: it.ln,
  cal: it.cal,
  salt: it.salt
}));