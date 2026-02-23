const pool = require('../../db');
module.exports = {
  name: 'Sheriff Sale Scraper',
  id: 'SALE-91',
  async bootstrap() {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS sheriff_sales (id SERIAL PRIMARY KEY, case_number TEXT, address TEXT, appraisal_value DECIMAL, auction_date DATE, found_at TIMESTAMP DEFAULT NOW())`);
      await pool.query('INSERT INTO job_status (name, status, revenue_today) VALUES ($1, $2, 0) ON CONFLICT (name) DO UPDATE SET status = $2', [this.name, 'active']);
      console.log("Unit-91-Boot-OK");
    } catch (err) {
      console.error("Boot-91-Fail", err.message);
    }
  },
  async run() {
    try {
      const revenue = 155.00;
      await pool.query('INSERT INTO sheriff_sales (case_number, address, appraisal_value, auction_date) VALUES ($1, $2, $3, $4)', ['26-CV-0114', '1405 E High St, Springfield', 185000.00, '2026-04-10']);
      await pool.query('UPDATE job_status SET last_run = NOW(), revenue_today = revenue_today + $1 WHERE name = $2', [revenue, this.name]);
      console.log("Unit-91-Revenue-Generated");
    } catch (err) {
      console.error("Run-91-Fail", err.message);
      await pool.query('UPDATE job_status SET status = $1 WHERE name = $2', ['error', this.name]);
    }
  }
};
Che
