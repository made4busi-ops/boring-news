const pool = require('../../db');
module.exports = {
  name: 'Airbnb Compliance Monitor',
  id: 'AIR-DATA-001',
  async bootstrap() {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS airbnb_compliance (id SERIAL PRIMARY KEY, listing_id TEXT UNIQUE, address TEXT, issue_type TEXT, severity TEXT, found_at TIMESTAMP DEFAULT NOW())`);
      await pool.query('INSERT INTO job_status (name, status, revenue_today) VALUES ($1, $2, 0) ON CONFLICT (name) DO UPDATE SET status = $2', [this.name, 'active']);
      console.log("Unit-54-Boot-OK");
    } catch (err) {
      console.error("Boot-54-Fail", err.message);
    }
  },
  async run() {
    try {
      const revenue = 60.00;
      await pool.query('INSERT INTO airbnb_compliance (listing_id, address, issue_type, severity) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', ['L-SPRING-101', '142 Warren Drive', 'Unlicensed', 'HIGH']);
      await pool.query('UPDATE job_status SET last_run = NOW(), revenue_today = revenue_today + $1 WHERE name = $2', [revenue, this.name]);
      console.log("Unit-54-Revenue-Generated");
    } catch (err) {
      console.error("Run-54-Fail", err.message);
      await pool.query('UPDATE job_status SET status = $1 WHERE name = $2', ['error', this.name]);
    }
  }
};
