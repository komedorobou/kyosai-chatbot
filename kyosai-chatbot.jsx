import { useState, useRef, useEffect, useCallback } from "react";

// ============================================================
// 知識ベース（インライン化）
// ============================================================

const ADULT_PLANS = [
  { type:"1型",cat:"大人のセット型",mp:11500,hosp:{ij:10000,ca:14250,ac:18500,tr:33500},out:{il:5000,ia:5000,cs:2500,tr:7500,ta:5000,tc:3750},death:{ij:2500,ac:4000,tr:5000},disab:"1,350万〜60万/2,700万〜120万/3,600万〜160万",surg:60000,u40:18000},
  { type:"2型",cat:"大人のセット型",mp:10370,hosp:{ij:9000,ca:13250,ac:17500,tr:29500},out:{il:4500,ia:4500,cs:2250,tr:6000,ta:4500,tc:3000},death:{ij:2250,ac:3600,tr:4400},disab:"1,215万〜54万/2,430万〜108万/3,150万〜140万",surg:60000,u40:16200},
  { type:"3型",cat:"大人のセット型",mp:9110,hosp:{ij:9000,ca:12750,ac:16500,tr:28500},out:{il:4500,ia:4500,cs:2250,tr:6000,ta:4500,tc:3000},death:{ij:1840,ac:3100,tr:3900},disab:"1,134万〜50万4千/2,268万〜100万8千/2,988万〜132万8千",surg:60000,u40:13240},
  { type:"4型",cat:"大人のセット型",mp:8070,hosp:{ij:7000,ca:10500,ac:14000,tr:23000},out:{il:3500,ia:3500,cs:1750,tr:4500,ta:3500,tc:2250},death:{ij:1710,ac:2800,tr:3400},disab:"981万〜43万6千/1,962万〜87万2千/2,502万〜111万2千",surg:60000,u40:12310},
  { type:"5型",cat:"大人のセット型",mp:6880,hosp:{ij:6000,ca:8750,ac:11500,tr:20500},out:{il:3000,ia:3000,cs:1500,tr:4500,ta:3000,tc:2250},death:{ij:1500,ac:2400,tr:3000},disab:"810万〜36万/1,620万〜72万/2,160万〜96万",surg:30000,u40:10800},
  { type:"6型",cat:"大人のセット型",mp:5740,hosp:{ij:4000,ca:6000,ac:8000,tr:14000},out:{il:2000,ia:2000,cs:1000,tr:3000,ta:2000,tc:1500},death:{ij:1300,ac:2200,tr:2600},disab:"810万〜36万/1,620万〜72万/1,980万〜88万",surg:30000,u40:9360},
  { type:"7型",cat:"大人のセット型",mp:4630,hosp:{ij:5000,ca:7500,ac:10000,tr:16000},out:{il:2500,ia:2500,cs:1250,tr:3000,ta:2500,tc:1500},death:{ij:850,ac:1400,tr:1800},disab:"495万〜22万/990万〜44万/1,350万〜60万",surg:60000,u40:6120},
  { type:"8型",cat:"大人のセット型",mp:3330,hosp:{ij:5000,ca:7250,ac:9500,tr:15500},out:{il:2500,ia:2500,cs:1250,tr:3000,ta:2500,tc:1500},death:{ij:500,ac:900,tr:1300},disab:"360万〜16万/720万〜32万/1,080万〜48万",surg:30000,u40:3600},
  { type:"9型",cat:"大人のセット型",mp:2230,hosp:{ij:3000,ca:4500,ac:6000,tr:12000},out:{il:1500,ia:1500,cs:750,tr:3000,ta:1500,tc:1500},death:{ij:310,ac:600,tr:1000},disab:"261万〜11万6千/522万〜23万2千/882万〜39万2千",surg:30000,u40:2230},
  { type:"10型",cat:"大人のセット型",mp:1140,hosp:{ij:2000,ca:3000,ac:4000,tr:7000},out:{il:1000,ia:1000,cs:500,tr:1500,ta:1000,tc:750},death:{ij:100,ac:200,tr:400},disab:"90万〜4万/180万〜8万/360万〜16万",surg:30000,u40:720},
];

