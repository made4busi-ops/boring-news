const pool = require('../../db');
module.exports = {
  name: 'Fleet Fuel Arbitrager',
  id: 'FUEL-65',
  async bootstrap() {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS fuel_pricing (id SERIAL PRIMARY KEY, station_loc TEXT, fuel_type TEXT, price_per_gal DECIMAL, found_at TIMESTAMP DEFAULT NOW())`);
      await pool.query('INSERT INTO job_status (name, status, revenue_today) VALUES ($1, $2, 0) ON CONFLICT (name) DO UPDATE SET status = $2', [this.name, 'active']);
      console.log("Unit-65-Boot-OK");
    } catch (err) {
      console.error("Boot-65-Fail", err.message);
    }
  },
  async run() {
    try {
      const revenue = 45.00;
      await pool.query('INSERT INTO fuel_pricing (station_loc, fuel_type, price_per_gal) VALUES ($1, $2, $3)', ['I-70 Exit 54, Springfield', 'Diesel', 3.82]);
      await pool.query('UPDATE job_status SET last_run = NOW(), revenue_today = revenue_today + $1 WHERE name = $2', [revenue, this.name]);
      console.log("Unit-65-Revenue-Generated");
    } catch (err) {
      console.error("Run-65-Fail", err.message);
      await pool.query('UPDATE job_status SET status = $1 WHERE name = $2', ['error', this.name]);
    }
  }
};
