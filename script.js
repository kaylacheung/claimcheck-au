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
const bannerSlides = Array.from(document.querySelectorAll(".banner-slide"));
const bannerDots = Array.from(document.querySelectorAll(".banner-dot"));

let currentStep = "medicare";
let currentLanguage = localStorage.getItem("claimcheckLanguage") || "en";

const googleTranslateLanguages = [
  "zh-CN", "zh-TW", "ar", "tr", "hi", "pa", "ta", "bn", "ur", "vi",
  "fr", "es", "ja", "ko", "el", "it", "de", "pt", "id", "ms", "th",
  "tl", "fa", "ru", "pl", "uk", "ne", "gu", "mr"
];

const rtlLanguages = ["ar", "fa", "ur"];

const text = {
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
  unsureOrUnlistedPlan: "I am not sure / my plan is not listed",
  unsureOrUnlistedDetail: "I need to check my insurer app, email, or policy statement.",
  otherInsurer: "Other / not listed",
  otherInsurerDetail: "I will search for my insurer manually.",
  otherCountry: "Another country / I am not sure"
};

const resultText = {
  reminder: "Reminder: this is general guidance only. It does not confirm that your claim will be accepted.",
  likelyPathway: "Likely pathway",
  likelyCategory: "Likely category",
  selectedInsurer: "Selected insurer",
  selectedPlan: "Selected plan",
  whatNext: "What to do next",
  nextStep: "Your next step",

  applyTitle: "You May Be Able to Enrol in Medicare",
  generalBody: "Based on your answers, you should check whether you can enrol in Medicare. The safest next step is to use the official Services Australia enrolment pathway and prepare identity documents before applying.",
  citizenBody: "Australian citizens can usually enrol in Medicare. If you do not have a card or cannot find it, you may need to enrol, get a replacement card, or check your myGov account.",
  nzBody: "New Zealand citizens living in Australia may be able to enrol in Medicare if they can show they live in Australia or will live here long term.",
  permanentBody: "Australian permanent residents can usually enrol in Medicare. If you do not have a card, check the enrolment steps and prepare your identity documents.",
  appliedPrBody: "If you have applied for permanent residency or a protection visa, you may be able to enrol in Medicare if you meet extra requirements such as work rights or close family in Australia.",
  maybeAppliedPrBody: "You may still be able to check Medicare eligibility, but your pathway is less certain from these answers. You should check the official Services Australia rules and your visa documents.",
  temporaryBody: "Temporary residents are not always eligible for Medicare. Your options may depend on your visa, travel insurance, overseas visitor health cover, or whether your country has a reciprocal health care agreement with Australia.",
  applySteps: [
    "Check whether you already have a Medicare card in your wallet, digital wallet, or myGov account.",
    "Prepare identity documents such as your passport, visa information, citizenship document, or residency documents.",
    "Use the official Services Australia enrolment page to check your exact pathway.",
    "After enrolment, ask clinics whether they bulk bill or whether there will be an out-of-pocket cost."
  ],

  visitorCoveredTitle: "Your Country May Have a Reciprocal Health Care Agreement",
  visitorNotListedTitle: "Your Country Is Not Listed for Reciprocal Medicare Help",
  visitorCoveredBody: "Australia has reciprocal health care agreements with some countries. This may help with medically necessary care while visiting Australia, but it does not mean every appointment or treatment is free.",
  visitorNotListedBody: "Your country is not on this reciprocal agreement list, or you selected unsure. You may need travel insurance, overseas visitor health cover, or to pay the clinic directly.",
  visitorWhy: "Why we ask your country: this is about government health care agreement rules. It is not about race, ethnicity, or background.",
  visitorItalyNote: "Italy has a special time limit under the reciprocal agreement, so Italian visitors should check the official rule carefully.",
  visitorSteps: [
    "Ask the clinic whether they accept Medicare or Reciprocal Health Care Agreement patients before booking.",
    "Bring your passport, visa information, and any health insurance documents.",
    "For urgent care, contact the health service directly and ask about upfront costs.",
    "Use the official Services Australia reciprocal agreement page to confirm the exact rule for your country."
  ],

  insuranceUnsureTitle: "Check Whether You Already Have Private Health Insurance",
  insuranceUnsureBody: "You might already be covered under your own policy or a family policy.",
  insuranceUnsureSteps: [
    "Search your email for words like health insurance, Medibank, Bupa, HCF, nib, ahm or premium.",
    "Check your bank statements for regular health insurance payments.",
    "Ask your parents or partner if you are listed on a family policy.",
    "Check whether you have a private health insurance card or app."
  ],

  noPrivateTitle: "Medicare or Low-Cost Pathway",
  noPrivateSteps: [
    "Use Healthdirect to find a nearby health service.",
    "Look for bulk-billing or low-cost providers where available.",
    "Call the clinic before booking and ask about out-of-pocket costs.",
    "For GP visits, ask directly whether they bulk bill."
  ],

  privateTitle: "Private Health Claim Guide",
  beforeClaim: "Before you claim, check this",
  officialClaimText: "Use your insurer's official claim page to confirm your cover and start the claim.",
  doctorNotice: "For GP and out-of-hospital specialist consultations, Medicare is usually the relevant claim pathway. Private health insurance usually only helps with doctor fees when the treatment is in hospital.",
  extrasLikely: "This looks like an extras-style service and your selected plan appears to include extras-style cover. You still need to check your annual limit, waiting period, and provider rules.",
  hospitalIssue: "You selected a hospital-style plan. This service is often linked to extras cover, so you may not be able to claim unless your policy includes extras.",
  ambulanceNotice: "Ambulance cover depends on your state and your policy. Check both your state rules and your insurer before assuming it is covered.",
  policyNotice: "Your exact claim depends on your policy, waiting periods, limits, provider recognition, and receipt details.",
  planUnsureNotice: "Because your plan is unknown, this tool can only give a general pathway. Check your insurer app, email, or policy statement for the exact plan name.",
  otherInsurerNotice: "Your insurer is not listed yet. Search your insurer's official website for “make a claim”, “extras claim”, or “member login”.",
  claimChecklist: [
    "Do you have the right cover type for this service?",
    "Has your waiting period finished?",
    "Do you have an itemised receipt or invoice?",
    "Is the provider recognised by your insurer?",
    "Have you already used your annual limit?"
  ]
};

