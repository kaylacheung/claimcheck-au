const state = {
  medicare: null,
  residency: null,
  privateInsurance: null,
  service: null,
  insurer: null,
  coverType: null
};

const historyStack = [];

const questionCard = document.getElementById("questionCard");
const resultCard = document.getElementById("resultCard");
const questionEyebrow = document.getElementById("questionEyebrow");
const questionTitle = document.getElementById("questionTitle");
const questionHelp = document.getElementById("questionHelp");
const answerButtons = document.getElementById("answerButtons");
const backButton = document.getElementById("backButton");
const restartButton = document.getElementById("restartButton");
const stepLabel = document.getElementById("stepLabel");
const progressFill = document.getElementById("progressFill");

let currentStep = "medicare";

const insurers = {
  medibank: {
    name: "Medibank",
    url: "https://www.medibank.com.au/health-insurance/using-your-cover/claim/"
  },
  bupa: {
    name: "Bupa",
    url: "https://www.bupa.com.au/health-insurance/members/make-a-claim"
  },
  hcf: {
    name: "HCF",
    url: "https://www.hcf.com.au/memberservices/claims/make-a-claim"
  },
  nib: {
    name: "nib",
    url: "https://www.nib.com.au/health-information/member-services/claiming"
  },
  ahm: {
    name: "ahm",
    url: "https://help.ahm.com.au/hc/en-us/articles/115005293647-Make-a-claim-ahm-extras"
  },
  australianUnity: {
    name: "Australian Unity",
    url: "https://www.australianunity.com.au/health-insurance/how-to-claim"
  },
  other: {
    name: "your insurer",
    url: ""
  }
};

const serviceInfo = {
  dental: {
    label: "Dental",
    category: "Usually extras cover",
    explanation:
      "Dental is usually linked to extras cover. You will normally need to check your annual limit, waiting period, provider rules, and itemised receipt."
  },
  optical: {
    label: "Optical",
    category: "Usually extras cover",
    explanation:
      "Optical is usually linked to extras cover. Check whether glasses, contact lenses, or eye tests are included in your policy."
  },
  physio: {
    label: "Physiotherapy",
    category: "Usually extras cover",
    explanation:
      "Physiotherapy is usually linked to extras cover. Check your per-visit limit, annual limit, waiting period, and whether the provider is recognised."
  },
  psychology: {
    label: "Psychology",
    category: "May involve Medicare or extras",
    explanation:
      "Psychology may involve Medicare if you have a valid mental health treatment plan. Some extras policies may also include psychology benefits."
  },
  gp: {
    label: "GP consultation",
    category: "Usually Medicare",
    explanation:
      "Normal GP visits are usually handled through Medicare, not private health insurance. Bulk billing may be available depending on the clinic."
  },
  specialist: {
    label: "Specialist consultation",
    category: "Usually Medicare or hospital-related",
    explanation:
      "Specialist consultations may involve Medicare rebates. Private health insurance usually becomes more relevant if hospital treatment is involved."
  },
  ambulance: {
    label: "Ambulance",
    category: "Depends on state and policy",
    explanation:
      "Ambulance cover depends on your state and your private health insurance policy. You should check both your state rules and your insurer."
  }
};

