(function () {
  "use strict";

  const rates = window.VOICE_AGENT_RATES;
  const form = document.querySelector("#cost-calculator-form");
  const results = document.querySelector("#calculator-results");
  const customRateWrap = document.querySelector("#custom-rate-wrap");
  const monthlyMinutes = document.querySelector("#monthly-minutes");
  const roiPanel = document.querySelector("#roi-panel");

  if (!rates || !form || !results) return;

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });
  const preciseMoney = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  function value(id, fallback) {
    const field = document.querySelector(`#${id}`);
    const parsed = Number(field && field.value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function checked(id) {
    const field = document.querySelector(`#${id}`);
    return Boolean(field && field.checked);
  }

  function telephonyRate(country, direction) {
    if (country === "custom") return Math.max(0, value("custom-telephony-rate", 0));
    const countryRates = rates.telephony[country] || rates.telephony.us;
    if (direction === "both") return (countryRates.inbound + countryRates.outbound) / 2;
    return countryRates[direction];
  }

  function phoneNumberCost(country, phoneNumbers) {
    if (!phoneNumbers) return 0;
    const countryRates = rates.telephony[country] || rates.telephony.us;
    return (country === "custom" ? value("custom-number-cost", 1.15) : countryRates.number) * phoneNumbers;
  }

  function addOns(minutes) {
    const recording = checked("recording");
    const kb = checked("knowledge-base");
    return { recording, kb, minutes };
  }

  function calculateRetell(ctx) {
    const r = rates.retell;
    const voice = r.voices[form.retellVoice.value];
    const llm = r.llms[form.retellLlm.value];
    const telephony = ctx.telephony;
    const kb = ctx.addons.kb ? r.knowledgeBase : 0;
    const perMinute = r.infrastructure + voice + llm + telephony + kb;
    const concurrency = Math.max(0, ctx.concurrency - r.includedConcurrency) * r.extraConcurrencyMonthly;
    const fixed = ctx.phoneNumbers * r.phoneNumber + concurrency + ctx.sms * 0.01;
    return {
      id: "retell",
      name: "Retell AI",
      badge: "Managed & flexible",
      perMinute,
      total: perMinute * ctx.minutes + fixed,
      fixed,
      detail: `Infrastructure ${preciseMoney.format(r.infrastructure)}/min + voice ${preciseMoney.format(voice)}/min + LLM ${preciseMoney.format(llm)}/min`,
      note: "Good balance of managed voice infrastructure and model flexibility."
    };
  }

  function calculateVapi(ctx) {
    const r = rates.vapi;
    const stt = r.stt[form.vapiStt.value];
    const llm = r.llms[form.vapiLlm.value];
    const tts = r.tts[form.vapiTts.value];
    const perMinute = r.platform + stt + llm + tts + ctx.telephony;
    const concurrency = Math.max(0, ctx.concurrency - r.includedConcurrency) * r.extraConcurrencyMonthly;
    const fixed = ctx.numberCost + concurrency + ctx.sms * 0.005;
    return {
      id: "vapi",
      name: "Vapi",
      badge: "Best for developers",
      perMinute,
      total: perMinute * ctx.minutes + fixed,
      fixed,
      detail: `Hosting ${preciseMoney.format(r.platform)}/min + STT ${preciseMoney.format(stt)}/min + LLM ${preciseMoney.format(llm)}/min + TTS ${preciseMoney.format(tts)}/min`,
      note: "Highly configurable; provider costs are passed through separately."
    };
  }

  function calculateBland(ctx) {
    const plans = rates.bland.plans;
    const selected = form.blandPlan.value;
    const candidates = selected === "auto" ? Object.values(plans) : [plans[selected]];
    const plan = candidates.reduce((best, item) => {
      const total = item.monthly + item.perMinute * ctx.minutes;
      return !best || total < best.total ? { ...item, total } : best;
    }, null);
    const perMinute = plan.perMinute + ctx.telephony;
    const fixed = plan.monthly + ctx.numberCost + ctx.sms * 0.01;
    return {
      id: "bland",
      name: "Bland AI",
      badge: "Simple bundled pricing",
      perMinute,
      total: perMinute * ctx.minutes + fixed,
      fixed,
      detail: `${plan.label} plan: ${preciseMoney.format(plan.perMinute)}/min including core LLM, STT and TTS${plan.monthly ? ` + ${money.format(plan.monthly)}/month` : ""}`,
      note: `Selected ${plan.label}, the lowest estimated Bland option for this usage.`
    };
  }

  function chooseElevenPlan(minutes, requestedPlan) {
    const plans = rates.elevenlabs.plans;
    if (requestedPlan !== "auto") return plans.find((plan) => plan.id === requestedPlan) || plans[0];
    const valid = plans.filter((plan) => minutes <= plan.included || plan.overage !== null);
    return valid.reduce((best, plan) => {
      const extra = Math.max(0, minutes - plan.included);
      const total = plan.monthly + extra * (plan.overage || 0);
      return !best || total < best.total ? { ...plan, total } : best;
    }, null);
  }

  function calculateElevenLabs(ctx) {
    const r = rates.elevenlabs;
    const plan = chooseElevenPlan(ctx.minutes, form.elevenPlan.value);
    const extraMinutes = Math.max(0, ctx.minutes - plan.included);
    const overageCost = extraMinutes * (plan.overage || 0);
    const llmCost = r.estimatedLlm * ctx.minutes;
    const variableTelephony = ctx.telephony * ctx.minutes;
    const fixed = plan.monthly + ctx.numberCost + ctx.sms * 0.004;
    const total = fixed + overageCost + llmCost + variableTelephony;
    return {
      id: "elevenlabs",
      name: "ElevenLabs Agents",
      badge: "Premium voice ecosystem",
      perMinute: ctx.minutes ? total / ctx.minutes : 0,
      total,
      fixed,
      detail: `${plan.label} plan: ${money.format(plan.monthly)}/month with ${number.format(plan.included)} included call minutes; estimated LLM and telephony added`,
      note: "Voice quality focused; LLM usage and telephony are separate."
    };
  }

  function calculateTelnyx(ctx) {
    const r = rates.telnyx;
    const llm = r.llms[form.telnyxLlm.value];
    let telco = ctx.telephony;
    if (form.country.value === "us") {
      telco = ctx.direction === "both"
        ? (r.usTelephony.inbound + r.usTelephony.outbound) / 2
        : r.usTelephony[ctx.direction];
    }
    const recording = ctx.addons.recording ? r.recording : 0;
    const perMinute = r.engine + llm + telco + recording;
    const fixed = ctx.phoneNumbers * r.phoneNumber + ctx.sms * 0.004;
    return {
      id: "telnyx",
      name: "Telnyx Voice AI",
      badge: "Integrated telecom stack",
      perMinute,
      total: perMinute * ctx.minutes + fixed,
      fixed,
      detail: `Voice engine ${preciseMoney.format(r.engine)}/min + LLM ${preciseMoney.format(llm)}/min + telephony ${preciseMoney.format(telco)}/min`,
      note: "Competitive integrated orchestration, STT, TTS and carrier pricing."
    };
  }

  function renderCard(item, lowest) {
    const costPerCall = item.total / Math.max(1, value("calls", 1));
    return `
      <article class="result-card ${item.id === lowest.id ? "is-lowest" : ""}">
        <div class="result-heading">
          <div><span class="provider-kicker">${item.badge}</span><h3>${item.name}</h3></div>
          ${item.id === lowest.id ? '<span class="lowest-badge">Lowest estimate</span>' : ""}
        </div>
        <div class="result-price"><strong>${money.format(item.total)}</strong><span>/month</span></div>
        <div class="result-metrics">
          <span><b>${preciseMoney.format(item.perMinute)}</b> / minute</span>
          <span><b>${preciseMoney.format(costPerCall)}</b> / call</span>
          <span><b>${money.format(item.total * 12)}</b> / year</span>
        </div>
        <p>${item.detail}.</p>
        <p class="result-note">${item.note}</p>
      </article>`;
  }

  function updateRoi(lowest) {
    const missedCalls = Math.max(0, value("missed-calls", 0));
    const conversion = Math.min(100, Math.max(0, value("conversion-rate", 0))) / 100;
    const leadValue = Math.max(0, value("lead-value", 0));
    const potential = missedCalls * conversion * leadValue;
    const net = potential - lowest.total;
    roiPanel.innerHTML = `
      <div><span>Potential recovered opportunity</span><strong>${money.format(potential)}/month</strong></div>
      <div><span>Lowest platform estimate</span><strong>${money.format(lowest.total)}/month</strong></div>
      <div><span>Potential net value</span><strong class="${net >= 0 ? "positive" : ""}">${money.format(net)}/month</strong></div>
      <p>Illustrative estimate only. Revenue and conversion are not guaranteed.</p>`;
  }

  function calculate() {
    const calls = Math.max(1, value("calls", 1000));
    const duration = Math.max(0.1, value("duration", 3));
    const minutes = calls * duration;
    const country = form.country.value;
    const direction = form.direction.value;
    const phoneNumbers = Math.max(0, Math.round(value("phone-numbers", 1)));
    const ctx = {
      calls,
      minutes,
      country,
      direction,
      phoneNumbers,
      sms: Math.max(0, Math.round(value("sms-count", 0))),
      concurrency: Math.max(1, Math.round(value("concurrency", 5))),
      telephony: telephonyRate(country, direction),
      numberCost: phoneNumberCost(country, phoneNumbers),
      addons: addOns(minutes)
    };
    monthlyMinutes.textContent = `${number.format(minutes)} estimated voice minutes/month`;

    const estimates = [
      calculateRetell(ctx),
      calculateVapi(ctx),
      calculateBland(ctx),
      calculateElevenLabs(ctx),
      calculateTelnyx(ctx)
    ].sort((a, b) => a.total - b.total);
    const lowest = estimates[0];
    results.innerHTML = estimates.map((item) => renderCard(item, lowest)).join("");
    updateRoi(lowest);
    return { lowest, calls, minutes };
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const calculation = calculate();
    if (calculation && typeof window.trackAnalyticsEvent === "function") {
      window.trackAnalyticsEvent("calculator_result", {
        calculator_name: "ai_voice_agent_cost",
        value: Number(calculation.lowest.total.toFixed(2)),
        currency: "USD",
        lowest_provider: calculation.lowest.name,
        monthly_calls: calculation.calls,
        monthly_minutes: Number(calculation.minutes.toFixed(1))
      });
    }
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  form.addEventListener("input", calculate);
  form.addEventListener("change", function () {
    customRateWrap.hidden = form.country.value !== "custom";
    calculate();
  });

  const updated = document.querySelector("#pricing-updated");
  if (updated) updated.textContent = rates.updated;
  calculate();
})();
