const { calcFeeRate } = require('./services/feeCalculator');
const { calcTax, calcProjection, calculateAllProjections } = require('./services/projectionCalculator');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`[PASS] ${message}`);
  } else {
    failed++;
    console.error(`[FAIL] ${message}`);
  }
}

console.log('--- RUNNING EFCG BUSINESS LOGIC TESTS ---');

// Test 1: Fee Calculator Tiers
console.log('\nTesting Fee Calculator...');
assert(calcFeeRate(3000) === 0.035, 'Fee rate for 3,000 AED should be 3.5% (0.035)');
assert(calcFeeRate(5000) === 0.035, 'Fee rate for 5,000 AED should be 3.5% (0.035)');
assert(calcFeeRate(10000) === 0.027, 'Fee rate for 10,000 AED should be 2.7% (0.027)');
assert(calcFeeRate(15000) === 0.027, 'Fee rate for 15,000 AED should be 2.7% (0.027)');
assert(calcFeeRate(20000) === 0.020, 'Fee rate for 20,000 AED should be 2.0% (0.020)');
assert(calcFeeRate(25000) === 0.020, 'Fee rate for 25,000 AED should be 2.0% (0.020)');
assert(calcFeeRate(30000) === 0.015, 'Fee rate for 30,000 AED should be 1.5% (0.015)');

// Test 2: Tax Calculator
console.log('\nTesting Tax Calculator...');
// Plan 1 Tax (always 0)
assert(calcTax(500000, 1) === 0, 'Plan 1 tax on 500,000 AED profit should be 0');

// Plan 2 Tax (10% on profit > 120,000)
assert(calcTax(100000, 2) === 0, 'Plan 2 tax on 100,000 AED profit should be 0');
assert(calcTax(200000, 2) === 8000, 'Plan 2 tax on 200,000 AED profit should be 8,000'); // (200000 - 120000) * 0.1

// Plan 3 Tax (10% on profit 120,000–400,000, 20% on profit > 400,000)
assert(calcTax(100000, 3) === 0, 'Plan 3 tax on 100,000 AED profit should be 0');
assert(calcTax(200000, 3) === 8000, 'Plan 3 tax on 200,000 AED profit should be 8,000'); // (200000 - 120000) * 0.1
assert(calcTax(500000, 3) === 48000, 'Plan 3 tax on 500,000 AED profit should be 48,000'); // (280000 * 0.1) + (100000 * 0.2)

// Test 3: Compound Projection Calculator
console.log('\nTesting Projections Compounding...');
try {
  // Let's run a projection for Plan 1 (minRate: 1.2%, maxRate: 2.4%, monthlyFeeRate: 0.1%)
  // Lump sum 10,000, Monthly 1,000, 1 year, rateType 'max'
  const result = calcProjection(10000, 1000, 1, 1, 'max');
  assert(result.invested === 22000, `Invested amount should be lump + monthly * 12 = 22,000 (Got: ${result.invested})`);
  assert(result.value > 0, `Compound value should be calculated and greater than 0 (Got: ${result.value})`);
  assert(result.fees > 0, `Accumulated monthly fees should be greater than 0 (Got: ${result.fees})`);
  
  const allProjections = calculateAllProjections(10000, 1000, 1);
  assert(allProjections.length === 3, 'calculateAllProjections should return projections for 3 interval points (1, 5, 10 yrs)');
  assert(allProjections[0].years === 1, 'First projection should be for 1 year');
  assert(allProjections[1].years === 5, 'Second projection should be for 5 years');
  assert(allProjections[2].years === 10, 'Third projection should be for 10 years');
} catch (err) {
  console.error('Projection tests failed with error:', err);
  failed++;
}

console.log('\n----------------------------------------');
console.log(`TEST RUN SUMMARY: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