const serviceInfo = {
  gp: {
    label: "GP consultation",
    detail: "A normal doctor appointment at a clinic.",
    category: "Usually Medicare",
    explanation: "Normal GP visits are usually handled through Medicare, not private health insurance. Bulk billing may be available depending on the clinic.",
    icon: "assets/icons/gp.png",
    fallback: "GP"
  },
  specialist: {
    label: "Specialist consultation",
    detail: "A specialist doctor appointment, before or after booking.",
    category: "Usually Medicare unless it is in-hospital treatment",
    explanation: "Out-of-hospital specialist consultations usually involve Medicare rebates. Private health insurance is usually more relevant if you are treated in hospital.",
    icon: "assets/icons/specialist.png",
    fallback: "S"
  },
  psychology: {
    label: "Psychology",
    detail: "Psychologist or mental health appointment.",
    category: "May involve Medicare or extras",
    explanation: "Psychology may involve Medicare if you have a valid mental health treatment plan. Some extras policies may also include psychology benefits.",
    icon: "assets/icons/psychology.png",
    fallback: "Ψ"
  },
  dental: {
    label: "Dental",
    detail: "Check-up, clean, filling, braces, or wisdom teeth.",
    category: "Usually extras cover",
    explanation: "Dental is usually linked to extras cover. Check your annual limit, waiting period, provider rules, and itemised receipt.",
    icon: "assets/icons/dental.png",
    fallback: "D"
  },
  optical: {
    label: "Optical",
    detail: "Glasses, contact lenses, or eye-related costs.",
    category: "Usually extras cover",
    explanation: "Optical is usually linked to extras cover. Check whether glasses, contact lenses, or eye tests are included in your policy.",
    icon: "assets/icons/optical.png",
    fallback: "O"
  },
  physio: {
    label: "Physiotherapy",
    detail: "Physio appointment or treatment.",
    category: "Usually extras cover",
    explanation: "Physiotherapy is usually linked to extras cover. Check your per-visit limit, annual limit, waiting period, and whether the provider is recognised.",
    icon: "assets/icons/physiotherapy.png",
    fallback: "P"
  },
  ambulance: {
    label: "Ambulance",
    detail: "Emergency transport or ambulance bill.",
    category: "Depends on state and policy",
    explanation: "Ambulance cover depends on your state and your private health insurance policy. Check both your state rules and your insurer.",
    icon: "assets/icons/ambulance.png",
    fallback: "A"
  },
  other: {
    label: "Other health service",
    detail: "Get general next steps.",
    category: "Medicare or low-cost pathway",
    explanation: "Your next step is to check Medicare, public health, or low-cost provider options.",
    icon: "assets/icons/other-health-service.png",
    fallback: "?"
  }
};

