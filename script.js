const state = {
  medicare: null,
  residency: null,
  medicareIdentity: null,
  nzDuration: null,
  prWork: null,
  visitorCountry: null,
  visitorService: null,
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
    medicareEligibilityLink: "Check Medicare eligibility",
    medicareApplyLink: "How to enrol in Medicare",
    reciprocalLink: "Check reciprocal health care agreements",
    continueWith: "Continue with",
    unsureOrUnlistedPlan: "I am not sure / my plan is not listed",
    unsureOrUnlistedDetail: "I need to check my insurer app, email, or policy statement.",
    otherInsurer: "Other / not listed",
    otherInsurerDetail: "I will search for my insurer manually.",
    whyCountry: "We ask this because Australia has health care agreements with specific countries. It is about government agreement rules, not your race or ethnicity.",
    steps: {
      medicare: ["Step 1", "Do You Have a Medicare Card?", "Look at the sample card below and choose the option that best matches you.", "Step 1 of 7"],
      residency: ["Medicare Eligibility", "Are You Living in Australia Long Term?", "This helps us decide whether to check normal Medicare enrolment or visitor health care rules.", "Step 2 of 7"],
      medicareIdentity: ["Medicare Eligibility", "Which Best Describes You?", "Choose the option that best matches the person who needs the health service.", "Step 3 of 7"],
      nzDuration: ["New Zealand Citizen", "How Long Are You Living in Australia?", "New Zealand citizens may have different Medicare pathways depending on whether they live in Australia long term or are visiting.", "Step 4 of 7"],
      prWork: ["Permanent Residency Application", "Do You Have Work Rights or Close Family in Australia?", "This helps check whether you may be able to enrol while your permanent residency or protection visa is being assessed.", "Step 4 of 7"],
      visitorCountry: ["Visitor Guidance", "Where Are You Visiting From?", "We ask this because Australia has health care agreements with specific countries. It is about government agreement rules, not your race or ethnicity.", "Step 3 of 7"],
      visitorService: ["Visitor Guidance", "Which Consultation or Service Do You Want to Check?", "Choose the health service you are considering, booking, or claiming.", "Step 4 of 7"],
      privateInsurance: ["Private Health Insurance", "Do You Have Private Health Insurance?", "This helps decide whether we guide you through an insurer claim, a Medicare pathway, or both.", "Step 2 of 7"],
      insurer: ["Insurer", "Which Private Health Insurer Are You With?", "Choose the company you recognise. You can replace these placeholder logos with real images in the assets folder.", "Step 3 of 7"],
      plan: ["Plan Name", "Which Plan Looks Most Like Yours?", "Choose the closest plan name. If you are unsure, choose the unsure option.", "Step 4 of 7"],
      servicePrivate: ["Health Service", "Which Health Service Do You Want to Check?", "Choose the appointment or service you are considering, booking, or claiming.", "Step 5 of 7"],
      serviceNoPrivate: ["Health Service", "Which Health Service Do You Want to Check?", "We will show the Medicare or low-cost pathway.", "Step 3 of 3"]
    },
    answers: {
      yesMedicare: ["Yes, I have a Medicare card", "I can use Medicare services in Australia."],
      noMedicare: ["No, I do not", "I may be visiting, new to Australia, or not eligible."],
      unsureMedicare: ["I am not sure", "Help me check whether I might already have Medicare or could apply."],
      living: ["Yes, I live in Australia", "For example, citizen, permanent resident, or applying for permanent residency."],
      visitor: ["No, I am visiting Australia", "For example, tourist, visitor, or short stay."],
      citizen: ["Australian citizen", "I am an Australian citizen or I need to enrol as one."],
      nzCitizen: ["New Zealand citizen", "I am from New Zealand and I am in Australia."],
      permanentResident: ["Australian permanent resident", "I have already been granted permanent residency."],
      appliedPr: ["I have applied for permanent residency or protection visa", "My permanent visa or protection visa application is being assessed."],
      temporaryResident: ["Temporary resident", "I have a temporary visa and I am not applying for permanent residency."],
      identityUnsure: ["I am not sure", "I need a general step-by-step way to check."],
      sixPlus: ["6 months or more", "I have lived here for 6 months, or I can prove I will live here for 6 months or more."],
      underSix: ["Less than 6 months", "I am mostly visiting or staying short term."],
      durationUnsure: ["I am not sure", "I need to check my documents first."],
      workRights: ["Yes, I have work rights", "My current visa allows me to work in Australia."],
      closeFamily: ["No work rights, but close family in Australia", "I have a parent, spouse, de facto partner or child who is an Australian citizen, permanent resident, or New Zealand citizen living in Australia."],
      noWorkNoFamily: ["No / I am not sure", "I do not know if I meet these extra requirements."],
      yesInsurance: ["Yes", "I have a private health insurance policy."],
      noInsurance: ["No", "I only want Medicare or low-cost options."],
      unsureInsurance: ["I am not sure", "I might be on a family policy or old policy."],
      otherCountry: ["Another country / I am not sure", "My country is not listed or I do not know which rule applies."]
    },
    services: {
      gp: ["GP consultation", "A normal doctor appointment at a clinic."],
      specialist: ["Specialist consultation", "A specialist doctor appointment, before or after booking."],
      psychology: ["Psychology", "Psychologist or mental health appointment."],
      dental: ["Dental", "Check-up, clean, filling, braces, or wisdom teeth."],
      optical: ["Optical", "Glasses, contact lenses, or eye-related costs."],
      physio: ["Physiotherapy", "Physio appointment or treatment."],
      ambulance: ["Ambulance", "Emergency transport or ambulance bill."],
      other: ["Other health service", "Get general next steps."]
    },
    serviceCategory: {
      gp: "Usually Medicare",
      specialist: "Usually Medicare unless it is in-hospital treatment",
      psychology: "May involve Medicare or extras",
      dental: "Usually extras cover",
      optical: "Usually extras cover",
      physio: "Usually extras cover",
      ambulance: "Depends on state and policy",
      other: "Medicare or low-cost pathway"
    },
    serviceExplanation: {
      gp: "Normal GP visits are usually handled through Medicare, not private health insurance. Bulk billing may be available depending on the clinic.",
      specialist: "Out-of-hospital specialist consultations usually involve Medicare rebates. Private health insurance is usually more relevant if you are treated in hospital.",
      psychology: "Psychology may involve Medicare if you have a valid mental health treatment plan. Some extras policies may also include psychology benefits.",
      dental: "Dental is usually linked to extras cover. Check your annual limit, waiting period, provider rules, and itemised receipt.",
      optical: "Optical is usually linked to extras cover. Check whether glasses, contact lenses, or eye tests are included in your policy.",
      physio: "Physiotherapy is usually linked to extras cover. Check your per-visit limit, annual limit, waiting period, and whether the provider is recognised.",
      ambulance: "Ambulance cover depends on your state and your private health insurance policy. Check both your state rules and your insurer.",
      other: "Your next step is to check Medicare, public health, or low-cost provider options."
    },
    results: {
      likelyPathway: "Likely pathway",
      selectedInsurer: "Selected insurer",
      selectedPlan: "Selected plan",
      likelyCategory: "Likely category",
      whatNext: "What to do next",
      beforeClaim: "Before you claim, check this",
      nextStep: "Your next step",
      reminder: "Reminder: this is general guidance only. It does not confirm that your claim will be accepted.",
      applyTitle: "You May Be Able to Enrol in Medicare",
      applyBody: "Based on your answers, Medicare is worth checking before you pay privately. You may already be on a family Medicare card, or you may be able to enrol yourself.",
      citizenBody: "Australian citizens who live in Australia can usually enrol in Medicare, but they need to provide identity and residency documents.",
      nzBody: "New Zealand citizens can usually enrol if they can prove they will live in Australia for 6 months or more, have lived here for 6 months or more in the last 12 months, or live here and have applied for permanent residency.",
      permanentBody: "Australian permanent residents can usually enrol in Medicare if they provide identity and permanent residency documents.",
      appliedPrBody: "Some people who have applied for permanent residency or a permanent protection visa can enrol while the application is being assessed, especially if they have work rights or qualifying close family in Australia.",
      maybeAppliedPrBody: "You may still have a possible pathway, but your answer depends on your visa conditions and family situation. Check the official Medicare enrolment rules before relying on Medicare.",
      temporaryBody: "Temporary residents are not automatically covered. Some temporary visa holders may be covered by a Ministerial Order, but you need to check the official rules for your visa.",
      generalBody: "Start by checking whether you are already on a family Medicare card, then check whether your citizenship or visa status lets you enrol.",
      applySteps: ["Check whether you are already listed on a family Medicare card.", "Sign in to myGov and check whether Medicare is linked to your account.", "If you are not enrolled, collect your passport, ImmiCard, visa, citizenship, residency, or address documents depending on your situation.", "Use the official Medicare enrolment page to enrol online where available, or use the Medicare enrolment form."],
      visitorCoveredTitle: "You May Have Visitor Medicare Support",
      visitorNotListedTitle: "You May Need Travel Insurance or Overseas Health Cover",
      visitorCoveredBody: "Australia has a reciprocal health care agreement with the country you selected. This means the consultation may be partly covered by Medicare if it meets the agreement conditions.",
      visitorItalyNote: "For visitors from Italy, Services Australia says Medicare support may apply for a period of 6 months while in Australia.",
      visitorNotListedBody: "The country you selected is not in this tool's reciprocal agreement list. You should check travel insurance, overseas student health cover, or pay privately unless the official Services Australia page says otherwise.",
      visitorWhy: "This question is about country-specific government agreements. It is not about race, ethnicity, language, or appearance.",
      visitorSteps: ["Ask the clinic whether they accept Medicare or Reciprocal Health Care Agreement patients before booking.", "Bring your passport, visa information, and any health insurance documents.", "For urgent care, contact the health service directly and ask about upfront costs.", "Use the official Services Australia reciprocal agreement page to confirm the exact rule for your country."],
      insuranceUnsureTitle: "Check Whether You Already Have Private Health Insurance",
      insuranceUnsureBody: "You might already be covered under your own policy or a family policy.",
      insuranceUnsureSteps: ["Search your email for words like health insurance, Medibank, Bupa, HCF, nib, ahm or premium.", "Check your bank statements for regular health insurance payments.", "Ask your parents or partner if you are listed on a family policy.", "Check whether you have a private health insurance card."],
      noPrivateTitle: "Medicare or Low-Cost Pathway",
      privateTitle: "Claim Guide",
      doctorNotice: "Important: this looks like a doctor consultation. GP visits and out-of-hospital specialist consultations are usually claimed through Medicare, not private health insurance. Private health insurance usually becomes relevant for doctor fees only when the treatment is in hospital.",
      extrasLikely: "Likely next step: your selected plan looks like it may include extras. This service may be claimable if it is included, your waiting period has finished, and you have not used your annual limit.",
      hospitalIssue: "You selected hospital-style cover. This service is often linked to extras cover, so you may not be able to claim unless your policy also includes extras.",
      ambulanceNotice: "Ambulance cover depends on your state and the exact policy. Check both the insurer and the state ambulance rules.",
      policyNotice: "This depends on your exact policy. Check the official insurer app, policy statement, or claim page before booking.",
      planUnsureNotice: "Because you are unsure of your exact plan, treat this as a guide only. Check your insurer app or call the insurer before booking.",
      claimChecklist: ["Is this service included in your exact policy?", "Has your waiting period finished?", "Do you have an itemised receipt or invoice?", "Is the provider recognised by your insurer?", "Have you already used your annual limit?"],
      noPrivateSteps: ["Use Healthdirect to find a nearby health service.", "Look for bulk-billing or low-cost providers where available.", "Call the clinic before booking and ask about out-of-pocket costs.", "For GP visits, ask directly whether they bulk bill."],
      officialClaimText: "Use your insurer's official claim page to confirm your cover and start the claim.",
      otherInsurerNotice: "Your insurer is not listed yet. Search your insurer's official website for make a claim, extras claim, or member login."
    }
  },

  zhHans: {
    langCode: "zh-Hans",
    direction: "ltr",
    language: "语言",
    heroTag: "澳洲医疗报销助手",
    slogan: "报销最大化助手",
    subtext: "帮助你了解哪些医疗费用可能可以报销。",
    restart: "重新开始",
    back: "返回",
    result: "结果",
    sample: "样本",
    medicareCardCaption: "这只是假的样本卡。真实的 Medicare 卡可能是实体卡，也可能在 myGov 应用中显示。",
    smallPrint: "ClaimCheck AU 只提供一般信息，不提供医疗、法律、财务或保险建议。请始终向 Medicare、保险公司或医疗机构确认。",
    officialClaim: "前往官方理赔页面",
    healthdirect: "查找医疗服务",
    medicareEligibilityLink: "查看 Medicare 资格",
    medicareApplyLink: "如何申请 Medicare",
    reciprocalLink: "查看互惠医疗协议",
    continueWith: "继续选择",
    unsureOrUnlistedPlan: "我不确定 / 我的计划不在列表中",
    unsureOrUnlistedDetail: "我需要查看保险公司 app、邮件或保单文件。",
    otherInsurer: "其他 / 未列出",
    otherInsurerDetail: "我会自己查找保险公司。",
    whyCountry: "我们询问国家是因为澳洲只与特定国家有医疗互惠协议。这是政府协议规则，不是种族或族裔问题。",
    steps: {
      medicare: ["步骤 1", "你有 Medicare 卡吗？", "请看下面的样本卡，然后选择最符合你的选项。", "步骤 1 / 7"],
      residency: ["Medicare 资格", "你是否长期居住在澳洲？", "这能帮助我们判断应该查看普通 Medicare 申请规则，还是访客医疗规则。", "步骤 2 / 7"],
      medicareIdentity: ["Medicare 资格", "哪一项最符合你的情况？", "请选择最符合需要使用医疗服务的人的选项。", "步骤 3 / 7"],
      nzDuration: ["新西兰公民", "你将在澳洲居住多久？", "新西兰公民是否可申请 Medicare，取决于是否长期居住或只是访客。", "步骤 4 / 7"],
      prWork: ["永居申请", "你有工作权利或在澳洲有近亲吗？", "这能帮助判断你在永居或保护签证审理期间是否可能申请 Medicare。", "步骤 4 / 7"],
      visitorCountry: ["访客指引", "你从哪个国家来澳洲？", "我们询问国家是因为澳洲只与特定国家有医疗互惠协议。这是政府协议规则，不是种族或族裔问题。", "步骤 3 / 7"],
      visitorService: ["访客指引", "你想查询哪种问诊或服务？", "请选择你正在考虑、准备预约或想报销的医疗服务。", "步骤 4 / 7"],
      privateInsurance: ["私人医保", "你有私人健康保险吗？", "这能帮助我们判断应走保险理赔、Medicare，还是两者都看。", "步骤 2 / 7"],
      insurer: ["保险公司", "你的私人医保是哪家公司？", "请选择你认识的公司。你之后可以在 assets 文件夹中替换真实 logo。", "步骤 3 / 7"],
      plan: ["计划名称", "哪个计划最像你的保险计划？", "请选择最接近的计划名称。如果不确定，请选择不确定。", "步骤 4 / 7"],
      servicePrivate: ["医疗服务", "你想查询哪种医疗服务？", "请选择你正在考虑、准备预约或想报销的服务。", "步骤 5 / 7"],
      serviceNoPrivate: ["医疗服务", "你想查询哪种医疗服务？", "我们会显示 Medicare 或低费用路径。", "步骤 3 / 3"]
    }
  },

  zhHant: {
    langCode: "zh-Hant",
    direction: "ltr",
    language: "語言",
    heroTag: "澳洲醫療報銷助手",
    slogan: "報銷最大化助手",
    subtext: "幫助你了解哪些醫療費用可能可以報銷。",
    restart: "重新開始",
    back: "返回",
    result: "結果",
    sample: "樣本",
    medicareCardCaption: "這只是假的樣本卡。真實的 Medicare 卡可能是實體卡，也可能在 myGov 應用程式中顯示。",
    smallPrint: "ClaimCheck AU 只提供一般資訊，不提供醫療、法律、財務或保險建議。請始終向 Medicare、保險公司或醫療機構確認。",
    officialClaim: "前往官方理賠頁面",
    healthdirect: "尋找醫療服務",
    medicareEligibilityLink: "查看 Medicare 資格",
    medicareApplyLink: "如何申請 Medicare",
    reciprocalLink: "查看互惠醫療協議",
    continueWith: "繼續選擇",
    unsureOrUnlistedPlan: "我不確定 / 我的計劃不在列表中",
    unsureOrUnlistedDetail: "我需要查看保險公司 app、電郵或保單文件。",
    otherInsurer: "其他 / 未列出",
    otherInsurerDetail: "我會自行查找保險公司。",
    whyCountry: "我們詢問國家是因為澳洲只與特定國家有醫療互惠協議。這是政府協議規則，不是種族或族裔問題。"
  },

  ar: {
    langCode: "ar",
    direction: "rtl",
    language: "اللغة",
    heroTag: "مساعد المطالبات الصحية في أستراليا",
    slogan: "تعظيم المطالبة",
    subtext: "نساعدك على فهم ما قد يكون قابلاً للمطالبة ضمن الرعاية الصحية.",
    restart: "إعادة البدء",
    back: "رجوع",
    result: "النتيجة",
    sample: "نموذج",
    medicareCardCaption: "هذه بطاقة نموذجية غير حقيقية. قد تكون بطاقة Medicare الحقيقية ورقية أو رقمية في تطبيق myGov.",
    smallPrint: "يوفر ClaimCheck AU معلومات عامة فقط ولا يقدم نصيحة طبية أو قانونية أو مالية أو تأمينية. تأكد دائماً من Medicare أو شركة التأمين أو مقدم الخدمة الصحية.",
    officialClaim: "الانتقال إلى صفحة المطالبات الرسمية",
    healthdirect: "البحث عن خدمة صحية",
    medicareEligibilityLink: "التحقق من أهلية Medicare",
    medicareApplyLink: "كيفية التسجيل في Medicare",
    reciprocalLink: "التحقق من اتفاقيات الرعاية الصحية المتبادلة",
    continueWith: "المتابعة مع",
    unsureOrUnlistedPlan: "لست متأكداً / خطتي غير موجودة",
    unsureOrUnlistedDetail: "أحتاج إلى مراجعة تطبيق شركة التأمين أو البريد الإلكتروني أو وثيقة البوليصة.",
    otherInsurer: "أخرى / غير مدرجة",
    otherInsurerDetail: "سأبحث عن شركة التأمين بنفسي.",
    whyCountry: "نسأل عن البلد لأن أستراليا لديها اتفاقيات رعاية صحية مع دول محددة. هذا يتعلق بقواعد حكومية وليس بالعرق أو الأصل."
  },

  tr: {
    langCode: "tr",
    direction: "ltr",
    language: "Dil",
    heroTag: "Avustralya Sağlık Talep Yardımcısı",
    slogan: "Talep Maksimizeri",
    subtext: "Uygun sağlık taleplerinden en iyi şekilde yararlanmanıza yardımcı olur.",
    restart: "Yeniden başlat",
    back: "Geri",
    result: "Sonuç",
    sample: "ÖRNEK",
    medicareCardCaption: "Bu yalnızca sahte bir örnek karttır. Gerçek Medicare kartınız fiziksel olabilir veya myGov uygulamasında dijital olabilir.",
    smallPrint: "ClaimCheck AU yalnızca genel bilgi verir. Tıbbi, hukuki, finansal veya sigorta tavsiyesi değildir. Her zaman Medicare, sigortacınız veya sağlık sağlayıcınızla doğrulayın.",
    officialClaim: "Resmi talep sayfasına git",
    healthdirect: "Sağlık hizmeti bul",
    medicareEligibilityLink: "Medicare uygunluğunu kontrol et",
    medicareApplyLink: "Medicare'e nasıl kayıt olunur",
    reciprocalLink: "Karşılıklı sağlık anlaşmalarını kontrol et",
    continueWith: "Devam et",
    unsureOrUnlistedPlan: "Emin değilim / planım listede yok",
    unsureOrUnlistedDetail: "Sigorta uygulamamı, e-postamı veya poliçe belgesini kontrol etmem gerekiyor.",
    otherInsurer: "Diğer / listede yok",
    otherInsurerDetail: "Sigortacımı kendim arayacağım.",
    whyCountry: "Ülkeyi sormamızın nedeni, Avustralya'nın belirli ülkelerle sağlık anlaşmaları olmasıdır. Bu ırk veya etnik kökenle ilgili değildir."
  },

  hi: {
    langCode: "hi",
    direction: "ltr",
    language: "भाषा",
    heroTag: "ऑस्ट्रेलियाई हेल्थ क्लेम सहायक",
    slogan: "क्लेम मैक्सिमाइज़र",
    subtext: "योग्य स्वास्थ्य क्लेम को समझने और अधिकतम करने में मदद।",
    restart: "फिर से शुरू करें",
    back: "वापस",
    result: "परिणाम",
    sample: "नमूना",
    medicareCardCaption: "यह केवल नकली नमूना कार्ड है। आपका असली Medicare कार्ड भौतिक या myGov ऐप में डिजिटल हो सकता है।",
    smallPrint: "ClaimCheck AU केवल सामान्य जानकारी देता है। यह मेडिकल, कानूनी, वित्तीय या बीमा सलाह नहीं है। हमेशा Medicare, अपने बीमाकर्ता या स्वास्थ्य प्रदाता से पुष्टि करें।",
    officialClaim: "आधिकारिक क्लेम पेज पर जाएं",
    healthdirect: "स्वास्थ्य सेवा खोजें",
    medicareEligibilityLink: "Medicare पात्रता जांचें",
    medicareApplyLink: "Medicare में कैसे नामांकन करें",
    reciprocalLink: "पारस्परिक स्वास्थ्य समझौते जांचें",
    continueWith: "इसके साथ जारी रखें",
    unsureOrUnlistedPlan: "मुझे यकीन नहीं है / मेरी योजना सूची में नहीं है",
    unsureOrUnlistedDetail: "मुझे बीमा ऐप, ईमेल या पॉलिसी स्टेटमेंट देखना होगा।",
    otherInsurer: "अन्य / सूची में नहीं",
    otherInsurerDetail: "मैं अपने बीमाकर्ता को स्वयं खोजूंगा।",
    whyCountry: "हम देश इसलिए पूछते हैं क्योंकि ऑस्ट्रेलिया के कुछ देशों के साथ स्वास्थ्य समझौते हैं। यह नस्ल या जातीयता के बारे में नहीं है।"
  }
};

