const ExchangeRateCache = require('../models/ExchangeRateCache');
const SystemErrorLog = require('../models/SystemErrorLog');

const FALLBACK_RATES = {
  AED: 1.0,
  USD: 0.2722,
  EUR: 0.2521,
  GBP: 0.2135,
  BRL: 1.5120,
  JPY: 43.6800
};

// Helper for delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch from Frankfurter API with 3 retries and 1s delay
 */
async function fetchLiveRates() {
  const url = `https://api.frankfurter.dev/v2/rates?base=AED&quotes=USD,EUR,GBP,JPY,BRL`;
  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API returned HTTP status ${response.status}`);
      }
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error(`API returned unsuccessful result: expected array`);
      }
      
      const filteredRates = { AED: 1.0 };
      
      data.forEach(item => {
        if (item.quote && item.rate) {
          filteredRates[item.quote] = item.rate;
        }
      });
      
      // Ensure all targets are present
      ['GBP', 'USD', 'EUR', 'BRL', 'JPY'].forEach(cur => {
        if (filteredRates[cur] === undefined) {
          filteredRates[cur] = FALLBACK_RATES[cur];
        }
      });

      return filteredRates;
    } catch (err) {
      lastError = err;
      if (attempt < 3) {
        await delay(1000);
      }
    }
  }

  throw lastError || new Error('Failed to fetch exchange rates after 3 attempts');
}

/**
 * Get rates, either from MongoDB cache or from external API with failover
 */
async function getExchangeRates(userId = null) {
  try {
    const now = new Date();
    
    // 1. Try to find a valid cache entry (under 5 minutes old)
    const cached = await ExchangeRateCache.findOne({ baseCurrency: 'AED' }).sort({ fetchedAt: -1 });
    
    if (cached && cached.expiresAt > now) {
      return {
        rates: cached.rates,
        source: 'cache',
        fetchedAt: cached.fetchedAt
      };
    }

    // 2. Fetch live rates
    try {
      const liveRates = await fetchLiveRates();
      
      // Save or update cache
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      
      let cacheEntry = await ExchangeRateCache.findOne({ baseCurrency: 'AED' });
      if (cacheEntry) {
        cacheEntry.rates = liveRates;
        cacheEntry.fetchedAt = now;
        cacheEntry.expiresAt = expiresAt;
        await cacheEntry.save();
      } else {
        cacheEntry = new ExchangeRateCache({
          baseCurrency: 'AED',
          rates: liveRates,
          fetchedAt: now,
          expiresAt: expiresAt
        });
        await cacheEntry.save();
      }

      return {
        rates: liveRates,
        source: 'live',
        fetchedAt: now
      };
    } catch (apiError) {
      // 3. Log to SystemErrorLog
      const errorLog = new SystemErrorLog({
        errorMessage: `ExchangeRate-API failure: ${apiError.message}`,
        stackTrace: apiError.stack,
        userId: userId,
        sessionData: { action: 'fetchExchangeRates' },
        logDestination: 'DATABASE'
      });
      await errorLog.save();

      // 4. Return last cached rates if available
      if (cached) {
        return {
          rates: cached.rates,
          source: 'cache-expired',
          fetchedAt: cached.fetchedAt,
          warning: 'Live exchange rates unavailable. Displaying cached data.'
        };
      }

      // 5. Hard fallback
      return {
        rates: FALLBACK_RATES,
        source: 'fallback',
        fetchedAt: now,
        warning: 'Live and cached rates unavailable. Displaying default fallback rates.'
      };
    }
  } catch (dbError) {
    // If the cache lookup itself crashes (e.g. DB down)
    return {
      rates: FALLBACK_RATES,
      source: 'fallback',
      fetchedAt: new Date(),
      warning: 'Database error. Displaying default fallback rates.'
    };
  }
}

module.exports = {
  getExchangeRates,
  FALLBACK_RATES
};