const insurers = {
  medibank: {
    name: "Medibank",
    logo: "assets/logos/medibank.png",
    fallback: "M",
    url: "https://www.medibank.com.au/health-insurance/using-your-cover/claim/",
    plans: [
      { id: "medibank-extras", name: "Medibank extras-style cover", type: "extras" },
      { id: "medibank-hospital", name: "Medibank hospital-style cover", type: "hospital" },
      { id: "medibank-combined", name: "Medibank hospital and extras-style cover", type: "combined" }
    ]
  },
  bupa: {
    name: "Bupa",
    logo: "assets/logos/bupa.png",
    fallback: "B",
    url: "https://www.bupa.com.au/health-insurance/members/make-a-claim",
    plans: [
      { id: "bupa-extras", name: "Bupa extras-style cover", type: "extras" },
      { id: "bupa-hospital", name: "Bupa hospital-style cover", type: "hospital" },
      { id: "bupa-combined", name: "Bupa hospital and extras-style cover", type: "combined" }
    ]
  },
  hcf: {
    name: "HCF",
    logo: "assets/logos/hcf.png",
    fallback: "HCF",
    url: "https://www.hcf.com.au/memberservices/claims/make-a-claim",
    plans: [
      { id: "hcf-extras", name: "HCF extras-style cover", type: "extras" },
      { id: "hcf-hospital", name: "HCF hospital-style cover", type: "hospital" },
      { id: "hcf-combined", name: "HCF hospital and extras-style cover", type: "combined" }
    ]
  },
  nib: {
    name: "nib",
    logo: "assets/logos/nib.png",
    fallback: "nib",
    url: "https://www.nib.com.au/health-information/member-services/claiming",
    plans: [
      { id: "nib-extras", name: "nib extras-style cover", type: "extras" },
      { id: "nib-hospital", name: "nib hospital-style cover", type: "hospital" },
      { id: "nib-combined", name: "nib hospital and extras-style cover", type: "combined" }
    ]
  },
  ahm: {
    name: "ahm",
    logo: "assets/logos/ahm.png",
    fallback: "ahm",
    url: "https://help.ahm.com.au/hc/en-us/articles/115005293647-Make-a-claim-ahm-extras",
    plans: [
      { id: "ahm-extras", name: "ahm extras-style cover", type: "extras" },
      { id: "ahm-hospital", name: "ahm hospital-style cover", type: "hospital" },
      { id: "ahm-combined", name: "ahm hospital and extras-style cover", type: "combined" }
    ]
  },
  australianUnity: {
    name: "Australian Unity",
    logo: "assets/logos/australian-unity.png",
    fallback: "AU",
    url: "https://www.australianunity.com.au/health-insurance/how-to-claim",
    plans: [
      { id: "au-extras", name: "Australian Unity extras-style cover", type: "extras" },
      { id: "au-hospital", name: "Australian Unity hospital-style cover", type: "hospital" },
      { id: "au-combined", name: "Australian Unity hospital and extras-style cover", type: "combined" }
    ]
  },
  other: {
    name: "your insurer",
    logo: "",
    fallback: "?",
    url: "",
    plans: [
      { id: "unknown-plan", name: text.unsureOrUnlistedPlan, type: "unknown" }
    ]
  }
};

const rhcaCountries = {
  belgium: { name: "Belgium", flag: "assets/countries/belgium.png", fallback: "BE" },
  finland: { name: "Finland", flag: "assets/countries/finland.png", fallback: "FI" },
  italy: { name: "Italy", flag: "assets/countries/italy.png", fallback: "IT" },
  malta: { name: "Malta", flag: "assets/countries/malta.png", fallback: "MT" },
  netherlands: { name: "Netherlands", flag: "assets/countries/netherlands.png", fallback: "NL" },
  newZealand: { name: "New Zealand", flag: "assets/countries/new-zealand.png", fallback: "NZ" },
  norway: { name: "Norway", flag: "assets/countries/norway.png", fallback: "NO" },
  ireland: { name: "Republic of Ireland", flag: "assets/countries/ireland.png", fallback: "IE" },
  slovenia: { name: "Slovenia", flag: "assets/countries/slovenia.png", fallback: "SI" },
  sweden: { name: "Sweden", flag: "assets/countries/sweden.png", fallback: "SE" },
  unitedKingdom: { name: "United Kingdom", flag: "assets/countries/united-kingdom.png", fallback: "UK" }
};