const english = translations.en;

function fillLanguage(key) {
  const lang = translations[key];
  lang.steps = { ...english.steps, ...(lang.steps || {}) };
  lang.answers = { ...english.answers, ...(lang.answers || {}) };
  lang.services = { ...english.services, ...(lang.services || {}) };
  lang.serviceCategory = { ...english.serviceCategory, ...(lang.serviceCategory || {}) };
  lang.serviceExplanation = { ...english.serviceExplanation, ...(lang.serviceExplanation || {}) };
  lang.results = { ...english.results, ...(lang.results || {}) };
}

Object.keys(translations).forEach(fillLanguage);


Object.assign(translations.zhHans.answers, {
  yesMedicare: ["有，我有 Medicare 卡", "我可以在澳洲使用 Medicare 服务。"],
  noMedicare: ["没有", "我可能是访客、新来澳洲，或不符合资格。"],
  unsureMedicare: ["我不确定", "帮我检查我是否可能已经有 Medicare，或者是否可以申请。"],
  living: ["是，我住在澳洲", "例如公民、永久居民，或正在申请永居。"],
  visitor: ["不是，我只是来澳洲访问", "例如游客、访客或短期停留。"],
  citizen: ["澳洲公民", "我是澳洲公民，或需要以公民身份申请。"],
  nzCitizen: ["新西兰公民", "我来自新西兰，现在在澳洲。"],
  permanentResident: ["澳洲永久居民", "我已经获得澳洲永久居民身份。"],
  appliedPr: ["我已申请永居或保护签证", "我的永居或保护签证正在审理中。"],
  temporaryResident: ["临时签证持有人", "我持有临时签证，且没有申请永居。"],
  identityUnsure: ["我不确定", "我需要一个简单的检查步骤。"],
  sixPlus: ["6 个月或以上", "我已经住满 6 个月，或可以证明会住 6 个月以上。"],
  underSix: ["少于 6 个月", "我主要是短期访问。"],
  durationUnsure: ["我不确定", "我需要先检查文件。"],
  workRights: ["有，我有工作权利", "我当前的签证允许我在澳洲工作。"],
  closeFamily: ["没有工作权利，但在澳洲有近亲", "我有父母、配偶、事实伴侣或子女是澳洲公民、永久居民，或居住在澳洲的新西兰公民。"],
  noWorkNoFamily: ["没有 / 我不确定", "我不知道自己是否符合这些额外要求。"],
  yesInsurance: ["有", "我有私人医疗保险。"],
  noInsurance: ["没有", "我只想看 Medicare 或低费用选项。"],
  unsureInsurance: ["我不确定", "我可能在家庭保险或旧保险里面。"],
  otherCountry: ["其他国家 / 我不确定", "我的国家没有列出，或我不知道适用哪条规则。"]
});
Object.assign(translations.zhHans.services, {
  dental: ["牙科", "洗牙、补牙、牙套或智齿等。"],
  optical: ["眼科 / 配镜", "眼镜、隐形眼镜或眼睛相关费用。"],
  physio: ["物理治疗", "物理治疗预约或治疗。"],
  psychology: ["心理咨询", "心理医生或心理健康预约。"],
  gp: ["GP 家庭医生", "普通医生预约。"],
  specialist: ["专科医生", "预约前或预约后的专科医生问诊。"],
  ambulance: ["救护车", "紧急交通或救护车账单。"],
  other: ["其他医疗服务", "查看一般下一步。"]
});
Object.assign(translations.zhHant.steps, {
  medicare: ["步驟 1", "你有 Medicare 卡嗎？", "請看下面的樣本卡，然後選擇最符合你的選項。", "步驟 1 / 7"],
  residency: ["Medicare 資格", "你是否長期住在澳洲？", "這能幫助我們判斷應查看普通 Medicare 申請規則，還是訪客醫療規則。", "步驟 2 / 7"],
  medicareIdentity: ["Medicare 資格", "哪一項最符合你的情況？", "請選擇最符合需要使用醫療服務的人的選項。", "步驟 3 / 7"],
  nzDuration: ["新西蘭公民", "你會在澳洲居住多久？", "新西蘭公民是否可申請 Medicare，取決於是否長期居住或只是訪客。", "步驟 4 / 7"],
  prWork: ["永居申請", "你有工作權利或在澳洲有近親嗎？", "這能幫助判斷你在永居或保護簽證審理期間是否可能申請 Medicare。", "步驟 4 / 7"],
  visitorCountry: ["訪客指引", "你從哪個國家來澳洲？", "我們詢問國家是因為澳洲只與特定國家有醫療互惠協議。這是政府協議規則，不是種族或族裔問題。", "步驟 3 / 7"],
  visitorService: ["訪客指引", "你想查詢哪種問診或服務？", "請選擇你正在考慮、準備預約或想報銷的醫療服務。", "步驟 4 / 7"],
  privateInsurance: ["私人醫療保險", "你有私人醫療保險嗎？", "這能幫助我們判斷應走保險理賠、Medicare，還是兩者都看。", "步驟 2 / 7"],
  insurer: ["保險公司", "你的私人醫療保險是哪家公司？", "請選擇你認識的公司。你之後可以在 assets 文件夾中替換真實 logo。", "步驟 3 / 7"],
  plan: ["計劃名稱", "哪個計劃最像你的保險計劃？", "請選擇最接近的計劃名稱。如果不確定，請選擇不確定。", "步驟 4 / 7"],
  servicePrivate: ["醫療服務", "你想查詢哪種醫療服務？", "請選擇你正在考慮、準備預約或想報銷的服務。", "步驟 5 / 7"],
  serviceNoPrivate: ["醫療服務", "你想查詢哪種醫療服務？", "我們會顯示 Medicare 或低費用路徑。", "步驟 3 / 3"]
});
Object.assign(translations.zhHant.answers, {
  yesMedicare: ["有，我有 Medicare 卡", "我可以在澳洲使用 Medicare 服務。"],
  noMedicare: ["沒有", "我可能是訪客、新來澳洲，或不符合資格。"],
  unsureMedicare: ["我不確定", "幫我檢查我是否可能已經有 Medicare，或者是否可以申請。"],
  living: ["是，我住在澳洲", "例如公民、永久居民，或正在申請永居。"],
  visitor: ["不是，我只是來澳洲訪問", "例如遊客、訪客或短期停留。"],
  citizen: ["澳洲公民", "我是澳洲公民，或需要以公民身份申請。"],
  nzCitizen: ["新西蘭公民", "我來自新西蘭，現在在澳洲。"],
  permanentResident: ["澳洲永久居民", "我已經獲得澳洲永久居民身份。"],
  appliedPr: ["我已申請永居或保護簽證", "我的永居或保護簽證正在審理中。"],
  temporaryResident: ["臨時簽證持有人", "我持有臨時簽證，且沒有申請永居。"],
  identityUnsure: ["我不確定", "我需要一個簡單的檢查步驟。"],
  sixPlus: ["6 個月或以上", "我已經住滿 6 個月，或可以證明會住 6 個月以上。"],
  underSix: ["少於 6 個月", "我主要是短期訪問。"],
  durationUnsure: ["我不確定", "我需要先檢查文件。"],
  workRights: ["有，我有工作權利", "我當前的簽證允許我在澳洲工作。"],
  closeFamily: ["沒有工作權利，但在澳洲有近親", "我有父母、配偶、事實伴侶或子女是澳洲公民、永久居民，或居住在澳洲的新西蘭公民。"],
  noWorkNoFamily: ["沒有 / 我不確定", "我不知道自己是否符合這些額外要求。"],
  yesInsurance: ["有", "我有私人醫療保險。"],
  noInsurance: ["沒有", "我只想看 Medicare 或低費用選項。"],
  unsureInsurance: ["我不確定", "我可能在家庭保險或舊保險裡面。"],
  otherCountry: ["其他國家 / 我不確定", "我的國家沒有列出，或我不知道適用哪條規則。"]
});
Object.assign(translations.zhHant.services, {
  dental: ["牙科", "洗牙、補牙、牙套或智慧齒等。"],
  optical: ["眼科 / 配鏡", "眼鏡、隱形眼鏡或眼睛相關費用。"],
  physio: ["物理治療", "物理治療預約或治療。"],
  psychology: ["心理諮詢", "心理醫生或心理健康預約。"],
  gp: ["GP 家庭醫生", "普通醫生預約。"],
  specialist: ["專科醫生", "預約前或預約後的專科醫生問診。"],
  ambulance: ["救護車", "緊急交通或救護車帳單。"],
  other: ["其他醫療服務", "查看一般下一步。"]
});

