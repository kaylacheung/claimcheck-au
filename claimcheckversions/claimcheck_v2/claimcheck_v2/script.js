const state = {
  medicare: null,
  residency: null,
  privateInsurance: null,
  insurer: null,
  plan: null,
  service: null
};

const historyStack = [];

const questionCard = document.getElementById("questionCard");
const resultCard = document.getElementById("resultCard");
const questionEyebrow = document.getElementById("questionEyebrow");
const questionTitle = document.getElementById("questionTitle");
const questionHelp = document.getElementById("questionHelp");
const questionVisual = document.getElementById("questionVisual");
const answerButtons = document.getElementById("answerButtons");
const backButton = document.getElementById("backButton");
const restartButton = document.getElementById("restartButton");
const stepLabel = document.getElementById("stepLabel");
const progressFill = document.getElementById("progressFill");
const languageSelect = document.getElementById("languageSelect");
const languageLabel = document.getElementById("languageLabel");
const heroTag = document.getElementById("heroTag");
const heroSlogan = document.getElementById("heroSlogan");
const heroSubtext = document.getElementById("heroSubtext");
const restartText = document.getElementById("restartText");
const backText = document.getElementById("backText");
const smallPrintText = document.getElementById("smallPrintText");

let currentStep = "medicare";
let currentLanguage = localStorage.getItem("claimcheckLanguage") || "en";