const MEDICAL_PLANS = [
  { type:"A型",cat:"医療重視",mp:3280,hosp:{ij:10000,ca:11000,ac:12000,tr:15000},out:{il:5000,ia:5000,cs:2500,tr:1500,ta:5000,tc:750},death:{ij:200,ac:300,tr:500},disab:"90万〜4万/180万〜8万/360万〜16万",surg:60000,u40:1440},
  { type:"B型",cat:"医療重視",mp:2860,hosp:{ij:8000,ca:9000,ac:10000,tr:13000},out:{il:4000,ia:4000,cs:2000,tr:1500,ta:4000,tc:750},death:{ij:200,ac:300,tr:500},disab:"90万〜4万/180万〜8万/360万〜16万",surg:60000,u40:1440},
  { type:"C型",cat:"医療重視",mp:2050,hosp:{ij:5000,ca:6000,ac:7000,tr:10000},out:{il:2500,ia:2500,cs:1250,tr:1500,ta:2500,tc:750},death:{ij:200,ac:300,tr:500},disab:"90万〜4万/180万〜8万/360万〜16万",surg:30000,u40:1440},
  { type:"D型",cat:"医療重視",mp:1840,hosp:{ij:4000,ca:5000,ac:6000,tr:9000},out:{il:2000,ia:2000,cs:1000,tr:1500,ta:2000,tc:750},death:{ij:200,ac:300,tr:500},disab:"90万〜4万/180万〜8万/360万〜16万",surg:30000,u40:1440},
  { type:"E型",cat:"医療重視",mp:1630,hosp:{ij:3000,ca:4000,ac:5000,tr:8000},out:{il:1500,ia:1500,cs:750,tr:1500,ta:1500,tc:750},death:{ij:200,ac:300,tr:500},disab:"90万〜4万/180万〜8万/360万〜16万",surg:30000,u40:1440},
];

const CHILD_PLANS = [
  { type:"C1型",cat:"子ども",mp:2830,hosp:{ij:5000,ca:7500,ac:10000,tr:22000},out:{il:2500,ia:2500,cs:1250,tr:6000,ta:2500,tc:3000},death:{ij:500,ac:800,tr:1600},disab:"270万〜12万/540万〜24万/1,260万〜56万",surg:60000,u40:1800},
  { type:"C2型",cat:"子ども",mp:1690,hosp:{ij:3000,ca:4500,ac:6000,tr:15000},out:{il:1500,ia:1500,cs:750,tr:4500,ta:1500,tc:2250},death:{ij:300,ac:400,tr:1000},disab:"90万〜4万/180万〜8万/720万〜32万",surg:30000,u40:1080},
  { type:"C3型",cat:"子ども",mp:960,hosp:{ij:2000,ca:3000,ac:4000,tr:7000},out:{il:1000,ia:1000,cs:500,tr:1500,ta:1000,tc:750},death:{ij:100,ac:200,tr:400},disab:"90万〜4万/180万〜8万/360万〜16万",surg:30000,u40:360},
  { type:"C4型",cat:"子ども",mp:710,hosp:{ij:1000,ca:1500,ac:2000,tr:5000},out:{il:500,ia:500,cs:250,tr:1500,ta:500,tc:750},death:{ij:100,ac:200,tr:400},disab:"90万〜4万/180万〜8万/360万〜16万",surg:30000,u40:360},
];

