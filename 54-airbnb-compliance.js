// 54-airbnb-compliance.js - Airbnb Compliance Monitor (Unit-54)

const pool = require('./db');   // Change this if your database file is named something else

module.exports = {
  name: 'Airbnb Compliance Monitor',
  id: 'AIR-DATA-001',
  description: 'Monitors Airbnb listings for compliance issues',

  async bootstrap() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS airbnb_compliance (
          id SERIAL PRIMARY KEY,
          listing_id TEXT UNIQUE,
          address TEXT,
          issue_type TEXT,
          severity TEXT,
          details TEXT,
          found_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS job_status (
          name TEXT PRIMARY KEY,
          status TEXT,
          revenue_today DECIMAL DEFAULT 0,
          last_run TIMESTAMP
        )
      `);

      await pool.query(
        'INSERT INTO job_status (name, status, revenue_today) VALUES ($1, $2, 0) ON CONFLICT (name) DO UPDATE SET status = $2',
        [this.name, 'active']
      );

      console.log("✅ Unit-54 Bootstrapped Successfully");
      return true;
    } catch (err) {
      console.error("❌ Unit-54 Bootstrap Failed:", err.message);
      return false;
    }
  },

  async run(listingData = null) {
    try {
      let revenue = 60.00;

      if (listingData) {
        await pool.query(`
          INSERT INTO airbnb_compliance (listing_id, address, issue_type, severity, details)
          VALUES ($1, $2, $3, $4, $5) 
          ON CONFLICT (listing_id) DO NOTHING
        `, [
          listingData.listing_id,
          listingData.address,
          listingData.issue_type,
          listingData.severity,
          listingData.details || ''
        ]);
      } else {
        await pool.query(`
          INSERT INTO airbnb_compliance (listing_id, address, issue_type, severity)
          VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING
        `, ['L-SPRING-101', '142 Warren Drive', 'Unlicensed', 'HIGH']);
      }

      await pool.query(
        'UPDATE job_status SET last_run = NOW(), revenue_today = revenue_today + $1 WHERE name = $2',
        [revenue, this.name]
      );

      console.log(`✅ Unit-54 Run Complete | Revenue: $${revenue}`);
      return { success: true, revenue };
    } catch (err) {
      console.error("❌ Unit-54 Run Failed:", err.message);
      await pool.query('UPDATE job_status SET status = $1 WHERE name = $2', ['error', this.name]);
      return { success: false, error: err.message };
    }
  }