const translations = {
  en: {
    langCode: "en",
    direction: "ltr",
    language: "Language",
    heroTag: "Australian Health Claim Helper",
    slogan: "Claim Maximiser",
    subtext: "Helping you maximise every eligible health claim.",
    restart: "Restart",
    back: "Back",
    result: "Result",
    sample: "SAMPLE",
    medicareCardCaption: "This is only a fake sample card. Your real Medicare card may be physical or digital in the myGov app.",
    smallPrint: "ClaimCheck AU gives general information only. It does not provide medical, legal, financial, or insurance advice. Always confirm directly with Medicare, your insurer, or your health provider.",
    officialClaim: "Go to official claims page",
    healthdirect: "Find a health service",
    medicareEligibility: "Check Medicare eligibility",
    reciprocal: "Check reciprocal health care",
    unsureOrUnlistedPlan: "I am not sure / my plan is not listed",
    unsureOrUnlistedDetail: "I need to check my insurer app, email, or policy statement.",
    otherInsurer: "Other / not listed",
    otherInsurerDetail: "I will search for my insurer manually.",
    steps: {
      medicare: ["Step 1", "Do You Have a Medicare Card?", "Look at the sample card below and choose the option that best matches you.", "Step 1 of 6"],
      residency: ["Medicare Eligibility", "Are You Living in Australia Long Term?", "This helps point you toward the right Medicare eligibility pathway.", "Step 2 of 6"],
      privateInsurance: ["Private Health Insurance", "Do You Have Private Health Insurance?", "This helps decide whether we guide you through an insurer claim, a Medicare pathway, or both.", "Step 2 of 6"],
      insurer: ["Insurer", "Which Private Health Insurer Are You With?", "Choose the company you recognise. You can replace these placeholder logos with real images later.", "Step 3 of 6"],
      plan: ["Plan Name", "Which Plan Looks Most Like Yours?", "Choose the closest plan name. If you are unsure, choose the unsure option.", "Step 4 of 6"],
      servicePrivate: ["Health Service", "Which Health Service Do You Want to Check?", "Choose the appointment or service you are considering, booking, or claiming.", "Step 5 of 6"],
      serviceNoPrivate: ["Health Service", "Which Health Service Do You Want to Check?", "We will show the Medicare or low-cost pathway.", "Step 3 of 3"]
    },
    answers: {
      yesMedicare: ["Yes, I have a Medicare card", "I can use Medicare services in Australia."],
      noMedicare: ["No, I do not", "I may be visiting, new to Australia, or not eligible."],
      unsureMedicare: ["I am not sure", "I need help checking."],
      living: ["Yes, I live in Australia", "For example, citizen, permanent resident, or applying for permanent residency."],
      visitor: ["No, I am visiting Australia", "For example, tourist, visitor, or short stay."],
      yesInsurance: ["Yes", "I have a private health insurance policy."],
      noInsurance: ["No", "I only want Medicare or low-cost options."],
      unsureInsurance: ["I am not sure", "I might be on a family policy or old policy."]
    },
    services: {
      dental: ["Dental", "Check-up, clean, filling, braces, or wisdom teeth."],
      optical: ["Optical", "Glasses, contact lenses, or eye-related costs."],
      physio: ["Physiotherapy", "Physio appointment or treatment."],
      psychology: ["Psychology", "Psychologist or mental health appointment."],
      gp: ["GP consultation", "Normal doctor appointment."],
      specialist: ["Specialist consultation", "Specialist doctor appointment."],
      ambulance: ["Ambulance", "Emergency transport or ambulance bill."],
      other: ["Other health service", "Get general next steps."]
    },
    results: {
      checkMedicareTitle: "Check Whether You Have Medicare First",
      checkMedicareBody: "Your first step is to check whether you have a Medicare card or whether you are eligible to enrol.",
      medicareEligibilityTitle: "You May Be Able to Check Medicare Eligibility",
      medicareEligibilityBody: "Medicare is not only for Australian citizens. Some residents and applicants may also be eligible.",
      visitorTitle: "You May Need Visitor or Overseas Health Guidance",
      visitorBody: "If you are visiting Australia, your options may depend on your visa, travel insurance, overseas student health cover, or whether your country has a reciprocal health care agreement with Australia.",
      insuranceUnsureTitle: "Check Whether You Already Have Private Health Insurance",
      insuranceUnsureBody: "You might already be covered under your own policy or a family policy.",
      noPrivateTitle: "Medicare or Low-Cost Pathway",
      privateTitle: "Claim Guide",
      likelyPathway: "Likely pathway",
      selectedInsurer: "Selected insurer",
      selectedPlan: "Selected plan",
      likelyCategory: "Likely category",
      whatNext: "What to do next",
      beforeClaim: "Before you claim, check this",
      nextStep: "Your next step",
      reminder: "Reminder: this is general guidance only. It does not confirm that your claim will be accepted.",
      doctorNotice: "Important: this looks like a doctor consultation. GP visits and out-of-hospital specialist consultations are usually claimed through Medicare, not private health insurance. Private health insurance usually becomes relevant for doctor fees only when the treatment is in hospital.",
      extrasLikely: "Likely next step: your selected plan looks like it may include extras. This service may be claimable if it is included, your waiting period has finished, and you have not used your limit.",
      hospitalIssue: "Possible issue: you selected a hospital-style plan. Dental, optical, physio and some psychology claims usually need extras cover, so this may not be claimable under hospital-only cover.",
      ambulanceNotice: "Check carefully: ambulance rules depend on your state and your policy. Check your insurer and your state rules before assuming it is covered.",
      policyNotice: "Check your policy: the selected plan does not give enough information to confirm a claim. Use your insurer app or call your insurer.",
      planUnsureNotice: "You chose an unsure or unlisted plan. Check the exact policy name in your insurer app, insurance card, email, or policy statement."
    }
  },

  zhHans: {
    langCode: "zh-Hans",
    direction: "ltr",
    language: "语言",
    heroTag: "澳洲医疗报销助手",
    slogan: "报销最大化助手",
    subtext: "帮助你尽量使用每一个符合条件的医疗报销机会。",
    restart: "重新开始",
    back: "返回",
    result: "结果",
    sample: "样本",
    medicareCardCaption: "这只是假的样本卡。你的真实 Medicare 卡可能是实体卡，也可能在 myGov app 里。",
    smallPrint: "ClaimCheck AU 只提供一般信息，不提供医疗、法律、财务或保险建议。请务必直接向 Medicare、保险公司或医疗服务提供者确认。",
    officialClaim: "前往官方报销页面",
    healthdirect: "寻找医疗服务",
    medicareEligibility: "查询 Medicare 资格",
    reciprocal: "查询互惠医疗协议",
    unsureOrUnlistedPlan: "我不确定 / 我的计划没有列出",
    unsureOrUnlistedDetail: "我需要查看保险 app、邮件或保单文件。",
    otherInsurer: "其他 / 没有列出",
    otherInsurerDetail: "我会自己查询我的保险公司。",
    steps: {
      medicare: ["第 1 步", "你有 Medicare 卡吗？", "请看下面的样本卡，然后选择最符合你的选项。", "第 1 步，共 6 步"],
      residency: ["Medicare 资格", "你是否长期住在澳洲？", "这可以帮助判断你是否应该先查询 Medicare 资格。", "第 2 步，共 6 步"],
      privateInsurance: ["私人医疗保险", "你有私人医疗保险吗？", "这会决定你应该看保险报销路径、Medicare 路径，还是两者都看。", "第 2 步，共 6 步"],
      insurer: ["保险公司", "你的私人医疗保险公司是哪一家？", "请选择你认识的公司。之后可以把这里的占位图换成真实 logo。", "第 3 步，共 6 步"],
      plan: ["保险计划名称", "哪个计划最像你的保险？", "选择最接近的计划名称。不确定就选择不确定。", "第 4 步，共 6 步"],
      servicePrivate: ["医疗服务", "你想查询哪一种医疗服务？", "请选择你正在考虑、准备预约或想报销的服务。", "第 5 步，共 6 步"],
      serviceNoPrivate: ["医疗服务", "你想查询哪一种医疗服务？", "我们会显示 Medicare 或低费用路径。", "第 3 步，共 3 步"]
    },
    answers: {
      yesMedicare: ["有，我有 Medicare 卡", "我可以在澳洲使用 Medicare 服务。"],
      noMedicare: ["没有", "我可能是访客、新来澳洲，或不符合资格。"],
      unsureMedicare: ["我不确定", "我需要帮助查询。"],
      living: ["是，我住在澳洲", "例如公民、永久居民，或正在申请永居。"],
      visitor: ["不是，我只是来澳洲访问", "例如游客、访客或短期停留。"],
      yesInsurance: ["有", "我有私人医疗保险。"],
      noInsurance: ["没有", "我只想看 Medicare 或低费用选项。"],
      unsureInsurance: ["我不确定", "我可能在家庭保险或旧保险里面。"]
    },
    services: {
      dental: ["牙科", "洗牙、补牙、牙套或智齿等。"],
      optical: ["眼科 / 配镜", "眼镜、隐形眼镜或眼睛相关费用。"],
      physio: ["物理治疗", "物理治疗预约或治疗。"],
      psychology: ["心理咨询", "心理医生或心理健康预约。"],
      gp: ["GP 家庭医生", "普通医生预约。"],
      specialist: ["专科医生", "专科医生预约。"],
      ambulance: ["救护车", "紧急交通或救护车账单。"],
      other: ["其他医疗服务", "查看一般下一步。"]
    },
    results: {}
  },

  zhHant: {
    langCode: "zh-Hant",
    direction: "ltr",
    language: "語言",
    heroTag: "澳洲醫療報銷助手",
    slogan: "報銷最大化助手",
    subtext: "幫助你盡量使用每一個符合條件的醫療報銷機會。",
    restart: "重新開始",
    back: "返回",
    result: "結果",
    sample: "樣本",
    medicareCardCaption: "這只是假的樣本卡。你的真實 Medicare 卡可能是實體卡，也可能在 myGov app 裡。",
    smallPrint: "ClaimCheck AU 只提供一般資訊，不提供醫療、法律、財務或保險建議。請務必直接向 Medicare、保險公司或醫療服務提供者確認。",
    officialClaim: "前往官方報銷頁面",
    healthdirect: "尋找醫療服務",
    medicareEligibility: "查詢 Medicare 資格",
    reciprocal: "查詢互惠醫療協議",
    unsureOrUnlistedPlan: "我不確定 / 我的計劃沒有列出",
    unsureOrUnlistedDetail: "我需要查看保險 app、電郵或保單文件。",
    otherInsurer: "其他 / 沒有列出",
    otherInsurerDetail: "我會自己查詢我的保險公司。",
    steps: {
      medicare: ["第 1 步", "你有 Medicare 卡嗎？", "請看下面的樣本卡，然後選擇最符合你的選項。", "第 1 步，共 6 步"],
      residency: ["Medicare 資格", "你是否長期住在澳洲？", "這可以幫助判斷你是否應該先查詢 Medicare 資格。", "第 2 步，共 6 步"],
      privateInsurance: ["私人醫療保險", "你有私人醫療保險嗎？", "這會決定你應該看保險報銷路徑、Medicare 路徑，還是兩者都看。", "第 2 步，共 6 步"],
      insurer: ["保險公司", "你的私人醫療保險公司是哪一家？", "請選擇你認識的公司。之後可以把這裡的佔位圖換成真實 logo。", "第 3 步，共 6 步"],
      plan: ["保險計劃名稱", "哪個計劃最像你的保險？", "選擇最接近的計劃名稱。不確定就選擇不確定。", "第 4 步，共 6 步"],
      servicePrivate: ["醫療服務", "你想查詢哪一種醫療服務？", "請選擇你正在考慮、準備預約或想報銷的服務。", "第 5 步，共 6 步"],
      serviceNoPrivate: ["醫療服務", "你想查詢哪一種醫療服務？", "我們會顯示 Medicare 或低費用路徑。", "第 3 步，共 3 步"]
    },
    answers: {
      yesMedicare: ["有，我有 Medicare 卡", "我可以在澳洲使用 Medicare 服務。"],
      noMedicare: ["沒有", "我可能是訪客、新來澳洲，或不符合資格。"],
      unsureMedicare: ["我不確定", "我需要幫助查詢。"],
      living: ["是，我住在澳洲", "例如公民、永久居民，或正在申請永居。"],
      visitor: ["不是，我只是來澳洲訪問", "例如遊客、訪客或短期停留。"],
      yesInsurance: ["有", "我有私人醫療保險。"],
      noInsurance: ["沒有", "我只想看 Medicare 或低費用選項。"],
      unsureInsurance: ["我不確定", "我可能在家庭保險或舊保險裡面。"]
    },
    services: {
      dental: ["牙科", "洗牙、補牙、牙套或智慧齒等。"],
      optical: ["眼科 / 配鏡", "眼鏡、隱形眼鏡或眼睛相關費用。"],
      physio: ["物理治療", "物理治療預約或治療。"],
      psychology: ["心理諮詢", "心理醫生或心理健康預約。"],
      gp: ["GP 家庭醫生", "普通醫生預約。"],
      specialist: ["專科醫生", "專科醫生預約。"],
      ambulance: ["救護車", "緊急交通或救護車帳單。"],
      other: ["其他醫療服務", "查看一般下一步。"]
    },
    results: {}
  },

  ar: {
    langCode: "ar",
    direction: "rtl",
    language: "اللغة",
    heroTag: "مساعد مطالبات الصحة في أستراليا",
    slogan: "تعظيم المطالبات",
    subtext: "نساعدك على الاستفادة من كل مطالبة صحية مؤهلة.",
    restart: "إعادة البدء",
    back: "رجوع",
    result: "النتيجة",
    sample: "عينة",
    medicareCardCaption: "هذه بطاقة عينة فقط. قد تكون بطاقة Medicare الحقيقية بطاقة فعلية أو رقمية في تطبيق myGov.",
    smallPrint: "يقدم ClaimCheck AU معلومات عامة فقط. لا يقدم نصائح طبية أو قانونية أو مالية أو تأمينية. تأكد دائماً مباشرة من Medicare أو شركة التأمين أو مقدم الخدمة الصحية.",
    officialClaim: "اذهب إلى صفحة المطالبات الرسمية",
    healthdirect: "ابحث عن خدمة صحية",
    medicareEligibility: "تحقق من أهلية Medicare",
    reciprocal: "تحقق من الرعاية الصحية المتبادلة",
    unsureOrUnlistedPlan: "لست متأكداً / خطتي غير موجودة",
    unsureOrUnlistedDetail: "أحتاج إلى التحقق من تطبيق شركة التأمين أو البريد الإلكتروني أو وثيقة البوليصة.",
    otherInsurer: "شركة أخرى / غير موجودة",
    otherInsurerDetail: "سأبحث عن شركة التأمين بنفسي.",
    steps: {
      medicare: ["الخطوة 1", "هل لديك بطاقة Medicare؟", "انظر إلى بطاقة العينة أدناه واختر الخيار الأقرب لك.", "الخطوة 1 من 6"],
      residency: ["أهلية Medicare", "هل تعيش في أستراليا لفترة طويلة؟", "يساعدنا ذلك على توجيهك إلى مسار أهلية Medicare الصحيح.", "الخطوة 2 من 6"],
      privateInsurance: ["التأمين الصحي الخاص", "هل لديك تأمين صحي خاص؟", "يساعدنا ذلك على تحديد ما إذا كنت تحتاج إلى مسار شركة التأمين أو Medicare أو الاثنين معاً.", "الخطوة 2 من 6"],
      insurer: ["شركة التأمين", "ما هي شركة التأمين الصحي الخاص لديك؟", "اختر الشركة التي تتعرف عليها. يمكن استبدال الشعارات المؤقتة بصور حقيقية لاحقاً.", "الخطوة 3 من 6"],
      plan: ["اسم الخطة", "أي خطة تشبه خطتك؟", "اختر أقرب اسم للخطة. إذا لم تكن متأكداً، اختر خيار عدم التأكد.", "الخطوة 4 من 6"],
      servicePrivate: ["الخدمة الصحية", "ما الخدمة الصحية التي تريد التحقق منها؟", "اختر الموعد أو الخدمة التي تفكر فيها أو تريد حجزها أو المطالبة بها.", "الخطوة 5 من 6"],
      serviceNoPrivate: ["الخدمة الصحية", "ما الخدمة الصحية التي تريد التحقق منها؟", "سنعرض مسار Medicare أو الخيارات منخفضة التكلفة.", "الخطوة 3 من 3"]
    },
    answers: {
      yesMedicare: ["نعم، لدي بطاقة Medicare", "يمكنني استخدام خدمات Medicare في أستراليا."],
      noMedicare: ["لا، ليس لدي", "قد أكون زائراً أو جديداً في أستراليا أو غير مؤهل."],
      unsureMedicare: ["لست متأكداً", "أحتاج إلى مساعدة في التحقق."],
      living: ["نعم، أعيش في أستراليا", "مثلاً مواطن أو مقيم دائم أو أتقدم للإقامة الدائمة."],
      visitor: ["لا، أنا أزور أستراليا", "مثلاً سائح أو زائر أو إقامة قصيرة."],
      yesInsurance: ["نعم", "لدي بوليصة تأمين صحي خاص."],
      noInsurance: ["لا", "أريد فقط خيارات Medicare أو خيارات منخفضة التكلفة."],
      unsureInsurance: ["لست متأكداً", "قد أكون ضمن بوليصة عائلية أو بوليصة قديمة."]
    },
    services: {
      dental: ["طب الأسنان", "فحص، تنظيف، حشو، تقويم أو ضرس عقل."],
      optical: ["البصريات", "نظارات، عدسات لاصقة أو تكاليف متعلقة بالعين."],
      physio: ["العلاج الطبيعي", "موعد أو علاج طبيعي."],
      psychology: ["علم النفس", "موعد مع أخصائي نفسي أو للصحة النفسية."],
      gp: ["موعد طبيب عام", "موعد طبي عادي."],
      specialist: ["موعد أخصائي", "موعد مع طبيب متخصص."],
      ambulance: ["الإسعاف", "نقل طارئ أو فاتورة إسعاف."],
      other: ["خدمة صحية أخرى", "احصل على خطوات عامة تالية."]
    },
    results: {}
  },

  tr: {
    langCode: "tr",
    direction: "ltr",
    language: "Dil",
    heroTag: "Avustralya Sağlık Talep Yardımcısı",
    slogan: "Talep Maksimizer",
    subtext: "Uygun olan her sağlık talebinden en iyi şekilde yararlanmanıza yardımcı olur.",
    restart: "Yeniden başlat",
    back: "Geri",
    result: "Sonuç",
    sample: "ÖRNEK",
    medicareCardCaption: "Bu yalnızca sahte bir örnek karttır. Gerçek Medicare kartınız fiziksel veya myGov uygulamasında dijital olabilir.",
    smallPrint: "ClaimCheck AU yalnızca genel bilgi verir. Tıbbi, hukuki, finansal veya sigorta tavsiyesi vermez. Her zaman doğrudan Medicare, sigortacınız veya sağlık sağlayıcınızla teyit edin.",
    officialClaim: "Resmî talep sayfasına git",
    healthdirect: "Sağlık hizmeti bul",
    medicareEligibility: "Medicare uygunluğunu kontrol et",
    reciprocal: "Karşılıklı sağlık anlaşmasını kontrol et",
    unsureOrUnlistedPlan: "Emin değilim / planım listede yok",
    unsureOrUnlistedDetail: "Sigorta uygulamamı, e-postamı veya poliçe belgesini kontrol etmem gerekiyor.",
    otherInsurer: "Diğer / listede yok",
    otherInsurerDetail: "Sigortacımı kendim arayacağım.",
    steps: {
      medicare: ["Adım 1", "Medicare Kartınız Var mı?", "Aşağıdaki örnek karta bakın ve size en uygun seçeneği seçin.", "Adım 1 / 6"],
      residency: ["Medicare Uygunluğu", "Avustralya'da Uzun Süreli mi Yaşıyorsunuz?", "Bu, doğru Medicare uygunluk yoluna yönlendirmemize yardımcı olur.", "Adım 2 / 6"],
      privateInsurance: ["Özel Sağlık Sigortası", "Özel Sağlık Sigortanız Var mı?", "Bu, sigorta talebi, Medicare yolu veya her ikisi üzerinden yönlendirme yapmamıza yardımcı olur.", "Adım 2 / 6"],
      insurer: ["Sigortacı", "Hangi Özel Sağlık Sigortacısındasınız?", "Tanıdığınız şirketi seçin. Bu geçici logoları daha sonra gerçek görsellerle değiştirebilirsiniz.", "Adım 3 / 6"],
      plan: ["Plan Adı", "Hangi Plan Sizinkine En Çok Benziyor?", "En yakın plan adını seçin. Emin değilseniz emin değilim seçeneğini seçin.", "Adım 4 / 6"],
      servicePrivate: ["Sağlık Hizmeti", "Hangi Sağlık Hizmetini Kontrol Etmek İstiyorsunuz?", "Düşündüğünüz, randevu alacağınız veya talep edeceğiniz hizmeti seçin.", "Adım 5 / 6"],
      serviceNoPrivate: ["Sağlık Hizmeti", "Hangi Sağlık Hizmetini Kontrol Etmek İstiyorsunuz?", "Medicare veya düşük maliyetli yolu göstereceğiz.", "Adım 3 / 3"]
    },
    answers: {
      yesMedicare: ["Evet, Medicare kartım var", "Avustralya'da Medicare hizmetlerini kullanabilirim."],
      noMedicare: ["Hayır, yok", "Ziyaretçi, Avustralya'ya yeni gelmiş veya uygun olmayabilirim."],
      unsureMedicare: ["Emin değilim", "Kontrol etmek için yardıma ihtiyacım var."],
      living: ["Evet, Avustralya'da yaşıyorum", "Örneğin vatandaş, daimi oturum sahibi veya daimi oturuma başvuran kişi."],
      visitor: ["Hayır, Avustralya'yı ziyaret ediyorum", "Örneğin turist, ziyaretçi veya kısa süreli kalış."],
      yesInsurance: ["Evet", "Özel sağlık sigortası poliçem var."],
      noInsurance: ["Hayır", "Sadece Medicare veya düşük maliyetli seçenekleri istiyorum."],
      unsureInsurance: ["Emin değilim", "Aile poliçesinde veya eski bir poliçede olabilirim."]
    },
    services: {
      dental: ["Diş", "Kontrol, temizlik, dolgu, tel veya yirmilik diş."],
      optical: ["Optik", "Gözlük, lens veya gözle ilgili masraflar."],
      physio: ["Fizyoterapi", "Fizyoterapi randevusu veya tedavisi."],
      psychology: ["Psikoloji", "Psikolog veya ruh sağlığı randevusu."],
      gp: ["Aile hekimi randevusu", "Normal doktor randevusu."],
      specialist: ["Uzman randevusu", "Uzman doktor randevusu."],
      ambulance: ["Ambulans", "Acil taşıma veya ambulans faturası."],
      other: ["Diğer sağlık hizmeti", "Genel sonraki adımları al."]
    },
    results: {}
  },

  hi: {
    langCode: "hi",
    direction: "ltr",
    language: "भाषा",
    heroTag: "ऑस्ट्रेलियाई स्वास्थ्य क्लेम सहायक",
    slogan: "क्लेम मैक्सिमाइज़र",
    subtext: "हर योग्य स्वास्थ्य क्लेम का अधिकतम लाभ लेने में मदद।",
    restart: "फिर से शुरू करें",
    back: "पीछे",
    result: "परिणाम",
    sample: "नमूना",
    medicareCardCaption: "यह केवल एक नकली नमूना कार्ड है। आपका असली Medicare कार्ड भौतिक या myGov ऐप में डिजिटल हो सकता है।",
    smallPrint: "ClaimCheck AU केवल सामान्य जानकारी देता है। यह चिकित्सा, कानूनी, वित्तीय या बीमा सलाह नहीं देता। हमेशा Medicare, अपने बीमाकर्ता या स्वास्थ्य प्रदाता से सीधे पुष्टि करें।",
    officialClaim: "आधिकारिक क्लेम पेज पर जाएं",
    healthdirect: "स्वास्थ्य सेवा खोजें",
    medicareEligibility: "Medicare पात्रता जांचें",
    reciprocal: "पारस्परिक स्वास्थ्य देखभाल जांचें",
    unsureOrUnlistedPlan: "मुझे यकीन नहीं है / मेरी योजना सूची में नहीं है",
    unsureOrUnlistedDetail: "मुझे बीमा ऐप, ईमेल या पॉलिसी स्टेटमेंट देखना होगा।",
    otherInsurer: "अन्य / सूची में नहीं",
    otherInsurerDetail: "मैं अपने बीमाकर्ता को स्वयं खोजूंगा।",
    steps: {
      medicare: ["चरण 1", "क्या आपके पास Medicare कार्ड है?", "नीचे दिए गए नमूना कार्ड को देखें और अपने लिए सही विकल्प चुनें।", "चरण 1 / 6"],
      residency: ["Medicare पात्रता", "क्या आप लंबे समय से ऑस्ट्रेलिया में रह रहे हैं?", "यह हमें सही Medicare पात्रता मार्ग दिखाने में मदद करता है।", "चरण 2 / 6"],
      privateInsurance: ["निजी स्वास्थ्य बीमा", "क्या आपके पास निजी स्वास्थ्य बीमा है?", "इससे हम तय करते हैं कि आपको बीमा क्लेम, Medicare मार्ग या दोनों दिखाने हैं।", "चरण 2 / 6"],
      insurer: ["बीमाकर्ता", "आपके पास कौन सा निजी स्वास्थ्य बीमाकर्ता है?", "उस कंपनी को चुनें जिसे आप पहचानते हैं। बाद में इन अस्थायी लोगो को असली इमेज से बदला जा सकता है।", "चरण 3 / 6"],
      plan: ["योजना का नाम", "कौन सी योजना आपकी योजना जैसी लगती है?", "सबसे नजदीकी योजना नाम चुनें। यदि आप अनिश्चित हैं, तो अनिश्चित विकल्प चुनें।", "चरण 4 / 6"],
      servicePrivate: ["स्वास्थ्य सेवा", "आप कौन सी स्वास्थ्य सेवा जांचना चाहते हैं?", "वह अपॉइंटमेंट या सेवा चुनें जिसे आप सोच रहे हैं, बुक कर रहे हैं या क्लेम करना चाहते हैं।", "चरण 5 / 6"],
      serviceNoPrivate: ["स्वास्थ्य सेवा", "आप कौन सी स्वास्थ्य सेवा जांचना चाहते हैं?", "हम Medicare या कम लागत वाला मार्ग दिखाएंगे।", "चरण 3 / 3"]
    },
    answers: {
      yesMedicare: ["हाँ, मेरे पास Medicare कार्ड है", "मैं ऑस्ट्रेलिया में Medicare सेवाओं का उपयोग कर सकता/सकती हूँ।"],
      noMedicare: ["नहीं, मेरे पास नहीं है", "मैं आगंतुक, ऑस्ट्रेलिया में नया, या पात्र नहीं हो सकता/सकती हूँ।"],
      unsureMedicare: ["मुझे यकीन नहीं है", "मुझे जांचने में मदद चाहिए।"],
      living: ["हाँ, मैं ऑस्ट्रेलिया में रहता/रहती हूँ", "जैसे नागरिक, स्थायी निवासी या स्थायी निवास के लिए आवेदन कर रहा/रही हूँ।"],
      visitor: ["नहीं, मैं ऑस्ट्रेलिया घूमने आया/आई हूँ", "जैसे पर्यटक, आगंतुक या छोटी अवधि का ठहराव।"],
      yesInsurance: ["हाँ", "मेरे पास निजी स्वास्थ्य बीमा पॉलिसी है।"],
      noInsurance: ["नहीं", "मैं केवल Medicare या कम लागत वाले विकल्प चाहता/चाहती हूँ।"],
      unsureInsurance: ["मुझे यकीन नहीं है", "मैं परिवार की पॉलिसी या पुरानी पॉलिसी में हो सकता/सकती हूँ।"]
    },
    services: {
      dental: ["दंत चिकित्सा", "चेक-अप, सफाई, फिलिंग, ब्रेसेस या अक्ल दाढ़।"],
      optical: ["ऑप्टिकल", "चश्मा, कॉन्टैक्ट लेंस या आंखों से जुड़े खर्च।"],
      physio: ["फिजियोथेरेपी", "फिजियो अपॉइंटमेंट या उपचार।"],
      psychology: ["मनोविज्ञान", "मनोवैज्ञानिक या मानसिक स्वास्थ्य अपॉइंटमेंट।"],
      gp: ["GP परामर्श", "सामान्य डॉक्टर अपॉइंटमेंट।"],
      specialist: ["विशेषज्ञ परामर्श", "विशेषज्ञ डॉक्टर अपॉइंटमेंट।"],
      ambulance: ["एम्बुलेंस", "आपातकालीन परिवहन या एम्बुलेंस बिल।"],
      other: ["अन्य स्वास्थ्य सेवा", "सामान्य अगले कदम देखें।"]
    },
    results: {}
  }
};