const steps = {
  medicare: {
    eyebrow: "Step 1",
    title: "Do you have a Medicare card?",
    help: "Choose the option that best matches you.",
    progress: 20,
    label: "Step 1 of 5",
    answers: [
      {
        text: "Yes, I have a Medicare card",
        detail: "I can use Medicare services in Australia.",
        value: "yes",
        next: "privateInsurance"
      },
      {
        text: "No, I do not",
        detail: "I may be visiting, new to Australia, or not eligible.",
        value: "no",
        next: "residency"
      },
      {
        text: "I am not sure",
        detail: "I need help checking.",
        value: "unsure",
        next: "medicareUnsureResult"
      }
    ]
  },

  residency: {
    eyebrow: "Medicare eligibility",
    title: "Are you living in Australia long term?",
    help: "This helps point you toward the right Medicare eligibility pathway.",
    progress: 35,
    label: "Step 2 of 5",
    answers: [
      {
        text: "Yes, I live in Australia",
        detail: "For example, citizen, permanent resident, or applying for permanent residency.",
        value: "living",
        next: "medicareEligibilityResult"
      },
      {
        text: "No, I am visiting Australia",
        detail: "For example, tourist, visitor, or short stay.",
        value: "visitor",
        next: "visitorResult"
      }
    ]
  },

  privateInsurance: {
    eyebrow: "Private health insurance",
    title: "Do you have private health insurance?",
    help: "This decides whether we guide you through an insurer claim or a Medicare/bulk-billing pathway.",
    progress: 40,
    label: "Step 2 of 5",
    answers: [
      {
        text: "Yes",
        detail: "I have a health insurance policy.",
        value: "yes",
        next: "servicePrivate"
      },
      {
        text: "No",
        detail: "I only want Medicare or low-cost options.",
        value: "no",
        next: "serviceNoPrivate"
      },
      {
        text: "I am not sure",
        detail: "I might be on a family policy or old policy.",
        value: "unsure",
        next: "insuranceUnsureResult"
      }
    ]
  },

  servicePrivate: {
    eyebrow: "Health service",
    title: "What did you pay for?",
    help: "Pick the service you want to check.",
    progress: 60,
    label: "Step 3 of 5",
    answers: [
      {
        text: "Dental",
        detail: "Check-up, clean, filling, braces, wisdom teeth.",
        value: "dental",
        next: "insurer"
      },
      {
        text: "Optical",
        detail: "Glasses, contact lenses, eye-related costs.",
        value: "optical",
        next: "insurer"
      },
      {
        text: "Physiotherapy",
        detail: "Physio appointment or treatment.",
        value: "physio",
        next: "insurer"
      },
      {
        text: "Psychology",
        detail: "Psychologist or mental health appointment.",
        value: "psychology",
        next: "insurer"
      },
      {
        text: "GP consultation",
        detail: "Normal doctor appointment.",
        value: "gp",
        next: "insurer"
      },
      {
        text: "Specialist consultation",
        detail: "Specialist doctor appointment.",
        value: "specialist",
        next: "insurer"
      },
      {
        text: "Ambulance",
        detail: "Emergency transport or ambulance bill.",
        value: "ambulance",
        next: "insurer"
      }
    ]
  },

  serviceNoPrivate: {
    eyebrow: "Health service",
    title: "What do you need help with?",
    help: "We will show the Medicare or low-cost pathway.",
    progress: 70,
    label: "Step 3 of 3",
    answers: [
      {
        text: "GP consultation",
        detail: "Find a bulk-billing or low-cost GP.",
        value: "gp",
        next: "noPrivateResult"
      },
      {
        text: "Psychology",
        detail: "Check Medicare mental health support options.",
        value: "psychology",
        next: "noPrivateResult"
      },
      {
        text: "Specialist consultation",
        detail: "Check Medicare rebate and referral pathway.",
        value: "specialist",
        next: "noPrivateResult"
      },
      {
        text: "Dental",
        detail: "Check public dental or low-cost options.",
        value: "dental",
        next: "noPrivateResult"
      },
      {
        text: "Other health service",
        detail: "Get general next steps.",
        value: "other",
        next: "noPrivateResult"
      }
    ]
  },

  insurer: {
    eyebrow: "Insurer",
    title: "Which insurer are you with?",
    help: "We will send you to the official claim page at the end.",
    progress: 75,
    label: "Step 4 of 5",
    answers: [
      {
        text: "Medibank",
        detail: "Go to Medibank claim guidance later.",
        value: "medibank",
        next: "coverType"
      },
      {
        text: "Bupa",
        detail: "Go to Bupa claim guidance later.",
        value: "bupa",
        next: "coverType"
      },
      {
        text: "HCF",
        detail: "Go to HCF claim guidance later.",
        value: "hcf",
        next: "coverType"
      },
      {
        text: "nib",
        detail: "Go to nib claim guidance later.",
        value: "nib",
        next: "coverType"
      },
      {
        text: "ahm",
        detail: "Go to ahm claim guidance later.",
        value: "ahm",
        next: "coverType"
      },
      {
        text: "Australian Unity",
        detail: "Go to Australian Unity claim guidance later.",
        value: "australianUnity",
        next: "coverType"
      },
      {
        text: "Other / not listed",
        detail: "I will search for my insurer manually.",
        value: "other",
        next: "coverType"
      }
    ]
  },

  coverType: {
    eyebrow: "Cover type",
    title: "What type of cover do you have?",
    help: "Do not worry if you are unsure. We will still give you the safest next step.",
    progress: 90,
    label: "Step 5 of 5",
    answers: [
      {
        text: "Extras only",
        detail: "Usually for dental, optical, physio and similar services.",
        value: "extras",
        next: "privateResult"
      },
      {
        text: "Hospital only",
        detail: "Usually for hospital treatment.",
        value: "hospital",
        next: "privateResult"
      },
      {
        text: "Hospital and extras",
        detail: "A combined policy.",
        value: "combined",
        next: "privateResult"
      },
      {
        text: "I am not sure",
        detail: "I need to check my policy.",
        value: "unsure",
        next: "privateResult"
      }
    ]
  }
};

