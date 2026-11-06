const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

const scrollMilestones = [10, 25, 50, 75, 90, 100];
const reachedScrollMilestones = new Set();
const focusedContactFields = new Set();
const viewedSections = new Set();
const pageViewStartedAt = Date.now();
let activeSectionName = null;
let activeSectionStartedAt = 0;

const trackEvent = (eventName, params = {}) => {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, {
    ...params,
    page_path: window.location.pathname,
    page_title: document.title,
  });
};

const AUTO_TRANSLATE_SOURCE_LANG = "en";
const AUTO_TRANSLATE_STORAGE_KEY = "preferred_site_language";
const AUTO_TRANSLATE_RELOAD_GUARD = "auto_translate_reload_guard";
const SUPPORTED_TRANSLATION_LANGS = new Set([
  "af","am","ar","az","be","bg","bn","bs","ca","ceb","co","cs","cy","da","de","el",
  "eo","es","et","eu","fa","fi","fr","fy","ga","gd","gl","gu","ha","haw","he","hi",
  "hmn","hr","ht","hu","hy","id","ig","is","it","ja","jw","ka","kk","km","kn","ko",
  "ku","ky","la","lb","lo","lt","lv","mg","mi","mk","ml","mn","mr","ms","mt","my",
  "ne","nl","no","ny","pa","pl","ps","pt","ro","ru","sd","si","sk","sl","sm","sn",
  "so","sq","sr","st","su","sv","sw","ta","te","tg","th","tl","tr","uk","ur","uz",
  "vi","xh","yi","yo","zh-CN","zh-TW","zu"
]);

const readGoogleTranslateCookie = () => {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  if (!match) {
    return "";
  }

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
};

