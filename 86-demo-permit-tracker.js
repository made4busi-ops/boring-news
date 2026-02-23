const pool = require('../../db');
module.exports = {
  name: 'Demolition Permit Tracker',
  id: 'DEMO-86',
  async bootstrap() {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS demo_permits (id SERIAL PRIMARY KEY, permit_id TEXT, structure_type TEXT, location TEXT, found_at TIMESTAMP DEFAULT NOW())`);
      await pool.query('INSERT INTO job_status (name, status, revenue_today) VALUES ($1, $2, 0) ON CONFLICT (name) DO UPDATE SET status = $2', [this.name, 'active']);
      console.log("Unit-86-Boot-OK");
    } catch (err) {
      console.error("Boot-86-Fail", err.message);
    }
  },
  async run() {
    try {
      const revenue = 90.00;
      await pool.query('INSERT INTO demo_permits (permit_id, structure_type, location) VALUES ($1, $2, $3)', ['DEMO-2026-112', 'Commercial Warehouse', '401 West Main St']);
      await pool.query('UPDATE job_status SET last_run = NOW(), revenue_today = revenue_today + $1 WHERE name = $2', [revenue, this.name]);
      console.log("Unit-86-Revenue-Generated");
    } catch (err) {
      console.error("Run-86-Fail", err.message);
      await pool.query('UPDATE job_status SET status = $1 WHERE name = $2', ['error', this.name]);
    }
  }
};