Object.assign(translations.ar.steps, {
  medicareIdentity: ["أهلية Medicare", "أي وصف يناسبك أكثر؟", "اختر الخيار الأقرب للشخص الذي يحتاج إلى الخدمة الصحية.", "الخطوة 3 من 7"],
  nzDuration: ["مواطن نيوزيلندي", "كم من الوقت ستعيش في أستراليا؟", "قد تختلف أهلية مواطني نيوزيلندا حسب مدة الإقامة أو الزيارة.", "الخطوة 4 من 7"],
  prWork: ["طلب الإقامة الدائمة", "هل لديك حق العمل أو قريب مباشر في أستراليا؟", "يساعد هذا في معرفة ما إذا كان يمكنك التسجيل أثناء تقييم طلب الإقامة الدائمة أو الحماية.", "الخطوة 4 من 7"],
  visitorCountry: ["إرشادات للزائر", "من أي بلد تزور أستراليا؟", "نسأل عن البلد لأن أستراليا لديها اتفاقيات صحية مع دول محددة. هذا ليس عن العرق أو الأصل.", "الخطوة 3 من 7"],
  visitorService: ["إرشادات للزائر", "ما الاستشارة أو الخدمة التي تريد التحقق منها؟", "اختر الخدمة الصحية التي تفكر فيها أو تريد حجزها أو المطالبة بها.", "الخطوة 4 من 7"]
});
Object.assign(translations.ar.answers, {
  citizen: ["مواطن أسترالي", "أنا مواطن أسترالي أو أحتاج إلى التسجيل بصفتي مواطناً."],
  nzCitizen: ["مواطن نيوزيلندي", "أنا من نيوزيلندا وموجود في أستراليا."],
  permanentResident: ["مقيم دائم في أستراليا", "لقد حصلت بالفعل على الإقامة الدائمة."],
  appliedPr: ["تقدمت للإقامة الدائمة أو تأشيرة حماية", "طلبي قيد التقييم."],
  temporaryResident: ["مقيم مؤقت", "لدي تأشيرة مؤقتة ولا أتقدم للإقامة الدائمة."],
  identityUnsure: ["لست متأكداً", "أحتاج إلى خطوات عامة للتحقق."],
  sixPlus: ["6 أشهر أو أكثر", "أستطيع إثبات أنني سأعيش هنا 6 أشهر أو أكثر."],
  underSix: ["أقل من 6 أشهر", "أنا في الغالب زائر قصير المدة."],
  durationUnsure: ["لست متأكداً", "أحتاج إلى التحقق من مستنداتي أولاً."],
  workRights: ["نعم، لدي حق العمل", "تأشيرتي الحالية تسمح لي بالعمل في أستراليا."],
  closeFamily: ["لا حق عمل، لكن لدي قريب مباشر في أستراليا", "لدي والد أو زوج أو شريك أو طفل مؤهل في أستراليا."],
  noWorkNoFamily: ["لا / لست متأكداً", "لا أعرف إن كنت أستوفي هذه المتطلبات."],
  otherCountry: ["دولة أخرى / لست متأكداً", "بلدي غير موجود أو لا أعرف القاعدة التي تنطبق."]
});

