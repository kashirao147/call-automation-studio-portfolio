(function () {
  "use strict";

  const measurementId = "G-B40B62EH07";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.trackAnalyticsEvent = function (eventName, params) {
    window.gtag("event", eventName, {
      page_title: document.title,
      page_path: window.location.pathname,
      page_location: window.location.href,
      ...(params || {})
    });
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: false
  });
  window.trackAnalyticsEvent("page_view", {
    page_title: document.title,
    page_path: window.location.pathname,
    page_location: window.location.href
  });

  const topic = document.body && document.body.dataset
    ? document.body.dataset.analyticsTopic
    : "";

  if (topic) {
    window.trackAnalyticsEvent("article_view", {
      article_topic: topic
    });

    const reached = new Set();
    const milestones = [25, 50, 75, 90];
    const trackScrollDepth = function () {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (pageHeight <= 0) return;
      const percent = Math.round((window.scrollY / pageHeight) * 100);
      milestones.forEach(function (milestone) {
        if (percent >= milestone && !reached.has(milestone)) {
          reached.add(milestone);
          window.trackAnalyticsEvent("article_scroll_depth", {
            article_topic: topic,
            percent: milestone
          });
        }
      });
    };
    window.addEventListener("scroll", trackScrollDepth, { passive: true });
  }

  document.addEventListener("click", function (event) {
    if (!event.target || typeof event.target.closest !== "function") return;
    const target = event.target.closest("[data-analytics-event]");
    if (!target) return;
    const eventName = String(target.dataset.analyticsEvent || "");
    if (!/^[a-z][a-z0-9_]{1,39}$/.test(eventName)) return;
    window.trackAnalyticsEvent(eventName, {
      event_label: String(target.dataset.analyticsLabel || "").slice(0, 100),
      link_url: target.href || ""
    });
  });
})();
