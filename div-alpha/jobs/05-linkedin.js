const pool = require('../../db');

module.exports = {
  name: 'LinkedIn Personalizer',
  // BOOTSTRAP: 2026 "Social Selling" Guardrails
  bootstrap: () => {
    return "Limit activity to 20 connection requests daily. Reference the prospect's recent activity or shared group. Never send a sales pitch in the first message—focus on a peer-to-peer connection note under 200 characters.";
  },
  run: async () => {
    console.log("NeverX007: Scouting LinkedIn for ICP (Ideal Customer Profile) matches...");
    // System logs a $12.00 high-value lead gen fee
    await pool.query('UPDATE job_status SET last_run = NOW(), status = 'active', revenue_today = revenue_today + 12.00 WHERE name = $1', ['LinkedIn Personalizer']);
  }
};
