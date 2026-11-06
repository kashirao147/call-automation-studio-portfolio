/*
 * Editable planning rates for the AI Voice Agent Cost Calculator.
 * Currency: USD. Per-minute rates unless another unit is stated.
 * Last verified against official public pricing pages: 2026-08-21.
 */
window.VOICE_AGENT_RATES = {
  updated: "2026-08-21",
  telephony: {
    us: { label: "United States", inbound: 0.0085, outbound: 0.014, number: 1.15 },
    ca: { label: "Canada", inbound: 0.0085, outbound: 0.014, number: 1.15 },
    uk: { label: "United Kingdom", inbound: 0.012, outbound: 0.022, number: 2.0 },
    au: { label: "Australia", inbound: 0.012, outbound: 0.04, number: 3.0 },
    pk: { label: "Pakistan", inbound: 0.02, outbound: 0.15, number: 5.0 }
  },
  retell: {
    infrastructure: 0.055,
    voices: { standard: 0.015, elevenlabs: 0.04 },
    llms: { nano: 0.003, mini: 0.012, balanced: 0.045 },
    knowledgeBase: 0.005,
    recording: 0,
    phoneNumber: 2,
    includedConcurrency: 20,
    extraConcurrencyMonthly: 8
  },
  vapi: {
    platform: 0.05,
    stt: { economy: 0.006, standard: 0.01, premium: 0.015 },
    llms: { economy: 0.008, standard: 0.02, premium: 0.045 },
    tts: { economy: 0.015, standard: 0.03, premium: 0.04 },
    includedConcurrency: 10,
    extraConcurrencyMonthly: 10
  },
  bland: {
    plans: {
      start: { label: "Start", perMinute: 0.14, monthly: 0, concurrency: 10 },
      build: { label: "Build", perMinute: 0.12, monthly: 299, concurrency: 50 },
      scale: { label: "Scale", perMinute: 0.11, monthly: 499, concurrency: 100 }
    }
  },
  elevenlabs: {
    plans: [
      { id: "free", label: "Free", monthly: 0, included: 15, concurrency: 4, overage: null },
      { id: "starter", label: "Starter", monthly: 6, included: 75, concurrency: 6, overage: null },
      { id: "creator", label: "Creator", monthly: 22, included: 275, concurrency: 10, overage: 0.08 },
      { id: "pro", label: "Pro", monthly: 99, included: 1238, concurrency: 20, overage: 0.08 },
      { id: "scale", label: "Scale", monthly: 299, included: 3738, concurrency: 30, overage: 0.08 },
      { id: "business", label: "Business", monthly: 990, included: 12375, concurrency: 40, overage: 0.08 }
    ],
    estimatedLlm: 0.015
  },
  telnyx: {
    engine: 0.05,
    llms: { economy: 0.004, standard: 0.012, premium: 0.03 },
    recording: 0.002,
    phoneNumber: 1,
    usTelephony: { inbound: 0.0032, outbound: 0.005 }
  }
};
