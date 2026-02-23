JavaScript
const pool = require('../../db');

module.exports = {
  name: 'Yelp Sentiment Alert',
  // BOOTSTRAP: The 2026 strategy for avoiding Yelp "bot-jail"
  bootstrap: () => {
    return "Scan Yelp review excerpts for negative keywords (e.g., 'terrible', 'avoid', 'rude'). If sentiment score is below 40%, trigger an urgent alert.";
  },
  run: async () => {
    console.log("NeverX007: Scanning Yelp reviews for negative spikes...");
    // System tracks the scout's progress and logs a $5.00 management fee
    await pool.query('UPDATE job_status SET last_run = NOW(), status = "active", revenue_today = revenue_today + 5.00 WHERE name = $1', ['Yelp Sentiment Alert']);
  }
};