const steps = {
  medicare: {
    eyebrow: "Step 1",
    title: "Do You Have a Medicare Card?",
    help: "Look at the sample card below and choose the option that best matches you.",
    progress: 14,
    label: "Step 1 of 7",
    visual: "medicare",
    answers: [
      { text: "Yes, I have a Medicare card", detail: "I can use Medicare services in Australia.", value: "yes", next: "privateInsurance", icon: "✓" },
      { text: "No, I do not", detail: "I may be visiting, new to Australia, or not eligible.", value: "no", next: "residency", icon: "✕" },
      { text: "I am not sure", detail: "Help me check whether I might already have Medicare or could apply.", value: "unsure", next: "residency", icon: "?" }
    ]
  },
  residency: {
    eyebrow: "Medicare Eligibility",
    title: "Are You Living in Australia Long Term?",
    help: "This helps us decide whether to check normal Medicare enrolment or visitor health care rules.",
    progress: 28,
    label: "Step 2 of 7",
    answers: [
      { text: "Yes, I live in Australia", detail: "For example, citizen, permanent resident, or applying for permanent residency.", value: "living", next: "medicareIdentity", icon: "⌂" },
      { text: "No, I am visiting Australia", detail: "For example, tourist, visitor, or short stay.", value: "visitor", next: "visitorCountry", icon: "✈" }
    ]
  },
  medicareIdentity: {
    eyebrow: "Medicare Eligibility",
    title: "Which Best Describes You?",
    help: "Choose the option that best matches the person who needs the health service.",
    progress: 42,
    label: "Step 3 of 7",
    answers: [
      { text: "Australian citizen", detail: "I am an Australian citizen or I need to enrol as one.", value: "citizen", next: "medicareCitizenResult", icon: "✓" },
      { text: "New Zealand citizen", detail: "I am from New Zealand and I am in Australia.", value: "nzCitizen", next: "nzDuration", icon: "NZ" },
      { text: "Australian permanent resident", detail: "I have already been granted permanent residency.", value: "permanentResident", next: "medicarePermanentResult", icon: "PR" },
      { text: "I have applied for permanent residency or a protection visa", detail: "My permanent visa or protection visa application is being assessed.", value: "appliedPr", next: "prWork", icon: "↻" },
      { text: "Temporary resident", detail: "I have a temporary visa and I am not applying for permanent residency.", value: "temporaryResident", next: "temporaryResidentResult", icon: "T" },
      { text: "I am not sure", detail: "I need a general step-by-step way to check.", value: "identityUnsure", next: "medicareGeneralResult", icon: "?" }
    ]
  },
  nzDuration: {
    eyebrow: "New Zealand Citizen",
    title: "How Long Are You Living in Australia?",
    help: "New Zealand citizens may have different Medicare pathways depending on whether they live in Australia long term or are visiting.",
    progress: 56,
    label: "Step 4 of 7",
    answers: [
      { text: "6 months or more", detail: "I have lived here for 6 months, or I can prove I will live here for 6 months or more.", value: "sixPlus", next: "medicareNZResult", icon: "✓" },
      { text: "Less than 6 months", detail: "I am mostly visiting or staying short term.", value: "underSix", next: "visitorService", icon: "✈" },
      { text: "I am not sure", detail: "I need to check my documents first.", value: "durationUnsure", next: "medicareNZMaybeResult", icon: "?" }
    ]
  },
  prWork: {
    eyebrow: "Permanent Residency Application",
    title: "Do You Have Work Rights or Close Family in Australia?",
    help: "This helps check whether you may be able to enrol while your permanent residency or protection visa is being assessed.",
    progress: 56,
    label: "Step 4 of 7",
    answers: [
      { text: "Yes, I have work rights", detail: "My current visa allows me to work in Australia.", value: "workRights", next: "medicareAppliedPRResult", icon: "✓" },
      { text: "No work rights, but close family in Australia", detail: "I have a parent, spouse, de facto partner or child who is an Australian citizen, permanent resident, or New Zealand citizen living in Australia.", value: "closeFamily", next: "medicareAppliedPRResult", icon: "⌂" },
      { text: "No / I am not sure", detail: "I do not know if I meet these extra requirements.", value: "noWorkNoFamily", next: "medicareAppliedPRMaybeResult", icon: "?" }
    ]
  },
  visitorCountry: {
    eyebrow: "Visitor Guidance",
    title: "Where Are You Visiting From?",
    help: "We ask this because Australia has health care agreements with specific countries. It is about government agreement rules, not your race or ethnicity.",
    progress: 42,
    label: "Step 3 of 7",
    answers: []
  },
  visitorService: {
    eyebrow: "Visitor Guidance",
    title: "Which Consultation or Service Do You Want to Check?",
    help: "Choose the health service you are considering, booking, or claiming.",
    progress: 56,
    label: "Step 4 of 7",
    answers: []
  },
  privateInsurance: {
    eyebrow: "Private Health Insurance",
    title: "Do You Have Private Health Insurance?",
    help: "This helps decide whether we guide you through an insurer claim, a Medicare pathway, or both.",
    progress: 28,
    label: "Step 2 of 7",
    answers: [
      { text: "Yes", detail: "I have a private health insurance policy.", value: "yes", next: "insurer", icon: "✓" },
      { text: "No", detail: "I only want Medicare or low-cost options.", value: "no", next: "serviceNoPrivate", icon: "✕" },
      { text: "I am not sure", detail: "I might be on a family policy or old policy.", value: "unsure", next: "insuranceUnsureResult", icon: "?" }
    ]
  },
  insurer: {
    eyebrow: "Insurer",
    title: "Which Private Health Insurer Are You With?",
    help: "Choose the company you recognise. You can replace these placeholder logos with real images in the assets folder.",
    progress: 42,
    label: "Step 3 of 7",
    answers: []
  },
  plan: {
    eyebrow: "Plan Name",
    title: "Which Plan Looks Most Like Yours?",
    help: "Choose the closest plan name. If you are unsure, choose the unsure option.",
    progress: 56,
    label: "Step 4 of 7",
    answers: []
  },
  servicePrivate: {
    eyebrow: "Health Service",
    title: "Which Health Service Do You Want to Check?",
    help: "Choose the appointment or service you are considering, booking, or claiming.",
    progress: 70,
    label: "Step 5 of 7",
    answers: []
  },
  serviceNoPrivate: {
    eyebrow: "Health Service",
    title: "Which Health Service Do You Want to Check?",
    help: "We will show the Medicare or low-cost pathway.",
    progress: 70,
    label: "Step 3 of 3",
    answers: []
  }
};

