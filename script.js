const serviceRules = {
  dental: {
    category: "Usually extras cover",
    explanation: "Dental is commonly claimed under extras cover. You should check your dental annual limit, waiting period, provider rules and itemised receipt."
  },
  optical: {
    category: "Usually extras cover",
    explanation: "Optical is commonly claimed under extras cover. You should check your optical limit, eligible items and whether the provider is recognised by your insurer."
  },
  physio: {
    category: "Usually extras cover",
    explanation: "Physiotherapy is commonly claimed under extras cover. You should check your per-visit limit, annual limit, waiting period and receipt details."
  },
  psychology: {
    category: "May be extras or Medicare",
    explanation: "Psychology may be partly supported through Medicare if you have a valid mental health treatment plan. Some extras policies may also include psychology benefits."
  },
  gp: {
    category: "Usually Medicare, not private health insurance",
    explanation: "Normal GP consultations are usually handled through Medicare rather than private health insurance. If you do not have private insurance, look for a bulk-billing clinic."
  },
  specialist: {
    category: "Usually Medicare or hospital-related",
    explanation: "Specialist consultations may involve Medicare rebates. Private health insurance usually matters more if the service is connected to hospital treatment."
  },
  ambulance: {
    category: "Depends on state and policy",
    explanation: "Ambulance cover in Australia depends heavily on your state and your private health insurance policy. You should check your state rules and insurer cover."
  }
};

const claimLinks = {
  medibank: {
    name: "Medibank",
    url: "https://www.medibank.com.au/health-insurance/using-your-cover/claim/"
  },
  bupa: {
    name: "Bupa",
    url: "https://www.bupa.com.au/"
  },
  hcf: {
    name: "HCF",
    url: "https://www.hcf.com.au/memberservices/claims/make-a-claim"
  },
  nib: {
    name: "nib",
    url: "https://www.nib.com.au/"
  },
  ahm: {
    name: "ahm",
    url: "https://help.ahm.com.au/hc/en-us/articles/115005293647-Make-a-claim-ahm-extras"
  },
  "australian-unity": {
    name: "Australian Unity",
    url: "https://www.australianunity.com.au/health-insurance/how-to-claim"
  }
};

const form = document.getElementById("claimForm");
const result = document.getElementById("result");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const insuranceStatus = document.getElementById("insuranceStatus").value;
  const insurer = document.getElementById("insurer").value;
  const service = document.getElementById("service").value;
  const coverType = document.getElementById("coverType").value;

  const selectedService = serviceRules[service];
  const selectedInsurer = claimLinks[insurer];

  let html = `
    <h2 class="result-title">Your claim guide</h2>
    <p><strong>Likely category:</strong> ${selectedService.category}</p>
    <p>${selectedService.explanation}</p>
  `;

  if (insuranceStatus === "no") {
    html += `
      <h3>Because you selected no private insurance</h3>
      <p>Your next step is to check Medicare options and search for a bulk-billing or low-cost provider.</p>
      <a class="button-link" href="https://www.healthdirect.gov.au/australian-health-services" target="_blank">
        Search Healthdirect
      </a>
    `;
  }

  if (insuranceStatus === "yes") {
    html += `
      <h3>Before you claim, check these things:</h3>
      <ul class="next-steps">
        <li>Do you have the right type of cover?</li>
        <li>Has your waiting period ended?</li>
        <li>Do you have an itemised receipt or invoice?</li>
        <li>Is the provider recognised by your insurer?</li>
        <li>Have you already used your annual limit?</li>
      </ul>
    `;

    if (coverType === "hospital" && ["dental", "optical", "physio", "psychology"].includes(service)) {
      html += `
        <p><strong>Warning:</strong> This service is often linked to extras cover, but you selected hospital-only cover. You may need to check whether you actually have extras.</p>
      `;
    }

    if (selectedInsurer) {
      html += `
        <h3>Claim with ${selectedInsurer.name}</h3>
        <p>Use the official insurer website to confirm your cover and start your claim.</p>
        <a class="button-link" href="${selectedInsurer.url}" target="_blank">
          Go to ${selectedInsurer.name}
        </a>
      `;
    } else {
      html += `
        <h3>Insurer not listed yet</h3>
        <p>Search your insurer's official website and look for "make a claim", "member login" or "extras claim".</p>
      `;
    }
  }

  if (insuranceStatus === "unsure") {
    html += `
      <h3>You are not sure about your insurance</h3>
      <p>Check your health insurance card, email inbox, bank statements, or ask your parents/family if you are on a family policy.</p>
    `;
  }

  html += `
    <hr>
    <p><strong>Reminder:</strong> This is only general guidance. Do not rely on this as confirmation that you are covered.</p>
  `;

  result.innerHTML = html;
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth" });
});