function withEnglishResults(languageKey) {
  translations[languageKey].results = { ...translations.en.results };
}

withEnglishResults("zhHans");
withEnglishResults("zhHant");
withEnglishResults("ar");
withEnglishResults("tr");
withEnglishResults("hi");

const insurers = {
  medibank: {
    name: "Medibank",
    fallback: "M",
    logo: "assets/logos/medibank.png",
    url: "https://www.medibank.com.au/health-insurance/using-your-cover/claim/",
    plans: [
      { id: "medibank-top-extras", name: "Top Extras", type: "extras", note: "Extras-style cover for dental, optical, physio and similar services." },
      { id: "medibank-basic-extras", name: "Basic Extras / Healthy Extras", type: "extras", note: "Lower-level extras-style cover. Check limits carefully." },
      { id: "medibank-hospital", name: "Hospital Cover", type: "hospital", note: "Hospital-style cover. Usually not for ordinary GP visits." },
      { id: "medibank-combined", name: "Hospital + Extras Package", type: "combined", note: "Combined-style cover. Check the extras section for allied health claims." }
    ]
  },
  bupa: {
    name: "Bupa",
    fallback: "B",
    logo: "assets/logos/bupa.png",
    url: "https://www.bupa.com.au/health-insurance/members/make-a-claim",
    plans: [
      { id: "bupa-extras", name: "Extras Cover", type: "extras", note: "Extras-style cover for dental, optical, physio and similar services." },
      { id: "bupa-hospital", name: "Hospital Cover", type: "hospital", note: "Hospital-style cover. Usually relevant for in-hospital treatment." },
      { id: "bupa-combined", name: "Hospital + Extras Package", type: "combined", note: "Combined-style cover. Check the extras section for allied health claims." }
    ]
  },
  hcf: {
    name: "HCF",
    fallback: "HCF",
    logo: "assets/logos/hcf.png",
    url: "https://www.hcf.com.au/memberservices/claims/make-a-claim",
    plans: [
      { id: "hcf-extras", name: "Starter / Mid / Top Extras", type: "extras", note: "Extras-style cover. Check the exact extras level and annual limits." },
      { id: "hcf-hospital", name: "Hospital Cover", type: "hospital", note: "Hospital-style cover. Usually relevant for in-hospital treatment." },
      { id: "hcf-combined", name: "Hospital + Extras Package", type: "combined", note: "Combined-style cover. Check both hospital and extras inclusions." }
    ]
  },
  nib: {
    name: "nib",
    fallback: "nib",
    logo: "assets/logos/nib.png",
    url: "https://www.nib.com.au/health-information/member-services/claiming",
    plans: [
      { id: "nib-extras", name: "Core / Value / Top Extras", type: "extras", note: "Extras-style cover. Check the exact level and limits." },
      { id: "nib-hospital", name: "Hospital Cover", type: "hospital", note: "Hospital-style cover. Usually relevant for in-hospital treatment." },
      { id: "nib-combined", name: "Hospital + Extras Package", type: "combined", note: "Combined-style cover. Extras may matter for dental, optical and physio." }
    ]
  },
  ahm: {
    name: "ahm",
    fallback: "ahm",
    logo: "assets/logos/ahm.png",
    url: "https://help.ahm.com.au/hc/en-us/articles/115005293647-Make-a-claim-ahm-extras",
    plans: [
      { id: "ahm-extras", name: "Lifestyle / Family / Super Extras", type: "extras", note: "Extras-style cover. Check your extras limit and waiting period." },
      { id: "ahm-hospital", name: "Hospital Cover", type: "hospital", note: "Hospital-style cover. Usually not for ordinary GP visits." },
      { id: "ahm-combined", name: "Hospital + Extras Package", type: "combined", note: "Combined-style cover. Check the extras section for allied health claims." }
    ]
  },
  australianUnity: {
    name: "Australian Unity",
    fallback: "AU",
    logo: "assets/logos/australian-unity.png",
    url: "https://www.australianunity.com.au/health-insurance/how-to-claim",
    plans: [
      { id: "au-extras", name: "Extras Cover", type: "extras", note: "Extras-style cover for dental, optical, physio and similar services." },
      { id: "au-hospital", name: "Hospital Cover", type: "hospital", note: "Hospital-style cover. Usually relevant for in-hospital treatment." },
      { id: "au-combined", name: "Hospital + Extras Package", type: "combined", note: "Combined-style cover. Check both hospital and extras inclusions." }
    ]
  },
  other: {
    name: "Your insurer",
    fallback: "?",
    logo: "",
    url: "",
    plans: [
      { id: "other-extras", name: "Extras Cover", type: "extras", note: "Usually for dental, optical, physio and similar services." },
      { id: "other-hospital", name: "Hospital Cover", type: "hospital", note: "Usually for hospital treatment." },
      { id: "other-combined", name: "Hospital + Extras Package", type: "combined", note: "A combined policy." }
    ]
  }
};