function iconMarkup(iconText) {
  return `<span class="icon-circle" aria-hidden="true">${iconText}</span>`;
}

function imageMarkup(src, fallbackText, type, alt) {
  if (!src) return `<span class="logo-fallback">${fallbackText}</span>`;

  const wrapClass = type === "flag" ? "flag-wrap" : type === "service" ? "service-icon-wrap" : "logo-wrap";
  const imgClass = type === "flag" ? "flag-icon-img" : type === "service" ? "service-icon-img" : "insurer-logo";

  return `
    <span class="${wrapClass}">
      <img class="${imgClass}" src="${src}" alt="${alt}" onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');" />
      <span class="logo-fallback hidden">${fallbackText}</span>
    </span>
  `;
}

function getCountryAnswers() {
  const answers = Object.entries(rhcaCountries).map(([key, country]) => ({
    text: country.name,
    detail: "This country is listed under Australia's reciprocal health care agreement information.",
    value: key,
    next: "visitorService",
    customIcon: imageMarkup(country.flag, country.fallback, "flag", `${country.name} flag`)
  }));

  answers.push({
    text: "Another country / I am not sure",
    detail: "My country is not listed or I do not know which rule applies.",
    value: "otherCountry",
    next: "visitorService",
    customIcon: imageMarkup("assets/countries/other-country.png", "?", "flag", "Other country icon")
  });

  return answers;
}

function getServiceAnswers(nextStep, useVisitorState = false) {
  return Object.entries(serviceInfo).map(([key, service]) => ({
    text: service.label,
    detail: service.detail,
    value: key,
    next: nextStep,
    saveAsVisitorService: useVisitorState,
    customIcon: imageMarkup(service.icon, service.fallback, "service", `${service.label} icon`)
  }));
}

function getInsurerAnswers() {
  return Object.entries(insurers)
    .filter(([key]) => key !== "other")
    .map(([key, insurer]) => ({
      text: insurer.name,
      detail: `Choose this if your policy is with ${insurer.name}.`,
      value: key,
      next: "plan",
      customIcon: imageMarkup(insurer.logo, insurer.fallback, "logo", `${insurer.name} logo`)
    }))
    .concat({
      text: text.otherInsurer,
      detail: text.otherInsurerDetail,
      value: "other",
      next: "plan",
      customIcon: imageMarkup("", "?", "logo", "Other insurer icon")
    });
}

function getPlanAnswers() {
  const insurer = insurers[state.insurer] || insurers.other;
  const plans = insurer.plans.map((plan) => ({
    text: plan.name,
    detail: "Choose this if it looks closest to your policy name or cover type.",
    value: plan.id,
    next: "servicePrivate",
    icon: "□"
  }));

  plans.push({
    text: text.unsureOrUnlistedPlan,
    detail: text.unsureOrUnlistedDetail,
    value: "unknown-plan",
    next: "servicePrivate",
    icon: "?"
  });

  return plans;
}

