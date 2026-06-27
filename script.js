const state = {
  medicare: null,
  residency: null,
  privateInsurance: null,
  service: null,
  insurer: null,
  plan: null
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
    language: "Language",
    heroTag: "Australian Health Claim Helper",
    slogan: "Claim Maximiser",
    subtext: "Helping You Maximise Every Eligible Health Claim.",
    restart: "Restart",
    back: "Back",
    result: "Result",
    sample: "SAMPLE",
    medicareCardCaption: "This Is Only A Fake Sample Card. Your Real Medicare Card May Be Physical Or Digital In The myGov App.",
    smallPrint: "ClaimCheck AU Gives General Information Only. It Does Not Provide Medical, Legal, Financial, Or Insurance Advice. Always Confirm Directly With Medicare, Your Insurer, Or Your Health Provider.",
    officialClaim: "Go To Official Claims Page",
    healthdirect: "Find A Health Service",
    medicareEligibility: "Check Medicare Eligibility",
    reciprocal: "Check Reciprocal Health Care",
    steps: {
      medicare: {
        eyebrow: "Step 1",
        title: "Do You Have A Medicare Card?",
        help: "Look At The Sample Card Below. Choose The Option That Best Matches You.",
        label: "Step 1 Of 5"
      },
      residency: {
        eyebrow: "Medicare Eligibility",
        title: "Are You Living In Australia Long Term?",
        help: "This Helps Point You Toward The Right Medicare Eligibility Pathway.",
        label: "Step 2 Of 5"
      },
      privateInsurance: {
        eyebrow: "Private Health Insurance",
        title: "Do You Have Private Health Insurance?",
        help: "This Decides Whether We Guide You Through An Insurer Claim Or A Medicare Pathway.",
        label: "Step 2 Of 5"
      },
      servicePrivate: {
        eyebrow: "Health Service",
        title: "What Did You Pay For?",
        help: "Pick The Health Service You Want To Check.",
        label: "Step 3 Of 5"
      },
      serviceNoPrivate: {
        eyebrow: "Health Service",
        title: "What Do You Need Help With?",
        help: "We Will Show The Medicare Or Low-Cost Pathway.",
        label: "Step 3 Of 3"
      },
      insurer: {
        eyebrow: "Insurer",
        title: "Which Insurer Are You With?",
        help: "Choose The Company You Recognise. The Letters Are Simple Placeholders, So You Can Replace Them With Official Logos Later.",
        label: "Step 4 Of 5"
      },
      plan: {
        eyebrow: "Plan Name",
        title: "Which Plan Looks Closest To Yours?",
        help: "Choose Your Exact Plan If You See It. If You Are Unsure, Choose ‘I Am Unsure’.",
        label: "Step 5 Of 5"
      }
    },
    answers: {
      yesMedicare: ["Yes, I Have A Medicare Card", "I Can Use Medicare Services In Australia."],
      noMedicare: ["No, I Do Not", "I May Be Visiting, New To Australia, Or Not Eligible."],
      unsureMedicare: ["I Am Unsure", "I Need Help Checking."],
      living: ["Yes, I Live In Australia", "For Example, Citizen, Permanent Resident, Or Applying For Permanent Residency."],
      visitor: ["No, I Am Visiting Australia", "For Example, Tourist, Visitor, Or Short Stay."],
      yesInsurance: ["Yes", "I Have A Health Insurance Policy."],
      noInsurance: ["No", "I Only Want Medicare Or Low-Cost Options."],
      unsureInsurance: ["I Am Unsure", "I Might Be On A Family Policy Or Old Policy."],
      otherInsurer: ["Other / Not Listed", "I Will Search For My Insurer Manually."],
      unsurePlan: ["I Am Unsure", "I Need To Check My Policy Name."],
      unknownPlan: ["My Plan Is Not Listed", "I Will Check My Insurer App Or Policy Document."],
      otherHealthService: ["Other Health Service", "Get General Next Steps."]
    },
    services: {
      dental: ["Dental", "Check-Up, Clean, Filling, Braces, Wisdom Teeth."],
      optical: ["Optical", "Glasses, Contact Lenses, Eye-Related Costs."],
      physio: ["Physiotherapy", "Physio Appointment Or Treatment."],
      psychology: ["Psychology", "Psychologist Or Mental Health Appointment."],
      gp: ["GP Consultation", "Normal Doctor Appointment."],
      specialist: ["Specialist Consultation", "Specialist Doctor Appointment."],
      ambulance: ["Ambulance", "Emergency Transport Or Ambulance Bill."],
      other: ["Other Health Service", "Get General Next Steps."]
    }
  },
  zh: {
    language: "语言",
    heroTag: "澳洲医疗报销助手",
    slogan: "报销最大化助手",
    subtext: "帮助你找到最合适的医疗报销路径。",
    restart: "重新开始",
    back: "返回",
    result: "结果",
    sample: "样本",
    medicareCardCaption: "这只是假的样本卡。你的真实 Medicare 卡可能是实体卡，也可能在 myGov App 里面。",
    smallPrint: "ClaimCheck AU 只提供一般信息，不提供医疗、法律、财务或保险建议。请务必向 Medicare、保险公司或医疗服务提供者确认。",
    officialClaim: "前往官方报销页面",
    healthdirect: "寻找医疗服务",
    medicareEligibility: "查询 Medicare 资格",
    reciprocal: "查询互惠医疗协议",
    steps: {
      medicare: {
        eyebrow: "第一步",
        title: "你有 Medicare 卡吗？",
        help: "请看下面的样本卡，然后选择最符合你的选项。",
        label: "第 1 步，共 5 步"
      },
      residency: {
        eyebrow: "Medicare 资格",
        title: "你是否长期住在澳洲？",
        help: "这可以帮助判断你是否应该先查询 Medicare 资格。",
        label: "第 2 步，共 5 步"
      },
      privateInsurance: {
        eyebrow: "私人医疗保险",
        title: "你有私人医疗保险吗？",
        help: "这会决定你应该看保险报销路径，还是 Medicare 路径。",
        label: "第 2 步，共 5 步"
      },
      servicePrivate: {
        eyebrow: "医疗服务",
        title: "你付了什么医疗费用？",
        help: "请选择你想查询的医疗服务。",
        label: "第 3 步，共 5 步"
      },
      serviceNoPrivate: {
        eyebrow: "医疗服务",
        title: "你需要哪方面的帮助？",
        help: "我们会显示 Medicare 或低费用路径。",
        label: "第 3 步，共 3 步"
      },
      insurer: {
        eyebrow: "保险公司",
        title: "你的保险公司是哪一家？",
        help: "请选择你认识的公司。这里的字母图标之后可以换成官方 Logo。",
        label: "第 4 步，共 5 步"
      },
      plan: {
        eyebrow: "保险计划名称",
        title: "哪个计划最像你的保险？",
        help: "如果看到你的计划，请选择它。如果不确定，请选择“不确定”。",
        label: "第 5 步，共 5 步"
      }
    },
    answers: {
      yesMedicare: ["有，我有 Medicare 卡", "我可以在澳洲使用 Medicare 服务。"],
      noMedicare: ["没有", "我可能是访客、新来澳洲，或不符合资格。"],
      unsureMedicare: ["我不确定", "我需要帮助查询。"],
      living: ["是，我住在澳洲", "例如公民、永久居民，或正在申请永居。"],
      visitor: ["不是，我只是来澳洲访问", "例如游客、访客或短期停留。"],
      yesInsurance: ["有", "我有私人医疗保险。"],
      noInsurance: ["没有", "我只想看 Medicare 或低费用选项。"],
      unsureInsurance: ["我不确定", "我可能在家庭保险或旧保险里面。"],
      otherInsurer: ["其他 / 没有列出", "我会自己查询我的保险公司。"],
      unsurePlan: ["我不确定", "我需要查看我的保险计划名称。"],
      unknownPlan: ["我的计划没有列出", "我会查看保险 App 或保险文件。"],
      otherHealthService: ["其他医疗服务", "查看一般下一步。"]
    },
    services: {
      dental: ["牙科", "洗牙、补牙、牙套、智齿等。"],
      optical: ["眼科 / 配镜", "眼镜、隐形眼镜、眼睛相关费用。"],
      physio: ["物理治疗", "物理治疗预约或治疗。"],
      psychology: ["心理咨询", "心理医生或心理健康预约。"],
      gp: ["GP 家庭医生", "普通医生预约。"],
      specialist: ["专科医生", "专科医生预约。"],
      ambulance: ["救护车", "紧急交通或救护车账单。"],
      other: ["其他医疗服务", "查看一般下一步。"]
    }
  }
};

