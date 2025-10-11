// controllers/authController.js
import pool from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { validateName, validateEmail, validatePassword, validateAddress } from '../validators/validators.js';
dotenv.config();

const SALT_ROUNDS = 10;

export async function register(req, res) {
  try {
    const { name, email, password, address } = req.body;

    // validation
    const vName = validateName(name);
    if (!vName.valid) return res.status(400).json({ error: vName.msg });
    const vEmail = validateEmail(email);
    if (!vEmail.valid) return res.status(400).json({ error: vEmail.msg });
    const vPass = validatePassword(password);
    if (!vPass.valid) return res.status(400).json({ error: vPass.msg });
    const vAddr = validateAddress(address);
    if (!vAddr.valid) return res.status(400).json({ error: vAddr.msg });

    // check exists
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email.toLowerCase()]);
    if (exists.rows.length) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, role`,
      [name, email.toLowerCase(), hashed, address || null, 'user']
    );

    const user = result.rows[0];

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const q = await pool.query('SELECT id, name, email, password, role FROM users WHERE email=$1', [email.toLowerCase()]);
    const user = q.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function updatePassword(req, res) {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: 'oldPassword and newPassword required' });

    const { rows } = await pool.query('SELECT password FROM users WHERE id=$1', [userId]);
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(oldPassword, rows[0].password);
    if (!match) return res.status(401).json({ error: 'Old password is incorrect' });

    const vPass = validatePassword(newPassword);
    if (!vPass.valid) return res.status(400).json({ error: vPass.msg });

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await pool.query('UPDATE users SET password=$1 WHERE id=$2', [hashed, userId]);
    return res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