const serviceInfo = {
  dental: {
    label: "Dental",
    category: "Usually extras cover",
    explanation: "Dental is usually linked to extras cover. Check your annual limit, waiting period, provider rules, and itemised receipt."
  },
  optical: {
    label: "Optical",
    category: "Usually extras cover",
    explanation: "Optical is usually linked to extras cover. Check whether glasses, contact lenses, or eye tests are included in your policy."
  },
  physio: {
    label: "Physiotherapy",
    category: "Usually extras cover",
    explanation: "Physiotherapy is usually linked to extras cover. Check your per-visit limit, annual limit, waiting period, and whether the provider is recognised."
  },
  psychology: {
    label: "Psychology",
    category: "May involve Medicare or extras",
    explanation: "Psychology may involve Medicare if you have a valid mental health treatment plan. Some extras policies may also include psychology benefits."
  },
  gp: {
    label: "GP consultation",
    category: "Usually Medicare",
    explanation: "Normal GP visits are usually handled through Medicare, not private health insurance. Bulk billing may be available depending on the clinic."
  },
  specialist: {
    label: "Specialist consultation",
    category: "Usually Medicare unless it is in-hospital treatment",
    explanation: "Out-of-hospital specialist consultations usually involve Medicare rebates. Private health insurance is usually more relevant if you are treated in hospital."
  },
  ambulance: {
    label: "Ambulance",
    category: "Depends on state and policy",
    explanation: "Ambulance cover depends on your state and your private health insurance policy. Check both your state rules and your insurer."
  },
  other: {
    label: "Health service",
    category: "Medicare or low-cost pathway",
    explanation: "Your next step is to check Medicare, public health, or low-cost provider options."
  }
};