const KNOWLEDGE = {
  system_overview: `【制度概要】自治労連セット共済は組合員の助け合い制度。掛金の70%が給付（民間生保は10〜20%）。年齢・性別関係なく掛金一律。日帰り〜180日入院保障。通院のみ（入院なし）でも連続5日以上の安静加療診断で90日限度保障。病気後遺障害も労基法1〜14級保障。加入後の慢性疾患でも同型なら継続OK。診断書料補助1期間2通まで各5,000円。剰余金は加入者に還元。年末所得税控除対象外。`,
  eligibility: `【加入条件】組合員とその配偶者・子ども（本人加入が条件）。健康告知・重度障害に非該当。0〜60歳。61歳以上は新規不可。60歳まで加入なら61〜65歳未満継続可（7〜10型・C〜E型のみ）。0歳はC3・C4型のみ。【健康告知】①慢性疾患り患中②休業・安静加療中③前30日に通算14日以上休業④前180日に連続14日以上⑤前1年に連続30日以上⑥前1年に開頭開胸開腹等手術⑦0歳特則あり。完治証明書で加入可。共済期間1年・中途変更解約不可。夫婦二重加入不可。`,
  claims: `【給付手続き】ケガ病気→組合連絡。交通事故→すぐ警察届出（自転車自損も）。請求書＋書類を組合提出。【必要書類】入通院：所定診断書＋事故報告書（不慮）＋交通事故証明書（交通）。死亡：死亡診断書＋戸籍謄本＋印鑑証明＋事故報告書。後遺障害：所定診断書＋後遺障害等級認定票写し。診断書料補助1期間2通5,000円/通。時効3年。`,
  exclusions: `【免責】犯罪行為、故意重過失、美容整形、正常分娩、1年後リハビリ入院、アルコール依存2回目以降、薬物、戦争、3年時効、効力前既往の後遺障害、自殺後遺障害、闘争行為。不慮追加：効力前既往、信号無視踏切、事故日2年後入院。交通追加：無免許飲酒薬物運転、速度違反信号無視、タクシー運転中、職業運転、天災、むち打ち他覚症状なし、海外事故、証明書なし。接骨院：不慮は安静加療5日指示後、交通は医師診断後。鍼灸カイロ対象外。`,
  chronic: `【慢性疾患】該当：糖尿病、高血圧、不整脈、子宮内膜症、卵巣のう腫、脂肪肝、大腸ポリープ、てんかん、潰瘍性大腸炎、精神疾患、がん等。非該当：痛風、喘息、結石、高脂血症、アトピー、橋本病、痔、ヘルニア、バセドウ病、前立腺肥大、緑内障白内障、十二指腸潰瘍。加入後の慢性疾患でも同型継続OK。子宮筋腫は2023年改定で申告不要＋給付対象。`,
  children: `【子どもの加入】C1型月2,830円/C2型月1,690円/C3型月960円/C4型月710円。0歳はC3・C4のみ。19歳移行（慢性疾患中）：C1→8,9,10,C,D,E型/C2→9,10,E型/C3→10型/C4→10型。保障増の型はチェックシート必要。`,
  u40: `【サポートU40】40歳以下対象の掛金軽減。年額：1型18,000/2型16,200/3型13,240/4型12,310/5型10,800/6型9,360/7型6,120/8型3,600/9型2,230/10型720/A〜E型各1,440/C1型1,800/C2型1,080/C3・C4型各360円。`,
  surgery: `【手術見舞金】診療報酬3,000点以上が対象。型により30,000円or60,000円（入院不要でも給付）。3,000点未満でも対象：子宮内容除去術、放射線照射（5週間50グレイ以上）。60日1回限度：レーザー眼球手術、温熱療法、結石破砕、内視鏡カテーテル手術、放射線照射。がん対象外：上皮内癌、良性腫瘍等。`,
  examples: `【支払事例】①めばちこ→網膜剥離日帰り手術(C型月2,050円)：合計35,000円 ②帝王切開(7型月4,630円)：入院11日＋通院＋手術＝122,500円 ③人工透析(6型月5,740円)：入院27日＋後遺障害7級＝4,652,000円 ④転倒足首5日通院(8型月3,330円)：17,500円 ⑤子どもバスケ靭帯6日(C3型月960円)：11,000円。検査入院(健保適用)も対象。ドナー見舞金あり。`,
  retirement: `【退職・シニア】退職後は既往症問わずシニア共済移行可。80歳で医療終身型選択可。`,
  accidents: `【不慮の事故】急激・偶然・外因性。除外：スキューバ、パラグライダー、バンジー、山岳登はん、だんじり等。交通事故は180日限度。骨折特例：鎖骨肋骨脊椎骨盤上下肢の骨折脱臼腱断裂は安静加療要件不要。`,
};

const CATEGORY_KEYWORDS = {
  plan_details:["型","掛金","月額","保障","保障内容","入院","通院","日額","いくら","何円","プラン","コース","料金"],
  plan_comparison:["比較","違い","どっち","おすすめ","どれ","選び方","どの型","迷"],
  eligibility:["加入","条件","入れる","健康告知","告知","年齢","申込","新規","配偶者","家族","申し込"],
  claims:["給付","手続き","請求","書類","診断書","申請","もらえる","届出","受け取"],
  exclusions:["免責","対象外","払えない","支払不可","除外","できない","ダメ","だめ","無効"],
  system_overview:["概要","特長","仕組み","制度","自治労連","共済とは","メリット","還元","民間","安い"],
  chronic:["慢性","持病","糖尿病","高血圧","うつ","精神","がん","慢性疾患","子宮筋腫","疾患","病気"],
  children:["子ども","子供","こども","C1","C2","C3","C4","移行","19歳","0歳","赤ちゃん"],
  u40:["U40","サポート","40歳","若い","若年","軽減","割引"],
  surgery:["手術","見舞金","手術見舞金","Kコード","診療報酬","点数","帝王切開"],
  examples:["事例","例","ケース","こんな時","実際","シミュレーション","計算"],
  retirement:["退職","シニア","65歳","80歳","終身","辞める"],
  accidents:["事故","不慮","交通","骨折","ギプス","整骨院","接骨院","スポーツ","転倒","ケガ","怪我"],
};