const insurers = {
  medibank: {
    name: "Medibank",
    badge: "M",
    url: "https://www.medibank.com.au/health-insurance/using-your-cover/claim/",
    plans: [
      { id: "medibank-top-extras-90", name: "Top Extras 90", type: "extras", note: "Extras-Style Cover For Dental, Optical, Physio And Similar Services." },
      { id: "medibank-basic-extras", name: "Basic Extras / Healthy Extras", type: "extras", note: "Lower-Level Extras-Style Cover. Check Limits Carefully." },
      { id: "medibank-gold-smart-choice", name: "Gold Smart Choice Hospital", type: "hospital", note: "Hospital-Style Cover. Usually Not For Ordinary GP Visits." },
      { id: "medibank-gold-protect", name: "Gold Protect", type: "hospital", note: "Hospital-Style Cover. Check Hospital Inclusions And Restrictions." },
      { id: "medibank-combined", name: "Hospital + Extras Package", type: "combined", note: "Combined-Style Cover. Extras May Matter For Dental, Optical And Physio." }
    ]
  },
  bupa: {
    name: "Bupa",
    badge: "B",
    url: "https://www.bupa.com.au/health-insurance/members/make-a-claim",
    plans: [
      { id: "bupa-gold-ultimate", name: "Gold Ultimate Health Cover", type: "hospital", note: "Hospital-Style Cover. Usually Relevant For In-Hospital Treatment." },
      { id: "bupa-bronze-simple", name: "Bronze Plus Simple Hospital", type: "hospital", note: "Hospital-Style Cover. Check Restrictions And Excess." },
      { id: "bupa-extras", name: "Extras Cover", type: "extras", note: "Extras-Style Cover For Dental, Optical, Physio And Similar Services." },
      { id: "bupa-hospital-extras", name: "Hospital + Extras Package", type: "combined", note: "Combined-Style Cover. Check The Extras Section For Allied Health Claims." }
    ]
  },
  hcf: {
    name: "HCF",
    badge: "HCF",
    url: "https://www.hcf.com.au/memberservices/claims/make-a-claim",
    plans: [
      { id: "hcf-healthy-first-silver-plus", name: "Healthy First Silver Plus", type: "hospital", note: "Hospital-Style Cover. Usually Relevant For In-Hospital Treatment." },
      { id: "hcf-extras", name: "Starter / Mid / Top Extras", type: "extras", note: "Extras-Style Cover. Check The Exact Extras Level And Annual Limits." },
      { id: "hcf-hospital-extras", name: "Hospital + Extras Package", type: "combined", note: "Combined-Style Cover. Check Both Hospital And Extras Inclusions." }
    ]
  },
  nib: {
    name: "nib",
    badge: "nib",
    url: "https://www.nib.com.au/health-information/member-services/claiming",
    plans: [
      { id: "nib-gold-corporate-top", name: "Gold Corporate Top Hospital", type: "hospital", note: "Hospital-Style Cover. Usually Relevant For In-Hospital Treatment." },
      { id: "nib-extras", name: "Core / Value / Top Extras", type: "extras", note: "Extras-Style Cover. Check The Exact Level And Limits." },
      { id: "nib-hospital-extras", name: "Hospital + Extras Package", type: "combined", note: "Combined-Style Cover. Extras May Matter For Dental, Optical And Physio." }
    ]
  },
  ahm: {
    name: "ahm",
    badge: "ahm",
    url: "https://help.ahm.com.au/hc/en-us/articles/115005293647-Make-a-claim-ahm-extras",
    plans: [
      { id: "ahm-extras", name: "Lifestyle / Family / Super Extras", type: "extras", note: "Extras-Style Cover. Check Your Extras Limit And Waiting Period." },
      { id: "ahm-hospital", name: "Starter / Basic / Bronze / Silver / Gold Hospital", type: "hospital", note: "Hospital-Style Cover. Usually Not For Ordinary GP Visits." },
      { id: "ahm-combined", name: "Hospital + Extras Package", type: "combined", note: "Combined-Style Cover. Check The Extras Section For Allied Health Claims." }
    ]
  },
  australianUnity: {
    name: "Australian Unity",
    badge: "AU",
    url: "https://www.australianunity.com.au/health-insurance/how-to-claim",
    plans: [
      { id: "au-extras", name: "Extras Cover", type: "extras", note: "Extras-Style Cover For Dental, Optical, Physio And Similar Services." },
      { id: "au-hospital", name: "Hospital Cover", type: "hospital", note: "Hospital-Style Cover. Usually Relevant For In-Hospital Treatment." },
      { id: "au-combined", name: "Hospital + Extras Package", type: "combined", note: "Combined-Style Cover. Check Both Hospital And Extras Inclusions." }
    ]
  },
  other: {
    name: "Your Insurer",
    badge: "?",
    url: "",
    plans: [
      { id: "other-extras", name: "Extras Cover", type: "extras", note: "Usually For Dental, Optical, Physio And Similar Services." },
      { id: "other-hospital", name: "Hospital Cover", type: "hospital", note: "Usually For Hospital Treatment." },
      { id: "other-combined", name: "Hospital + Extras Package", type: "combined", note: "A Combined Policy." }
    ]
  }
};