Object.assign(translations.tr.steps, {
  medicareIdentity: ["Medicare Uygunluğu", "Hangisi Sizi En İyi Tanımlar?", "Sağlık hizmetine ihtiyaç duyan kişiye en yakın seçeneği seçin.", "Adım 3 / 7"],
  nzDuration: ["Yeni Zelanda Vatandaşı", "Avustralya'da Ne Kadar Yaşayacaksınız?", "Yeni Zelanda vatandaşları için yol, uzun süreli yaşama veya ziyaret durumuna göre değişebilir.", "Adım 4 / 7"],
  prWork: ["Daimi Oturum Başvurusu", "Çalışma Hakkınız veya Avustralya'da Yakın Aileniz Var mı?", "Bu, başvuru sürecinde Medicare'e kayıt olup olamayacağınızı kontrol etmeye yardımcı olur.", "Adım 4 / 7"],
  visitorCountry: ["Ziyaretçi Rehberi", "Avustralya'yı Hangi Ülkeden Ziyaret Ediyorsunuz?", "Ülkeyi sormamızın nedeni, Avustralya'nın belirli ülkelerle sağlık anlaşmaları olmasıdır. Bu ırk veya etnik kökenle ilgili değildir.", "Adım 3 / 7"],
  visitorService: ["Ziyaretçi Rehberi", "Hangi Danışma veya Hizmeti Kontrol Etmek İstiyorsunuz?", "Düşündüğünüz, randevu alacağınız veya talep edeceğiniz hizmeti seçin.", "Adım 4 / 7"]
});
Object.assign(translations.tr.answers, {
  citizen: ["Avustralya vatandaşı", "Avustralya vatandaşıyım veya vatandaş olarak kaydolmam gerekiyor."],
  nzCitizen: ["Yeni Zelanda vatandaşı", "Yeni Zelanda'danım ve Avustralya'dayım."],
  permanentResident: ["Avustralya daimi oturum sahibi", "Daimi oturumum zaten onaylandı."],
  appliedPr: ["Daimi oturum veya koruma vizesine başvurdum", "Başvurum değerlendiriliyor."],
  temporaryResident: ["Geçici oturum sahibi", "Geçici vizem var ve daimi oturuma başvurmuyorum."],
  identityUnsure: ["Emin değilim", "Kontrol etmek için genel adımlara ihtiyacım var."],
  sixPlus: ["6 ay veya daha fazla", "Burada 6 ay veya daha uzun yaşayacağımı kanıtlayabilirim."],
  underSix: ["6 aydan az", "Çoğunlukla kısa süreli ziyaretçiyim."],
  durationUnsure: ["Emin değilim", "Önce belgelerimi kontrol etmem gerekiyor."],
  workRights: ["Evet, çalışma hakkım var", "Mevcut vizem Avustralya'da çalışmama izin veriyor."],
  closeFamily: ["Çalışma hakkım yok ama Avustralya'da yakın ailem var", "Avustralya'da uygun bir ebeveyn, eş, partner veya çocuğum var."],
  noWorkNoFamily: ["Hayır / emin değilim", "Bu şartları karşılayıp karşılamadığımı bilmiyorum."],
  otherCountry: ["Başka ülke / emin değilim", "Ülkem listede yok veya hangi kuralın geçerli olduğunu bilmiyorum."]
});

Object.assign(translations.hi.steps, {
  medicareIdentity: ["Medicare पात्रता", "कौन सा विकल्प आपके लिए सही है?", "जिस व्यक्ति को स्वास्थ्य सेवा चाहिए, उसके लिए सबसे सही विकल्प चुनें।", "चरण 3 / 7"],
  nzDuration: ["न्यूज़ीलैंड नागरिक", "आप ऑस्ट्रेलिया में कितने समय रहेंगे?", "न्यूज़ीलैंड नागरिकों के लिए Medicare मार्ग रहने की अवधि या विज़िटर स्थिति पर निर्भर कर सकता है।", "चरण 4 / 7"],
  prWork: ["स्थायी निवास आवेदन", "क्या आपके पास काम का अधिकार या ऑस्ट्रेलिया में करीबी परिवार है?", "इससे पता चलता है कि आवेदन प्रक्रिया में आप Medicare में नामांकन कर सकते हैं या नहीं।", "चरण 4 / 7"],
  visitorCountry: ["विज़िटर मार्गदर्शन", "आप किस देश से ऑस्ट्रेलिया आए हैं?", "हम देश इसलिए पूछते हैं क्योंकि ऑस्ट्रेलिया के कुछ देशों के साथ स्वास्थ्य समझौते हैं। यह नस्ल या जातीयता के बारे में नहीं है।", "चरण 3 / 7"],
  visitorService: ["विज़िटर मार्गदर्शन", "आप कौन सा परामर्श या सेवा जांचना चाहते हैं?", "वह सेवा चुनें जिसे आप सोच रहे हैं, बुक कर रहे हैं या क्लेम करना चाहते हैं।", "चरण 4 / 7"]
});
Object.assign(translations.hi.answers, {
  citizen: ["ऑस्ट्रेलियाई नागरिक", "मैं ऑस्ट्रेलियाई नागरिक हूँ या नागरिक के रूप में नामांकन करना चाहता/चाहती हूँ।"],
  nzCitizen: ["न्यूज़ीलैंड नागरिक", "मैं न्यूज़ीलैंड से हूँ और ऑस्ट्रेलिया में हूँ।"],
  permanentResident: ["ऑस्ट्रेलियाई स्थायी निवासी", "मुझे स्थायी निवास मिल चुका है।"],
  appliedPr: ["मैंने स्थायी निवास या protection visa के लिए आवेदन किया है", "मेरा आवेदन प्रक्रिया में है।"],
  temporaryResident: ["अस्थायी निवासी", "मेरे पास temporary visa है और मैं PR के लिए आवेदन नहीं कर रहा/रही।"],
  identityUnsure: ["मुझे यकीन नहीं है", "मुझे जांचने के लिए सामान्य कदम चाहिए।"],
  sixPlus: ["6 महीने या अधिक", "मैं साबित कर सकता/सकती हूँ कि मैं 6 महीने या अधिक रहूँगा/रहूँगी।"],
  underSix: ["6 महीने से कम", "मैं मुख्य रूप से short-term visitor हूँ।"],
  durationUnsure: ["मुझे यकीन नहीं है", "मुझे पहले अपने दस्तावेज़ देखने होंगे।"],
  workRights: ["हाँ, मेरे पास काम का अधिकार है", "मेरा visa मुझे ऑस्ट्रेलिया में काम करने देता है।"],
  closeFamily: ["काम का अधिकार नहीं, लेकिन ऑस्ट्रेलिया में करीबी परिवार है", "मेरे parent, spouse, partner या child ऑस्ट्रेलिया में योग्य स्थिति में हैं।"],
  noWorkNoFamily: ["नहीं / मुझे यकीन नहीं", "मुझे नहीं पता कि मैं ये शर्तें पूरी करता/करती हूँ।"],
  otherCountry: ["अन्य देश / मुझे यकीन नहीं", "मेरा देश सूची में नहीं है या मुझे नियम नहीं पता।"]
});