// ============================================================
// カテゴリ判定ロジック
// ============================================================
function detectCategories(query, conversationHistory) {
  const scores = {};
  const q = query.toLowerCase();

  // 現在のメッセージからキーワード検出
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (q.includes(kw.toLowerCase())) score++;
    }
    if (score > 0) scores[cat] = score;
  }

  // 会話履歴にプラン相談の文脈があるかチェック
  // 直近のやり取りで「おすすめ」「検討」「どの型」等があれば plan_comparison を維持
  if (conversationHistory && conversationHistory.length > 0) {
    const recentTexts = conversationHistory.slice(-6).map(m => m.content).join(" ").toLowerCase();
    const comparisonContext = /おすすめ|検討|どの型|比較|選び方|迷|予算|掛金|月額|重視/.test(recentTexts);
    if (comparisonContext) {
      scores["plan_comparison"] = (scores["plan_comparison"] || 0) + 3;
    }
  }

  const sorted = Object.entries(scores).sort((a,b) => b[1] - a[1]);
  if (sorted.length === 0) return ["system_overview"];
  const top = sorted.slice(0, 3).map(s => s[0]);
  return top;
}

// ============================================================
// プラン情報をテキスト化
// ============================================================
function formatPlan(p) {
  return `【${p.type}】月掛金${p.mp.toLocaleString()}円
入院日額：病気ケガ${p.hosp.ij.toLocaleString()}円/がん${p.hosp.ca.toLocaleString()}円/不慮${p.hosp.ac.toLocaleString()}円/交通${p.hosp.tr.toLocaleString()}円
通院日額：病気${p.out.il.toLocaleString()}円/ケガ不慮${p.out.ia.toLocaleString()}円/ギプス${p.out.cs.toLocaleString()}円/交通${p.out.tr.toLocaleString()}円/交通加算${p.out.ta.toLocaleString()}円
死亡重度障害：病気ケガ${p.death.ij.toLocaleString()}万円/不慮${p.death.ac.toLocaleString()}万円/交通${p.death.tr.toLocaleString()}万円
後遺障害(3-14級)：${p.disab}
手術見舞金：${p.surg.toLocaleString()}円 / サポートU40：${p.u40.toLocaleString()}円/年`;
}

function formatPlanCompact(p) {
  return `${p.type}：月${p.mp.toLocaleString()}円／入院${p.hosp.ij.toLocaleString()}円／がん${p.hosp.ca.toLocaleString()}円／通院${p.out.il.toLocaleString()}円／死亡${p.death.ij.toLocaleString()}万円／手術${p.surg.toLocaleString()}円／U40:${p.u40.toLocaleString()}円`;
}

function buildContext(categories, query) {
  let ctx = "";
  const needPlans = categories.some(c => ["plan_details","plan_comparison","u40"].includes(c));
  const mentionsChild = /子ども|子供|こども|C[1-4]|0歳/.test(query);
  const mentionsMedical = /医療重視|A型|B型|[^C]D型|[^C]E型/.test(query);

  if (needPlans) {
    // 特定の型名が言及されてるか
    const mentionedTypes = [];
    const allPlans = [...ADULT_PLANS, ...MEDICAL_PLANS, ...CHILD_PLANS];
    for (const p of allPlans) {
      if (query.includes(p.type)) mentionedTypes.push(p);
    }
    if (mentionedTypes.length > 0) {
      ctx += "\n【該当プラン詳細】\n" + mentionedTypes.map(formatPlan).join("\n\n");
    } else {
      // 全型を簡潔一覧で（入院日額/がん/通院/死亡/手術/U40）
      ctx += "\n【大人のセット型（1〜10型）月掛金/入院日額(病気ケガ)/がん/通院(病気)/死亡(病気ケガ)/手術見舞金/U40】\n" + ADULT_PLANS.map(formatPlanCompact).join("\n");
      if (mentionsMedical || !mentionsChild) {
        ctx += "\n\n【医療重視プラン（A〜E型）死亡保障は全型200万円固定】\n" + MEDICAL_PLANS.map(formatPlanCompact).join("\n");
      }
      if (mentionsChild || categories.includes("children")) {
        ctx += "\n\n【子どものセット型（C1〜C4型）】\n" + CHILD_PLANS.map(formatPlanCompact).join("\n");
      }
    }
  }
  for (const cat of categories) {
    if (KNOWLEDGE[cat]) ctx += "\n\n" + KNOWLEDGE[cat];
  }
  return ctx;
}