function getStep(stepName) {
  const step = { ...steps[stepName] };

  if (stepName === "visitorCountry") step.answers = getCountryAnswers();
  if (stepName === "visitorService") step.answers = getServiceAnswers("visitorResult", true);
  if (stepName === "insurer") step.answers = getInsurerAnswers();
  if (stepName === "plan") step.answers = getPlanAnswers();
  if (stepName === "servicePrivate") step.answers = getServiceAnswers("privateResult");
  if (stepName === "serviceNoPrivate") step.answers = getServiceAnswers("noPrivateResult");

  return step;
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

  const step = getStep(stepName);

  questionCard.classList.remove("hidden");
  resultCard.classList.add("hidden");
  questionVisual.classList.add("hidden");
  questionVisual.innerHTML = "";

  questionEyebrow.textContent = step.eyebrow;
  questionTitle.textContent = step.title;
  questionHelp.textContent = step.help;
  stepLabel.textContent = step.label;
  progressFill.style.width = `${step.progress}%`;

  if (step.visual === "medicare") {
    renderMedicareSampleCard();
  }

  answerButtons.innerHTML = "";

  step.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";

    const icon = answer.customIcon || iconMarkup(answer.icon || "•");

    button.innerHTML = `
      <span class="answer-main">
        ${icon}
        <span>${answer.text}</span>
      </span>
      <span class="answer-detail">${answer.detail}</span>
    `;

    button.addEventListener("click", () => {
      saveAnswer(stepName, answer.value, answer);
      renderStep(answer.next);
    });

    answerButtons.appendChild(button);
  });

  if (historyStack.length > 0) {
    backButton.classList.remove("hidden");
  } else {
    backButton.classList.add("hidden");
  }

  afterRenderTranslate();
}

function renderMedicareSampleCard() {
  questionVisual.classList.remove("hidden");
  questionVisual.innerHTML = `
    <div class="medicare-sample-card" aria-label="Sample Medicare card">
      <div class="medicare-card-top">
        <p class="medicare-card-title">Medicare</p>
        <span class="sample-stamp">${text.sample}</span>
      </div>
      <div class="medicare-card-line">
        <span>Jane Citizen</span>
        <span>2000 00000 0</span>
      </div>
    </div>
    <p class="visual-caption">${text.medicareCardCaption}</p>
  `;
}

function saveAnswer(stepName, value, answer = {}) {
  if (stepName === "medicare") state.medicare = value;
  if (stepName === "residency") state.residency = value;
  if (stepName === "medicareIdentity") state.medicareIdentity = value;
  if (stepName === "nzDuration") {
    state.nzDuration = value;
    if (value === "underSix") state.visitorCountry = "newZealand";
  }
  if (stepName === "prWork") state.prWork = value;
  if (stepName === "visitorCountry") state.visitorCountry = value;
  if (stepName === "visitorService" || answer.saveAsVisitorService) state.visitorService = value;
  if (stepName === "privateInsurance") state.privateInsurance = value;
  if (stepName === "insurer") state.insurer = value;
  if (stepName === "plan") state.plan = value;
  if (stepName === "servicePrivate" || stepName === "serviceNoPrivate") state.service = value;
}

function getSelectedPlan() {
  const insurer = insurers[state.insurer] || insurers.other;
  return insurer.plans.find((plan) => plan.id === state.plan) || {
    id: "unknown-plan",
    name: text.unsureOrUnlistedPlan,
    type: "unknown"
  };
}

function getServiceInfo(serviceKey) {
  return serviceInfo[serviceKey] || serviceInfo.other;
}

