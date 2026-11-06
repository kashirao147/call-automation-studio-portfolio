(function () {
  const STORAGE_KEY = "ai_voice_portfolio_content_v3";
  const CLOUD_CACHE_TS_KEY = `${STORAGE_KEY}_cloud_ts`;
  const CLOUD_CACHE_MAX_AGE_MS = 5 * 60 * 1000;

  const DEFAULT_REPEATERS = {
    about_items: [
      {
        title: "AI Voice Calling Systems",
        text: "Human-like inbound and outbound voice agents with intent handling and smart call routing.",
      },
      {
        title: "Lead Capture & Appointment Booking",
        text: "Instantly qualify leads, sync with your CRM, and automate confirmations plus reminders.",
      },
      {
        title: "n8n Workflow Automations",
        text: "Connect calls, forms, sheets, CRM, and WhatsApp workflows into one smooth pipeline.",
      },
    ],
    case_studies: [
      {
        mediaClass: "case-media-masterworks",
        logo: "MASTERWORKS",
        tag: "Alternative Investments",
        title: "Masterworks",
        description:
          "Strategic advisory on automating investor relations for high-value offerings.",
        outcomes: [
          "Architected AI-driven communication strategy for HNW individuals",
          "Streamlined inquiry processing via intelligent agent design",
          "Advised on operational efficiency for offering management",
        ],
        cta: "Schedule Strategic Consultation",
        ctaUrl: "https://calendly.com/dpleducationsystem/meeting",
      },
      {
        mediaClass: "case-media-jg",
        logo: "J.G.WENTWORTH",
        tag: "Financial Services",
        title: "JG Wentworth",
        description:
          "Consulting engagement to modernize structured settlement client intake.",
        outcomes: [
          "Optimized client intake workflow through strategic AI implementation",
          "Automated debt counseling scheduling via custom voice architecture",
          "Increased accessibility for support inquiries through 24/7 agents",
        ],
        cta: "Schedule Strategic Consultation",
        ctaUrl: "https://calendly.com/dpleducationsystem/meeting",
      },
      {
        mediaClass: "case-media-nerdwallet",
        logo: "nerdwallet",
        tag: "Personal Finance",
        title: "Nerdwallet",
        description:
          "Advisory on personalized voice interfaces for financial product discovery.",
        outcomes: [
          "Designed personalized user experiences for financial queries",
          "Implemented scalable support architecture for diverse products",
          "Leveraged data-driven insights for improved recommendations",
        ],
        cta: "Schedule Strategic Consultation",
        ctaUrl: "https://calendly.com/dpleducationsystem/meeting",
      },
    ],
    process_steps: [
      {
        icon: "[]",
        title: "Strategic Assessment",
        text: "We run a deep discovery session to map call flows, lead handling, response gaps, and automation opportunities with highest impact.",
      },
      {
        icon: "</>",
        title: "Architecture & Design",
        text: "We design voice personas, prompt logic, handoff paths, and n8n workflow architecture tailored to your exact operating model.",
      },
      {
        icon: "AI",
        title: "Implementation Advisory",
        text: "We guide integration across Retell AI, OpenAI, Vapi, CRM, and communication channels with reliability and security best practices.",
      },
      {
        icon: "%%",
        title: "Ongoing Optimization",
        text: "After launch, we continuously improve scripts, latency, outcomes, and conversion performance using real interaction analytics.",
      },
    ],
    integrations: [
      {
        logo: "HubSpot",
        title: "HubSpot",
        description:
          "Seamlessly sync customer data, calls, and interactions with your HubSpot CRM.",
        points: [
          "Automatic contact creation",
          "Call logging and recording",
          "Activity tracking",
          "Custom field mapping",
        ],
        cta: "Learn More",
        ctaUrl: "#",
      },
      {
        logo: "GoHighLevel",
        title: "GoHighLevel",
        description:
          "Integrate voice AI capabilities directly into your GoHighLevel marketing automation.",
        points: [
          "Lead qualification",
          "Appointment scheduling",
          "Campaign automation",
          "Call tracking",
        ],
        cta: "Learn More",
        ctaUrl: "#",
      },
      {
        logo: "n8n",
        title: "n8n",
        description:
          "Build custom workflows and automations using flexible n8n nodes and triggers.",
        points: [
          "Custom workflow creation",
          "Data synchronization",
          "Automated triggers",
          "Webhook support",
        ],
        cta: "Learn More",
        ctaUrl: "#",
      },
      {
        logo: "Make",
        title: "Make.com",
        description:
          "Create powerful automated scenarios with Make.com and your voice AI agents.",
        points: [
          "Visual automation builder",
          "Real-time execution",
          "Multi-app scenarios",
          "Error handling",
        ],
        cta: "Learn More",
        ctaUrl: "#",
      },
      {
        logo: "Zapier",
        title: "Zapier",
        description:
          "Connect voice agents with thousands of apps through fast no-code automation.",
        points: [
          "Multi-app integration",
          "Automated workflows",
          "Custom Zaps",
          "Instant triggers",
        ],
        cta: "Learn More",
        ctaUrl: "#",
      },
      {
        logo: "Retell AI",
        title: "Retell AI",
        description:
          "Leverage advanced voice AI capabilities with natural synthesis and real-time conversational control.",
        points: [
          "Natural voice synthesis",
          "Real-time conversations",
          "Custom voice cloning",
          "Multi-language support",
        ],
        cta: "Learn More",
        ctaUrl: "#",
      },
    ],
    partner_logos: [
      {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/HubSpot_Logo.svg/512px-HubSpot_Logo.svg.png",
        alt: "HubSpot",
        link: "",
      },
      {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Zapier_logo.svg/512px-Zapier_logo.svg.png",
        alt: "Zapier",
        link: "",
      },
      {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/N8n-logo-new.svg/512px-N8n-logo-new.svg.png",
        alt: "n8n",
        link: "",
      },
      {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/512px-Google_2015_logo.svg.png",
        alt: "Google",
        link: "",
      },
      {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/OpenAI_Logo.svg/512px-OpenAI_Logo.svg.png",
        alt: "OpenAI",
        link: "",
      },
    ],
    who_its_for: [
      {
        title: "Healthcare Clinics",
        text: "Automate appointment calls, patient reminders, and inbound support triage.",
      },
      {
        title: "Real Estate Teams",
        text: "Capture and qualify property leads instantly with voice-first follow-up workflows.",
      },
      {
        title: "Education & Coaching",
        text: "Handle inquiry calls, counseling bookings, and lead nurture sequences automatically.",
      },
      {
        title: "Service Businesses",
        text: "Reduce missed calls, speed up response time, and convert more inbound opportunities.",
      },
    ],
    use_cases: [
      {
        title: "Missed Call Recovery",
        description: "Every missed call triggers an AI callback flow plus CRM lead creation.",
        outcomes: [
          "Faster lead recovery",
          "Higher response consistency",
          "Zero manual tracking",
        ],
      },
      {
        title: "AI Lead Qualification",
        description: "Voice agent asks qualifying questions and routes hot leads to sales instantly.",
        outcomes: [
          "Better lead quality",
          "Sales team time saved",
          "Faster deal response",
        ],
      },
      {
        title: "Appointment Booking Automation",
        description: "AI handles booking, reminders, and re-scheduling across call and workflow channels.",
        outcomes: [
          "More confirmed bookings",
          "Lower no-show rate",
          "Less admin workload",
        ],
      },
    ],
    faq_items: [
      {
        question: "How long does setup take?",
        answer: "Most businesses can launch a practical MVP within 7-14 days depending on integration complexity.",
      },
      {
        question: "Can this integrate with our current CRM?",
        answer: "Yes. We commonly integrate with HubSpot, GoHighLevel, spreadsheets, and custom APIs through n8n.",
      },
      {
        question: "Do you provide ongoing support after launch?",
        answer: "Yes. We provide optimization support, prompt tuning, flow improvements, and reliability monitoring.",
      },
      {
        question: "Is this suitable for small businesses?",
        answer: "Yes. We can start with a lean scope, prove ROI, then expand workflows as your team grows.",
      },
    ],
    service_pages: [
      { path: "/", changefreq: "weekly", priority: "1.0" },
      { path: "/ai-voice-agent-services/", changefreq: "weekly", priority: "0.9" },
      { path: "/ai-automation-services/", changefreq: "weekly", priority: "0.9" },
      { path: "/n8n-workflow-automation/", changefreq: "weekly", priority: "0.9" },
      { path: "/retell-openai-vapi-integration/", changefreq: "weekly", priority: "0.9" },
      { path: "/appointment-booking-automation/", changefreq: "weekly", priority: "0.9" },
      { path: "/voice-ai-customer-service/", changefreq: "weekly", priority: "0.8" },
      { path: "/ai-voice-agents-islamabad/", changefreq: "weekly", priority: "0.8" },
      { path: "/ai-automation-services-pakistan/", changefreq: "weekly", priority: "0.8" },
      { path: "/ai-voice-agents-usa/", changefreq: "weekly", priority: "0.8" },
      { path: "/ai-voice-agents-uk/", changefreq: "weekly", priority: "0.8" },
      { path: "/ai-automation-services-australia/", changefreq: "weekly", priority: "0.8" },
      { path: "/ai-dental-receptionist-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/virtual-receptionist-perth/", changefreq: "monthly", priority: "0.8" },
      { path: "/business-process-automation-consulting-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-phone-answering-for-restaurants-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-voice-agent-vs-ai-receptionist-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/real-time-voice-ai-latency-security-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-voice-agents-customer-support-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/missed-call-automation-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-receptionist-property-management-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-call-recording-transcription-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-receptionist-allied-health-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-receptionist-ndis-providers-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-governance-checklist-voice-ai-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-voice-agents-field-service-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-receptionist-accounting-firms-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-receptionist-law-firms-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-receptionist-mortgage-brokers-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-receptionist-insurance-brokers-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-receptionist-veterinary-clinics-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-receptionist-solar-installers-australia/", changefreq: "monthly", priority: "0.8" },
      { path: "/ai-voice-agents-europe/", changefreq: "weekly", priority: "0.8" },
      { path: "/retell-ai-vs-vapi/", changefreq: "weekly", priority: "0.8" },
      { path: "/ai-lead-qualification-calls/", changefreq: "weekly", priority: "0.8" },
      { path: "/ai-appointment-reminder-automation/", changefreq: "weekly", priority: "0.8" },
      { path: "/multilingual-ai-voice-agents/", changefreq: "weekly", priority: "0.8" },
      { path: "/ai-voice-agents-for-healthcare-clinics/", changefreq: "weekly", priority: "0.8" },
      { path: "/ai-voice-agents-for-real-estate-leads/", changefreq: "weekly", priority: "0.8" },
      { path: "/ai-appointment-booking-with-retell-vapi/", changefreq: "weekly", priority: "0.8" },
    ],
    pricing_packages: [
      {
        badge: "Basic",
        title: "Basic",
        price: "$499",
        period: "/month",
        description: "A focused starting package for businesses launching their first AI voice agent and automation workflow.",
        features: [
          "1 voice assistant workflow demo",
          "Basic lead capture form automation",
          "Email support",
          "Setup guidance call (30 min)",
        ],
        cta: "Get Started",
        ctaUrl: "https://calendly.com/dpleducationsystem/meeting",
        highlight: "false",
      },
      {
        badge: "Most Popular",
        title: "Growth",
        price: "$999",
        period: "/month",
        description: "For businesses ready to deploy a production AI voice agent for calls, follow-ups, bookings, and workflow automation.",
        features: [
          "Up to 3 AI voice call workflows",
          "CRM + n8n workflow integration",
          "Appointment booking automation",
          "Priority WhatsApp support",
          "Monthly optimization review",
        ],
        cta: "Choose Growth",
        ctaUrl: "https://calendly.com/dpleducationsystem/meeting",
        highlight: "true",
      },
      {
        badge: "Custom",
        title: "Enterprise",
        price: "$1,999",
        period: "/month",
        description: "Advanced AI voice agent architecture, integrations, compliance, and dedicated support for high-volume operations.",
        features: [
          "Unlimited custom AI automation workflows",
          "Advanced compliance and security controls",
          "Dedicated implementation specialist",
          "SLA-backed support and monitoring",
          "Quarterly strategy and scaling roadmap",
        ],
        cta: "Book Enterprise Call",
        ctaUrl: "https://calendly.com/dpleducationsystem/meeting",
        highlight: "false",
      },
    ],
  };

  const deepClone = (value) => JSON.parse(JSON.stringify(value));

  const normalizeStorage = (raw) => {
    if (!raw || typeof raw !== "object") {
      return { content: {}, repeaters: deepClone(DEFAULT_REPEATERS) };
    }

    if ("content" in raw || "repeaters" in raw) {
      return {
        content:
          raw.content && typeof raw.content === "object" ? raw.content : {},
        repeaters: {
          ...deepClone(DEFAULT_REPEATERS),
          ...(raw.repeaters && typeof raw.repeaters === "object"
            ? raw.repeaters
            : {}),
        },
      };
    }

    return {
      content: raw,
      repeaters: deepClone(DEFAULT_REPEATERS),
    };
  };

  const getSavedData = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return normalizeStorage(raw ? JSON.parse(raw) : {});
    } catch {
      return normalizeStorage({});
    }
  };

  const saveData = (data) => {
    const normalized = normalizeStorage(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  };

  const markCloudSyncedNow = () => {
    try {
      localStorage.setItem(CLOUD_CACHE_TS_KEY, String(Date.now()));
    } catch {
      // ignore storage issues
    }
  };

  const shouldFetchCloudNow = (localData) => {
    try {
      const lastSync = Number(localStorage.getItem(CLOUD_CACHE_TS_KEY) || 0);
      const age = Date.now() - lastSync;
      const hasLocalContent =
        Boolean(localData && Object.keys(localData.content || {}).length) ||
        Boolean(localData && Object.keys(localData.repeaters || {}).length);

      if (!hasLocalContent) {
        return true;
      }
      return !lastSync || age > CLOUD_CACHE_MAX_AGE_MS;
    } catch {
      return true;
    }
  };

  const getSavedContent = () => getSavedData().content;
  const getSavedRepeaters = () => getSavedData().repeaters;

  const fetchCloudData = async () => {
    const response = await fetch("/api/content", {
      method: "GET",
      cache: "no-store",
    });

    const rawText = await response.text();
    let parsed = {};
    try {
      parsed = rawText ? JSON.parse(rawText) : {};
    } catch {
      parsed = {};
    }

    if (!response.ok) {
      throw new Error(parsed.error || "Failed to fetch cloud content.");
    }

    return normalizeStorage(parsed.data || parsed);
  };

  const saveCloudData = async (data, adminKey = "") => {
    const normalized = normalizeStorage(data);
    const response = await fetch("/api/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": String(adminKey || ""),
      },
      body: JSON.stringify(normalized),
    });

    const rawText = await response.text();
    let parsed = {};
    try {
      parsed = rawText ? JSON.parse(rawText) : {};
    } catch {
      parsed = {};
    }

    if (!response.ok) {
      throw new Error(parsed.error || "Failed to save cloud content.");
    }

    saveData(normalized);
    markCloudSyncedNow();
    return normalized;
  };

  const saveContent = (content) => {
    const data = getSavedData();
    data.content = content || {};
    saveData(data);
  };

  const saveRepeaters = (repeaters) => {
    const data = getSavedData();
    data.repeaters = {
      ...deepClone(DEFAULT_REPEATERS),
      ...(repeaters || {}),
    };
    saveData(data);
  };

  const clearContent = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const applyContentToDom = (root = document, content = getSavedContent()) => {
    const nodes = root.querySelectorAll("[data-content-key]");
    nodes.forEach((node) => {
      const key = node.getAttribute("data-content-key");
      if (!key || !(key in content)) {
        return;
      }

      const value = String(content[key] ?? "");
      if (node.getAttribute("data-content-type") === "html") {
        node.innerHTML = value;
      } else {
        node.textContent = value;
      }
    });
  };

  const renderAboutItems = (root, items) => {
    const container = root.querySelector(".about-highlights");
    if (!container || !Array.isArray(items)) {
      return;
    }
    container.innerHTML = "";
    items.forEach((item, index) => {
      const article = document.createElement("article");
      article.className = "about-item";
      article.innerHTML = `
        <span class="about-icon">${String(index + 1).padStart(2, "0")}</span>
        <div>
          <h3>${item.title || ""}</h3>
          <p>${item.text || ""}</p>
        </div>
      `;
      container.append(article);
    });
  };

  const renderCaseStudies = (root, items) => {
    const track = root.querySelector("[data-case-track]");
    const dots = root.querySelector("[data-case-dots]");
    if (!track || !Array.isArray(items)) {
      return;
    }
    track.innerHTML = "";
    items.forEach((item) => {
      const article = document.createElement("article");
      article.className = "case-slide";
      const outcomes = Array.isArray(item.outcomes)
        ? item.outcomes.map((o) => `<li>${o}</li>`).join("")
        : "";
      article.innerHTML = `
        <div class="case-media ${item.mediaClass || "case-media-masterworks"}">
          <div class="case-logo-card">${item.logo || ""}</div>
        </div>
        <div class="case-content">
          <span class="case-tag">${item.tag || ""}</span>
          <h3>${item.title || ""}</h3>
          <p>${item.description || ""}</p>
          <div class="case-outcomes">
            <h4>Advisory Outcomes</h4>
            <ul>${outcomes}</ul>
          </div>
          <a class="case-cta" href="${item.ctaUrl || "#"}" target="_blank" rel="noreferrer">
            ${item.cta || "Learn More"}
          </a>
        </div>
      `;
      track.append(article);
    });
    if (dots) {
      dots.innerHTML = "";
    }
  };

  const renderProcessSteps = (root, items) => {
    const container = root.querySelector(".process-grid");
    if (!container || !Array.isArray(items)) {
      return;
    }
    container.innerHTML = "";
    items.forEach((item, index) => {
      const article = document.createElement("article");
      article.className = "process-card";
      article.innerHTML = `
        <span class="process-step">${index + 1}</span>
        <div class="process-icon">${item.icon || ""}</div>
        <h3>${item.title || ""}</h3>
        <p>${item.text || ""}</p>
      `;
      container.append(article);
    });
  };

  const renderIntegrations = (root, items) => {
    const container = root.querySelector(".integrations-grid");
    if (!container || !Array.isArray(items)) {
      return;
    }
    container.innerHTML = "";
    items.forEach((item) => {
      const article = document.createElement("article");
      article.className = "integration-card";
      const points = Array.isArray(item.points)
        ? item.points.map((p) => `<li>${p}</li>`).join("")
        : "";
      article.innerHTML = `
        <div class="integration-logo">${item.logo || ""}</div>
        <h3>${item.title || ""}</h3>
        <p>${item.description || ""}</p>
        <ul>${points}</ul>
        <a href="${item.ctaUrl || "#"}">${item.cta || "Learn More"}</a>
      `;
      container.append(article);
    });
  };

  const renderPricingPackages = (root, items) => {
    const section = root.querySelector(".pricing-section");
    const container = root.querySelector(".pricing-grid");
    if (!container || !section || !Array.isArray(items)) {
      return;
    }

    const packages = items.filter(
      (item) => item && String(item.title || "").trim() && String(item.price || "").trim()
    );

    if (!packages.length) {
      section.hidden = true;
      container.innerHTML = "";
      return;
    }

    section.hidden = false;
    container.innerHTML = "";

    packages.forEach((item) => {
      const card = document.createElement("article");
      const isHighlight = String(item.highlight || "").toLowerCase() === "true";
      card.className = `pricing-card${isHighlight ? " is-highlight" : ""}`;
      const features = Array.isArray(item.features)
        ? item.features.map((feature) => `<li>${feature}</li>`).join("")
        : "";
      const ctaUrl = String(item.ctaUrl || "#").trim() || "#";
      const cta = String(item.cta || "Choose Plan").trim() || "Choose Plan";
      const period = String(item.period || "").trim();

      card.innerHTML = `
        <span class="pricing-badge">${item.badge || "Plan"}</span>
        <h3>${item.title || ""}</h3>
        <p class="pricing-price">${item.price || ""}${period ? `<span>${period}</span>` : ""}</p>
        <p class="pricing-description">${item.description || ""}</p>
        <ul class="pricing-features">${features}</ul>
        <a class="pricing-cta" href="${ctaUrl}" target="_blank" rel="noreferrer">${cta}</a>
      `;
      container.append(card);
    });
  };

  const renderWhoItsFor = (root, items) => {
    const section = root.querySelector(".who-section");
    const container = root.querySelector(".who-grid");
    if (!container || !section || !Array.isArray(items)) {
      return;
    }
    const cards = items.filter(
      (item) => item && String(item.title || "").trim() && String(item.text || "").trim()
    );
    if (!cards.length) {
      section.hidden = true;
      container.innerHTML = "";
      return;
    }
    section.hidden = false;
    container.innerHTML = "";
    cards.forEach((item) => {
      const card = document.createElement("article");
      card.className = "who-card";
      card.innerHTML = `
        <h3>${item.title || ""}</h3>
        <p>${item.text || ""}</p>
      `;
      container.append(card);
    });
  };

  const renderUseCases = (root, items) => {
    const section = root.querySelector(".use-cases-section");
    const container = root.querySelector(".use-cases-grid");
    if (!container || !section || !Array.isArray(items)) {
      return;
    }
    const cards = items.filter(
      (item) =>
        item &&
        String(item.title || "").trim() &&
        String(item.description || "").trim()
    );
    if (!cards.length) {
      section.hidden = true;
      container.innerHTML = "";
      return;
    }
    section.hidden = false;
    container.innerHTML = "";
    cards.forEach((item) => {
      const outcomes = Array.isArray(item.outcomes)
        ? item.outcomes.map((outcome) => `<li>${outcome}</li>`).join("")
        : "";
      const card = document.createElement("article");
      card.className = "use-case-card";
      card.innerHTML = `
        <h3>${item.title || ""}</h3>
        <p>${item.description || ""}</p>
        <ul>${outcomes}</ul>
      `;
      container.append(card);
    });
  };

  const renderFaqItems = (root, items) => {
    const section = root.querySelector(".faq-section");
    const container = root.querySelector(".faq-grid");
    if (!container || !section || !Array.isArray(items)) {
      return;
    }
    const rows = items.filter(
      (item) =>
        item &&
        String(item.question || "").trim() &&
        String(item.answer || "").trim()
    );
    if (!rows.length) {
      section.hidden = true;
      container.innerHTML = "";
      return;
    }
    section.hidden = false;
    container.innerHTML = "";
    rows.forEach((item) => {
      const details = document.createElement("details");
      details.className = "faq-item";
      details.innerHTML = `
        <summary>${item.question || ""}</summary>
        <p>${item.answer || ""}</p>
      `;
      container.append(details);
    });
  };

  const renderPartnerLogos = (root, items) => {
    const section = root.querySelector("[data-logo-strip]");
    const track = root.querySelector("[data-logo-track]");
    if (!section || !track || !Array.isArray(items)) {
      return;
    }

    const toDirectDriveImageUrl = (url) => {
      const source = String(url || "").trim();
      if (!source) {
        return "";
      }

      const directMatch = source.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
      if (directMatch?.[1]) {
        return `https://drive.google.com/thumbnail?id=${directMatch[1]}&sz=w1200`;
      }

      const filePathMatch = source.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{10,})/);
      if (filePathMatch?.[1]) {
        return `https://drive.google.com/thumbnail?id=${filePathMatch[1]}&sz=w1200`;
      }

      return source;
    };

    const normalized = items
      .map((item) => ({
        imageUrl: toDirectDriveImageUrl(item?.imageUrl),
        alt: String(item?.alt || "Partner logo").trim() || "Partner logo",
        link: String(item?.link || "").trim(),
      }))
      .filter((item) => Boolean(item.imageUrl));

    if (!normalized.length) {
      section.hidden = true;
      track.innerHTML = "";
      return;
    }

    section.hidden = false;

    const minimumVisible = 5;
    const baseLogos = [];
    for (let i = 0; i < Math.max(normalized.length, minimumVisible); i += 1) {
      baseLogos.push(normalized[i % normalized.length]);
    }

    const combined = [...baseLogos, ...baseLogos];
    track.innerHTML = "";

    combined.forEach((item) => {
      const wrapper = item.link
        ? document.createElement("a")
        : document.createElement("article");
      wrapper.className = "logo-strip-item";

      if (item.link) {
        wrapper.href = item.link;
        wrapper.target = "_blank";
        wrapper.rel = "noreferrer";
      }

      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.alt;
      img.loading = "lazy";
      img.addEventListener("error", () => {
        wrapper.style.display = "none";
      });

      wrapper.append(img);
      track.append(wrapper);
    });
  };

  const applyRepeaters = (root = document, repeaters = getSavedRepeaters()) => {
    renderPartnerLogos(root, repeaters.partner_logos);
    renderWhoItsFor(root, repeaters.who_its_for);
    renderUseCases(root, repeaters.use_cases);
    renderAboutItems(root, repeaters.about_items);
    renderCaseStudies(root, repeaters.case_studies);
    renderProcessSteps(root, repeaters.process_steps);
    renderIntegrations(root, repeaters.integrations);
    renderPricingPackages(root, repeaters.pricing_packages);
    renderFaqItems(root, repeaters.faq_items);
  };

  window.PortfolioContent = {
    getSavedData,
    saveData,
    getSavedContent,
    getSavedRepeaters,
    saveContent,
    saveRepeaters,
    fetchCloudData,
    saveCloudData,
    markCloudSyncedNow,
    shouldFetchCloudNow,
    clearContent,
    applyContentToDom,
    applyRepeaters,
    getDefaultRepeaters: () => deepClone(DEFAULT_REPEATERS),
    STORAGE_KEY,
  };

  const runApply = async () => {
    if (!document.body || !document.body.hasAttribute("data-apply-content")) {
      return;
    }
    let data = getSavedData();
    if (shouldFetchCloudNow(data)) {
      try {
        const cloudData = await fetchCloudData();
        data = cloudData;
        saveData(cloudData);
        markCloudSyncedNow();
      } catch {
        // Local cached fallback keeps the site usable even if cloud is unavailable.
      }
    }
    applyContentToDom(document, data.content);
    applyRepeaters(document, data.repeaters);
    document.dispatchEvent(new CustomEvent("portfolio-content-applied"));
  };

  runApply().catch(() => {});
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      runApply().catch(() => {});
    });
  }
})();
