// controllers/adminController.js
import pool from '../db.js';
import bcrypt from 'bcryptjs'

export async function dashboardCounts(req, res) {
  try {
    const usersRes = await pool.query('SELECT COUNT(*) FROM users');
    const storesRes = await pool.query('SELECT COUNT(*) FROM stores');
    const ratingsRes = await pool.query('SELECT COUNT(*) FROM ratings');

    return res.json({
      totalUsers: Number(usersRes.rows[0].count),
      totalStores: Number(storesRes.rows[0].count),
      totalRatings: Number(ratingsRes.rows[0].count)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Generic listing of users with filters & sorting
 * Filters by name/email/address/role
 */
export async function listUsers(req, res) {
  try {
    const { name, email, address, role, sortBy='name', sortDir='asc', page=1, limit=20 } = req.query;
    const offset = (page-1)*limit;
    const conditions = [];
    const vals = [];
    let idx = 1;
    if (name) { conditions.push(`name ILIKE $${idx++}`); vals.push(`%${name}%`); }
    if (email) { conditions.push(`email ILIKE $${idx++}`); vals.push(`%${email}%`); }
    if (address) { conditions.push(`address ILIKE $${idx++}`); vals.push(`%${address}%`); }
    if (role) { conditions.push(`role = $${idx++}`); vals.push(role); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const q = `
      SELECT id, name, email, address, role
      FROM users
      ${where}
      ORDER BY ${sortBy} ${sortDir === 'desc' ? 'DESC' : 'ASC'}
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    vals.push(limit, offset);
    const { rows } = await pool.query(q, vals);
    return res.json({ users: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Admin view of stores with rating
 */
export async function adminListStores(req, res) {
  try {
    const { page=1, limit=20 } = req.query;
    const offset = (page-1) * limit;
    const q = `
      SELECT s.*, COALESCE(ROUND(avg(r.rating)::numeric,2), 0) AS rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      GROUP BY s.id
      ORDER BY s.name
      LIMIT $1 OFFSET $2
    `;
    const { rows } = await pool.query(q, [limit, offset]);
    return res.json({ stores: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
export async function createUserByAdmin(req, res) {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Name, email, and password are required" });

    // Check for existing user
    const existing = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ error: "User already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert new user
    const insert = `
      INSERT INTO users (name, email, password, address, role)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING id, name, email, address, role
    `;
    const { rows } = await pool.query(insert, [name, email, hashed, address || "", role || "user"]);

    return res.status(201).json({ user: rows[0] });
  } catch (err) {
    console.error("Admin createUser error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

/**
 * Admin create a new store (Admin Add Store modal)
 */
export async function createStoreByAdmin(req, res) {
  try {
    const { name, address, owner_id } = req.body;

    if (!name)
      return res.status(400).json({ error: "Store name is required" });

    // If owner_id provided, ensure it exists
    if (owner_id) {
      const checkOwner = await pool.query("SELECT id FROM users WHERE id=$1 AND role='owner'", [owner_id]);
      if (checkOwner.rows.length === 0)
        return res.status(400).json({ error: "Owner not found or not an owner" });
    }

    const insert = `
      INSERT INTO stores (name, address, owner_id)
      VALUES ($1, $2, $3)
      RETURNING id, name, address, owner_id
    `;
    const { rows } = await pool.query(insert, [name, address || "", owner_id || null]);

    return res.status(201).json({ store: rows[0] });
  } catch (err) {
    console.error("Admin createStore error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