function getText() {
  return translations[currentLanguage] || translations.en;
}

function answerFromKey(key) {
  const answer = getText().answers[key] || translations.en.answers[key];
  return { text: answer[0], detail: answer[1] };
}

function serviceText(key) {
  const service = getText().services[key] || translations.en.services[key];
  return { text: service[0], detail: service[1] };
}

function iconHtml(symbol) {
  return `<span class="icon-circle" aria-hidden="true">${symbol}</span>`;
}

function insurerLogoHtml(insurer) {
  if (!insurer.logo) {
    return `<span class="logo-wrap"><span class="logo-fallback" aria-hidden="true">${insurer.fallback}</span></span>`;
  }

  return `
    <span class="logo-wrap">
      <img class="insurer-logo" src="${insurer.logo}" alt="${insurer.name} logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />
      <span class="logo-fallback" aria-hidden="true" style="display: none;">${insurer.fallback}</span>
    </span>
  `;
}

function serviceAnswer(value, symbol, next) {
  const service = serviceText(value);
  return { text: service.text, detail: service.detail, iconHtml: iconHtml(symbol), value, next };
}

function serviceAnswers(next) {
  return [
    serviceAnswer("gp", "⚕", next),
    serviceAnswer("specialist", "★", next),
    serviceAnswer("psychology", "☁", next),
    serviceAnswer("dental", "□", next),
    serviceAnswer("optical", "◉", next),
    serviceAnswer("physio", "↗", next),
    serviceAnswer("ambulance", "+", next),
    serviceAnswer("other", "?", next)
  ];
}

