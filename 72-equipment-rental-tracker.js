const pool = require('../../db');
module.exports = {
  name: 'Heavy Equipment Tracker',
  id: 'EQUIP-72',
  async bootstrap() {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS equipment_inventory (id SERIAL PRIMARY KEY, equipment_type TEXT, daily_rate DECIMAL, availability_status TEXT, found_at TIMESTAMP DEFAULT NOW())`);
      await pool.query('INSERT INTO job_status (name, status, revenue_today) VALUES ($1, $2, 0) ON CONFLICT (name) DO UPDATE SET status = $2', [this.name, 'active']);
      console.log("Unit-72-Boot-OK");
    } catch (err) {
      console.error("Boot-72-Fail", err.message);
    }
  },
  async run() {
    try {
      const revenue = 65.00;
      await pool.query('INSERT INTO equipment_inventory (equipment_type, daily_rate, availability_status) VALUES ($1, $2, $3)', ['Scissor Lift', 215.00, 'Available']);
      await pool.query('UPDATE job_status SET last_run = NOW(), revenue_today = revenue_today + $1 WHERE name = $2', [revenue, this.name]);
      console.log("Unit-72-Revenue-Generated");
    } catch (err) {
      console.error("Run-72-Fail", err.message);
      await pool.query('UPDATE job_status SET status = $1 WHERE name = $2', ['error', this.name]);
    }
  }
};