const setGoogleTranslateCookie = (targetLanguage) => {
  const value = `/en/${targetLanguage}`;
  document.cookie = `googtrans=${value}; path=/; max-age=31536000; SameSite=Lax`;
  if (window.location.hostname && window.location.hostname !== "localhost") {
    document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}; max-age=31536000; SameSite=Lax`;
  }
};

const getBrowserLanguage = () => {
  const stored = localStorage.getItem(AUTO_TRANSLATE_STORAGE_KEY);
  const fromBrowser =
    (Array.isArray(navigator.languages) && navigator.languages[0]) ||
    navigator.language ||
    "en";
  const raw = (stored || fromBrowser || "en").trim();
  const lower = raw.toLowerCase();

  if (lower.startsWith("zh-tw") || lower.startsWith("zh-hk")) {
    return "zh-TW";
  }
  if (lower.startsWith("zh")) {
    return "zh-CN";
  }

  return lower.split("-")[0];
};

const loadGoogleTranslateScript = () => {
  if (window.google?.translate?.TranslateElement) {
    return;
  }

  window.googleTranslateElementInit = function () {
    if (!window.google?.translate?.TranslateElement) {
      return;
    }
    new window.google.translate.TranslateElement(
      {
        pageLanguage: AUTO_TRANSLATE_SOURCE_LANG,
        autoDisplay: false
      },
      "google_translate_element"
    );
  };

  const script = document.createElement("script");
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

const setupAutoTranslation = () => {
  const targetLanguage = getBrowserLanguage();
  localStorage.setItem(AUTO_TRANSLATE_STORAGE_KEY, targetLanguage);
  document.documentElement.setAttribute("lang", targetLanguage);

  if (
    !targetLanguage ||
    targetLanguage === AUTO_TRANSLATE_SOURCE_LANG ||
    !SUPPORTED_TRANSLATION_LANGS.has(targetLanguage)
  ) {
    return;
  }

  const currentCookie = readGoogleTranslateCookie();
  const expectedCookie = `/${AUTO_TRANSLATE_SOURCE_LANG}/${targetLanguage}`;

  if (currentCookie !== expectedCookie) {
    setGoogleTranslateCookie(targetLanguage);

    if (!sessionStorage.getItem(AUTO_TRANSLATE_RELOAD_GUARD)) {
      sessionStorage.setItem(AUTO_TRANSLATE_RELOAD_GUARD, "1");
      window.location.reload();
      return;
    }
  }

  loadGoogleTranslateScript();
};

const applyGoogleTranslateSelection = (targetLanguage) => {
  const combo = document.querySelector(".goog-te-combo");
  if (!(combo instanceof HTMLSelectElement)) {
    return false;
  }

  if (!targetLanguage) {
    return false;
  }

  combo.value = targetLanguage;
  combo.dispatchEvent(new Event("change"));
  return true;
};

const refreshTranslationAfterDynamicContent = () => {
  const targetLanguage = localStorage.getItem(AUTO_TRANSLATE_STORAGE_KEY) || "";
  if (
    !targetLanguage ||
    targetLanguage === AUTO_TRANSLATE_SOURCE_LANG ||
    !SUPPORTED_TRANSLATION_LANGS.has(targetLanguage)
  ) {
    return;
  }

  let attempts = 0;
  const maxAttempts = 18;
  const timerId = window.setInterval(() => {
    attempts += 1;
    if (applyGoogleTranslateSelection(targetLanguage) || attempts >= maxAttempts) {
      window.clearInterval(timerId);
    }
  }, 350);
};

const sectionNameFromElement = (element) => {
  if (!(element instanceof Element)) {
    return "unknown";
  }

  if (element.closest(".hero")) {
    return "hero";
  }

  const section = element.closest("section[id]");
  if (section?.id) {
    return section.id;
  }

  if (element.closest("header")) {
    return "header";
  }

  if (element.closest("footer")) {
    return "footer";
  }

  return "unknown";
};

const finalizeSectionTime = (reason = "switch") => {
  if (!activeSectionName || !activeSectionStartedAt) {
    return;
  }

  const seconds = Math.round((Date.now() - activeSectionStartedAt) / 1000);
  if (seconds >= 4) {
    trackEvent("section_time_spent", {
      section_name: activeSectionName,
      seconds,
      reason,
    });
  }
};

const setupSectionTracking = () => {
  const sections = [
    document.querySelector(".hero"),
    document.querySelector("#about"),
    document.querySelector("#who-its-for"),
    document.querySelector("#use-cases"),
    document.querySelector("#case-studies"),
    document.querySelector("#consulting-process"),
    document.querySelector("#integrations"),
    document.querySelector("#pricing"),
    document.querySelector("#faq"),
    document.querySelector("#contact"),
    document.querySelector("#audit-cta"),
  ].filter(Boolean);

  if (!sections.length || typeof IntersectionObserver !== "function") {
    return;
  }

  const visibilityMap = new Map();

  const pickMostVisibleSection = () => {
    let selectedName = null;
    let selectedRatio = 0;

    visibilityMap.forEach((ratio, sectionName) => {
      if (ratio > selectedRatio) {
        selectedRatio = ratio;
        selectedName = sectionName;
      }
    });

    if (selectedName && selectedName !== activeSectionName) {
      finalizeSectionTime("switch");
      activeSectionName = selectedName;
      activeSectionStartedAt = Date.now();
    }
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const sectionName = sectionNameFromElement(entry.target);

        if (entry.isIntersecting) {
          visibilityMap.set(sectionName, entry.intersectionRatio);
          if (!viewedSections.has(sectionName) && entry.intersectionRatio >= 0.35) {
            viewedSections.add(sectionName);
            trackEvent("section_view", { section_name: sectionName });
          }
        } else {
          visibilityMap.delete(sectionName);
        }
      });

      pickMostVisibleSection();
    },
    {
      threshold: [0.15, 0.35, 0.55, 0.75],
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
};

setupSectionTracking();

document.addEventListener("click", (event) => {
  const clickable =
    event.target instanceof Element ? event.target.closest("a, button") : null;

  if (!clickable) {
    return;
  }

  const label = (clickable.textContent || "").replace(/\s+/g, " ").trim();
  const sectionName = sectionNameFromElement(clickable);

  if (clickable.matches("[data-nav] a")) {
    trackEvent("nav_click", {
      nav_item: label || "unknown",
      section_name: sectionName,
    });
  }

  if (clickable instanceof HTMLAnchorElement) {
    const href = clickable.getAttribute("href") || "";

    if (href.includes("calendly.com/dpleducationsystem/meeting")) {
      trackEvent("schedule_consultation_click", {
        section_name: sectionName,
        link_text: label || "schedule consultation",
      });
      return;
    }

    if (href.startsWith("#")) {
      trackEvent("in_page_anchor_click", {
        section_name: sectionName,
        target: href,
        link_text: label || "anchor link",
      });
      return;
    }

    if (href && href !== "#") {
      trackEvent("outbound_link_click", {
        section_name: sectionName,
        link_text: label || "external link",
        destination: href,
      });
    }
  }
});

if (header && toggle && nav) {
  const closeMenu = () => {
    header.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    trackEvent("mobile_menu_toggle", { state: isOpen ? "open" : "closed" });
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

const caseSlider = document.querySelector("[data-case-slider]");

if (caseSlider) {
  const track = caseSlider.querySelector("[data-case-track]");
  const prevButton = caseSlider.querySelector("[data-case-prev]");
  const nextButton = caseSlider.querySelector("[data-case-next]");
  const dotsWrap = caseSlider.querySelector("[data-case-dots]");

  if (track && prevButton && nextButton && dotsWrap) {
    const slides = Array.from(track.children);
    let currentIndex = 0;
    let autoRotateId;
    let touchStartX = 0;
    let touchEndX = 0;

    const dots = slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to case study ${index + 1}`);
      dotsWrap.append(dot);
      dot.addEventListener("click", () => {
        goTo(index, "dot");
        restartAutoRotate();
      });
      return dot;
    });

    const render = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === currentIndex);
      });
    };

    const goTo = (index, trigger = "unknown") => {
      const previousIndex = currentIndex;
      currentIndex = (index + slides.length) % slides.length;
      render();
      if (previousIndex !== currentIndex) {
        trackEvent("case_slide_change", {
          from_slide: previousIndex + 1,
          to_slide: currentIndex + 1,
          trigger,
        });
      }
    };

    const next = (trigger = "next") => goTo(currentIndex + 1, trigger);
    const prev = (trigger = "prev") => goTo(currentIndex - 1, trigger);

    const startAutoRotate = () => {
      autoRotateId = window.setInterval(() => next("auto"), 6200);
    };

    const stopAutoRotate = () => {
      window.clearInterval(autoRotateId);
    };

    const restartAutoRotate = () => {
      stopAutoRotate();
      startAutoRotate();
    };

    nextButton.addEventListener("click", () => {
      next("arrow_next");
      restartAutoRotate();
    });

    prevButton.addEventListener("click", () => {
      prev("arrow_prev");
      restartAutoRotate();
    });

    track.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].screenX;
    });

    track.addEventListener("touchend", (event) => {
      touchEndX = event.changedTouches[0].screenX;
      if (Math.abs(touchStartX - touchEndX) < 40) {
        return;
      }

      if (touchStartX > touchEndX) {
        next("swipe_left");
      } else {
        prev("swipe_right");
      }
      restartAutoRotate();
    });

    caseSlider.addEventListener("mouseenter", () => {
      stopAutoRotate();
      trackEvent("case_slider_hover", { state: "enter" });
    });
    caseSlider.addEventListener("mouseleave", () => {
      startAutoRotate();
      trackEvent("case_slider_hover", { state: "leave" });
    });

    render();
    trackEvent("case_slide_view", { slide: 1, trigger: "initial" });
    startAutoRotate();
  }
}