const serviceInfo = {
  dental: {
    label: "Dental",
    category: "Usually Extras Cover",
    explanation: "Dental Is Usually Linked To Extras Cover. You Will Normally Need To Check Your Annual Limit, Waiting Period, Provider Rules, And Itemised Receipt."
  },
  optical: {
    label: "Optical",
    category: "Usually Extras Cover",
    explanation: "Optical Is Usually Linked To Extras Cover. Check Whether Glasses, Contact Lenses, Or Eye Tests Are Included In Your Policy."
  },
  physio: {
    label: "Physiotherapy",
    category: "Usually Extras Cover",
    explanation: "Physiotherapy Is Usually Linked To Extras Cover. Check Your Per-Visit Limit, Annual Limit, Waiting Period, And Whether The Provider Is Recognised."
  },
  psychology: {
    label: "Psychology",
    category: "May Involve Medicare Or Extras",
    explanation: "Psychology May Involve Medicare If You Have A Valid Mental Health Treatment Plan. Some Extras Policies May Also Include Psychology Benefits."
  },
  gp: {
    label: "GP Consultation",
    category: "Usually Medicare",
    explanation: "Normal GP Visits Are Usually Handled Through Medicare, Not Private Health Insurance. Bulk Billing May Be Available Depending On The Clinic."
  },
  specialist: {
    label: "Specialist Consultation",
    category: "Usually Medicare Unless It Is In-Hospital Treatment",
    explanation: "Out-Of-Hospital Specialist Consultations Usually Involve Medicare Rebates. Private Health Insurance Is Usually More Relevant If You Are Treated In Hospital."
  },
  ambulance: {
    label: "Ambulance",
    category: "Depends On State And Policy",
    explanation: "Ambulance Cover Depends On Your State And Your Private Health Insurance Policy. You Should Check Both Your State Rules And Your Insurer."
  },
  other: {
    label: "Health Service",
    category: "Medicare Or Low-Cost Pathway",
    explanation: "Your Next Step Is To Check Medicare, Public Health, Or Low-Cost Provider Options."
  }
};

