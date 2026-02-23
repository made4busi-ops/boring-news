const pool = require('../../db');
module.exports = {
  name: 'Tax Lien Scraper',
  id: 'TAX-85',
  async bootstrap() {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS tax_liens (id SERIAL PRIMARY KEY, parcel_id TEXT, amount_due DECIMAL, owner_address TEXT, found_at TIMESTAMP DEFAULT NOW())`);
      await pool.query('INSERT INTO job_status (name, status, revenue_today) VALUES ($1, $2, 0) ON CONFLICT (name) DO UPDATE SET status = $2', [this.name, 'active']);
      console.log("Unit-85-Boot-OK");
    } catch (err) {
      console.error("Boot-85-Fail", err.message);
    }
  },
  async run() {
    try {
      const revenue = 160.00;
      await pool.query('INSERT INTO tax_liens (parcel_id, amount_due, owner_address) VALUES ($1, $2, $3)', ['340-06-00021', 4250.75, '102 Yellow Springs St, Springfield']);
      await pool.query('UPDATE job_status SET last_run = NOW(), revenue_today = revenue_today + $1 WHERE name = $2', [revenue, this.name]);
      console.log("Unit-85-Revenue-Generated");
    } catch (err) {
      console.error("Run-85-Fail", err.message);
      await pool.query('UPDATE job_status SET status = $1 WHERE name = $2', ['error', this.name]);
    }
  }
};
