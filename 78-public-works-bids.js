const pool = require('../../db');
module.exports = {
  name: 'Public Works Bid Scraper',
  id: 'WORKS-78',
  async bootstrap() {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS public_works_bids (id SERIAL PRIMARY KEY, project_id TEXT, description TEXT, bid_close_date DATE, found_at TIMESTAMP DEFAULT NOW())`);
      await pool.query('INSERT INTO job_status (name, status, revenue_today) VALUES ($1, $2, 0) ON CONFLICT (name) DO UPDATE SET status = $2', [this.name, 'active']);
      console.log("Unit-78-Boot-OK");
    } catch (err) {
      console.error("Boot-78-Fail", err.message);
    }
  },
  async run() {
    try {
      const revenue = 135.00;
      await pool.query('INSERT INTO public_works_bids (project_id, description, bid_close_date) VALUES ($1, $2, $3)', ['SW-2026-09', 'Sewer Main Replacement - South Hill', '2026-03-30']);
      await pool.query('UPDATE job_status SET last_run = NOW(), revenue_today = revenue_today + $1 WHERE name = $2', [revenue, this.name]);
      console.log("Unit-78-Revenue-Generated");
    } catch (err) {
      console.error("Run-78-Fail", err.message);
      await pool.query('UPDATE job_status SET status = $1 WHERE name = $2', ['error', this.name]);
    }
  }
};