function getText() {
  return translations[currentLanguage] || translations.en;
}

function getAnswer(key) {
  return getText().answers[key] || translations.en.answers[key];
}

function getServiceText(key) {
  return getText().services[key] || translations.en.services[key];
}

function icon(symbol) {
  return `<span class="icon-circle" aria-hidden="true">${symbol}</span>`;
}

function logoBadge(text) {
  return `<span class="logo-badge" aria-hidden="true">${text}</span>`;
}

function getSteps() {
  const t = getText();
  const s = t.steps;

  return {
    medicare: {
      ...s.medicare,
      progress: 20,
      answers: [
        { ...answerFromKey("yesMedicare"), icon: "✓", value: "yes", next: "privateInsurance" },
        { ...answerFromKey("noMedicare"), icon: "×", value: "no", next: "residency" },
        { ...answerFromKey("unsureMedicare"), icon: "?", value: "unsure", next: "medicareUnsureResult" }
      ]
    },
    residency: {
      ...s.residency,
      progress: 35,
      answers: [
        { ...answerFromKey("living"), icon: "✓", value: "living", next: "medicareEligibilityResult" },
        { ...answerFromKey("visitor"), icon: "✈", value: "visitor", next: "visitorResult" }
      ]
    },
    privateInsurance: {
      ...s.privateInsurance,
      progress: 40,
      answers: [
        { ...answerFromKey("yesInsurance"), icon: "✓", value: "yes", next: "servicePrivate" },
        { ...answerFromKey("noInsurance"), icon: "×", value: "no", next: "serviceNoPrivate" },
        { ...answerFromKey("unsureInsurance"), icon: "?", value: "unsure", next: "insuranceUnsureResult" }
      ]
    },
    servicePrivate: {
      ...s.servicePrivate,
      progress: 60,
      answers: serviceAnswers("insurer")
    },
    serviceNoPrivate: {
      ...s.serviceNoPrivate,
      progress: 70,
      answers: [
        serviceAnswer("gp", "⚕", "noPrivateResult"),
        serviceAnswer("psychology", "☁", "noPrivateResult"),
        serviceAnswer("specialist", "★", "noPrivateResult"),
        serviceAnswer("dental", "□", "noPrivateResult"),
        serviceAnswer("other", "?", "noPrivateResult")
      ]
    },
    insurer: {
      ...s.insurer,
      progress: 75,
      answers: insurerAnswers()
    },
    plan: {
      ...s.plan,
      progress: 90,
      answers: planAnswers()
    }
  };
}

function answerFromKey(key) {
  const [text, detail] = getAnswer(key);
  return { text, detail };
}

function serviceAnswer(value, iconSymbol, next) {
  const [text, detail] = getServiceText(value);
  return { text, detail, icon: iconSymbol, value, next };
}

function serviceAnswers(next) {
  return [
    serviceAnswer("dental", "□", next),
    serviceAnswer("optical", "◉", next),
    serviceAnswer("physio", "↗", next),
    serviceAnswer("psychology", "☁", next),
    serviceAnswer("gp", "⚕", next),
    serviceAnswer("specialist", "★", next),
    serviceAnswer("ambulance", "+", next)
  ];
}

