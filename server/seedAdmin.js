// seedAdmin.js
import pool from './db.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const SALT_ROUNDS = 10;

async function seed() {
  try {
    const email = 'admin@store.com';
    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length) {
      console.log('Admin already exists');
      process.exit(0);
    }
    const password = 'Admin@123'; 
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const res = await pool.query('INSERT INTO users (name,email,password,address,role) VALUES ($1,$2,$3,$4,$5) RETURNING id', [
      'System Administrator Default Name',
      email,
      hashed,
      'HQ Address',
      'admin'
    ]);
    console.log('Admin created with id', res.rows[0].id, 'email:', email, 'password:', password);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
