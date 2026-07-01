/**
 * Calculate fee rate based on transaction amount
 * @param {number} amount - The source currency amount
 * @returns {number} The fee rate percentage (decimal representation, e.g. 0.035 for 3.5%)
 */
function calcFeeRate(amount) {
  if (amount <= 5000) return 0.035;
  if (amount <= 15000) return 0.027;
  if (amount <= 25000) return 0.020;
  return 0.015;
}

module.exports = {
  calcFeeRate
};