function insurerAnswers() {
  const t = getText();

  return Object.keys(insurers).map((key) => {
    const insurer = insurers[key];

    if (key === "other") {
      const [text, detail] = t.answers.otherInsurer;
      return {
        text,
        detail,
        iconHtml: logoBadge(insurer.badge),
        value: key,
        next: "plan"
      };
    }

    return {
      text: insurer.name,
      detail: currentLanguage === "zh" ? "之后会显示相关保险计划选项。" : `Show ${insurer.name} Plan Options Next.`,
      iconHtml: logoBadge(insurer.badge),
      value: key,
      next: "plan"
    };
  });
}

function planAnswers() {
  const t = getText();
  const insurer = insurers[state.insurer] || insurers.other;
  const plans = insurer.plans.map((plan) => ({
    text: plan.name,
    detail: currentLanguage === "zh" ? translatePlanType(plan.type) : plan.note,
    icon: plan.type === "extras" ? "+" : plan.type === "hospital" ? "H" : "✓",
    value: plan.id,
    next: "privateResult"
  }));

  const [unsureText, unsureDetail] = t.answers.unsurePlan;
  const [unknownText, unknownDetail] = t.answers.unknownPlan;

  plans.push(
    { text: unsureText, detail: unsureDetail, icon: "?", value: "unsure", next: "privateResult" },
    { text: unknownText, detail: unknownDetail, icon: "…", value: "unknown", next: "privateResult" }
  );

  return plans;
}

function translatePlanType(type) {
  if (type === "extras") return "Extras 类保险，通常和牙科、眼镜、物理治疗等有关。";
  if (type === "hospital") return "Hospital 类保险，通常和住院治疗有关。";
  if (type === "combined") return "Hospital + Extras 组合保险。";
  return "请查看保险 App 或保险文件确认。";
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

  const steps = getSteps();
  const step = steps[stepName];

  questionCard.classList.remove("hidden");
  resultCard.classList.add("hidden");

  questionEyebrow.textContent = step.eyebrow;
  questionTitle.textContent = step.title;
  questionHelp.textContent = step.help;
  stepLabel.textContent = step.label;
  progressFill.style.width = `${step.progress}%`;

  renderQuestionVisual(stepName);
  renderAnswerButtons(step.answers, stepName);

  if (historyStack.length > 0) {
    backButton.classList.remove("hidden");
  } else {
    backButton.classList.add("hidden");
  }
}

function renderQuestionVisual(stepName) {
  const t = getText();

  if (stepName !== "medicare") {
    questionVisual.classList.add("hidden");
    questionVisual.innerHTML = "";
    return;
  }

  questionVisual.classList.remove("hidden");
  questionVisual.innerHTML = `
    <div class="medicare-sample-card" role="img" aria-label="Fake Sample Medicare Card">
      <div class="medicare-card-top">
        <p class="medicare-card-title">medicare</p>
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

function renderAnswerButtons(answers, stepName) {
  answerButtons.innerHTML = "";

  answers.forEach((answer) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";

    const iconMarkup = answer.iconHtml || icon(answer.icon || "→");

    button.innerHTML = `
      <span class="answer-main">
        ${iconMarkup}
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
}

function saveAnswer(stepName, value) {
  if (stepName === "medicare") state.medicare = value;
  if (stepName === "residency") state.residency = value;
  if (stepName === "privateInsurance") state.privateInsurance = value;
  if (stepName === "servicePrivate" || stepName === "serviceNoPrivate") state.service = value;
  if (stepName === "insurer") {
    state.insurer = value;
    state.plan = null;
  }
  if (stepName === "plan") state.plan = value;
}

function getSelectedPlan() {
  const insurer = insurers[state.insurer] || insurers.other;
  return insurer.plans.find((plan) => plan.id === state.plan) || {
    id: state.plan,
    name: state.plan === "unsure" ? "I Am Unsure" : "My Plan Is Not Listed",
    type: "unknown",
    note: "Check Your Insurer App, Member Card, Or Policy Document."
  };
}