function renderStep(stepName, addToHistory = true) {
  if (addToHistory && currentStep !== stepName) {
    historyStack.push(currentStep);
  }

  currentStep = stepName;

  if (stepName.endsWith("Result")) {
    renderResult(stepName);
    return;
  }

  const step = steps[stepName];

  questionCard.classList.remove("hidden");
  resultCard.classList.add("hidden");

  questionEyebrow.textContent = step.eyebrow;
  questionTitle.textContent = step.title;
  questionHelp.textContent = step.help;
  stepLabel.textContent = step.label;
  progressFill.style.width = `${step.progress}%`;

  answerButtons.innerHTML = "";

  step.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.innerHTML = `${answer.text}<span>${answer.detail}</span>`;

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

function saveAnswer(stepName, value) {
  if (stepName === "medicare") state.medicare = value;
  if (stepName === "residency") state.residency = value;
  if (stepName === "privateInsurance") state.privateInsurance = value;
  if (stepName === "servicePrivate" || stepName === "serviceNoPrivate") state.service = value;
  if (stepName === "insurer") state.insurer = value;
  if (stepName === "coverType") state.coverType = value;
}

function renderResult(resultType) {
  questionCard.classList.add("hidden");
  resultCard.classList.remove("hidden");
  progressFill.style.width = "100%";
  stepLabel.textContent = "Result";

  let html = "";

  if (resultType === "medicareUnsureResult") {
    html = `
      <p class="eyebrow">Result</p>
      <h2>Check whether you have Medicare first</h2>
      <p>
        Your first step is to check whether you have a Medicare card or whether you are eligible to enrol.
      </p>
      <ul class="result-list">
        <li>Check your wallet or digital wallet for a Medicare card.</li>
        <li>Check your myGov account.</li>
        <li>Ask your family if you are listed on a family Medicare card.</li>
        <li>Use the official Services Australia information to check eligibility.</li>
      </ul>
      <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/enrolling-medicare" target="_blank">
        Check Medicare eligibility
      </a>
    `;
  }

  if (resultType === "medicareEligibilityResult") {
    html = `
      <p class="eyebrow">Result</p>
      <h2>You may be able to check Medicare eligibility</h2>
      <p>
        Medicare is not only for Australian citizens. Some residents and applicants may also be eligible.
      </p>
      <ul class="result-list">
        <li>Check the official Medicare enrolment rules.</li>
        <li>Prepare identity and residency documents if needed.</li>
        <li>Use Medicare first for GP, specialist and some mental health pathways.</li>
      </ul>
      <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/enrolling-medicare" target="_blank">
        Check Medicare enrolment
      </a>
    `;
  }

  if (resultType === "visitorResult") {
    html = `
      <p class="eyebrow">Result</p>
      <h2>You may need visitor or overseas health guidance</h2>
      <p>
        If you are visiting Australia, your options may depend on your visa, travel insurance, overseas student health cover, or whether your country has a reciprocal health care agreement with Australia.
      </p>
      <ul class="result-list">
        <li>Check whether your country has a reciprocal health care agreement.</li>
        <li>Check your travel insurance or overseas health cover.</li>
        <li>For urgent care, contact the health service directly.</li>
      </ul>
      <a class="primary-link blue" href="https://www.servicesaustralia.gov.au/reciprocal-health-care-agreements" target="_blank">
        Check reciprocal health care
      </a>
    `;
  }

  if (resultType === "insuranceUnsureResult") {
    html = `
      <p class="eyebrow">Result</p>
      <h2>Check whether you already have private health insurance</h2>
      <p>
        You might already be covered under your own policy or a family policy.
      </p>
      <ul class="result-list">
        <li>Search your email for words like health insurance, Medibank, Bupa, HCF, nib, ahm or premium.</li>
        <li>Check your bank statements for regular health insurance payments.</li>
        <li>Ask your parents or partner if you are listed on a family policy.</li>
        <li>Check whether you have a private health insurance card.</li>
      </ul>
      <div class="notice">
        After you confirm your insurer and policy type, come back and use this tool again.
      </div>
    `;
  }

  if (resultType === "noPrivateResult") {
    const service = serviceInfo[state.service] || {
      label: "Health service",
      category: "Medicare or low-cost pathway",
      explanation: "Your next step is to check Medicare, public health, or low-cost provider options."
    };

    html = `
      <p class="eyebrow">Result</p>
      <h2>${service.label}: Medicare or low-cost pathway</h2>
      <p><strong>Likely pathway:</strong> ${service.category}</p>
      <p>${service.explanation}</p>

      <h3>What to do next</h3>
      <ul class="result-list">
        <li>Use Healthdirect to find a nearby health service.</li>
        <li>Look for bulk-billing or low-cost providers where available.</li>
        <li>Call the clinic before booking and ask about out-of-pocket costs.</li>
        <li>For GP visits, ask directly whether they bulk bill.</li>
      </ul>

      <a class="primary-link green" href="https://www.healthdirect.gov.au/australian-health-services" target="_blank">
        Find a health service
      </a>
    `;
  }

  if (resultType === "privateResult") {
    const service = serviceInfo[state.service];
    const insurer = insurers[state.insurer];

    let coverWarning = "";

    if (
      state.coverType === "hospital" &&
      ["dental", "optical", "physio", "psychology"].includes(state.service)
    ) {
      coverWarning = `
        <div class="notice">
          You selected hospital-only cover. This service is often linked to extras cover, so you may not be able to claim unless your policy includes extras.
        </div>
      `;
    }

    let insurerLink = "";

    if (insurer && insurer.url) {
      insurerLink = `
        <a class="primary-link blue" href="${insurer.url}" target="_blank">
          Go to ${insurer.name} claims
        </a>
      `;
    } else {
      insurerLink = `
        <div class="notice">
          Your insurer is not listed yet. Search your insurer's official website for “make a claim”, “extras claim”, or “member login”.
        </div>
      `;
    }

    html = `
      <p class="eyebrow">Result</p>
      <h2>${service.label}: private health claim guide</h2>
      <p><strong>Likely category:</strong> ${service.category}</p>
      <p>${service.explanation}</p>

      ${coverWarning}

      <h3>Before you claim, check this</h3>
      <ul class="result-list">
        <li>Do you have the right cover type for this service?</li>
        <li>Has your waiting period finished?</li>
        <li>Do you have an itemised receipt or invoice?</li>
        <li>Is the provider recognised by your insurer?</li>
        <li>Have you already used your annual limit?</li>
      </ul>

      <h3>Your next step</h3>
      <p>
        Use your insurer's official claim page to confirm your cover and start the claim.
      </p>

      ${insurerLink}
    `;
  }

  html += `
    <div class="notice">
      Reminder: this is general guidance only. It does not confirm that your claim will be accepted.
    </div>
  `;

  resultCard.innerHTML = html;
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
  state.coverType = null;

  historyStack.length = 0;
  renderStep("medicare", false);
});

renderStep("medicare", false);