const contactForm = document.querySelector("[data-contact-form]");
const contactStatus = document.querySelector("[data-contact-status]");
const doc = document.documentElement;
let scrollableHeight = 1;
let latestScrollY = window.scrollY;
let isScrollTicking = false;

const recalcScrollableHeight = () => {
  scrollableHeight = Math.max(doc.scrollHeight - doc.clientHeight, 1);
};

const updateScrollProgress = () => {
  const progress = (latestScrollY / scrollableHeight) * 100;
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  doc.style.setProperty("--scroll-progress", `${normalizedProgress}%`);

  scrollMilestones.forEach((milestone) => {
    if (normalizedProgress >= milestone && !reachedScrollMilestones.has(milestone)) {
      reachedScrollMilestones.add(milestone);
      trackEvent("scroll_depth", { percent: milestone });
    }
  });
};

const onScroll = () => {
  latestScrollY = window.scrollY;
  if (isScrollTicking) {
    return;
  }
  isScrollTicking = true;
  window.requestAnimationFrame(() => {
    updateScrollProgress();
    isScrollTicking = false;
  });
};

recalcScrollableHeight();
updateScrollProgress();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", () => {
  recalcScrollableHeight();
  onScroll();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    finalizeSectionTime("tab_hidden");
    trackEvent("time_on_page", {
      seconds: Math.round((Date.now() - pageViewStartedAt) / 1000),
      reason: "hidden",
    });
  } else if (document.visibilityState === "visible" && activeSectionName) {
    activeSectionStartedAt = Date.now();
  }
});

window.addEventListener("beforeunload", () => {
  finalizeSectionTime("unload");
  trackEvent("time_on_page", {
    seconds: Math.round((Date.now() - pageViewStartedAt) / 1000),
    reason: "unload",
  });
});

setupAutoTranslation();
document.addEventListener("portfolio-content-applied", refreshTranslationAfterDynamicContent);