Object.assign(translations.zhHans.results, {
  likelyPathway: "可能路径",
  selectedInsurer: "已选保险公司",
  selectedPlan: "已选计划",
  likelyCategory: "可能类别",
  whatNext: "下一步",
  beforeClaim: "理赔前请检查",
  nextStep: "你的下一步",
  reminder: "提醒：这只是一般指引，不能保证你的报销或理赔一定会被接受。",
  applyTitle: "你可能可以申请 Medicare",
  applyBody: "根据你的回答，建议先检查 Medicare。你可能已经在家庭 Medicare 卡上，或者可以自己申请。",
  citizenBody: "长期住在澳洲的澳洲公民通常可以申请 Medicare，但需要提供身份证明和居住相关文件。",
  nzBody: "新西兰公民如果可以证明会在澳洲住满 6 个月或以上、过去 12 个月内已经住满 6 个月，或已经申请澳洲永久居留，通常值得检查 Medicare 申请资格。",
  permanentBody: "澳洲永久居民通常可以申请 Medicare，但需要提供身份证明和永久居留文件。",
  appliedPrBody: "部分已经申请澳洲永久居留或永久保护签证的人，在申请审理期间可能可以申请 Medicare，特别是有工作权利或在澳洲有符合条件的近亲时。",
  maybeAppliedPrBody: "你可能仍然有申请路径，但需要看你的签证条件、工作权利和家庭情况。请在依赖 Medicare 前查看官方规则。",
  temporaryBody: "临时签证持有人不会自动获得 Medicare。部分临时签证可能因特殊政府规定而有资格，但必须查看你的具体签证规则。",
  generalBody: "先检查你是否已经在家庭 Medicare 卡上，然后再看你的公民身份、居留身份或签证是否允许你申请。",
  applySteps: ["检查你是否已经列在家庭 Medicare 卡上。", "登录 myGov，查看你的账号是否已经关联 Medicare。", "如果尚未登记，请根据个人情况准备护照、ImmiCard、签证、公民身份、居住地址或其他证明文件。", "使用官方 Medicare 登记页面在线申请，或填写 Medicare 登记表。"],
  visitorCoveredTitle: "你可能可以获得访客 Medicare 支持",
  visitorNotListedTitle: "你可能需要旅游保险或海外健康保险",
  visitorCoveredBody: "澳洲与该国家有互惠医疗协议。如果符合协议条件，这次问诊或服务可能可以通过 Medicare 获得部分支持。",
  visitorItalyNote: "如果你来自意大利，Services Australia 说明 Medicare 支持通常只适用于在澳期间的 6 个月内。",
  visitorNotListedBody: "你选择的国家不在此工具的互惠医疗协议列表中。请检查旅游保险、海外学生健康保险，或查看 Services Australia 官方页面。",
  visitorWhy: "这个问题是关于国家之间的政府医疗协议，不是关于种族、族裔、语言或外貌。",
  visitorSteps: ["预约前，询问诊所是否接受 Medicare 或互惠医疗协议患者。", "带上护照、签证信息以及任何健康保险文件。", "如果是紧急情况，请直接联系医疗机构，并询问是否需要先付款以及大概费用。", "使用 Services Australia 的官方互惠医疗协议页面，确认你的国家适用的具体规则。"],
  insuranceUnsureTitle: "检查你是否已有私人健康保险",
  insuranceUnsureBody: "你可能已经在自己的保险或家庭保险中。",
  insuranceUnsureSteps: ["在邮箱中搜索 health insurance、Medibank、Bupa、HCF、nib、ahm 或 premium 等关键词。", "查看银行账单是否有定期健康保险扣款。", "询问父母、伴侣或家人，你是否在家庭保险中。", "查看你是否有私人健康保险卡或保险 app。"],
  noPrivateTitle: "Medicare 或低费用路径",
  privateTitle: "理赔指引",
  doctorNotice: "重要：这看起来是医生问诊。普通 GP 和非住院专科问诊通常通过 Medicare，而不是私人医保。私人医保通常只在住院治疗时与医生费用更相关。",
  extrasLikely: "可能的下一步：你选择的计划看起来可能包含 extras。如果该服务包含在保单内、等待期已结束且年度限额未用完，可能可以理赔。",
  hospitalIssue: "你选择的是住院类保险。这个服务通常属于 extras，因此除非保单也包含 extras，否则可能无法理赔。",
  ambulanceNotice: "救护车保障取决于你所在的州以及具体保单。请同时查看保险公司规则和州救护车规则。",
  policyNotice: "这取决于你的具体保单。预约前请查看保险 app、保单文件或官方理赔页面。",
  planUnsureNotice: "因为你不确定具体计划，请只把这个结果当作指引。预约前请查看保险 app 或致电保险公司。",
  claimChecklist: ["这项服务是否包含在你的具体保单中？", "等待期是否已经结束？", "你是否有详细收据或发票？", "服务提供者是否被保险公司认可？", "你是否已经用完年度限额？"],
  noPrivateSteps: ["使用 Healthdirect 查找附近的医疗服务。", "尽量寻找 bulk-billing 或低费用服务提供者。", "预约前致电诊所，询问自付费用。", "如果是 GP 问诊，请直接询问是否 bulk bill。"],
  officialClaimText: "使用保险公司的官方理赔页面确认保障并开始理赔。",
  otherInsurerNotice: "你的保险公司暂未列出。请在保险公司官网搜索 make a claim、extras claim 或 member login。"
});

Object.assign(translations.zhHans.serviceCategory, {
  gp: "通常通过 Medicare",
  specialist: "通常通过 Medicare，除非属于住院治疗",
  psychology: "可能涉及 Medicare 或 extras",
  dental: "通常属于 extras 保险",
  optical: "通常属于 extras 保险",
  physio: "通常属于 extras 保险",
  ambulance: "取决于州规则和保单",
  other: "Medicare 或低费用路径"
});

Object.assign(translations.zhHans.serviceExplanation, {
  gp: "普通 GP 问诊通常通过 Medicare 处理，而不是私人健康保险。是否可以 bulk bill 取决于具体诊所。",
  specialist: "非住院专科医生问诊通常涉及 Medicare 返还。私人健康保险通常在住院治疗时更相关。",
  psychology: "如果你有有效的心理健康治疗计划，心理咨询可能涉及 Medicare。部分 extras 保单也可能包含心理服务。",
  dental: "牙科通常与 extras 保险相关。请查看年度限额、等待期、服务提供者规则和详细收据。",
  optical: "眼科或配镜通常与 extras 保险相关。请检查眼镜、隐形眼镜或眼部检查是否包含在保单中。",
  physio: "物理治疗通常与 extras 保险相关。请检查每次限额、年度限额、等待期以及服务提供者是否被认可。",
  ambulance: "救护车保障取决于你所在的州和私人健康保险保单。请同时查看州规则和保险公司规则。",
  other: "你的下一步是查看 Medicare、公共医疗或低费用服务选择。"
});

Object.assign(translations.zhHant.results, {
  likelyPathway: "可能路徑",
  selectedInsurer: "已選保險公司",
  selectedPlan: "已選計劃",
  likelyCategory: "可能類別",
  whatNext: "下一步",
  beforeClaim: "理賠前請檢查",
  nextStep: "你的下一步",
  reminder: "提醒：這只是一般指引，不能保證你的報銷或理賠一定會被接受。",
  applyTitle: "你可能可以申請 Medicare",
  applyBody: "根據你的回答，建議先檢查 Medicare。你可能已經在家庭 Medicare 卡上，或者可以自己申請。",
  citizenBody: "長期住在澳洲的澳洲公民通常可以申請 Medicare，但需要提供身份證明和居住相關文件。",
  nzBody: "紐西蘭公民如果可以證明會在澳洲住滿 6 個月或以上、過去 12 個月內已經住滿 6 個月，或已經申請澳洲永久居留，通常值得檢查 Medicare 申請資格。",
  permanentBody: "澳洲永久居民通常可以申請 Medicare，但需要提供身份證明和永久居留文件。",
  appliedPrBody: "部分已經申請澳洲永久居留或永久保護簽證的人，在申請審理期間可能可以申請 Medicare，特別是有工作權利或在澳洲有符合條件的近親時。",
  maybeAppliedPrBody: "你可能仍然有申請路徑，但需要看你的簽證條件、工作權利和家庭情況。請在依賴 Medicare 前查看官方規則。",
  temporaryBody: "臨時簽證持有人不會自動獲得 Medicare。部分臨時簽證可能因特殊政府規定而有資格，但必須查看你的具體簽證規則。",
  generalBody: "先檢查你是否已經在家庭 Medicare 卡上，然後再看你的公民身份、居留身份或簽證是否允許你申請。",
  applySteps: ["檢查你是否已經列在家庭 Medicare 卡上。", "登入 myGov，查看你的帳號是否已經關聯 Medicare。", "如果尚未登記，請根據個人情況準備護照、ImmiCard、簽證、公民身份、居住地址或其他證明文件。", "使用官方 Medicare 登記頁面線上申請，或填寫 Medicare 登記表。"],
  visitorCoveredTitle: "你可能可以獲得訪客 Medicare 支援",
  visitorNotListedTitle: "你可能需要旅遊保險或海外健康保險",
  visitorCoveredBody: "澳洲與該國家有互惠醫療協議。如果符合協議條件，這次問診或服務可能可以透過 Medicare 獲得部分支援。",
  visitorItalyNote: "如果你來自義大利，Services Australia 說明 Medicare 支援通常只適用於在澳期間的 6 個月內。",
  visitorNotListedBody: "你選擇的國家不在此工具的互惠醫療協議列表中。請檢查旅遊保險、海外學生健康保險，或查看 Services Australia 官方頁面。",
  visitorWhy: "這個問題是關於國家之間的政府醫療協議，不是關於種族、族裔、語言或外貌。",
  visitorSteps: ["預約前，詢問診所是否接受 Medicare 或互惠醫療協議患者。", "帶上護照、簽證資訊以及任何健康保險文件。", "如果是緊急情況，請直接聯絡醫療機構，並詢問是否需要先付款以及大概費用。", "使用 Services Australia 的官方互惠醫療協議頁面，確認你的國家適用的具體規則。"],
  insuranceUnsureTitle: "檢查你是否已有私人健康保險",
  insuranceUnsureBody: "你可能已經在自己的保險或家庭保險中。",
  insuranceUnsureSteps: ["在電郵中搜尋 health insurance、Medibank、Bupa、HCF、nib、ahm 或 premium 等關鍵字。", "查看銀行帳單是否有定期健康保險扣款。", "詢問父母、伴侶或家人，你是否在家庭保險中。", "查看你是否有私人健康保險卡或保險 app。"],
  noPrivateTitle: "Medicare 或低費用路徑",
  privateTitle: "理賠指引",
  doctorNotice: "重要：這看起來是醫生問診。普通 GP 和非住院專科問診通常透過 Medicare，而不是私人醫療保險。私人醫療保險通常只在住院治療時與醫生費用更相關。",
  extrasLikely: "可能的下一步：你選擇的計劃看起來可能包含 extras。如果該服務包含在保單內、等待期已結束且年度限額未用完，可能可以理賠。",
  hospitalIssue: "你選擇的是住院類保險。這個服務通常屬於 extras，因此除非保單也包含 extras，否則可能無法理賠。",
  ambulanceNotice: "救護車保障取決於你所在的州以及具體保單。請同時查看保險公司規則和州救護車規則。",
  policyNotice: "這取決於你的具體保單。預約前請查看保險 app、保單文件或官方理賠頁面。",
  planUnsureNotice: "因為你不確定具體計劃，請只把這個結果當作指引。預約前請查看保險 app 或致電保險公司。",
  claimChecklist: ["這項服務是否包含在你的具體保單中？", "等待期是否已經結束？", "你是否有詳細收據或發票？", "服務提供者是否被保險公司認可？", "你是否已經用完年度限額？"],
  noPrivateSteps: ["使用 Healthdirect 查找附近的醫療服務。", "盡量尋找 bulk-billing 或低費用服務提供者。", "預約前致電診所，詢問自付費用。", "如果是 GP 問診，請直接詢問是否 bulk bill。"],
  officialClaimText: "使用保險公司的官方理賠頁面確認保障並開始理賠。",
  otherInsurerNotice: "你的保險公司暫未列出。請在保險公司官網搜尋 make a claim、extras claim 或 member login。"
});