function listHtml(items) {
  return `<ul class="result-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderResult(resultType) {
  questionCard.classList.add("hidden");
  resultCard.classList.remove("hidden");
  progressFill.style.width = "100%";
  stepLabel.textContent = text.result;

  let html = "";

  if (resultType.startsWith("medicare")) html = renderMedicareResult(resultType);
  if (resultType === "temporaryResidentResult") html = renderTemporaryResidentResult();
  if (resultType === "visitorResult") html = renderVisitorResult();
  if (resultType === "insuranceUnsureResult") html = renderInsuranceUnsureResult();
  if (resultType === "noPrivateResult") html = renderNoPrivateResult();
  if (resultType === "privateResult") html = renderPrivateResult();

  html += `<div class="notice">${resultText.reminder}</div>`;

  if (historyStack.length > 0) {
    html += `
      <div class="result-actions">
        <button id="resultBackButton" class="secondary-button icon-button" type="button">
          <span class="button-icon" aria-hidden="true">←</span>
          <span>${text.back}</span>
        </button>
      </div>
    `;
  }

  resultCard.innerHTML = html;

  const resultBackButton = document.getElementById("resultBackButton");
  if (resultBackButton) resultBackButton.addEventListener("click", goBack);

  afterRenderTranslate();
}

function renderMedicareResult(resultType) {
  let body = resultText.generalBody;

  if (resultType === "medicareCitizenResult") body = resultText.citizenBody;
  if (resultType === "medicareNZResult") body = resultText.nzBody;
  if (resultType === "medicareNZMaybeResult") body = resultText.nzBody;
  if (resultType === "medicarePermanentResult") body = resultText.permanentBody;
  if (resultType === "medicareAppliedPRResult") body = resultText.appliedPrBody;
  if (resultType === "medicareAppliedPRMaybeResult") body = resultText.maybeAppliedPrBody;

  return `
    <p class="eyebrow">${text.result}</p>
    <h2>${resultText.applyTitle}</h2>
    <p>${body}</p>
    <h3>${resultText.whatNext}</h3>
    ${listHtml(resultText.applySteps)}
    <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/enrolling-medicare" target="_blank" rel="noreferrer">↗ ${text.medicareApplyLink}</a>
  `;
}

function renderTemporaryResidentResult() {
  return `
    <p class="eyebrow">${text.result}</p>
    <h2>${resultText.applyTitle}</h2>
    <p>${resultText.temporaryBody}</p>
    <h3>${resultText.whatNext}</h3>
    ${listHtml(resultText.applySteps)}
    <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/enrolling-medicare" target="_blank" rel="noreferrer">↗ ${text.medicareEligibilityLink}</a>
  `;
}

function renderVisitorResult() {
  const service = getServiceInfo(state.visitorService || "other");
  const countryName = rhcaCountries[state.visitorCountry]?.name || text.otherCountry;
  const isCoveredCountry = Boolean(rhcaCountries[state.visitorCountry]);
  const italyNote = state.visitorCountry === "italy" ? `<div class="notice">${resultText.visitorItalyNote}</div>` : "";

  return `
    <p class="eyebrow">${text.result}</p>
    <h2>${isCoveredCountry ? resultText.visitorCoveredTitle : resultText.visitorNotListedTitle}</h2>
    <p><strong>${countryName}</strong></p>
    <p><strong>${resultText.likelyCategory}:</strong> ${service.category}</p>
    <p>${isCoveredCountry ? resultText.visitorCoveredBody : resultText.visitorNotListedBody}</p>
    <div class="notice"><strong>${resultText.visitorWhy}</strong></div>
    ${italyNote}
    <h3>${resultText.whatNext}</h3>
    ${listHtml(resultText.visitorSteps)}
    <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/when-reciprocal-health-care-agreements-apply-and-you-visit-australia?context=22481" target="_blank" rel="noreferrer">↗ ${text.reciprocalLink}</a>
  `;
}

function renderInsuranceUnsureResult() {
  return `
    <p class="eyebrow">${text.result}</p>
    <h2>${resultText.insuranceUnsureTitle}</h2>
    <p>${resultText.insuranceUnsureBody}</p>
    ${listHtml(resultText.insuranceUnsureSteps)}
  `;
}

function renderNoPrivateResult() {
  const service = getServiceInfo(state.service || "other");

  return `
    <p class="eyebrow">${text.result}</p>
    <h2>${service.label}: ${resultText.noPrivateTitle}</h2>
    <p><strong>${resultText.likelyPathway}:</strong> ${service.category}</p>
    <p>${service.explanation}</p>
    <h3>${resultText.whatNext}</h3>
    ${listHtml(resultText.noPrivateSteps)}
    <a class="primary-link green" href="https://www.healthdirect.gov.au/australian-health-services" target="_blank" rel="noreferrer">↗ ${text.healthdirect}</a>
  `;
}

function renderPrivateResult() {
  const service = getServiceInfo(state.service || "other");
  const insurer = insurers[state.insurer] || insurers.other;
  const plan = getSelectedPlan();
  const isDoctorConsult = ["gp", "specialist"].includes(state.service);
  const isExtrasService = ["dental", "optical", "physio", "psychology"].includes(state.service);

  let decision = "";

  if (isDoctorConsult) {
    decision = `<div class="notice"><strong>${resultText.doctorNotice}</strong></div>`;
  } else if (isExtrasService && ["extras", "combined"].includes(plan.type)) {
    decision = `<div class="notice">${resultText.extrasLikely}</div>`;
  } else if (isExtrasService && plan.type === "hospital") {
    decision = `<div class="notice">${resultText.hospitalIssue}</div>`;
  } else if (state.service === "ambulance") {
    decision = `<div class="notice">${resultText.ambulanceNotice}</div>`;
  } else {
    decision = `<div class="notice">${resultText.policyNotice}</div>`;
  }

  const planWarning = plan.type === "unknown" ? `<div class="notice">${resultText.planUnsureNotice}</div>` : "";
  const insurerLink = insurer.url
    ? `<a class="primary-link blue" href="${insurer.url}" target="_blank" rel="noreferrer">↗ ${text.officialClaim}</a>`
    : `<div class="notice">${resultText.otherInsurerNotice}</div>`;

  return `
    <p class="eyebrow">${text.result}</p>
    <h2>${service.label}: ${resultText.privateTitle}</h2>
    <p><strong>${resultText.selectedInsurer}:</strong> ${insurer.name}</p>
    <p><strong>${resultText.selectedPlan}:</strong> ${plan.name}</p>
    <p><strong>${resultText.likelyCategory}:</strong> ${service.category}</p>
    <p>${service.explanation}</p>
    ${decision}
    ${planWarning}
    <h3>${resultText.beforeClaim}</h3>
    ${listHtml(resultText.claimChecklist)}
    <h3>${resultText.nextStep}</h3>
    <p>${resultText.officialClaimText}</p>
    ${insurerLink}
  `;
}

function updateStaticEnglishText() {
  languageLabel.textContent = text.language;
  heroTag.textContent = text.heroTag;
  heroSlogan.textContent = text.slogan;
  heroSubtext.textContent = text.subtext;
  restartText.textContent = text.restart;
  backText.textContent = text.back;
  smallPrintText.textContent = text.smallPrint;
}

function setDirection(languageCode) {
  document.documentElement.lang = languageCode === "en" ? "en" : languageCode;
  document.body.classList.toggle("rtl", rtlLanguages.includes(languageCode));
}

function cookieDomainCandidates() {
  const host = window.location.hostname;
  if (!host || host === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    return [""];
  }

  return ["", host, `.${host}`];
}

function clearGoogleTranslateCookie() {
  cookieDomainCandidates().forEach((domain) => {
    const domainPart = domain ? `; domain=${domain}` : "";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax${domainPart}`;
  });
}