function insurerAnswers() {
  const t = getText();
  return Object.keys(insurers).map((key) => {
    const insurer = insurers[key];

    if (key === "other") {
      return {
        text: t.otherInsurer,
        detail: t.otherInsurerDetail,
        iconHtml: insurerLogoHtml(insurer),
        value: key,
        next: "plan"
      };
    }

    return {
      text: insurer.name,
      detail: `Continue with ${insurer.name}.`,
      iconHtml: insurerLogoHtml(insurer),
      value: key,
      next: "plan"
    };
  });
}

function planAnswers() {
  const t = getText();
  const insurer = insurers[state.insurer] || insurers.other;
  const answers = insurer.plans.map((plan) => ({
    text: plan.name,
    detail: plan.note,
    iconHtml: iconHtml(plan.type === "extras" ? "+" : plan.type === "hospital" ? "H" : "✓"),
    value: plan.id,
    next: "servicePrivate"
  }));

  answers.push({
    text: t.unsureOrUnlistedPlan,
    detail: t.unsureOrUnlistedDetail,
    iconHtml: iconHtml("?"),
    value: "unknown-plan",
    next: "servicePrivate"
  });

  return answers;
}

function getStepData(stepName) {
  const t = getText();
  const step = t.steps[stepName] || translations.en.steps[stepName];

  const base = {
    eyebrow: step[0],
    title: step[1],
    help: step[2],
    label: step[3]
  };

  const steps = {
    medicare: {
      ...base,
      progress: 16,
      answers: [
        { ...answerFromKey("yesMedicare"), iconHtml: iconHtml("✓"), value: "yes", next: "privateInsurance" },
        { ...answerFromKey("noMedicare"), iconHtml: iconHtml("×"), value: "no", next: "residency" },
        { ...answerFromKey("unsureMedicare"), iconHtml: iconHtml("?"), value: "unsure", next: "medicareUnsureResult" }
      ]
    },
    residency: {
      ...base,
      progress: 33,
      answers: [
        { ...answerFromKey("living"), iconHtml: iconHtml("✓"), value: "living", next: "medicareEligibilityResult" },
        { ...answerFromKey("visitor"), iconHtml: iconHtml("✈"), value: "visitor", next: "visitorResult" }
      ]
    },
    privateInsurance: {
      ...base,
      progress: 33,
      answers: [
        { ...answerFromKey("yesInsurance"), iconHtml: iconHtml("✓"), value: "yes", next: "insurer" },
        { ...answerFromKey("noInsurance"), iconHtml: iconHtml("×"), value: "no", next: "serviceNoPrivate" },
        { ...answerFromKey("unsureInsurance"), iconHtml: iconHtml("?"), value: "unsure", next: "insuranceUnsureResult" }
      ]
    },
    insurer: {
      ...base,
      progress: 50,
      answers: insurerAnswers()
    },
    plan: {
      ...base,
      progress: 66,
      answers: planAnswers()
    },
    servicePrivate: {
      ...base,
      progress: 83,
      answers: serviceAnswers("privateResult")
    },
    serviceNoPrivate: {
      ...base,
      progress: 70,
      answers: serviceAnswers("noPrivateResult")
    }
  };

  return steps[stepName];
}