Object.assign(translations.zhHant.serviceCategory, {
  gp: "通常透過 Medicare",
  specialist: "通常透過 Medicare，除非屬於住院治療",
  psychology: "可能涉及 Medicare 或 extras",
  dental: "通常屬於 extras 保險",
  optical: "通常屬於 extras 保險",
  physio: "通常屬於 extras 保險",
  ambulance: "取決於州規則和保單",
  other: "Medicare 或低費用路徑"
});

Object.assign(translations.zhHant.serviceExplanation, {
  gp: "普通 GP 問診通常透過 Medicare 處理，而不是私人健康保險。是否可以 bulk bill 取決於具體診所。",
  specialist: "非住院專科醫生問診通常涉及 Medicare 返還。私人健康保險通常在住院治療時更相關。",
  psychology: "如果你有有效的心理健康治療計劃，心理諮詢可能涉及 Medicare。部分 extras 保單也可能包含心理服務。",
  dental: "牙科通常與 extras 保險相關。請查看年度限額、等待期、服務提供者規則和詳細收據。",
  optical: "眼科或配鏡通常與 extras 保險相關。請檢查眼鏡、隱形眼鏡或眼部檢查是否包含在保單中。",
  physio: "物理治療通常與 extras 保險相關。請檢查每次限額、年度限額、等待期以及服務提供者是否被認可。",
  ambulance: "救護車保障取決於你所在的州和私人健康保險保單。請同時查看州規則和保險公司規則。",
  other: "你的下一步是查看 Medicare、公共醫療或低費用服務選擇。"
});

Object.assign(translations.ar.results, {
  likelyPathway: "المسار المحتمل",
  selectedInsurer: "شركة التأمين المختارة",
  selectedPlan: "الخطة المختارة",
  likelyCategory: "الفئة المحتملة",
  whatNext: "ما الخطوة التالية",
  beforeClaim: "قبل تقديم المطالبة، تحقق من الآتي",
  nextStep: "خطوتك التالية",
  reminder: "تذكير: هذه معلومات عامة فقط ولا تؤكد قبول المطالبة.",
  applyTitle: "قد تكون مؤهلاً للتسجيل في Medicare",
  visitorCoveredTitle: "قد يكون لديك دعم Medicare كزائر",
  visitorNotListedTitle: "قد تحتاج إلى تأمين سفر أو تغطية صحية خارجية",
  visitorCoveredBody: "لدى أستراليا اتفاقية رعاية صحية متبادلة مع الدولة المختارة. قد تكون الاستشارة مغطاة جزئياً إذا استوفت شروط الاتفاقية.",
  visitorItalyNote: "بالنسبة للزوار من إيطاليا، قد ينطبق دعم Medicare لفترة 6 أشهر أثناء وجودهم في أستراليا.",
  visitorNotListedBody: "الدولة المختارة غير موجودة في قائمة الاتفاقيات في هذه الأداة. تحقق من تأمين السفر أو التأمين الصحي للطلاب الأجانب أو صفحة Services Australia الرسمية.",
  visitorWhy: "هذا السؤال يتعلق باتفاقيات حكومية بين الدول وليس بالعرق أو اللغة أو المظهر.",
  visitorSteps: ["اسأل العيادة قبل الحجز هل تقبل مرضى Medicare أو اتفاقية الرعاية الصحية المتبادلة.", "أحضر جواز السفر ومعلومات التأشيرة وأي مستندات تأمين صحي.", "في الحالات العاجلة، اتصل بمقدم الخدمة الصحية مباشرة واسأل عن التكاليف المسبقة.", "استخدم صفحة Services Australia الرسمية لتأكيد القاعدة الدقيقة لبلدك."],
  insuranceUnsureTitle: "تحقق مما إذا كان لديك تأمين صحي خاص بالفعل",
  insuranceUnsureBody: "قد تكون مغطى من خلال بوليصتك أو بوليصة عائلية.",
  insuranceUnsureSteps: ["ابحث في بريدك عن health insurance أو Medibank أو Bupa أو HCF أو nib أو ahm أو premium.", "تحقق من كشوف البنك عن دفعات تأمين صحي منتظمة.", "اسأل والديك أو شريكك إذا كنت ضمن بوليصة عائلية.", "تحقق مما إذا كانت لديك بطاقة تأمين صحي خاص."],
  noPrivateTitle: "مسار Medicare أو تكلفة منخفضة",
  privateTitle: "دليل المطالبة",
  doctorNotice: "مهم: يبدو أن هذه استشارة طبيب. عادةً تتم مطالبة زيارات GP والاستشارات التخصصية خارج المستشفى عبر Medicare وليس التأمين الصحي الخاص.",
  extrasLikely: "الخطوة المحتملة: قد تشمل خطتك خدمات extras. قد تكون الخدمة قابلة للمطالبة إذا كانت مشمولة وانتهت فترة الانتظار ولم يتم استخدام الحد السنوي.",
  hospitalIssue: "لقد اخترت تغطية مستشفى. هذه الخدمة غالباً مرتبطة بتغطية extras، لذلك قد لا تكون قابلة للمطالبة إلا إذا كانت خطتك تشمل extras أيضاً.",
  ambulanceNotice: "تغطية الإسعاف تعتمد على الولاية وعلى وثيقة التأمين الدقيقة. تحقق من شركة التأمين وقواعد الإسعاف في الولاية.",
  policyNotice: "هذا يعتمد على وثيقتك الدقيقة. تحقق من تطبيق شركة التأمين أو بيان الوثيقة أو صفحة المطالبات الرسمية قبل الحجز.",
  planUnsureNotice: "لأنك غير متأكد من الخطة الدقيقة، اعتبر هذه النتيجة دليلاً فقط. تحقق من تطبيق التأمين أو اتصل بالشركة قبل الحجز.",
  claimChecklist: ["هل هذه الخدمة مشمولة في وثيقتك الدقيقة؟", "هل انتهت فترة الانتظار؟", "هل لديك إيصال أو فاتورة مفصلة؟", "هل مقدم الخدمة معترف به من شركة التأمين؟", "هل استخدمت الحد السنوي بالفعل؟"],
  noPrivateSteps: ["استخدم Healthdirect للعثور على خدمة صحية قريبة.", "ابحث عن مقدمي خدمة منخفضي التكلفة أو bulk-billing عند توفرهم.", "اتصل بالعيادة قبل الحجز واسأل عن التكاليف التي ستدفعها.", "بالنسبة لزيارة GP، اسأل مباشرة هل يقدمون bulk billing."],
  officialClaimText: "استخدم صفحة المطالبات الرسمية لشركة التأمين لتأكيد التغطية وبدء المطالبة.",
  otherInsurerNotice: "شركة التأمين غير مدرجة بعد. ابحث في موقعها الرسمي عن make a claim أو extras claim أو member login."
});

Object.assign(translations.tr.results, {
  likelyPathway: "Olası yol",
  selectedInsurer: "Seçilen sigortacı",
  selectedPlan: "Seçilen plan",
  likelyCategory: "Olası kategori",
  whatNext: "Sonraki adımlar",
  beforeClaim: "Talep yapmadan önce kontrol edin",
  nextStep: "Sonraki adımınız",
  reminder: "Hatırlatma: Bu yalnızca genel rehberdir. Talebinizin kabul edileceğini garanti etmez.",
  applyTitle: "Medicare'e kayıt olabilirsiniz",
  visitorCoveredTitle: "Ziyaretçi olarak Medicare desteğiniz olabilir",
  visitorNotListedTitle: "Seyahat sigortası veya yurtdışı sağlık kapsamı gerekebilir",
  visitorCoveredBody: "Avustralya'nın seçtiğiniz ülkeyle karşılıklı sağlık anlaşması vardır. Şartlar sağlanırsa danışma Medicare tarafından kısmen desteklenebilir.",
  visitorItalyNote: "İtalya'dan gelen ziyaretçiler için Medicare desteği Avustralya'daki 6 aylık süreyle sınırlı olabilir.",
  visitorNotListedBody: "Seçtiğiniz ülke bu aracın anlaşma listesinde yok. Seyahat sigortasını, öğrenci sağlık kapsamını veya resmi Services Australia sayfasını kontrol edin.",
  visitorWhy: "Bu soru ülkeler arası resmi anlaşmalarla ilgilidir; ırk, etnik köken, dil veya görünüşle ilgili değildir.",
  visitorSteps: ["Randevudan önce kliniğe Medicare veya Reciprocal Health Care Agreement hastalarını kabul edip etmediklerini sorun.", "Pasaportunuzu, vize bilgilerinizi ve sağlık sigortası belgelerinizi getirin.", "Acil durumda sağlık hizmeti sağlayıcısıyla doğrudan iletişime geçin ve peşin maliyetleri sorun.", "Ülkeniz için kesin kuralı doğrulamak üzere resmi Services Australia karşılıklı anlaşma sayfasını kullanın."],
  insuranceUnsureTitle: "Zaten özel sağlık sigortanız olup olmadığını kontrol edin",
  insuranceUnsureBody: "Kendi poliçeniz veya aile poliçesi kapsamında olabilirsiniz.",
  insuranceUnsureSteps: ["E-postanızda health insurance, Medibank, Bupa, HCF, nib, ahm veya premium gibi kelimeleri arayın.", "Banka hesap hareketlerinizde düzenli sağlık sigortası ödemelerini kontrol edin.", "Ailenize veya partnerinize aile poliçesinde olup olmadığınızı sorun.", "Özel sağlık sigortası kartınız olup olmadığını kontrol edin."],
  noPrivateTitle: "Medicare veya düşük maliyet yolu",
  privateTitle: "Talep rehberi",
  doctorNotice: "Önemli: Bu bir doktor danışması gibi görünüyor. GP ve hastane dışı uzman görüşmeleri genellikle özel sigorta yerine Medicare üzerinden yapılır.",
  extrasLikely: "Olası sonraki adım: Seçtiğiniz plan extras içerebilir. Hizmet poliçeye dahilse, bekleme süresi bittiyse ve limit dolmadıysa talep edilebilir.",
  hospitalIssue: "Hastane tipi kapsam seçtiniz. Bu hizmet genellikle extras ile ilgilidir, bu nedenle extras yoksa talep edilemeyebilir.",
  ambulanceNotice: "Ambulans kapsamı eyalete ve poliçeye bağlıdır. Hem sigortacıyı hem de eyalet ambulans kurallarını kontrol edin.",
  policyNotice: "Bu kesin poliçenize bağlıdır. Randevudan önce sigorta uygulamasını, poliçe belgesini veya resmi talep sayfasını kontrol edin.",
  planUnsureNotice: "Planınızdan emin olmadığınız için bunu yalnızca rehber olarak kullanın. Randevudan önce sigorta uygulamasını kontrol edin veya sigortacıyı arayın.",
  claimChecklist: ["Bu hizmet kesin poliçenize dahil mi?", "Bekleme süresi bitti mi?", "Ayrıntılı makbuz veya faturanız var mı?", "Hizmet sağlayıcı sigortacınız tarafından tanınıyor mu?", "Yıllık limitinizi kullandınız mı?"],
  noPrivateSteps: ["Yakındaki sağlık hizmetlerini bulmak için Healthdirect kullanın.", "Mümkünse bulk-billing veya düşük maliyetli sağlayıcıları arayın.", "Randevudan önce kliniği arayıp cepten ödenecek maliyetleri sorun.", "GP ziyaretleri için doğrudan bulk bill yapıp yapmadıklarını sorun."],
  officialClaimText: "Kapsamınızı doğrulamak ve talebi başlatmak için sigortacınızın resmi talep sayfasını kullanın.",
  otherInsurerNotice: "Sigortacınız henüz listede yok. Resmi sitesinde make a claim, extras claim veya member login arayın."
});

