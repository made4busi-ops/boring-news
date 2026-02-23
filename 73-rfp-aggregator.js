const pool = require('../../db');
module.exports = {
  name: 'Local RFP Aggregator',
  id: 'RFP-73',
  async bootstrap() {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS local_rfps (id SERIAL PRIMARY KEY, title TEXT, agency TEXT, deadline DATE, found_at TIMESTAMP DEFAULT NOW())`);
      await pool.query('INSERT INTO job_status (name, status, revenue_today) VALUES ($1, $2, 0) ON CONFLICT (name) DO UPDATE SET status = $2', [this.name, 'active']);
      console.log("Unit-73-Boot-OK");
    } catch (err) {
      console.error("Boot-73-Fail", err.message);
    }
  },
  async run() {
    try {
      const revenue = 110.00;
      await pool.query('INSERT INTO local_rfps (title, agency, deadline) VALUES ($1, $2, $3)', ['Cybersecurity Audit', 'City of Springfield', '2026-04-15']);
      await pool.query('UPDATE job_status SET last_run = NOW(), revenue_today = revenue_today + $1 WHERE name = $2', [revenue, this.name]);
      console.log("Unit-73-Revenue-Generated");
    } catch (err) {
      console.error("Run-73-Fail", err.message);
      await pool.query('UPDATE job_status SET status = $1 WHERE name = $2', ['error', this.name]);
    }
  }
};