function renderResult(resultType) {
  const t = getText();

  questionCard.classList.add("hidden");
  resultCard.classList.remove("hidden");
  progressFill.style.width = "100%";
  stepLabel.textContent = t.result;

  if (currentLanguage === "zh") {
    resultCard.innerHTML = renderChineseResult(resultType);
    return;
  }

  let html = "";

  if (resultType === "medicareUnsureResult") {
    html = `
      <p class="eyebrow">Result</p>
      <h2>Check Whether You Have Medicare First</h2>
      <p>Your First Step Is To Check Whether You Have A Medicare Card Or Whether You Are Eligible To Enrol.</p>
      <ul class="result-list">
        <li>Check Your Wallet Or Digital Wallet For A Medicare Card.</li>
        <li>Check Your myGov Account.</li>
        <li>Ask Your Family If You Are Listed On A Family Medicare Card.</li>
        <li>Use Official Services Australia Information To Check Eligibility.</li>
      </ul>
      <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/enrolling-medicare" target="_blank" rel="noreferrer">↗ ${t.medicareEligibility}</a>
    `;
  }

  if (resultType === "medicareEligibilityResult") {
    html = `
      <p class="eyebrow">Result</p>
      <h2>You May Be Able To Check Medicare Eligibility</h2>
      <p>Medicare Is Not Only For Australian Citizens. Some Residents And Applicants May Also Be Eligible.</p>
      <ul class="result-list">
        <li>Check The Official Medicare Enrolment Rules.</li>
        <li>Prepare Identity And Residency Documents If Needed.</li>
        <li>Use Medicare First For GP, Specialist And Some Mental Health Pathways.</li>
      </ul>
      <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/enrolling-medicare" target="_blank" rel="noreferrer">↗ ${t.medicareEligibility}</a>
    `;
  }

  if (resultType === "visitorResult") {
    html = `
      <p class="eyebrow">Result</p>
      <h2>You May Need Visitor Or Overseas Health Guidance</h2>
      <p>If You Are Visiting Australia, Your Options May Depend On Your Visa, Travel Insurance, Overseas Student Health Cover, Or Whether Your Country Has A Reciprocal Health Care Agreement With Australia.</p>
      <ul class="result-list">
        <li>Check Whether Your Country Has A Reciprocal Health Care Agreement.</li>
        <li>Check Your Travel Insurance Or Overseas Health Cover.</li>
        <li>For Urgent Care, Contact The Health Service Directly.</li>
      </ul>
      <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/reciprocal-health-care-agreements" target="_blank" rel="noreferrer">↗ ${t.reciprocal}</a>
    `;
  }

  if (resultType === "insuranceUnsureResult") {
    html = `
      <p class="eyebrow">Result</p>
      <h2>Check Whether You Already Have Private Health Insurance</h2>
      <p>You Might Already Be Covered Under Your Own Policy Or A Family Policy.</p>
      <ul class="result-list">
        <li>Search Your Email For Words Like Health Insurance, Medibank, Bupa, HCF, nib, ahm Or Premium.</li>
        <li>Check Your Bank Statements For Regular Health Insurance Payments.</li>
        <li>Ask Your Parents Or Partner If You Are Listed On A Family Policy.</li>
        <li>Check Whether You Have A Private Health Insurance Card.</li>
      </ul>
      <div class="notice">After You Confirm Your Insurer And Policy Name, Come Back And Use This Tool Again.</div>
    `;
  }

  if (resultType === "noPrivateResult") {
    const service = serviceInfo[state.service] || serviceInfo.other;

    html = `
      <p class="eyebrow">Result</p>
      <h2>${service.label}: Medicare Or Low-Cost Pathway</h2>
      <p><strong>Likely Pathway:</strong> ${service.category}</p>
      <p>${service.explanation}</p>

      <h3>What To Do Next</h3>
      <ul class="result-list">
        <li>Use Healthdirect To Find A Nearby Health Service.</li>
        <li>Look For Bulk-Billing Or Low-Cost Providers Where Available.</li>
        <li>Call The Clinic Before Booking And Ask About Out-Of-Pocket Costs.</li>
        <li>For GP Visits, Ask Directly Whether They Bulk Bill.</li>
      </ul>

      <a class="primary-link green" href="https://www.healthdirect.gov.au/australian-health-services" target="_blank" rel="noreferrer">↗ ${t.healthdirect}</a>
    `;
  }

  if (resultType === "privateResult") {
    html = renderPrivateResultEnglish();
  }

  html += `
    <div class="notice">
      <strong>Reminder:</strong> This Is General Guidance Only. It Does Not Confirm That Your Claim Will Be Accepted.
    </div>
  `;

  resultCard.innerHTML = html;
}