// ============================================================
// システムプロンプト
// ============================================================
const BASE_SYSTEM = `あなたは「自治労連セット共済」の案内チャットボットです。岸和田市職員労働組合の組合員向けに案内してください。

【型の分類（これ以外は存在しない。参照データにない型名や数字は絶対に出さない）】
①大人のセット型：1型〜10型（全10種）
②医療重視プラン：A型〜E型（全5種）※入院通院が手厚く死亡保障は一律200万円
③子どものセット型：C1型〜C4型（全4種）

【回答ルール】
- 親しみやすい口調で答える
- 掛金・保障額は参照データの数字をそのまま使う。概算・推定・計算は禁止
- 参照データにない情報は「組合までお問い合わせください」と案内
- 問い合わせ先として電話番号や「大阪自治労連事業本部」の名称は出さない。「組合までお問い合わせください」に統一
- 長くなりすぎず要点をまとめる

【おすすめ提案のルール】
- 1つずつ質問する：年齢→家族構成→重視ポイント→予算→まとめて提案
- 年齢を聞いた時点で加入可否を判定（61歳以上は新規不可、65歳以上はシニア共済を案内）。加入できないなら次へ進まない
- 予算を1円でも超える型は提案しない
- 予算内の型は省略せず全て提示する
- 重視ポイントに最も合致する型を一番のおすすめにする（入院重視→入院日額最高の型、安さ重視→最安の型）
- 独身→死亡保障は優先度低い。医療重視プラン（A〜E型）を積極的に勧める。「バランスよく」でも独身なら医療重視寄り
- 配偶者・子どもあり→死亡保障も重要。大人のセット型を勧める

【具体的な状況相談】
ユーザーが「入院した」「通院してる」「手術した」等の自分の状況を話した場合は、一般論ではなく、その状況に該当する具体的な保障額と手続き（必要書類）を案内する。型不明なら先に確認する

【選択肢の書き方】
ユーザーに選択肢から選んでもらうときだけ行頭に「▶」を付ける。
自由回答の質問や説明リストには「▶」を使わない。`;

// ============================================================
// UI コンポーネント
// ============================================================