Object.assign(translations.hi.results, {
  likelyPathway: "संभावित मार्ग",
  selectedInsurer: "चुना गया बीमाकर्ता",
  selectedPlan: "चुनी गई योजना",
  likelyCategory: "संभावित श्रेणी",
  whatNext: "आगे क्या करें",
  beforeClaim: "क्लेम करने से पहले जांचें",
  nextStep: "आपका अगला कदम",
  reminder: "याद रखें: यह केवल सामान्य मार्गदर्शन है। यह गारंटी नहीं देता कि आपका क्लेम स्वीकार होगा।",
  applyTitle: "आप Medicare में नामांकन कर सकते हैं",
  visitorCoveredTitle: "विज़िटर के रूप में आपको Medicare सहायता मिल सकती है",
  visitorNotListedTitle: "आपको यात्रा बीमा या विदेशी स्वास्थ्य कवर की आवश्यकता हो सकती है",
  visitorCoveredBody: "ऑस्ट्रेलिया का चुने गए देश के साथ पारस्परिक स्वास्थ्य समझौता है। यदि शर्तें पूरी होती हैं, तो परामर्श Medicare से आंशिक रूप से कवर हो सकता है।",
  visitorItalyNote: "इटली से आने वाले आगंतुकों के लिए Medicare सहायता ऑस्ट्रेलिया में 6 महीने की अवधि तक लागू हो सकती है।",
  visitorNotListedBody: "चुना गया देश इस टूल की समझौता सूची में नहीं है। यात्रा बीमा, overseas student health cover या आधिकारिक Services Australia पेज जांचें।",
  visitorWhy: "यह सवाल देशों के सरकारी समझौतों के बारे में है, नस्ल, जातीयता, भाषा या रूप-रंग के बारे में नहीं।",
  visitorSteps: ["बुकिंग से पहले क्लिनिक से पूछें कि क्या वे Medicare या Reciprocal Health Care Agreement मरीजों को स्वीकार करते हैं।", "अपना पासपोर्ट, visa जानकारी और स्वास्थ्य बीमा दस्तावेज़ साथ लाएँ।", "जरूरी या urgent care के लिए स्वास्थ्य सेवा प्रदाता से सीधे संपर्क करें और upfront costs पूछें।", "अपने देश के सटीक नियम की पुष्टि के लिए आधिकारिक Services Australia reciprocal agreement पेज देखें।"],
  insuranceUnsureTitle: "जांचें कि क्या आपके पास पहले से निजी स्वास्थ्य बीमा है",
  insuranceUnsureBody: "आप अपनी पॉलिसी या परिवार की पॉलिसी में कवर हो सकते हैं।",
  insuranceUnsureSteps: ["अपने ईमेल में health insurance, Medibank, Bupa, HCF, nib, ahm या premium जैसे शब्द खोजें।", "बैंक स्टेटमेंट में नियमित स्वास्थ्य बीमा भुगतान देखें।", "माता-पिता या partner से पूछें कि क्या आप family policy में हैं।", "देखें कि क्या आपके पास private health insurance card है।"],
  noPrivateTitle: "Medicare या कम लागत वाला मार्ग",
  privateTitle: "क्लेम गाइड",
  doctorNotice: "महत्वपूर्ण: यह डॉक्टर परामर्श जैसा लगता है। GP और अस्पताल के बाहर specialist परामर्श आमतौर पर निजी बीमा के बजाय Medicare से जुड़े होते हैं।",
  extrasLikely: "संभावित अगला कदम: आपकी चुनी गई योजना में extras हो सकते हैं। यदि सेवा शामिल है, waiting period खत्म है और annual limit बची है, तो क्लेम संभव हो सकता है।",
  hospitalIssue: "आपने hospital-style cover चुना है। यह सेवा अक्सर extras से जुड़ी होती है, इसलिए extras न होने पर क्लेम संभव नहीं हो सकता।",
  ambulanceNotice: "Ambulance cover आपके राज्य और policy पर निर्भर करता है। बीमाकर्ता और state ambulance rules दोनों देखें।",
  policyNotice: "यह आपकी सही policy पर निर्भर करता है। बुकिंग से पहले बीमा ऐप, policy statement या official claim page देखें।",
  planUnsureNotice: "क्योंकि आप अपनी सही योजना को लेकर अनिश्चित हैं, इसे केवल मार्गदर्शन मानें। बुकिंग से पहले बीमा ऐप देखें या बीमाकर्ता को कॉल करें।",
  claimChecklist: ["क्या यह सेवा आपकी सही policy में शामिल है?", "क्या waiting period खत्म हो गया है?", "क्या आपके पास itemised receipt या invoice है?", "क्या provider को आपका insurer मान्यता देता है?", "क्या आपने annual limit पहले ही उपयोग कर ली है?"],
  noPrivateSteps: ["नज़दीकी स्वास्थ्य सेवा खोजने के लिए Healthdirect का उपयोग करें।", "जहाँ उपलब्ध हो, bulk-billing या कम लागत वाले providers खोजें।", "बुकिंग से पहले क्लिनिक को कॉल करें और out-of-pocket costs पूछें।", "GP visit के लिए सीधे पूछें कि क्या वे bulk bill करते हैं।"],
  officialClaimText: "अपने कवर की पुष्टि करने और क्लेम शुरू करने के लिए बीमाकर्ता के आधिकारिक क्लेम पेज का उपयोग करें।",
  otherInsurerNotice: "आपका बीमाकर्ता अभी सूची में नहीं है। उसकी official website पर make a claim, extras claim या member login खोजें।"
});


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

const serviceIcons = {
  gp: { src: "assets/icons/gp.png", fallback: "⚕" },
  specialist: { src: "assets/icons/specialist.png", fallback: "★" },
  psychology: { src: "assets/icons/psychology.png", fallback: "☁" },
  dental: { src: "assets/icons/dental.png", fallback: "□" },
  optical: { src: "assets/icons/optical.png", fallback: "◉" },
  physio: { src: "assets/icons/physiotherapy.png", fallback: "↗" },
  ambulance: { src: "assets/icons/ambulance.png", fallback: "+" },
  other: { src: "assets/icons/other-health-service.png", fallback: "?" }
};

const rhcaCountries = {
  belgium: { name: "Belgium", flag: "assets/countries/belgium.png", fallback: "BE" },
  finland: { name: "Finland", flag: "assets/countries/finland.png", fallback: "FI" },
  italy: { name: "Italy", flag: "assets/countries/italy.png", fallback: "IT" },
  malta: { name: "Malta", flag: "assets/countries/malta.png", fallback: "MT" },
  netherlands: { name: "Netherlands", flag: "assets/countries/netherlands.png", fallback: "NL" },
  newZealand: { name: "New Zealand", flag: "assets/countries/new-zealand.png", fallback: "NZ" },
  norway: { name: "Norway", flag: "assets/countries/norway.png", fallback: "NO" },
  ireland: { name: "Ireland", flag: "assets/countries/ireland.png", fallback: "IE" },
  slovenia: { name: "Slovenia", flag: "assets/countries/slovenia.png", fallback: "SI" },
  sweden: { name: "Sweden", flag: "assets/countries/sweden.png", fallback: "SE" },
  unitedKingdom: { name: "United Kingdom", flag: "assets/countries/united-kingdom.png", fallback: "UK" }
};

function getText() {
  return translations[currentLanguage] || translations.en;
}

function arrText(section, key) {
  const t = getText();
  return (t[section] && t[section][key]) || english[section][key];
}

function answerFromKey(key) {
  const answer = arrText("answers", key);
  return { text: answer[0], detail: answer[1] };
}

function serviceText(key) {
  const service = arrText("services", key);
  return { text: service[0], detail: service[1] };
}

function iconHtml(symbol) {
  return `<span class="icon-circle" aria-hidden="true">${symbol}</span>`;
}

function imageIconHtml(src, alt, fallback) {
  return `
    <span class="service-icon-wrap">
      <img class="service-icon-img" src="${src}" alt="${alt}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />
      <span class="logo-fallback" aria-hidden="true" style="display: none;">${fallback}</span>
    </span>
  `;
}