function renderPrivateResultEnglish() {
  const t = getText();
  const service = serviceInfo[state.service] || serviceInfo.other;
  const insurer = insurers[state.insurer] || insurers.other;
  const plan = getSelectedPlan();
  const isDoctorConsult = ["gp", "specialist"].includes(state.service);
  const isExtrasService = ["dental", "optical", "physio", "psychology"].includes(state.service);

  let decision = "";
  let coverWarning = "";

  if (isDoctorConsult) {
    decision = `
      <div class="notice">
        <strong>Important:</strong> This Looks Like A Doctor Consultation. GP Visits And Out-Of-Hospital Specialist Consultations Are Usually Claimed Through Medicare, Not Private Health Insurance. Private Health Insurance Usually Becomes Relevant For Doctor Fees Only When The Treatment Is In Hospital.
      </div>
    `;
  } else if (isExtrasService && ["extras", "combined"].includes(plan.type)) {
    decision = `
      <div class="notice">
        <strong>Likely Next Step:</strong> Your Selected Plan Looks Like It May Include Extras. This Service May Be Claimable If It Is Included, Your Waiting Period Has Finished, And You Have Not Used Your Limit.
      </div>
    `;
  } else if (isExtrasService && plan.type === "hospital") {
    decision = `
      <div class="notice">
        <strong>Possible Issue:</strong> You Selected A Hospital-Style Plan. Dental, Optical, Physio And Some Psychology Claims Usually Need Extras Cover, So This May Not Be Claimable Under Hospital-Only Cover.
      </div>
    `;
  } else if (state.service === "ambulance") {
    decision = `
      <div class="notice">
        <strong>Check Carefully:</strong> Ambulance Rules Depend On Your State And Your Policy. Check Your Insurer And Your State Rules Before Assuming It Is Covered.
      </div>
    `;
  } else {
    decision = `
      <div class="notice">
        <strong>Check Your Policy:</strong> Your Selected Plan Does Not Give Enough Information To Confirm A Claim. Use Your Insurer App Or Call Your Insurer.
      </div>
    `;
  }

  if (plan.type === "unknown") {
    coverWarning = `
      <div class="notice">
        You Chose An Unsure Or Unlisted Plan. Check The Exact Policy Name In Your Insurer App, Insurance Card, Email, Or Policy Statement.
      </div>
    `;
  }

  let insurerLink = "";
  if (insurer && insurer.url) {
    insurerLink = `<a class="primary-link blue" href="${insurer.url}" target="_blank" rel="noreferrer">↗ ${t.officialClaim}</a>`;
  } else {
    insurerLink = `<div class="notice">Your Insurer Is Not Listed Yet. Search Your Insurer's Official Website For “Make A Claim”, “Extras Claim”, Or “Member Login”.</div>`;
  }

  return `
    <p class="eyebrow">Result</p>
    <h2>${service.label}: Claim Guide</h2>
    <p><strong>Selected Insurer:</strong> ${insurer.name}</p>
    <p><strong>Selected Plan:</strong> ${plan.name}</p>
    <p><strong>Likely Category:</strong> ${service.category}</p>
    <p>${service.explanation}</p>

    ${decision}
    ${coverWarning}

    <h3>Before You Claim, Check This</h3>
    <ul class="result-list">
      <li>Is This Service Included In Your Exact Policy?</li>
      <li>Has Your Waiting Period Finished?</li>
      <li>Do You Have An Itemised Receipt Or Invoice?</li>
      <li>Is The Provider Recognised By Your Insurer?</li>
      <li>Have You Already Used Your Annual Limit?</li>
    </ul>

    <h3>Your Next Step</h3>
    <p>Use Your Insurer's Official Claim Page To Confirm Your Cover And Start The Claim.</p>

    ${insurerLink}
  `;
}

function renderChineseResult(resultType) {
  let html = "";
  const t = getText();

  if (resultType === "medicareUnsureResult") {
    html = `
      <p class="eyebrow">结果</p>
      <h2>请先查询你是否有 Medicare</h2>
      <p>第一步是确认你是否有 Medicare 卡，或是否符合申请资格。</p>
      <ul class="result-list">
        <li>检查钱包或手机钱包。</li>
        <li>查看 myGov 账户。</li>
        <li>询问家人你是否在家庭 Medicare 卡上。</li>
        <li>使用 Services Australia 官方信息查询资格。</li>
      </ul>
      <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/enrolling-medicare" target="_blank" rel="noreferrer">↗ ${t.medicareEligibility}</a>
    `;
  }

  if (resultType === "medicareEligibilityResult") {
    html = `
      <p class="eyebrow">结果</p>
      <h2>你可以查询 Medicare 申请资格</h2>
      <p>Medicare 不只适用于澳洲公民，部分居民和申请人也可能符合资格。</p>
      <ul class="result-list">
        <li>查看官方 Medicare 申请规则。</li>
        <li>准备身份证明和居住文件。</li>
        <li>GP、专科医生和部分心理健康服务通常先看 Medicare 路径。</li>
      </ul>
      <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/enrolling-medicare" target="_blank" rel="noreferrer">↗ ${t.medicareEligibility}</a>
    `;
  }

  if (resultType === "visitorResult") {
    html = `
      <p class="eyebrow">结果</p>
      <h2>你可能需要访客或海外医疗保险信息</h2>
      <p>如果你只是来澳洲访问，选择会取决于签证、旅游保险、海外学生医疗保险，或你的国家是否和澳洲有互惠医疗协议。</p>
      <ul class="result-list">
        <li>查询你的国家是否有互惠医疗协议。</li>
        <li>查看旅游保险或海外医疗保险。</li>
        <li>紧急情况请直接联系医疗服务。</li>
      </ul>
      <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/reciprocal-health-care-agreements" target="_blank" rel="noreferrer">↗ ${t.reciprocal}</a>
    `;
  }

  if (resultType === "insuranceUnsureResult") {
    html = `
      <p class="eyebrow">结果</p>
      <h2>请先确认你是否已有私人医疗保险</h2>
      <p>你可能在自己的保险或家庭保险里面。</p>
      <ul class="result-list">
        <li>搜索邮箱里的 health insurance、Medibank、Bupa、HCF、nib、ahm 或 premium。</li>
        <li>查看银行账单是否有定期保险扣款。</li>
        <li>询问父母或伴侣你是否在家庭保险里。</li>
        <li>检查是否有私人医疗保险卡。</li>
      </ul>
      <div class="notice">确认保险公司和计划名称后，可以回来重新使用这个工具。</div>
    `;
  }

  if (resultType === "noPrivateResult") {
    const service = serviceInfo[state.service] || serviceInfo.other;
    html = `
      <p class="eyebrow">结果</p>
      <h2>${service.label}: Medicare 或低费用路径</h2>
      <p><strong>可能路径:</strong> ${service.category}</p>
      <p>${service.explanation}</p>
      <h3>下一步</h3>
      <ul class="result-list">
        <li>使用 Healthdirect 寻找附近医疗服务。</li>
        <li>寻找 bulk-billing 或低费用服务。</li>
        <li>预约前打电话询问自付费用。</li>
        <li>GP 预约请直接询问是否 bulk bill。</li>
      </ul>
      <a class="primary-link green" href="https://www.healthdirect.gov.au/australian-health-services" target="_blank" rel="noreferrer">↗ ${t.healthdirect}</a>
    `;
  }

  if (resultType === "privateResult") {
    html = renderPrivateResultChinese();
  }

  html += `<div class="notice"><strong>提醒:</strong> 这只是一般指引，不保证你的报销一定会被接受。</div>`;
  return html;
}

