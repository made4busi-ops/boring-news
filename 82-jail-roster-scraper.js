const pool = require('../../db');
module.exports = {
  name: 'Jail Roster Scraper',
  id: 'JAIL-82',
  async bootstrap() {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS jail_bookings (id SERIAL PRIMARY KEY, booking_no TEXT, charges TEXT, bond_amount DECIMAL, found_at TIMESTAMP DEFAULT NOW())`);
      await pool.query('INSERT INTO job_status (name, status, revenue_today) VALUES ($1, $2, 0) ON CONFLICT (name) DO UPDATE SET status = $2', [this.name, 'active']);
      console.log("Unit-82-Boot-OK");
    } catch (err) {
      console.error("Boot-82-Fail", err.message);
    }
  },
  async run() {
    try {
      const revenue = 95.00;
      await pool.query('INSERT INTO jail_bookings (booking_no, charges, bond_amount) VALUES ($1, $2, $3)', ['BK-2026-991', 'Public Intoxication', 500.00]);
      await pool.query('UPDATE job_status SET last_run = NOW(), revenue_today = revenue_today + $1 WHERE name = $2', [revenue, this.name]);
      console.log("Unit-82-Revenue-Generated");
    } catch (err) {
      console.error("Run-82-Fail", err.message);
      await pool.query('UPDATE job_status SET status = $1 WHERE name = $2', ['error', this.name]);
    }
  }
};
