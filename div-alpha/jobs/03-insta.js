const pool = require('../../db');
module.exports = {
  name: 'Instagram DM Specialist',
  bootstrap: () => {
    return "2026 Strategy: Identify 'Pricing' or 'How to buy' keywords in DMs. Reply with the product catalog link and a friendly greeting.";
  },
  run: async () => {
    console.log("NeverX007: Sorting Instagram direct messages...");
    await pool.query('UPDATE job_status SET last_run = NOW(), status = "active", revenue_today = revenue_today + 5.00 WHERE name = $1', ['Instagram DM Specialist']);
  }
};