function renderPrivateResultChinese() {
  const service = serviceInfo[state.service] || serviceInfo.other;
  const insurer = insurers[state.insurer] || insurers.other;
  const plan = getSelectedPlan();
  const isDoctorConsult = ["gp", "specialist"].includes(state.service);
  const isExtrasService = ["dental", "optical", "physio", "psychology"].includes(state.service);

  let decision = "";

  if (isDoctorConsult) {
    decision = `<div class="notice"><strong>重要:</strong> 这看起来是医生咨询。普通 GP 和非住院专科医生咨询通常通过 Medicare，而不是私人医疗保险。私人医疗保险通常只在住院治疗时才可能和医生费用有关。</div>`;
  } else if (isExtrasService && ["extras", "combined"].includes(plan.type)) {
    decision = `<div class="notice"><strong>可能路径:</strong> 你选择的计划看起来可能包含 Extras。如果该服务包含在保险内、等待期已结束，而且额度还没用完，就可能可以报销。</div>`;
  } else if (isExtrasService && plan.type === "hospital") {
    decision = `<div class="notice"><strong>可能问题:</strong> 你选择的是 Hospital 类计划。牙科、眼镜、物理治疗和部分心理服务通常需要 Extras，所以 Hospital-only 可能不能报销。</div>`;
  } else if (state.service === "ambulance") {
    decision = `<div class="notice"><strong>请仔细确认:</strong> 救护车规则取决于州和保险计划。不要直接假设一定包含。</div>`;
  } else {
    decision = `<div class="notice"><strong>请确认保险:</strong> 当前信息不足以确认是否可以报销。请查看保险 App 或联系保险公司。</div>`;
  }

  const link = insurer.url
    ? `<a class="primary-link blue" href="${insurer.url}" target="_blank" rel="noreferrer">↗ ${getText().officialClaim}</a>`
    : `<div class="notice">你的保险公司暂时没有列出。请搜索保险公司官网的 Make A Claim、Extras Claim 或 Member Login。</div>`;

  return `
    <p class="eyebrow">结果</p>
    <h2>${service.label}: 报销指引</h2>
    <p><strong>保险公司:</strong> ${insurer.name}</p>
    <p><strong>选择的计划:</strong> ${plan.name}</p>
    <p><strong>可能类别:</strong> ${service.category}</p>
    <p>${service.explanation}</p>

    ${decision}

    <h3>报销前请检查</h3>
    <ul class="result-list">
      <li>这个服务是否包含在你的具体保险里？</li>
      <li>等待期是否已经结束？</li>
      <li>你是否有详细收据或发票？</li>
      <li>服务提供者是否被保险公司认可？</li>
      <li>年度额度是否已经用完？</li>
    </ul>

    <h3>下一步</h3>
    <p>使用保险公司的官方报销页面确认保险内容并开始报销。</p>
    ${link}
  `;
}

function updateStaticText() {
  const t = getText();
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
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
  state.service = null;
  state.insurer = null;
  state.plan = null;

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