function setGoogleTranslateCookie(languageCode) {
  clearGoogleTranslateCookie();

  if (languageCode === "en") return;

  cookieDomainCandidates().forEach((domain) => {
    const domainPart = domain ? `; domain=${domain}` : "";
    document.cookie = `googtrans=/en/${languageCode}; path=/${domainPart}`;
    document.cookie = `googtrans=/en/${languageCode}; path=/; SameSite=Lax${domainPart}`;
  });
}

function getGoogleCombo() {
  return document.querySelector(".goog-te-combo");
}

function dispatchGoogleComboChange(combo) {
  combo.dispatchEvent(new Event("change", { bubbles: true }));
  combo.dispatchEvent(new Event("input", { bubbles: true }));
}

function changeGoogleLanguage(languageCode, attempt = 0) {
  setDirection(languageCode);
  setGoogleTranslateCookie(languageCode);

  const combo = getGoogleCombo();

  if (!combo) {
    if (attempt < 40) {
      window.setTimeout(() => changeGoogleLanguage(languageCode, attempt + 1), 250);
    }
    return;
  }

  combo.value = languageCode === "en" ? "" : languageCode;
  dispatchGoogleComboChange(combo);

  // Google Translate sometimes misses text that was added after the page loaded.
  // Re-dispatch once so the final recommendation page and newly rendered questions are also translated.
  if (languageCode !== "en" && attempt === 0) {
    window.setTimeout(() => {
      const latestCombo = getGoogleCombo();
      if (!latestCombo) return;
      latestCombo.value = languageCode;
      dispatchGoogleComboChange(latestCombo);
    }, 650);
  }
}

function afterRenderTranslate() {
  setDirection(currentLanguage);
  if (currentLanguage !== "en") {
    window.setTimeout(() => changeGoogleLanguage(currentLanguage), 180);
  }
}

window.googleTranslateElementInit = function googleTranslateElementInit() {
  if (window.google && window.google.translate) {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: googleTranslateLanguages.join(","),
        autoDisplay: false,
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
      },
      "googleTranslateElement"
    );

    window.setTimeout(() => changeGoogleLanguage(currentLanguage), 700);
  }
};

function showBannerSlide(index) {
  if (!bannerSlides.length) return;

  const safeIndex = ((index % bannerSlides.length) + bannerSlides.length) % bannerSlides.length;

  bannerSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === safeIndex);
  });

  bannerDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === safeIndex);
  });
}

function initBannerCarousel() {
  if (!bannerSlides.length) return;

  let currentBanner = 0;

  bannerDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      currentBanner = Number(dot.dataset.slide || 0);
      showBannerSlide(currentBanner);
    });
  });

  window.setInterval(() => {
    currentBanner += 1;
    showBannerSlide(currentBanner);
  }, 4500);
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
  const previousLanguage = currentLanguage;
  currentLanguage = event.target.value;
  localStorage.setItem("claimcheckLanguage", currentLanguage);

  if (currentLanguage === "en" && previousLanguage !== "en") {
    clearGoogleTranslateCookie();
    setDirection("en");
    updateStaticEnglishText();
    renderStep(currentStep, false);
    changeGoogleLanguage("en");
    return;
  }

  setDirection(currentLanguage);
  updateStaticEnglishText();
  renderStep(currentStep, false);
  changeGoogleLanguage(currentLanguage);
});

languageSelect.value = currentLanguage;
setDirection(currentLanguage);
updateStaticEnglishText();
initBannerCarousel();
renderStep("medicare", false);