function renderStep(stepName, addToHistory = true) {
  if (addToHistory && currentStep !== stepName) {
    historyStack.push(currentStep);
  }

  currentStep = stepName;

  if (stepName.endsWith("Result")) {
    renderResult(stepName);
    return;
  }

  const step = getStepData(stepName);

  questionCard.classList.remove("hidden");
  resultCard.classList.add("hidden");
  questionVisual.classList.add("hidden");
  questionVisual.innerHTML = "";

  questionEyebrow.textContent = step.eyebrow;
  questionTitle.textContent = step.title;
  questionHelp.textContent = step.help;
  stepLabel.textContent = step.label;
  progressFill.style.width = `${step.progress}%`;

  if (stepName === "medicare") {
    renderMedicareSampleCard();
  }

  answerButtons.innerHTML = "";

  step.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.innerHTML = `
      <span class="answer-main">
        ${answer.iconHtml}
        <span>${answer.text}</span>
      </span>
      <span class="answer-detail">${answer.detail}</span>
    `;

    button.addEventListener("click", () => {
      saveAnswer(stepName, answer.value);
      renderStep(answer.next);
    });

    answerButtons.appendChild(button);
  });

  if (historyStack.length > 0) {
    backButton.classList.remove("hidden");
  } else {
    backButton.classList.add("hidden");
  }
}

function renderMedicareSampleCard() {
  const t = getText();
  questionVisual.classList.remove("hidden");
  questionVisual.innerHTML = `
    <div class="medicare-sample-card" aria-label="Sample Medicare card">
      <div class="medicare-card-top">
        <p class="medicare-card-title">Medicare</p>
        <span class="sample-stamp">${t.sample}</span>
      </div>
      <div class="medicare-card-line">
        <span>Jane Citizen</span>
        <span>2000 00000 0</span>
      </div>
    </div>
    <p class="visual-caption">${t.medicareCardCaption}</p>
  `;
}

function saveAnswer(stepName, value) {
  if (stepName === "medicare") state.medicare = value;
  if (stepName === "residency") state.residency = value;
  if (stepName === "privateInsurance") state.privateInsurance = value;
  if (stepName === "insurer") state.insurer = value;
  if (stepName === "plan") state.plan = value;
  if (stepName === "servicePrivate" || stepName === "serviceNoPrivate") state.service = value;
}

function getSelectedPlan() {
  const insurer = insurers[state.insurer] || insurers.other;
  return insurer.plans.find((plan) => plan.id === state.plan) || {
    id: "unknown-plan",
    name: getText().unsureOrUnlistedPlan,
    type: "unknown",
    note: getText().unsureOrUnlistedDetail
  };
}

