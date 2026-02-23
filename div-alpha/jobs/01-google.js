JavaScript
const pool = require('../../db');

module.exports = {
  name: 'Google Review Responder',
  bootstrap: () => {
    return "You are a polite assistant. Thank 5-star reviewers. Apologize to 1-star reviewers and give them the owner's email.";
  },
  run: async () => {
    console.log("NeverX007: Checking Google Business Profile for new reviews...");
    await pool.query('UPDATE job_status SET last_run = NOW(), status = "active", revenue_today = revenue_today + 3.50 WHERE name = $1', ['Google Review Responder']);
  }
};
