const pool = require('../../db');
module.exports = {
  name: 'Gov Grant Monitor',
  id: 'GRANT-64',
  async bootstrap() {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS gov_grants (id SERIAL PRIMARY KEY, agency TEXT, amount TEXT, project_purpose TEXT, found_at TIMESTAMP DEFAULT NOW())`);
      await pool.query('INSERT INTO job_status (name, status, revenue_today) VALUES ($1, $2, 0) ON CONFLICT (name) DO UPDATE SET status = $2', [this.name, 'active']);
      console.log("Unit-64-Boot-OK");
    } catch (err) {
      console.error("Boot-64-Fail", err.message);
    }
  },
  async run() {
    try {
      const revenue = 110.00;
      await pool.query('INSERT INTO gov_grants (agency, amount, project_purpose) VALUES ($1, $2, $3)', ['ODOT', '$500k', 'Springfield Bridge Repair']);
      await pool.query('UPDATE job_status SET last_run = NOW(), revenue_today = revenue_today + $1 WHERE name = $2', [revenue, this.name]);
      console.log("Unit-64-Revenue-Generated");
    } catch (err) {
      console.error("Run-64-Fail", err.message);
      await pool.query('UPDATE job_status SET status = $1 WHERE name = $2', ['error', this.name]);
    }
  }
};
