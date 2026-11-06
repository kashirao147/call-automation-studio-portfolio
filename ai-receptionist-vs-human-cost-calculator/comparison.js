(function () {
  "use strict";

  const form = document.querySelector("#comparison-form");
  if (!form) return;

  const money0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const money2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  function num(id, fallback) {
    const parsed = Number(document.querySelector(`#${id}`).value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function text(id, value) {
    const element = document.querySelector(`#${id}`);
    if (element) element.textContent = value;
  }

  function calculate() {
    const salary = Math.max(0, num("human-salary", 3200));
    const overhead = Math.max(0, num("human-overhead", 0)) / 100;
    const hoursDay = Math.max(.5, num("working-hours", 8));
    const daysMonth = Math.max(1, num("working-days", 20));
    const callsDay = Math.max(0, num("calls-day", 50));
    const duration = Math.max(.1, num("call-duration", 3));
    const aiRate = Math.max(0, num("ai-rate", .14));
    const aiFixed = Math.max(0, num("ai-fixed", 0));

    const humanMonthly = salary * (1 + overhead);
    const humanHours = hoursDay * daysMonth;
    const monthlyCalls = callsDay * daysMonth;
    const monthlyMinutes = monthlyCalls * duration;
    const aiMonthly = monthlyMinutes * aiRate + aiFixed;
    const monthlySaving = humanMonthly - aiMonthly;
    const savingPercent = humanMonthly ? (monthlySaving / humanMonthly) * 100 : 0;
    const humanPerCall = monthlyCalls ? humanMonthly / monthlyCalls : 0;
    const aiPerCall = monthlyCalls ? aiMonthly / monthlyCalls : 0;
    const humanHourly = humanHours ? humanMonthly / humanHours : 0;

    text("human-monthly", money0.format(humanMonthly));
    text("human-annual", `${money0.format(humanMonthly * 12)} per year`);
    text("ai-monthly", money0.format(aiMonthly));
    text("ai-annual", `${money0.format(aiMonthly * 12)} per year`);
    text("monthly-saving", money0.format(monthlySaving));
    text("annual-saving", `${money0.format(monthlySaving * 12)} potential annual saving`);
    text("saving-percent", `${Math.round(savingPercent)}%`);
    text("monthly-calls", number.format(monthlyCalls));
    text("monthly-minutes", number.format(monthlyMinutes));
    text("human-hourly", money2.format(humanHourly));
    text("human-call-cost", money2.format(humanPerCall));
    text("ai-call-cost", money2.format(aiPerCall));
    text("coverage-hours", number.format(humanHours));

    const missed = Math.max(0, num("missed-calls", 5));
    const closeRate = Math.min(100, Math.max(0, num("close-rate", 20))) / 100;
    const customerValue = Math.max(0, num("customer-value", 200));
    const missedMonthly = missed * daysMonth;
    const opportunity = missedMonthly * closeRate * customerValue;
    const totalPotential = monthlySaving + opportunity;
    text("missed-monthly", number.format(missedMonthly));
    text("opportunity-value", `${money0.format(opportunity)}/month`);
    text("total-potential", `${money0.format(totalPotential)}/month`);

    const verdict = document.querySelector("#decision-text");
    if (verdict) {
      if (monthlySaving > 0 && callsDay >= 20) {
        verdict.textContent = `At ${number.format(monthlyCalls)} calls per month, the AI estimate is ${money0.format(monthlySaving)} lower per month. A hybrid setup is usually the safest starting point: AI handles routine, overflow and after-hours calls while a person keeps complex and in-person work.`;
      } else if (monthlySaving > 0) {
        verdict.textContent = `The AI estimate is lower, but your call volume is modest. Compare the saving with setup effort and keep a human path for complex calls.`;
      } else {
        verdict.textContent = "At these inputs, AI is not cheaper on direct monthly cost. Review the per-minute rate, call volume and whether after-hours coverage or missed-call recovery creates enough additional value.";
      }
    }
    return { humanMonthly, aiMonthly, monthlySaving, monthlyCalls, monthlyMinutes };
  }

  form.addEventListener("input", calculate);
  form.addEventListener("change", calculate);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const calculation = calculate();
    if (calculation && typeof window.trackAnalyticsEvent === "function") {
      window.trackAnalyticsEvent("calculator_result", {
        calculator_name: "ai_vs_human_receptionist",
        value: Number(calculation.monthlySaving.toFixed(2)),
        currency: "USD",
        human_monthly_cost: Number(calculation.humanMonthly.toFixed(2)),
        ai_monthly_cost: Number(calculation.aiMonthly.toFixed(2)),
        monthly_calls: calculation.monthlyCalls,
        monthly_minutes: Number(calculation.monthlyMinutes.toFixed(1))
      });
    }
    document.querySelector("#comparison-results").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  calculate();
})();
