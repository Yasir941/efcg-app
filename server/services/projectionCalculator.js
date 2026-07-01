// ─────────────────────────────────────────────────────────────────────────────
// EFCG Investment Plan Definitions  (Appendix 1 – official specification)
// ─────────────────────────────────────────────────────────────────────────────
const PLANS = {
  1: {
    name: 'Basic Savings Plan',
    minRate: 1.2,          // 1.2% per year
    maxRate: 2.4,          // 2.4% per year
    monthlyFeeRate: 0.25,  // 0.25% per month EFCG group fee
    minMonthly: 500,       // Minimum monthly investment (AED)
    minLumpSum: 0,         // No minimum lump sum
    maxPerYear: 200000     // Maximum investment per year (AED)
  },
  2: {
    name: 'Savings Plan Plus',
    minRate: 3.0,          // 3% per year
    maxRate: 5.5,          // 5.5% per year
    monthlyFeeRate: 0.3,   // 0.3% per month EFCG group fee
    minMonthly: 500,       // Minimum monthly investment (AED)
    minLumpSum: 3000,      // Minimum initial lump sum (AED)
    maxPerYear: 300000     // Maximum investment per year (AED)
  },
  3: {
    name: 'Managed Stock Investments',
    minRate: 4.0,          // 4% per year
    maxRate: 23.0,         // 23% per year
    monthlyFeeRate: 1.3,   // 1.3% per month EFCG group fee
    minMonthly: 1500,      // Minimum monthly investment (AED)
    minLumpSum: 10000,     // Minimum initial lump sum (AED)
    maxPerYear: Infinity   // No maximum (Unlimited)
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Tax Calculation  (Appendix 1)
//   Plan 1: 0% tax always
//   Plan 2: 10% on profit exceeding 120,000 AED
//   Plan 3: 10% on profit 120,000–400,000 AED; 20% on profit above 400,000 AED
// ─────────────────────────────────────────────────────────────────────────────
function calcTax(profit, planType) {
  if (profit <= 0) return 0;

  if (planType === 1) return 0;

  if (planType === 2) {
    return profit > 120000 ? (profit - 120000) * 0.10 : 0;
  }

  if (planType === 3) {
    if (profit > 400000) {
      // 10% on band 120,000–400,000 (280,000 AED) + 20% on excess above 400,000
      return (280000 * 0.10) + ((profit - 400000) * 0.20);
    }
    if (profit > 120000) {
      return (profit - 120000) * 0.10;
    }
    return 0;
  }

  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core compound-growth projection
//
// Algorithm (per month):
//   balance = balance × (1 + monthlyRate) + monthlyContribution
//   fee     = balance × (monthlyFeeRate / 100)
//   balance = balance − fee
//   totalFees += fee
//
// After all months:
//   profit = balance − totalInvested
//   tax    = calcTax(profit, planType)
// ─────────────────────────────────────────────────────────────────────────────
function calcProjection(lumpSum, monthly, planType, years, rateType) {
  const plan = PLANS[planType];
  if (!plan) throw new Error(`Invalid plan type: ${planType}`);

  const annualRate  = (rateType === 'min' ? plan.minRate : plan.maxRate) / 100;
  const monthlyRate = annualRate / 12;
  const feeMonthly  = plan.monthlyFeeRate / 100;

  let balance      = lumpSum;
  let totalFees    = 0;
  const totalMonths   = years * 12;
  const totalInvested = lumpSum + monthly * totalMonths;

  for (let m = 1; m <= totalMonths; m++) {
    balance = balance * (1 + monthlyRate) + monthly;
    const fee = balance * feeMonthly;
    balance  -= fee;
    totalFees += fee;
  }

  const profit = balance - totalInvested;
  const tax    = calcTax(Math.max(0, profit), planType);

  return {
    value:    Math.max(0, balance),
    profit:   Math.max(0, profit),
    fees:     totalFees,
    tax:      tax,
    invested: totalInvested
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Build projection array for 1, 5, and 10 years
// ─────────────────────────────────────────────────────────────────────────────
function calculateAllProjections(lumpSum, monthly, planType) {
  return [1, 5, 10].map(years => ({
    years,
    min: calcProjection(lumpSum, monthly, planType, years, 'min'),
    max: calcProjection(lumpSum, monthly, planType, years, 'max')
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Validate inputs against plan rules  (Appendix 1)
// Returns null if valid, or an error string if invalid.
// ─────────────────────────────────────────────────────────────────────────────
function validatePlanInputs(lumpSum, monthly, planType) {
  const plan = PLANS[planType];
  if (!plan) return `Invalid plan type: ${planType}`;

  if (monthly < plan.minMonthly) {
    return `Plan ${planType} (${plan.name}) requires a minimum monthly contribution of ${plan.minMonthly.toLocaleString()} AED. You entered ${monthly.toLocaleString()} AED.`;
  }

  if (plan.minLumpSum > 0 && lumpSum < plan.minLumpSum) {
    return `Plan ${planType} (${plan.name}) requires a minimum initial lump sum of ${plan.minLumpSum.toLocaleString()} AED. You entered ${lumpSum.toLocaleString()} AED.`;
  }

  if (plan.maxPerYear !== Infinity) {
    const annualTotal = lumpSum + monthly * 12;
    if (annualTotal > plan.maxPerYear) {
      return `Plan ${planType} (${plan.name}) has a maximum annual investment of ${plan.maxPerYear.toLocaleString()} AED. Your first-year total (lump sum + 12 × monthly) is ${annualTotal.toLocaleString()} AED.`;
    }
  }

  return null; // valid
}

module.exports = {
  PLANS,
  calcTax,
  calcProjection,
  calculateAllProjections,
  validatePlanInputs
};
