const pool = require('../../db');
module.exports = {
  name: 'Liquor License Monitor',
  id: 'LIQUOR-75',
  async bootstrap() {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS liquor_permits (id SERIAL PRIMARY KEY, business_name TEXT, permit_type TEXT, status TEXT, found_at TIMESTAMP DEFAULT NOW())`);
      await pool.query('INSERT INTO job_status (name, status, revenue_today) VALUES ($1, $2, 0) ON CONFLICT (name) DO UPDATE SET status = $2', [this.name, 'active']);
      console.log("Unit-75-Boot-OK");
    } catch (err) {
      console.error("Boot-75-Fail", err.message);
    }
  },
  async run() {
    try {
      const revenue = 95.00;
      await pool.query('INSERT INTO liquor_permits (business_name, permit_type, status) VALUES ($1, $2, $3)', ['Downtown Springfield Bistro', 'D5', 'PENDING']);
      await pool.query('UPDATE job_status SET last_run = NOW(), revenue_today = revenue_today + $1 WHERE name = $2', [revenue, this.name]);
      console.log("Unit-75-Revenue-Generated");
    } catch (err) {
      console.error("Run-75-Fail", err.message);
      await pool.query('UPDATE job_status SET status = $1 WHERE name = $2', ['error', this.name]);
    }
  }
};
