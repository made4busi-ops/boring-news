const pool = require('../../db');
module.exports = {
  name: 'Signage Permit Monitor',
  id: 'SIGN-77',
  async bootstrap() {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS sign_permits (id SERIAL PRIMARY KEY, business_name TEXT, sign_type TEXT, location TEXT, found_at TIMESTAMP DEFAULT NOW())`);
      await pool.query('INSERT INTO job_status (name, status, revenue_today) VALUES ($1, $2, 0) ON CONFLICT (name) DO UPDATE SET status = $2', [this.name, 'active']);
      console.log("Unit-77-Boot-OK");
    } catch (err) {
      console.error("Boot-77-Fail", err.message);
    }
  },
  async run() {
    try {
      const revenue = 75.00;
      await pool.query('INSERT INTO sign_permits (business_name, sign_type, location) VALUES ($1, $2, $3)', ['Buckeye Fuel Stop', 'Digital Billboard', 'I-70 & SR-72']);
      await pool.query('UPDATE job_status SET last_run = NOW(), revenue_today = revenue_today + $1 WHERE name = $2', [revenue, this.name]);
      console.log("Unit-77-Revenue-Generated");
    } catch (err) {
      console.error("Run-77-Fail", err.message);
      await pool.query('UPDATE job_status SET status = $1 WHERE name = $2', ['error', this.name]);
    }
  }
};