function flagIconHtml(countryKey) {
  const country = rhcaCountries[countryKey] || {
    name: "Other country",
    flag: "assets/countries/other-country.png",
    fallback: "?"
  };

  return `
    <span class="flag-wrap">
      <img class="flag-icon-img" src="${country.flag}" alt="${country.name} flag" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />
      <span class="logo-fallback" aria-hidden="true" style="display: none;">${country.fallback}</span>
    </span>
  `;
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

function serviceAnswer(value, next) {
  const service = serviceText(value);
  const icon = serviceIcons[value] || serviceIcons.other;
  return {
    text: service.text,
    detail: service.detail,
    iconHtml: imageIconHtml(icon.src, `${service.text} icon`, icon.fallback),
    value,
    next
  };
}

function serviceAnswers(next) {
  return ["gp", "specialist", "psychology", "dental", "optical", "physio", "ambulance", "other"].map((key) => serviceAnswer(key, next));
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
      detail: `${t.continueWith} ${insurer.name}.`,
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

function countryAnswers() {
  const t = getText();
  const answers = Object.keys(rhcaCountries).map((key) => ({
    text: rhcaCountries[key].name,
    detail: t.whyCountry,
    iconHtml: flagIconHtml(key),
    value: key,
    next: "visitorService"
  }));

  const other = answerFromKey("otherCountry");
  answers.push({
    text: other.text,
    detail: other.detail,
    iconHtml: flagIconHtml("other"),
    value: "other",
    next: "visitorService"
  });

  return answers;
}

function getStepData(stepName) {
  const t = getText();
  const step = arrText("steps", stepName);
  const base = {
    eyebrow: step[0],
    title: step[1],
    help: step[2],
    label: step[3]
  };

  const steps = {
    medicare: {
      ...base,
      progress: 14,
      answers: [
        { ...answerFromKey("yesMedicare"), iconHtml: iconHtml("✓"), value: "yes", next: "privateInsurance" },
        { ...answerFromKey("noMedicare"), iconHtml: iconHtml("×"), value: "no", next: "residency" },
        { ...answerFromKey("unsureMedicare"), iconHtml: iconHtml("?"), value: "unsure", next: "medicareIdentity" }
      ]
    },
    residency: {
      ...base,
      progress: 28,
      answers: [
        { ...answerFromKey("living"), iconHtml: iconHtml("⌂"), value: "living", next: "medicareIdentity" },
        { ...answerFromKey("visitor"), iconHtml: iconHtml("✈"), value: "visitor", next: "visitorCountry" }
      ]
    },
    medicareIdentity: {
      ...base,
      progress: 42,
      answers: [
        { ...answerFromKey("citizen"), iconHtml: iconHtml("✓"), value: "citizen", next: "medicareCitizenResult" },
        { ...answerFromKey("nzCitizen"), iconHtml: iconHtml("NZ"), value: "nz", next: "nzDuration" },
        { ...answerFromKey("permanentResident"), iconHtml: iconHtml("PR"), value: "permanent", next: "medicarePermanentResult" },
        { ...answerFromKey("appliedPr"), iconHtml: iconHtml("?"), value: "appliedPr", next: "prWork" },
        { ...answerFromKey("temporaryResident"), iconHtml: iconHtml("T"), value: "temporary", next: "temporaryResidentResult" },
        { ...answerFromKey("visitor"), iconHtml: iconHtml("✈"), value: "visitor", next: "visitorCountry" },
        { ...answerFromKey("identityUnsure"), iconHtml: iconHtml("?"), value: "unsure", next: "medicareGeneralResult" }
      ]
    },
    nzDuration: {
      ...base,
      progress: 56,
      answers: [
        { ...answerFromKey("sixPlus"), iconHtml: iconHtml("✓"), value: "sixPlus", next: "medicareNZResult" },
        { ...answerFromKey("underSix"), iconHtml: iconHtml("✈"), value: "underSix", next: "visitorService" },
        { ...answerFromKey("durationUnsure"), iconHtml: iconHtml("?"), value: "unsure", next: "medicareNZMaybeResult" }
      ]
    },
    prWork: {
      ...base,
      progress: 56,
      answers: [
        { ...answerFromKey("workRights"), iconHtml: iconHtml("✓"), value: "workRights", next: "medicareAppliedPRResult" },
        { ...answerFromKey("closeFamily"), iconHtml: iconHtml("⌂"), value: "closeFamily", next: "medicareAppliedPRResult" },
        { ...answerFromKey("noWorkNoFamily"), iconHtml: iconHtml("?"), value: "noOrUnsure", next: "medicareAppliedPRMaybeResult" }
      ]
    },
    visitorCountry: {
      ...base,
      progress: 42,
      answers: countryAnswers()
    },
    visitorService: {
      ...base,
      progress: 56,
      answers: serviceAnswers("visitorResult")
    },
    privateInsurance: {
      ...base,
      progress: 28,
      answers: [
        { ...answerFromKey("yesInsurance"), iconHtml: iconHtml("✓"), value: "yes", next: "insurer" },
        { ...answerFromKey("noInsurance"), iconHtml: iconHtml("×"), value: "no", next: "serviceNoPrivate" },
        { ...answerFromKey("unsureInsurance"), iconHtml: iconHtml("?"), value: "unsure", next: "insuranceUnsureResult" }
      ]
    },
    insurer: {
      ...base,
      progress: 42,
      answers: insurerAnswers()
    },
    plan: {
      ...base,
      progress: 56,
      answers: planAnswers()
    },
    servicePrivate: {
      ...base,
      progress: 70,
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
  if (stepName === "medicareIdentity") state.medicareIdentity = value;
  if (stepName === "nzDuration") {
    state.nzDuration = value;
    if (value === "underSix") state.visitorCountry = "newZealand";
  }
  if (stepName === "prWork") state.prWork = value;
  if (stepName === "visitorCountry") state.visitorCountry = value;
  if (stepName === "visitorService") state.visitorService = value;
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

function getServiceInfo(serviceKey) {
  const t = getText();
  const service = serviceText(serviceKey || "other");
  return {
    label: service.text,
    category: t.serviceCategory[serviceKey] || t.serviceCategory.other,
    explanation: t.serviceExplanation[serviceKey] || t.serviceExplanation.other
  };
}

function listHtml(items) {
  return `<ul class="result-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderResult(resultType) {
  questionCard.classList.add("hidden");
  resultCard.classList.remove("hidden");
  progressFill.style.width = "100%";
  stepLabel.textContent = getText().result;

  let html = "";

  if (resultType.startsWith("medicare")) {
    html = renderMedicareResult(resultType);
  }

  if (resultType === "temporaryResidentResult") {
    html = renderTemporaryResidentResult();
  }

  if (resultType === "visitorResult") {
    html = renderVisitorResult();
  }

  if (resultType === "insuranceUnsureResult") {
    html = renderInsuranceUnsureResult();
  }

  if (resultType === "noPrivateResult") {
    html = renderNoPrivateResult();
  }

  if (resultType === "privateResult") {
    html = renderPrivateResult();
  }

  html += `<div class="notice">${getText().results.reminder}</div>`;

  if (historyStack.length > 0) {
    html += `
      <div class="result-actions">
        <button id="resultBackButton" class="secondary-button icon-button" type="button">
          <span class="button-icon" aria-hidden="true">←</span>
          <span>${getText().back}</span>
        </button>
      </div>
    `;
  }

  resultCard.innerHTML = html;

  const resultBackButton = document.getElementById("resultBackButton");
  if (resultBackButton) {
    resultBackButton.addEventListener("click", goBack);
  }
}

function renderMedicareResult(resultType) {
  const t = getText();
  const r = t.results;
  let body = r.generalBody;

  if (resultType === "medicareCitizenResult") body = r.citizenBody;
  if (resultType === "medicareNZResult") body = r.nzBody;
  if (resultType === "medicareNZMaybeResult") body = r.nzBody;
  if (resultType === "medicarePermanentResult") body = r.permanentBody;
  if (resultType === "medicareAppliedPRResult") body = r.appliedPrBody;
  if (resultType === "medicareAppliedPRMaybeResult") body = r.maybeAppliedPrBody;

  return `
    <p class="eyebrow">${t.result}</p>
    <h2>${r.applyTitle}</h2>
    <p>${body}</p>
    <h3>${r.whatNext}</h3>
    ${listHtml(r.applySteps)}
    <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/enrolling-medicare" target="_blank" rel="noreferrer">↗ ${t.medicareApplyLink}</a>
  `;
}

function renderTemporaryResidentResult() {
  const t = getText();
  const r = t.results;

  return `
    <p class="eyebrow">${t.result}</p>
    <h2>${r.applyTitle}</h2>
    <p>${r.temporaryBody}</p>
    <h3>${r.whatNext}</h3>
    ${listHtml(r.applySteps)}
    <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/enrolling-medicare" target="_blank" rel="noreferrer">↗ ${t.medicareEligibilityLink}</a>
  `;
}

function renderVisitorResult() {
  const t = getText();
  const r = t.results;
  const service = getServiceInfo(state.visitorService || "other");
  const countryName = rhcaCountries[state.visitorCountry]?.name || t.answers.otherCountry[0];
  const isCoveredCountry = Boolean(rhcaCountries[state.visitorCountry]);
  const italyNote = state.visitorCountry === "italy" ? `<div class="notice">${r.visitorItalyNote}</div>` : "";

  return `
    <p class="eyebrow">${t.result}</p>
    <h2>${isCoveredCountry ? r.visitorCoveredTitle : r.visitorNotListedTitle}</h2>
    <p><strong>${countryName}</strong></p>
    <p><strong>${r.likelyCategory}:</strong> ${service.category}</p>
    <p>${isCoveredCountry ? r.visitorCoveredBody : r.visitorNotListedBody}</p>
    <div class="notice"><strong>${r.visitorWhy}</strong></div>
    ${italyNote}
    <h3>${r.whatNext}</h3>
    ${listHtml(r.visitorSteps)}
    <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/when-reciprocal-health-care-agreements-apply-and-you-visit-australia?context=22481" target="_blank" rel="noreferrer">↗ ${t.reciprocalLink}</a>
  `;
}

function renderInsuranceUnsureResult() {
  const t = getText();
  const r = t.results;

  return `
    <p class="eyebrow">${t.result}</p>
    <h2>${r.insuranceUnsureTitle}</h2>
    <p>${r.insuranceUnsureBody}</p>
    ${listHtml(r.insuranceUnsureSteps)}
  `;
}

function renderNoPrivateResult() {
  const t = getText();
  const r = t.results;
  const service = getServiceInfo(state.service || "other");

  return `
    <p class="eyebrow">${t.result}</p>
    <h2>${service.label}: ${r.noPrivateTitle}</h2>
    <p><strong>${r.likelyPathway}:</strong> ${service.category}</p>
    <p>${service.explanation}</p>
    <h3>${r.whatNext}</h3>
    ${listHtml(r.noPrivateSteps)}
    <a class="primary-link green" href="https://www.healthdirect.gov.au/australian-health-services" target="_blank" rel="noreferrer">↗ ${t.healthdirect}</a>
  `;
}

function renderPrivateResult() {
  const t = getText();
  const r = t.results;
  const service = getServiceInfo(state.service || "other");
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

  const planWarning = plan.type === "unknown" ? `<div class="notice">${r.planUnsureNotice}</div>` : "";
  const insurerLink = insurer.url
    ? `<a class="primary-link blue" href="${insurer.url}" target="_blank" rel="noreferrer">↗ ${t.officialClaim}</a>`
    : `<div class="notice">${r.otherInsurerNotice}</div>`;

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
    ${listHtml(r.claimChecklist)}
    <h3>${r.nextStep}</h3>
    <p>${r.officialClaimText}</p>
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

function goBack() {
  const previousStep = historyStack.pop();

  if (previousStep) {
    renderStep(previousStep, false);
  }
}

backButton.addEventListener("click", goBack);

restartButton.addEventListener("click", () => {
  Object.keys(state).forEach((key) => {
    state[key] = null;
  });

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