function renderResult(resultType) {
  questionCard.classList.add("hidden");
  resultCard.classList.remove("hidden");
  progressFill.style.width = "100%";
  stepLabel.textContent = getText().result;

  let html = "";
  const t = getText();
  const r = t.results;

  if (resultType === "medicareUnsureResult") {
    html = `
      <p class="eyebrow">${t.result}</p>
      <h2>${r.checkMedicareTitle}</h2>
      <p>${r.checkMedicareBody}</p>
      <ul class="result-list">
        <li>Check your wallet or digital wallet for a Medicare card.</li>
        <li>Check your myGov account.</li>
        <li>Ask your family if you are listed on a family Medicare card.</li>
        <li>Use the official Services Australia information to check eligibility.</li>
      </ul>
      <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/enrolling-medicare" target="_blank" rel="noreferrer">↗ ${t.medicareEligibility}</a>
    `;
  }

  if (resultType === "medicareEligibilityResult") {
    html = `
      <p class="eyebrow">${t.result}</p>
      <h2>${r.medicareEligibilityTitle}</h2>
      <p>${r.medicareEligibilityBody}</p>
      <ul class="result-list">
        <li>Check the official Medicare enrolment rules.</li>
        <li>Prepare identity and residency documents if needed.</li>
        <li>Use Medicare first for GP, specialist and some mental health pathways.</li>
      </ul>
      <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/enrolling-medicare" target="_blank" rel="noreferrer">↗ ${t.medicareEligibility}</a>
    `;
  }

  if (resultType === "visitorResult") {
    html = `
      <p class="eyebrow">${t.result}</p>
      <h2>${r.visitorTitle}</h2>
      <p>${r.visitorBody}</p>
      <ul class="result-list">
        <li>Check whether your country has a reciprocal health care agreement.</li>
        <li>Check your travel insurance or overseas health cover.</li>
        <li>For urgent care, contact the health service directly.</li>
      </ul>
      <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/reciprocal-health-care-agreements" target="_blank" rel="noreferrer">↗ ${t.reciprocal}</a>
    `;
  }

  if (resultType === "insuranceUnsureResult") {
    html = `
      <p class="eyebrow">${t.result}</p>
      <h2>${r.insuranceUnsureTitle}</h2>
      <p>${r.insuranceUnsureBody}</p>
      <ul class="result-list">
        <li>Search your email for words like health insurance, Medibank, Bupa, HCF, nib, ahm or premium.</li>
        <li>Check your bank statements for regular health insurance payments.</li>
        <li>Ask your parents or partner if you are listed on a family policy.</li>
        <li>Check whether you have a private health insurance card.</li>
      </ul>
      <div class="notice">After you confirm your insurer and plan name, come back and use this tool again.</div>
    `;
  }

  if (resultType === "noPrivateResult") {
    const service = serviceInfo[state.service] || serviceInfo.other;
    html = `
      <p class="eyebrow">${t.result}</p>
      <h2>${service.label}: ${r.noPrivateTitle}</h2>
      <p><strong>${r.likelyPathway}:</strong> ${service.category}</p>
      <p>${service.explanation}</p>
      <h3>${r.whatNext}</h3>
      <ul class="result-list">
        <li>Use Healthdirect to find a nearby health service.</li>
        <li>Look for bulk-billing or low-cost providers where available.</li>
        <li>Call the clinic before booking and ask about out-of-pocket costs.</li>
        <li>For GP visits, ask directly whether they bulk bill.</li>
      </ul>
      <a class="primary-link green" href="https://www.healthdirect.gov.au/australian-health-services" target="_blank" rel="noreferrer">↗ ${t.healthdirect}</a>
    `;
  }

  if (resultType === "privateResult") {
    html = renderPrivateResult();
  }

  html += `<div class="notice">${r.reminder}</div>`;
  resultCard.innerHTML = html;
}

function renderPrivateResult() {
  const t = getText();
  const r = t.results;
  const service = serviceInfo[state.service] || serviceInfo.other;
  const insurer = insurers[state.insurer] || insurers.other;
  const plan = getSelectedPlan();
  const isDoctorConsult = ["gp", "specialist"].includes(state.service);
  const isExtrasService = ["dental", "optical", "physio", "psychology"].includes(state.service);

  let decision = "";

  if (isDoctorConsult) {
    decision = `<div class="notice"><strong>${r.doctorNotice}</strong></div>`;
  } else if (isExtrasService && ["extras", "combined"].includes(plan.type)) {
    decision = `<div class="notice">${r.extrasLikely}</div>`;
  } else if (isExtrasService && plan.type === "hospital") {
    decision = `<div class="notice">${r.hospitalIssue}</div>`;
  } else if (state.service === "ambulance") {
    decision = `<div class="notice">${r.ambulanceNotice}</div>`;
  } else {
    decision = `<div class="notice">${r.policyNotice}</div>`;
  }

  const planWarning = plan.type === "unknown"
    ? `<div class="notice">${r.planUnsureNotice}</div>`
    : "";

  const insurerLink = insurer.url
    ? `<a class="primary-link blue" href="${insurer.url}" target="_blank" rel="noreferrer">↗ ${t.officialClaim}</a>`
    : `<div class="notice">Your insurer is not listed yet. Search your insurer's official website for “make a claim”, “extras claim”, or “member login”.</div>`;

  return `
    <p class="eyebrow">${t.result}</p>
    <h2>${service.label}: ${r.privateTitle}</h2>
    <p><strong>${r.selectedInsurer}:</strong> ${insurer.name}</p>
    <p><strong>${r.selectedPlan}:</strong> ${plan.name}</p>
    <p><strong>${r.likelyCategory}:</strong> ${service.category}</p>
    <p>${service.explanation}</p>

    ${decision}
    ${planWarning}

    <h3>${r.beforeClaim}</h3>
    <ul class="result-list">
      <li>Is this service included in your exact policy?</li>
      <li>Has your waiting period finished?</li>
      <li>Do you have an itemised receipt or invoice?</li>
      <li>Is the provider recognised by your insurer?</li>
      <li>Have you already used your annual limit?</li>
    </ul>

    <h3>${r.nextStep}</h3>
    <p>Use your insurer's official claim page to confirm your cover and start the claim.</p>

    ${insurerLink}
  `;
}

function updateStaticText() {
  const t = getText();
  document.documentElement.lang = t.langCode;
  document.body.classList.toggle("rtl", t.direction === "rtl");
  languageLabel.textContent = t.language;
  heroTag.textContent = t.heroTag;
  heroSlogan.textContent = t.slogan;
  heroSubtext.textContent = t.subtext;
  restartText.textContent = t.restart;
  backText.textContent = t.back;
  smallPrintText.textContent = t.smallPrint;
}

backButton.addEventListener("click", () => {
  const previousStep = historyStack.pop();

  if (previousStep) {
    renderStep(previousStep, false);
  }
});

restartButton.addEventListener("click", () => {
  state.medicare = null;
  state.residency = null;
  state.privateInsurance = null;
  state.insurer = null;
  state.plan = null;
  state.service = null;

  historyStack.length = 0;
  renderStep("medicare", false);
});

languageSelect.addEventListener("change", (event) => {
  currentLanguage = event.target.value;
  localStorage.setItem("claimcheckLanguage", currentLanguage);
  updateStaticText();
  renderStep(currentStep, false);
});

languageSelect.value = currentLanguage;
updateStaticText();
renderStep("medicare", false);