const SUGGESTED_QUESTIONS = [
  "セット共済ってどんな制度？",
  "おすすめの型を検討したい",
  "加入条件を教えて",
  "持病があっても入れる？",
  "手術見舞金はいくら？",
  "給付の手続き方法は？",
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, typingText]);

  // タイピングエフェクト
  const typeOut = useCallback((fullText) => {
    return new Promise((resolve) => {
      setIsTyping(true);
      setTypingText("");
      let i = 0;
      const speed = 20; // ms per char
      const tick = () => {
        if (i < fullText.length) {
          // 数文字ずつ出す（自然な速度）
          const chunk = fullText.slice(i, i + Math.ceil(Math.random() * 3 + 1));
          i += chunk.length;
          setTypingText(fullText.slice(0, i));
          setTimeout(tick, speed + Math.random() * 15);
        } else {
          setIsTyping(false);
          setTypingText("");
          resolve(fullText);
        }
      };
      tick();
    });
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading || isTyping) return;
    const userMsg = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setShowSuggestions(false);
    setLoading(true);

    try {
      const cats = detectCategories(text, messages);
      const context = buildContext(cats, text);

      // 全会話からユーザーが伝えた情報を抽出してsystem promptに含める
      const allTexts = messages.map(m => m.content).join(" ") + " " + text;
      const userTexts = messages.filter(m => m.role === "user").map(m => m.content).join(" ") + " " + text;
      let userProfile = "";

      // 年齢の抽出
      const ageMatch = userTexts.match(/(\d{1,3})歳/);
      if (ageMatch) {
        userProfile += "年齢: " + ageMatch[1] + "歳\n";
      } else {
        // 数字だけの発言を年齢として拾う（0-100の範囲）
        const nums = messages.filter(m => m.role === "user").map(m => m.content.trim());
        for (const n of nums) {
          if (/^\d{1,3}$/.test(n) && Number(n) <= 100) {
            userProfile += "年齢: " + n + "歳\n";
            break;
          }
        }
      }

      // 家族構成の抽出
      if (allTexts.indexOf("独身") >= 0 || userTexts.indexOf("一人") >= 0) userProfile += "家族構成: 独身\n";
      else if (allTexts.indexOf("子どもあり") >= 0 || allTexts.indexOf("子供あり") >= 0) userProfile += "家族構成: 配偶者・子どもあり\n";
      else if (allTexts.indexOf("配偶者あり") >= 0 || userTexts.indexOf("既婚") >= 0) userProfile += "家族構成: 配偶者あり\n";

      // 重視ポイントの抽出
      if (userTexts.indexOf("安さ") >= 0 || userTexts.indexOf("安く") >= 0 || userTexts.indexOf("安い") >= 0) userProfile += "重視: 掛金の安さ\n";
      else if (userTexts.indexOf("入院") >= 0 || userTexts.indexOf("医療") >= 0) userProfile += "重視: 入院・通院保障\n";
      else if (userTexts.indexOf("バランス") >= 0) userProfile += "重視: バランス\n";
      else if (userTexts.indexOf("死亡") >= 0) userProfile += "重視: 死亡保障\n";

      // 予算の抽出（ユーザー発言から最新の金額を拾う）
      const userMsgs = [...messages.filter(m => m.role === "user").map(m => m.content), text];
      let latestBudget = "";
      for (const msg of userMsgs) {
        const yenMatch = msg.match(/(\d[\d,]*)円/);
        if (yenMatch) latestBudget = yenMatch[1].replace(/,/g, "");
        else if (/^\d{3,6}$/.test(msg.trim())) latestBudget = msg.trim();
      }
      if (latestBudget) {
        userProfile += "予算: 月" + Number(latestBudget).toLocaleString() + "円以内\n";
      }

      let systemPrompt = BASE_SYSTEM;
      if (userProfile) {
        systemPrompt += `\n\n【この会話で判明しているユーザー情報（既に聞いた情報は再度聞かないこと）】\n${userProfile}`;
      }
      systemPrompt += "\n\n【参照データ】" + context;

      const recentHistory = messages.slice(-12);
      const apiMessages = [
        ...recentHistory.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: text.trim() }
      ];

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: systemPrompt,
          messages: apiMessages,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "API error");
      }

      const assistantText = data.content
        ?.filter(b => b.type === "text")
        .map(b => b.text)
        .join("\n") || "すみません、回答を生成できませんでした。";

      setLoading(false);

      // タイピングエフェクトで表示
      await typeOut(assistantText);
      setMessages(prev => [...prev, { role: "assistant", content: assistantText }]);

    } catch (err) {
      console.error(err);
      setLoading(false);
      setIsTyping(false);
      setTypingText("");
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "通信エラーが発生しました。しばらくしてからもう一度お試しください。"
      }]);
    }
  }, [messages, loading, isTyping, typeOut]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div style={styles.container}>
      {/* LINE風ヘッダー */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M15 19l-7-7 7-7"/></svg>
          <div style={styles.headerAvatar}>
            <span style={{fontSize:20}}>🛡️</span>
          </div>
          <div style={{flex:1}}>
            <p style={styles.headerName}>セット共済ナビ</p>
          </div>
        </div>
      </div>

      {/* チャットエリア */}
      <div style={styles.chatArea}>
        {/* 日付ラベル */}
        <div style={styles.dateBadge}>
          <span style={styles.dateBadgeText}>今日</span>
        </div>

        {messages.length === 0 && (
          <div style={styles.welcomeArea}>
            <div style={styles.welcomeCard}>
              <div style={{fontSize:36, marginBottom:8}}>🛡️</div>
              <p style={styles.welcomeTitle}>セット共済ナビ</p>
              <p style={styles.welcomeDesc}>セット共済のことなら<br/>何でも聞いてください！</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          // ボットの回答から選択肢を抽出
          const isBot = msg.role === "assistant";
          const isLast = isBot && i === messages.length - 1 && !loading && !isTyping;
          let bodyLines = [];
          let choices = [];

          if (isBot) {
            const lines = msg.content.split("\n");
            for (const line of lines) {
              if (/^▶/.test(line.trim())) {
                choices.push(line.trim());
              } else {
                bodyLines.push(line);
              }
            }
          }

          return (
            <div key={i}>
              <div style={{
                ...styles.msgRow,
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
              }}>
                {isBot && (
                  <div style={styles.botAvatar}>🛡️</div>
                )}
                <div style={{
                  ...styles.bubble,
                  ...(msg.role === "user" ? styles.userBubble : styles.botBubble),
                }}>
                  {isBot ? (
                    bodyLines.map((line, j) => (
                      <span key={j}>{line}<br/></span>
                    ))
                  ) : (
                    msg.content.split("\n").map((line, j) => (
                      <span key={j}>{line}<br/></span>
                    ))
                  )}
                </div>
              </div>
              {/* 選択肢ボタン */}
              {isBot && choices.length > 0 && (
                <div style={styles.choicesWrap}>
                  {choices.map((ch, ci) => {
                    const label = ch.replace(/^▶\s*/, "");
                    return (
                      <button
                        key={ci}
                        style={{
                          ...styles.choiceBtn,
                          ...(isLast ? {} : styles.choiceBtnDone),
                        }}
                        disabled={!isLast}
                        onClick={() => isLast && sendMessage(label)}
                        onMouseEnter={e => { if(isLast) e.target.style.background="#D6F5D6"; }}
                        onMouseLeave={e => { if(isLast) e.target.style.background="#fff"; }}
                      >
                        <span style={styles.choiceNum}>{ci + 1}</span>
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{...styles.msgRow, flexDirection:"row"}}>
            <div style={styles.botAvatar}>🛡️</div>
            <div style={{...styles.bubble, ...styles.botBubble, padding:"10px 18px"}}>
              <div style={styles.dots}>
                <span style={{...styles.dot, animationDelay:"0s"}}/>
                <span style={{...styles.dot, animationDelay:"0.15s"}}/>
                <span style={{...styles.dot, animationDelay:"0.3s"}}/>
              </div>
            </div>
          </div>
        )}

        {isTyping && typingText && (
          <div style={{...styles.msgRow, flexDirection:"row"}}>
            <div style={styles.botAvatar}>🛡️</div>
            <div style={{...styles.bubble, ...styles.botBubble}}>
              {typingText.split("\n").map((line, j) => (
                <span key={j}>{line}<br/></span>
              ))}
              <span style={styles.cursor}>▍</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* サジェスト */}
      {showSuggestions && messages.length === 0 && (
        <div style={styles.suggestionsWrap}>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              style={styles.suggestBtn}
              onClick={() => sendMessage(q)}
              onMouseEnter={e => {e.target.style.background="#D6F5D6";}}
              onMouseLeave={e => {e.target.style.background="#fff";}}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* 入力エリア */}
      <div style={styles.inputArea}>
        <div style={styles.inputInner}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }}}
            placeholder="メッセージを入力..."
            style={styles.input}
            disabled={loading || isTyping}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading || isTyping}
            style={{
              ...styles.sendBtn,
              background: (!input.trim() || loading || isTyping) ? "#ccc" : "#07B53B",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
        <p style={styles.disclaimer}>
          ※ AIによる回答です。正確な情報は組合までお問い合わせください。
        </p>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

// ============================================================
// LINE風スタイル
// ============================================================
const LINEGreen = "#07B53B";
const LINEBg = "#8CAAB9";
const styles = {
  container: {
    display:"flex", flexDirection:"column", height:"100vh",
    fontFamily:"'Noto Sans JP', sans-serif", background: LINEBg, color:"#111",
  },

  // ヘッダー
  header: {
    background:"#6E9AAA", padding:"10px 14px", flexShrink:0,
    borderBottom:"1px solid rgba(0,0,0,0.1)",
  },
  headerInner: {
    display:"flex", alignItems:"center", gap:10, maxWidth:700, margin:"0 auto",
  },
  headerAvatar: {
    width:38, height:38, borderRadius:"50%", background:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
  },
  headerName: {
    margin:0, fontSize:17, fontWeight:700, color:"#fff",
  },

  // チャット
  chatArea: {
    flex:1, overflowY:"auto", padding:"12px 14px",
    maxWidth:700, width:"100%", margin:"0 auto",
    backgroundImage:"url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2260%22 height%3D%2260%22%3E%3Crect width%3D%2260%22 height%3D%2260%22 fill%3D%22none%22%2F%3E%3Ccircle cx%3D%2230%22 cy%3D%2230%22 r%3D%221.2%22 fill%3D%22rgba(255%2C255%2C255%2C0.07)%22%2F%3E%3C%2Fsvg%3E')",
  },

  dateBadge: { textAlign:"center", marginBottom:16 },
  dateBadgeText: {
    display:"inline-block", background:"rgba(0,0,0,0.15)", color:"#fff",
    fontSize:11, padding:"3px 12px", borderRadius:20,
  },

  welcomeArea: { display:"flex", justifyContent:"center", marginTop:20 },
  welcomeCard: {
    background:"rgba(255,255,255,0.85)", borderRadius:16, padding:"28px 36px",
    textAlign:"center", backdropFilter:"blur(4px)",
  },
  welcomeTitle: { margin:"0 0 4px", fontSize:16, fontWeight:700, color:"#333" },
  welcomeDesc: { margin:0, fontSize:13, color:"#666", lineHeight:1.7 },

  // メッセージ
  msgRow: { display:"flex", alignItems:"flex-start", gap:8, marginBottom:8 },
  botAvatar: {
    width:36, height:36, borderRadius:"50%", background:"#fff",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:18, flexShrink:0, marginTop:2,
    boxShadow:"0 1px 2px rgba(0,0,0,0.1)",
  },
  bubble: {
    maxWidth:"75%", padding:"10px 14px", fontSize:14, lineHeight:1.7,
    wordBreak:"break-word",
  },
  userBubble: {
    background:LINEGreen, color:"#fff",
    borderRadius:"18px 4px 18px 18px",
  },
  botBubble: {
    background:"#fff", color:"#222",
    borderRadius:"4px 18px 18px 18px",
    boxShadow:"0 1px 1px rgba(0,0,0,0.06)",
  },

  // ローディング
  dots: { display:"flex", gap:5, alignItems:"center", height:20 },
  dot: {
    width:8, height:8, borderRadius:"50%", background:"#999",
    animation:"dotPulse 1.2s infinite ease-in-out",
  },
  cursor: { animation:"cursorBlink 0.8s infinite", color:LINEGreen, fontWeight:700 },

  // 選択肢ボタン
  choicesWrap: {
    display:"flex", flexDirection:"column", gap:6,
    marginLeft:44, marginBottom:10, marginTop:2,
  },
  choiceBtn: {
    display:"flex", alignItems:"center", gap:10,
    background:"#fff", border:`1.5px solid ${LINEGreen}`, borderRadius:20,
    padding:"9px 16px", fontSize:14, cursor:"pointer",
    color:"#222", fontFamily:"'Noto Sans JP', sans-serif",
    transition:"all 0.15s", textAlign:"left",
  },
  choiceBtnDone: {
    opacity:0.5, cursor:"default", borderColor:"#ccc",
  },
  choiceNum: {
    display:"inline-flex", alignItems:"center", justifyContent:"center",
    width:22, height:22, borderRadius:"50%", background:LINEGreen,
    color:"#fff", fontSize:12, fontWeight:700, flexShrink:0,
  },

  // サジェスト
  suggestionsWrap: {
    padding:"0 14px 6px", maxWidth:700, margin:"0 auto", width:"100%",
    display:"flex", flexWrap:"wrap", gap:6,
  },
  suggestBtn: {
    background:"#fff", border:"1.5px solid #07B53B", borderRadius:20,
    padding:"7px 14px", fontSize:13, cursor:"pointer", color:"#07B53B",
    fontWeight:500, transition:"all 0.15s",
    fontFamily:"'Noto Sans JP', sans-serif", whiteSpace:"nowrap",
  },

  // 入力
  inputArea: {
    background:"#F7F7F7", padding:"8px 10px 6px", flexShrink:0,
    borderTop:"1px solid #ddd",
  },
  inputInner: {
    display:"flex", gap:8, maxWidth:700, margin:"0 auto", alignItems:"center",
  },
  input: {
    flex:1, border:"1px solid #ddd", outline:"none", background:"#fff",
    fontSize:15, padding:"10px 14px", borderRadius:20,
    fontFamily:"'Noto Sans JP', sans-serif", color:"#111",
  },
  sendBtn: {
    width:40, height:40, borderRadius:"50%", border:"none",
    cursor:"pointer", flexShrink:0, display:"flex",
    alignItems:"center", justifyContent:"center",
    transition:"background 0.15s",
  },
  disclaimer: {
    fontSize:10, color:"#999", textAlign:"center",
    margin:"6px 0 0",
  },
};
